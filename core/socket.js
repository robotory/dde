/* Created by Fry on 2/4/16. */
//https://www.hacksparrow.com/tcp-socket-programming-in-node-js.html
const net = require("net")
globalThis.net = net

//never create an instance
var Socket = class Socket{
    //returns a net_soc_inst or null if none in Socket.robot_name_to_soc_instance_map
    //this is reverse lookup in robot_name_to_soc_instance_map
    static net_soc_inst_to_robot_name(net_soc_inst){
        for(let robot_name in Socket.robot_name_to_soc_instance_map){
            let a_net_soc_inst = Socket.robot_name_to_soc_instance_map[robot_name]
            if (a_net_soc_inst === net_soc_inst) { return robot_name }
        }
        return null
    }

    //when a job starts, it calls robot.start, which calls start_aux, which (for Dexter's)
    //calls Socket.init, which for sim, calls DexterSim.create_or_just_init
    static init(robot_name, job_instance, instruction_to_send_on_connect=null){
       //out(job_instance.name + " Socket.init passed: " + robot_name + " " + instruction_to_send_on_connect)
       if(!job_instance.is_active()) {
            warning(job_instance.name + " Attempt to Socket.init with inactive status: " + job_instance.status_code)
            return
        }
        let rob = Robot[robot_name]
        const sim_actual = Robot.get_simulate_actual(rob.simulate) //true, false, or "both"
        if (sim_actual === true){ //when we are ONLY simulating
            DexterSim.create_or_just_init(robot_name, sim_actual)
            //out("socket for Robot." + robot_name + ". is_connected? " + Robot[robot_name].is_connected)
            Socket.new_socket_callback(robot_name, job_instance, instruction_to_send_on_connect)
        }
        else if ((sim_actual === false) || (sim_actual == "both")) {
            if(sim_actual == "both"){
                DexterSim.create_or_just_init(robot_name, sim_actual) //harmless if done a 2nd time. returns without callbaack
            }
            let net_soc_inst = Socket.robot_name_to_soc_instance_map[robot_name]
            if(net_soc_inst && (net_soc_inst.readyState === "closed")) { //we need to init all the "on" event handlers
                this.close(robot_name, true)
                net_soc_inst = null
            }
            let st_inst = null //setTimeout instance, used for clearing.
            if(!net_soc_inst){
                //out(job_instance.name + " Socket.init net_soc_inst for " + robot_name + " doesn't yet exist or is closed.")
                try {
                    net_soc_inst = new net.Socket()
                    net_soc_inst.setKeepAlive(true)
                    //out(job_instance.name + " Just after created, net_soc_inst.readyState: " + net_soc_inst.readyState)
                    /* on error *could* be called, but its duration from a no-connection is
                       highly variable so I have below a setTimeout to kill the connection
                       after a second. But then both on error and the setTimeout method
                       *could* get called so I take pains to kill off the setTimeout
                       so that only one will get called.

                    */
                }
                catch(err){
                    console.log(job_instance.name + " Socket.init catch clause with err: " + err.message)
                    dde_error("Error attempting to create socket to Dexter." + robot_name + " at ip_address: " + rob.ip_address + " port: " + rob.port + err.message)
                    this.close(robot_name, true)
                }
                // I must define the below just once (on actual new socket init, because  calling
                // net_soc_inst.on("data", function(data) {...} actually gives the socket 2 versions of the callback
                // and so each will be called once, giving us a duplication that causes a difficult to find bug.
                net_soc_inst.on("data", function(data) {
                    Socket.on_receive(data, undefined, rob)
                })
                net_soc_inst.on("connect", function(){
                    out(job_instance.name + " Succeeded connection to Dexter: " + robot_name + " at ip_address: " + rob.ip_address + " port: " + rob.port, "green")
                    //clearTimeout(st_inst)
                    Socket.robot_name_to_soc_instance_map[robot_name] = net_soc_inst
                    //the 3 below closed over vars are just used in the one call to when this on connect happens.
                    Socket.new_socket_callback(robot_name, job_instance, instruction_to_send_on_connect)
                })
                net_soc_inst.on("error", function(err){
                    console.log("Probably while running " + job_instance.name + " Socket.init on error while waiting for ack from instruction: " + instruction_to_send_on_connect  +
                        " with err: " + err.message)
                    //clearTimeout(st_inst)
                    let rob_name = Socket.net_soc_inst_to_robot_name(net_soc_inst)
                    if (rob_name == null) { rob_name = "unknown" } //should be rare if at all.
                    let rob_maybe = (rob_name ? Dexter[rob_name] : null)
                    if (rob_maybe) {
                        //warning("in Socket.init on error callback, could not find Dexter." + rob_name)
                        rob = rob_maybe
                    }
                    else {} //let rob "default" to the closed over "rob" because can't find anything else
                    //if(st_inst || (st_inst == 0)){ clearTimeout(st_inst) } //st_inst is just a non-neg int.
                    //Socket.close(robot_name, true) //true, means force_close, needed if job is still active becuse that will remove the soc from the robot_name_to_soc_instance_map and get init to really work.
                    if (rob.resend_count && (rob.resend_count >= 4)) {  //give up retrying and error
                        let active_jobs_using_rob = Job.active_jobs_using_robot(rob)
                        rob.resend_count = 0
                        for(let job_inst of active_jobs_using_rob) {
                            job_inst.stop_for_reason("errored_from_dexter", "can't connect to Dexter." + rob_name)
                        }
                        return
                    }
                    else { //we've got a rob, keep trying
                        if(!rob.resend_count) {
                            rob.resend_count = 1
                        }
                        else { rob.resend_count += 1 }
                        Socket.close(robot_name, true)
                        let timeout_dur = Math.pow(10, rob.resend_count)
                        setTimeout(function(){
                            console.log("re-initing Socket to Dexter." + rob_name)
                            //in the below, for the 3 closed over vars, its possible that these aren't
                            //the right closed over vars, because multiple jobs can send to a given robot.
                            //but if we're only running one robot, or in 2 or more jobs hitting a robot,
                            //maybe these are right, so worth a shot. Not sure what else to do.
                            Socket.prepare_for_re_init(robot_name)
                            Socket.init(rob_name, job_instance, instruction_to_send_on_connect)
                        }, timeout_dur)
                    }
                }) //end of on("error"
                setTimeout(function() {
                    if(!net_soc_inst) { } //presume the job completed and so nothing to do
                    else if (job_instance.is_done()) {} //presume the job completed and so nothing to do
                    else if(net_soc_inst.readyState === "open") {} //connection worked, leave it alone
                    else { //connection failed
                        job_instance.stop_for_reason("errored_from_dexter_connect", "Connection to Dexter." + robot_name +
                                                     "\n failed after 2 seconds.")
                    }
                }, 2000)
                net_soc_inst.connect(rob.port, rob.ip_address)
            } //ending the case where we need to make a new net_soc_inst

            /*out(job_instance.name + "Socket.init before connect, net_soc_inst.readyState: " + net_soc_inst.readyState)
            if (net_soc_inst.readyState === "closed") {
                 st_inst = setTimeout(function(){
                    out(job_instance.name + " in Socket.init, setTimout of st_inst")
                    if(net_soc_inst.readyState !== "open") { //still trying to connect after 1 sec, so presume it never will. kill it
                        Socket.close(robot_name, true)
                        rob.resend_count = 0
                        if(!job_instance.is_done()){
                            job_instance.stop_for_reason("errored_from_dexter", " socket timeout while connecting to Dexter." + rob.name)
                        }
                    }
                    else {
                        Socket.new_socket_callback(robot_name, job_instance, instruction_to_send_on_connect)
                    }
                }, Socket.connect_timeout_seconds * 5000)
                out(job_instance.name + " Now attempting to connect to Dexter." + robot_name + " at ip_address: " + rob.ip_address + " port: " + rob.port + " ...", "brown")
                net_soc_inst.connect(rob.port, rob.ip_address) //the one call to .connect()
            } */
            else { //net_soc_inst already existed and is open
                Socket.new_socket_callback(robot_name, job_instance, instruction_to_send_on_connect)
            }
        }
        //out(job_instance.name + " Socket.init, very bottom")
    }

    //called from both above socket code and from dexsim
    static new_socket_callback(robot_name, job_instance, instruction_to_send_on_connect){
        Dexter.set_a_robot_instance_socket_id(robot_name)
        let rob = Robot[robot_name]
        if(instruction_to_send_on_connect) { //usually this clause hits. happens for initial g oplet for a job
              //and when connection is dropped and we need to resetablish connection and resend.
              //ok to call this even if we were already connected.
            let inst_id = instruction_to_send_on_connect[1]
            if((inst_id === undefined) || (inst_id === -1)) { //we have the initial "g" instr for a job, that has yet to get filled out by Job.prototype.send
                //out("new_socket_callback with initial g instruction.")
                job_instance.send(instruction_to_send_on_connect, rob)
            }
            else {
                rob.send(instruction_to_send_on_connect)
            }
        }
        else {
            warning("In new_socket_callback without instruction to send.")
        }
    }

    static oplet_array_or_string_to_array_buffer(oplet_array_or_string){
        let str = this.oplet_array_or_string_to_string(oplet_array_or_string)
        return this.string_to_array_buffer(str)
    }

    static oplet_array_or_string_to_string(oplet_array_or_string) {
        if (typeof(oplet_array_or_string) == "string") { return oplet_array_or_string }
        else { //oplet_array_or_string is an array
            let str = ""
            for(var i = 0; i < oplet_array_or_string.length; i++){
                let suffix = ((i == (oplet_array_or_string.length - 1))? ";": " ")
                //let elt = oplet_array_or_string[i] + suffix
                let elt = oplet_array_or_string[i]
                if (Number.isNaN(elt)) { elt = "NaN" } //usually only for "a" instructions and only for elts > 4
                  //looks like this is never used now because I convert from NaN to the prev val
                  //in the the higher level code so only numbers get passed to DexRun.
                elt = elt + suffix
                str += elt
            }
            return str
        }
    }

    static string_to_array_buffer(str){
        var arr_buff = Buffer.alloc(128) //dexter code expecting fixed length buf of 128
        //var view1    = new Uint8Array(arr_buff)
        for(var i = 0; i < str.length; i++){
            let char = str[i]
            let code = char.charCodeAt(0)
            arr_buff[i] = code
        }
        return arr_buff
    }

    static degrees_to_dexter_units_array(arr){
        let new_array = []
        for(let index = 0; index < arr.length; index++){
            let joint_number = index + 1
            new_array.push(this.degrees_to_dexter_units(arr[index], joint_number))
        }
        return new_array
    }

    static dexter_units_to_degrees_array(arr){
        let new_array = []
        for(let index = 0; index < arr.length; index++){
            let joint_number = index + 1
            new_array.push(this.dexter_units_to_degrees(arr[index], joint_number))
        }
        return new_array
    }

    static degrees_to_dexter_units(deg, joint_number){
        if(joint_number == 6) {
            return Math.round(deg / Socket.DEGREES_PER_DYNAMIXEL_320_UNIT) +
                              Socket.J6_OFFSET_SERVO_UNITS //512
        }
        else if (joint_number == 7) {
            return Math.round(deg / Socket.DEGREES_PER_DYNAMIXEL_320_UNIT)
        }
        else {
            return Math.round(deg * 3600)  //convert to arcseconds
        }
    }

    static dexter_units_to_degrees(du, joint_number){
        if(joint_number == 6) {
            let ang_deg = (du - Socket.J6_OFFSET_SERVO_UNITS ) *
                       Socket.DEGREES_PER_DYNAMIXEL_320_UNIT
            return ang_deg
        }
        else if (joint_number == 7) {
              let ang_deg = du * Socket.DEGREES_PER_DYNAMIXEL_320_UNIT
              return ang_deg
        }
        else { return du / 3600 }
    }

    static instruction_array_degrees_to_arcseconds_maybe(instruction_array, rob){
        if(typeof(instruction_array) == "string") { return instruction_array} //no conversion needed.
        const oplet = instruction_array[Dexter.INSTRUCTION_TYPE]
        let number_of_args = instruction_array.length - Instruction.INSTRUCTION_ARG0
        if ((oplet === "a") || (oplet === "P")){
            //take any number of angle args
            let instruction_array_copy = instruction_array.slice()
            let angle_args_count = instruction_array_copy.length - Instruction.INSTRUCTION_ARG0
            for(let i = 0; i < number_of_args; i++) {
                let index = Instruction.INSTRUCTION_ARG0 + i
                let arg_val = instruction_array_copy[index]
                let converted_val = this.degrees_to_dexter_units(arg_val, i + 1)
                instruction_array_copy[index] = converted_val
            }
            return instruction_array_copy
        }
        else if (oplet === "S") {
            const name = instruction_array[Instruction.INSTRUCTION_ARG0]
            const args = instruction_array.slice(Instruction.INSTRUCTION_ARG1, instruction_array.length)
            const first_arg = args[0]
            //first convert degrees to arcseconds
            if(["MaxSpeed", "StartSpeed", "Acceleration",
                "AngularSpeed", "AngularSpeedStartAndEnd", "AngularAcceleration",
                "CartesianPivotSpeed", "CartesianPivotSpeedStart", "CartesianPivotSpeedEnd",
                "CartesianPivotAcceleration", "CartesianPivotStepSize" ].includes(name)){
                let instruction_array_copy = instruction_array.slice()
                instruction_array_copy[Instruction.INSTRUCTION_ARG1] = Math.round(first_arg * _nbits_cf)
                return instruction_array_copy
            }
            else if (name.includes("Boundry")) { //the full name is  J1BoundryHigh thru J5BoundryHigh, or J1BoundryLow thru J5BoundryLow
                let instruction_array_copy = instruction_array.slice()
                let joint_number = parseInt(name[1])
                instruction_array_copy[Instruction.INSTRUCTION_ARG1] = this.degrees_to_dexter_units(first_arg, joint_number) //Math.round(first_arg * 3600) //deg to arcseconds
                                            //only expecting j1 thru J5, and since j1 thru j5 are to be converted the same, just pass joint 1
                return instruction_array_copy
            }
            else if (["CommandedAngles", "RawEncoderErrorLimits", "RawVelocityLimits"].includes(name)){
                let instruction_array_copy = instruction_array.slice()
                for(let i = Instruction.INSTRUCTION_ARG1; i <  instruction_array.length; i++){
                    let orig_arg = instruction_array_copy[i]
                    instruction_array_copy[i] = this.degrees_to_dexter_units(orig_arg, i + 1) // Math.round(orig_arg * 3600)
                }
                return instruction_array_copy
            }
            //dynamixel conversion
            else if (name == "EERoll"){ //J6 no actual conversion here, but this is a convenient place
                //to put the setting of robot.angles and is also the same fn where we convert
                // the degrees to dynamixel units of 0.20 degrees
                //val is in dynamixel units
                rob.angles[5] = this.dexter_units_to_degrees(first_arg, 6) //convert dynamixel units to degrees then shove that into rob.angles for use by subsequent relative move instructions
                return instruction_array
            }
            else if (name == "EESpan") { //J7
                rob.angles[6] = this.dexter_units_to_degrees(first_arg, 7)
                return instruction_array
            }
            else if (name === "LinkLengths"){
                let instruction_array_copy = instruction_array.slice()
                for(let i = Instruction.INSTRUCTION_ARG1; i < instruction_array.length; i++){
                    let orig_arg = instruction_array_copy[i]
                    instruction_array_copy[i] = Math.round(orig_arg / _um)
                }
                return instruction_array_copy
            }
            else if (["CartesianSpeed", "CartesianSpeedStart", "CartesianSpeedEnd", "CartesianAcceleration",
                "CartesianStepSize", ].includes(name)){
                let instruction_array_copy = instruction_array.slice()
                let new_val = Math.round(first_arg / _um) //convert from meters to microns
                instruction_array_copy[Instruction.INSTRUCTION_ARG1] = new_val
                return instruction_array_copy
            }
            else if(name === "JointDH") {
                let instruction_array_copy = instruction_array.slice()
                instruction_array_copy[Instruction.INSTRUCTION_ARG2] =
                    Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG2] * 1000000)
                instruction_array_copy[Instruction.INSTRUCTION_ARG3] =
                    Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG3] * 3600)
                instruction_array_copy[Instruction.INSTRUCTION_ARG4] =
                    Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG4] * 1000000)
                instruction_array_copy[Instruction.INSTRUCTION_ARG5] =
                    Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG5] * 3600)
                return instruction_array_copy
            }
            else { return instruction_array }
        }
        else if (oplet == "T") { //move_to_straight
            let instruction_array_copy = instruction_array.slice()
            instruction_array_copy[Instruction.INSTRUCTION_ARG0] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG0] / _um) //meters to microns
            instruction_array_copy[Instruction.INSTRUCTION_ARG1] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG1] / _um) //meters to microns
            instruction_array_copy[Instruction.INSTRUCTION_ARG2] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG2] / _um) //meters to microns
            instruction_array_copy[Instruction.INSTRUCTION_ARG11] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG11] * 3600) //degrees to arcseconds
            instruction_array_copy[Instruction.INSTRUCTION_ARG12] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG12] * 3600) //degrees to arcseconds
            return instruction_array_copy
        }
        else if (oplet == "z") { //sleep
            let instruction_array_copy = instruction_array.slice() //instruction array contains dur in seconds, but Dexter expects microseconds
            instruction_array_copy[Instruction.INSTRUCTION_ARG0] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG0] * Socket.DEXTER_UNITS_PER_SECOND_FOR_SLEEP) //seconds to nanoseconds
            return instruction_array_copy
        }
        else { return instruction_array }
    }

    //not normally called but IS called when converting Defaults.make_ins to "high level".
    //this fn is meant to parallel as much as possible instruction_array_degrees_to_arcseconds_maybe
    //with degrees_to_dexter_units replaced with dexter_units_to_degrees, divides replaced by multiples, etc as makes sense
    //this inverse version doesn't actually use its rob arg.
    static instruction_array_arcseconds_to_degrees_maybe(instruction_array, rob){
        if(typeof(instruction_array) == "string") { return instruction_array} //no conversion needed.
        const oplet = instruction_array[Dexter.INSTRUCTION_TYPE]
        let number_of_args = instruction_array.length - Instruction.INSTRUCTION_ARG0
        if ((oplet === "a") || (oplet === "P")){
            //take any number of angle args
            let instruction_array_copy = instruction_array.slice()
            let angle_args_count = instruction_array_copy.length - Instruction.INSTRUCTION_ARG0
            for(let i = 0; i < number_of_args; i++) {
                let index = Instruction.INSTRUCTION_ARG0 + i
                let arg_val = instruction_array_copy[index]
                let converted_val = this.dexter_units_to_degrees(arg_val, i + 1)
                instruction_array_copy[index] = converted_val
            }
            return instruction_array_copy
        }
        else if (oplet === "S") {
            const name = instruction_array[Instruction.INSTRUCTION_ARG0]
            const args = instruction_array.slice(Instruction.INSTRUCTION_ARG1, instruction_array.length)
            const first_arg = args[0]
            //first convert arcseconds to degrees
            if(["MaxSpeed", "StartSpeed", "Acceleration",
                "AngularSpeed", "AngularSpeedStartAndEnd", "AngularAcceleration",
                "CartesianPivotSpeed", "CartesianPivotSpeedStart", "CartesianPivotSpeedEnd",
                "CartesianPivotAcceleration", "CartesianPivotStepSize" ].includes(name)){
                let instruction_array_copy = instruction_array.slice()
                instruction_array_copy[Instruction.INSTRUCTION_ARG1] = first_arg / _nbits_cf
                return instruction_array_copy
            }
            else if (name.includes("Boundry")) { //the full name is  J1BoundryHigh thru J5BoundryHigh, or J1BoundryLow thru J5BoundryLow
                let instruction_array_copy = instruction_array.slice()
                let joint_number = parseInt(name[1])
                instruction_array_copy[Instruction.INSTRUCTION_ARG1] = this.dexter_units_to_degrees(first_arg, joint_number) //Math.round(first_arg * 3600) //deg to arcseconds
                //only expecting j1 thru J5, and since j1 thru j5 are to be converted the same, just pass joint 1
                return instruction_array_copy
            }
            else if (["CommandedAngles", "RawEncoderErrorLimits", "RawVelocityLimits"].includes(name)){
                let instruction_array_copy = instruction_array.slice()
                for(let i = Instruction.INSTRUCTION_ARG1; i <  instruction_array.length; i++){
                    let orig_arg = instruction_array_copy[i]
                    instruction_array_copy[i] = this.dexter_units_to_degrees(orig_arg, i + 1) // Math.round(orig_arg * 3600)
                }
                return instruction_array_copy
            }
            //dynamixel conversion
            else if (name == "EERoll"){ //J6 no actual conversion here, but this is a convenient place
                //to put the setting of robot.angles and is also the same fn where we convert
                // the degrees to dynamixel units of 0.20 degrees
                //val is in dynamixel units
                //don't do in this fn  rob.angles[5] = this.dexter_units_to_degrees(first_arg, 6) //convert dynamixel units to degrees then shove that into rob.angles for use by subsequent relative move instructions
                return instruction_array
            }
            else if (name == "EESpan") { //J7
                //don't do in this fn  rob.angles[6] = this.dexter_units_to_degrees(first_arg, 7)
                return instruction_array
            }
            else if (name === "LinkLengths"){
                let instruction_array_copy = instruction_array.slice()
                for(let i = Instruction.INSTRUCTION_ARG1; i < instruction_array.length; i++){
                    let orig_arg = instruction_array_copy[i]
                    instruction_array_copy[i] = orig_arg * _um
                }
                return instruction_array_copy
            }
            else if (["CartesianSpeed", "CartesianSpeedStart", "CartesianSpeedEnd", "CartesianAcceleration",
                "CartesianStepSize", ].includes(name)){
                let instruction_array_copy = instruction_array.slice()
                let new_val = Math.round(first_arg * _um) //convert from meters to microns
                instruction_array_copy[Instruction.INSTRUCTION_ARG1] = new_val
                return instruction_array_copy
            }
            else if(name === "JointDH") {
                let instruction_array_copy = instruction_array.slice()
                instruction_array_copy[Instruction.INSTRUCTION_ARG2] =
                    instruction_array_copy[Instruction.INSTRUCTION_ARG2] / 1000000 //orig in microns
                instruction_array_copy[Instruction.INSTRUCTION_ARG3] =
                    instruction_array_copy[Instruction.INSTRUCTION_ARG3] / 3600    //orig in arcsecs
                instruction_array_copy[Instruction.INSTRUCTION_ARG4] =
                    instruction_array_copy[Instruction.INSTRUCTION_ARG4] / 1000000 //orig in microns
                instruction_array_copy[Instruction.INSTRUCTION_ARG5] =
                    instruction_array_copy[Instruction.INSTRUCTION_ARG5] / 3600    //orig in arcsecs
                return instruction_array_copy
            }
            else { return instruction_array }
        }
        else if (oplet == "T") { //move_to_straight
            let instruction_array_copy = instruction_array.slice()
            instruction_array_copy[Instruction.INSTRUCTION_ARG0] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG0] * _um) //microns to meters
            instruction_array_copy[Instruction.INSTRUCTION_ARG1] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG1] * _um) //microns to meters
            instruction_array_copy[Instruction.INSTRUCTION_ARG2] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG2] * _um) //microns to meters
            instruction_array_copy[Instruction.INSTRUCTION_ARG11] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG11] / 3600) //arcseconds to degrees
            instruction_array_copy[Instruction.INSTRUCTION_ARG12] =
                Math.round(instruction_array_copy[Instruction.INSTRUCTION_ARG12] / 3600) //arcseconds to degrees
            return instruction_array_copy
        }
        else if (oplet == "z") { //sleep
            let instruction_array_copy = instruction_array.slice()
            instruction_array_copy[Instruction.INSTRUCTION_ARG0] =
                instruction_array_copy[Instruction.INSTRUCTION_ARG0] / Socket.DEXTER_UNITS_PER_SECOND_FOR_SLEEP // nanoseconds to seconds
            return instruction_array_copy
        }
        else { return instruction_array }
    }

    static send(robot_name, oplet_array_or_string){ //can't name a class method and instance method the same thing
        let rob = Robot[robot_name]
        let oplet_array_or_string_du = Socket.instruction_array_degrees_to_arcseconds_maybe(oplet_array_or_string, rob)
        let job_id = Instruction.extract_job_id(oplet_array_or_string)
        let job_instance = Job.job_id_to_job_instance(job_id)
        if(!job_instance){
            shouldnt("Socket.send passed: " + robot_name + " " + oplet_array_or_string +
                     "<br/>extracted job_id:" + job_id + " but no defined Job with that ID.")
        }
        //out(job_instance.name + " " + robot_name + " Socket.send passed oplet_array_or_string: " + oplet_array_or_string)

        const str =  Socket.oplet_array_or_string_to_string(oplet_array_or_string_du)
        if(Instruction.is_F_instruction_string(str)) {
            rob.waiting_for_flush_ack = true
        }
        if(job_instance.keep_history) {
            job_instance.sent_instructions_strings.push(str)
        }
        const arr_buff = Socket.string_to_array_buffer(str)
        const sim_actual = Robot.get_simulate_actual(rob.simulate)
        if((sim_actual === true) || (sim_actual === "both")){
            let sim_inst = DexterSim.robot_name_to_dextersim_instance_map[robot_name]
            if(sim_inst) {
                setTimeout( function() { //eqiv to net_soc_inst.write(arr_buff) below.
                    DexterSim.send(robot_name, arr_buff)
                }, 1)}
            else {
                Socket.close(robot_name, true) //both are send args
                setTimeout(function(){
                    Socket.init(robot_name, job_instance, oplet_array_or_string)
                }, 100)
            }
        }
        if ((sim_actual === false) || (sim_actual === "both")) {
            let net_soc_inst = Socket.robot_name_to_soc_instance_map[robot_name]
            if(net_soc_inst && (net_soc_inst.readyState === "open")) {
                try {
                    //console.log("Socket.send about to send: " + str)
                    net_soc_inst.write(arr_buff) //if doesn't error, success and we're done with send
                    //console.log("Socket.send just sent:     " + str)
                    //this.stop_job_if_socket_dead(job_id, robot_name)
                    return
                }
                catch(err) {
                    console.log("Socket.send just after write in catch clause with err: " + err.message)
                    if (rob.resend_count && (rob.resend_count >= 4)) {  //give up retrying and error
                        rob.resend_count = 0
                        job_instance.stop_for_reason("errored_from_dexter", "can't connect to Dexter")
                        //job_instance.color_job_button() //automatically done by job.prototype.finish
                        job_instance.set_up_next_do(0)  //necessary?
                        return
                    }
                    else { //keep trying
                        /*if(!rob.resend_count) {
                            rob.resend_count = 1
                        }
                        else { rob.resend_count += 1 }*/
                        Socket.close(robot_name, true)
                        let timeout_dur = Math.pow(10, rob.resend_count)
                        setTimeout(function(){
                            console.log("re-initing Socket to Dexter." + robot_name)
                            Socket.init(robot_name, job_instance, oplet_array_or_string)
                        }, timeout_dur)
                        return
                    }
                }
            }
            else { //maybe never hits. it only hits if there is no net_soc_inst in Socket.robot_name_to_soc_instance_map
                Socket.close(robot_name, true) //both are send args
                setTimeout(function(){
                    Socket.init(robot_name, job_instance, oplet_array_or_string)
                }, 100)
            }
        }
    } //end of send method
    /* apr 2019: sim calls on_receive now
    static on_receive_sim(robot_status_in_arcseconds, robot_name){ //robot_status_in_arcseconds might also be an ack_array, wbich doens't have any degrees, and won't be converted. or modified.
        let rob = Robot[robot_name]
        let sim_actual = Robot.get_simulate_actual(rob.simulate)
        if(sim_actual === true) { //don't include "both"
            Socket.convert_robot_status_to_degrees(robot_status_in_arcseconds) //modifies its input
            rob.robot_done_with_instruction(robot_status_in_arcseconds) //now robot_status_in_arcseconds is really in degrees
        }
        //else {} rob.simulate will be "both", so let the real Dexter supply the call to
        //rob.robot_done_with_instruction and the rs_status from Dexter, not the simulated one.
    }*/

    //called both from Dexter returning, and from Sim.
    //data should be a Buffer object. https://nodejs.org/api/buffer.html#buffer_buffer
    //payload_string_maybe is undefined when called from the robot,
    //and if called from sim and we have an "r" oplet, it is either a string (everything ok)
    //or a positive integer (1) when sim get file-not-found.
    //
    static on_receive(data, payload_string_maybe, dexter_instance){
        //data.length == 240 data is of type: Uint8Array, all values between 0 and 255 inclusive
        //console.log("Socket.on_receive passed data:        " + data)
        let robot_status
        let oplet
        if(Array.isArray(data)) {  //todo return from sim same data type as Dexter returns.   //a status array passed in from the simulator
            robot_status = data
            oplet = robot_status[Dexter.INSTRUCTION_TYPE]
        }
        else { //a Uint8Array when called from the robot.
            let view1 = new Int32Array(data.buffer) //array_buff1.bytelength / 4); //weird google syntax for getting length of a array_buff1
            robot_status = []
            for(var i = 0; i < view1.length; i++){
                var elt_int32 = view1[i]
                robot_status.push(elt_int32)
            }
            let opcode = robot_status[Dexter.INSTRUCTION_TYPE]
            oplet  = String.fromCharCode(opcode)
        }
        //console.log("Socket.on_receive passed DU robot status: " + robot_status)
        //the simulator automatically does this so we have to do it here in non-simulation
        //out("on_receive got back oplet of " + oplet)
        robot_status[Dexter.INSTRUCTION_TYPE] = oplet
        if(oplet == "r"){ //Dexter.read_file
            if(typeof(payload_string_maybe) == "number") { //only can hit im sim.// should be 2 if it hits
                robot_status[Dexter.ERROR_CODE] = 0 //even though we got an error from file_not_found,
                //don't set the error in the robot status. Just let that error
                //be used in r_payload_grab_aux which passes it to got_content_hunk
                //which sets the user data to the error code and
                // read_file_instance.is_done = true
                //so the loop in read_file_instance terminates normally.
            }
            else if ((payload_string_maybe === undefined) && //real. not simulated
                     (robot_status[Dexter.ERROR_CODE] > 0)) { //got an error, probably file not found
                payload_string_maybe = robot_status[Dexter.ERROR_CODE]
                robot_status[Dexter.ERROR_CODE] = 0
            }
            //now robot_status does NOT have an error code, but if there is an error,
            //payload_string_maybe is an int > 0
            //but if no error, payload_string_maybe is a string
            Socket.r_payload_grab(data, robot_status, payload_string_maybe)
        }
        else {
            Socket.convert_robot_status_to_degrees(robot_status)
        }

        //the below line became unnecessary, and too complex, too hieruasic once we
        //changed capturing the dexter_instance in the closure that is the wrapper
        //for the call to on_received, in Socket.init
        //let rob = this.find_dexter_instance_from_robot_status(robot_status) //= Dexter[robot_name]
        if (oplet === "F") {
            dexter_instance.waiting_for_flush_ack = false
        }
        let job_id = robot_status[Dexter.JOB_ID]
        let job_instance = Job.job_id_to_job_instance(job_id)
        //out(job_instance.name + " " + rob.name + " bottom of Socket.on_receive with: " + robot_status)
        dexter_instance.robot_done_with_instruction(robot_status) //robot_status ERROR_CODE *might* be 1
    }

    //this is needed bacause we might have an instruction like Dexter.dexter2.move_all_joints()
    //the enclosing job might not have that dexter as its default robot,
    //or might not even have a Dexter instance as the Job robot at all.
    //so we want to first check the instruction to see if it has a robot.
    //if so. use it, if not, go for the default robot for the job and if that is an instance
    //of Dexter, use it, else error with shouldnt
    //uPDATE JUl 18, 2021
    //now unnecessary due to the Socket.init closure for on_receive capturiing the
    //dexter intstnace and passing it to on_receive,
    //BUT this code might come in handy some day
    /*
    static find_dexter_instance_from_robot_status(robot_status){
        let job_id       = robot_status[Dexter.JOB_ID]
        let job_instance = Job.job_id_to_job_instance(job_id)
        if(!job_instance){
            shouldnt("Socket.find_dexter_instance_from_robot_status passed: " + oplet_array_or_string +
                "<br/>extracted job_id:" + job_id + " but there is no defined Job with that ID.")
        }
        let instr_id     = robot_status[Dexter.INSTRUCTION_ID]
        let rob
        if(instr_id === -1) { //the initial g instruction, only sent when a Job has as its robot, a dexter
           rob = job_instance.robot
        }
        else {
            let instr = job_instance.do_list[instr_id]
            rob = instr.robot //this is the best we can do if there's a robot indicated in the instr
            if(!rob) {
                if(Array.isArray(instr)) {
                    let last_elt = last(instr)
                    if(last_elt instanceof Dexter){
                        rob = last_elt
                    }
                    else {
                        rob = job_instance.robot
                    }
                }
                else if(job_instance.robot instanceof Dexter) { //next best we can do
                    rob = job_instance.robot
                }
                else {
                    shouldnt("Socket.find_dexter_instance_from_robot_status 2 couldn't find robot from: " + robot_status +
                             "<br/>using Job.id: " + job_id + " Job.name: " + job_instance.name +
                             "<br/>instr id: " + instr_id + " instruction: " + instr)
                }
            }
        }
        return rob
    }*/

    static r_payload_grab(data, robot_status, payload_string_maybe) {
        if(payload_string_maybe === undefined) { //only in real, not in sim
            let payload_length = robot_status[Socket.PAYLOAD_LENGTH]
            let data_start = Socket.PAYLOAD_START
            let data_end = data_start + payload_length
            payload_string_maybe = data.slice(data_start, data_end).toString()
        }
        else if (payload_string_maybe instanceof Buffer) { //beware, sometimes payload_string_maybe is a buffer. This converts it to a string.
            payload_string_maybe = payload_string_maybe.toString()
        }
        //else { payload_string_maybe is normally a string, but could be an integer of > 0 if there's an error }
        Socket.r_payload_grab_aux(robot_status, payload_string_maybe)  //payload_string still might be an integer error code, ie 1 when file not found
    }

    //payload_string_maybe could be a string or an integer error code like 1 when no file found
    static r_payload_grab_aux(robot_status, payload_string_maybe){
        let job_id = robot_status[Dexter.JOB_ID]
        let ins_id = robot_status[Dexter.INSTRUCTION_ID]
        Instruction.Dexter.read_file.got_content_hunk(job_id, ins_id, payload_string_maybe)
    }

    static convert_robot_status_to_degrees(robot_status){
        let raw_status_mode = robot_status[Dexter.STATUS_MODE]
        //out("convert_robot_status_to_degrees got raw_status_mode of: " + raw_status_mode)
        if((raw_status_mode === null) || (raw_status_mode === 0) || (raw_status_mode === "0")){
            robot_status[Dexter.STATUS_MODE] = 0
            if (robot_status.length == Dexter.robot_status_labels.length){
                robot_status[Dexter.J1_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J1_ANGLE], 1) //0.0002777777777777778 //this number === _arcsec
                robot_status[Dexter.J2_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J2_ANGLE], 2)
                robot_status[Dexter.J3_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J3_ANGLE], 3)
                robot_status[Dexter.J4_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J4_ANGLE], 4)
                robot_status[Dexter.J5_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J5_ANGLE], 5)

                robot_status[Dexter.J1_DELTA] = Socket.dexter_units_to_degrees(robot_status[Dexter.J1_DELTA], 1)
                robot_status[Dexter.J2_DELTA] = Socket.dexter_units_to_degrees(robot_status[Dexter.J2_DELTA], 2)
                robot_status[Dexter.J3_DELTA] = Socket.dexter_units_to_degrees(robot_status[Dexter.J3_DELTA], 3)
                robot_status[Dexter.J4_DELTA] *= 0.00001736111111111111   //todo get the "S" interpolation values from Defaults.make_ins instead  ie robot_status[Dexter.J4_DELTA] *= _arcsec / the_make_int_number
                robot_status[Dexter.J5_DELTA] *= 0.00001736111111111111   //for this one too.

                robot_status[Dexter.J1_PID_DELTA] = Socket.dexter_units_to_degrees(robot_status[Dexter.J1_PID_DELTA], 1)
                robot_status[Dexter.J2_PID_DELTA] = Socket.dexter_units_to_degrees(robot_status[Dexter.J2_PID_DELTA], 2)
                robot_status[Dexter.J3_PID_DELTA] = Socket.dexter_units_to_degrees(robot_status[Dexter.J3_PID_DELTA], 3)
                robot_status[Dexter.J4_PID_DELTA] *= 0.00001736111111111111  //for this one too.
                robot_status[Dexter.J5_PID_DELTA] *= 0.00001736111111111111  //for this one too.

                robot_status[Dexter.J1_MEASURED_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J1_MEASURED_ANGLE], 1)
                robot_status[Dexter.J2_MEASURED_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J2_MEASURED_ANGLE], 2)
                robot_status[Dexter.J3_MEASURED_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J3_MEASURED_ANGLE], 3)
                robot_status[Dexter.J4_MEASURED_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J4_MEASURED_ANGLE], 4)
                robot_status[Dexter.J5_MEASURED_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J5_MEASURED_ANGLE], 5)
                robot_status[Dexter.J6_MEASURED_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J6_MEASURED_ANGLE], 6)
                robot_status[Dexter.J7_MEASURED_ANGLE] = Socket.dexter_units_to_degrees(robot_status[Dexter.J7_MEASURED_ANGLE], 7)

                robot_status[Dexter.J1_SENT] = Socket.dexter_units_to_degrees(robot_status[Dexter.J1_SENT], 1) //0.0002777777777777778 //this number === _arcsec
                robot_status[Dexter.J2_SENT] = Socket.dexter_units_to_degrees(robot_status[Dexter.J2_SENT], 2)
                robot_status[Dexter.J3_SENT] = Socket.dexter_units_to_degrees(robot_status[Dexter.J3_SENT], 3)
                robot_status[Dexter.J4_SENT] = Socket.dexter_units_to_degrees(robot_status[Dexter.J4_SENT], 4)
                robot_status[Dexter.J5_SENT] = Socket.dexter_units_to_degrees(robot_status[Dexter.J5_SENT], 5)

            }
        }
        //else not g0 so no conversion
    }

    static close(robot_name, force_close=false){
        let rob = Robot[robot_name]
        const sim_actual = Robot.get_simulate_actual(rob.simulate)
        if ((sim_actual === true) || (sim_actual === "both")){ //simulation
            //DexterSim.close(robot_name) //commented out mar 21, 20201 because DexterSim.close didn't actually do anything.
            //if we stop a job, the robot still plays out its queue so simulator should too.
        }
        if ((sim_actual === false) || (sim_actual === "both")){
           if((rob.active_jobs_using_this_robot().length == 0) || force_close){
                const net_soc_inst = Socket.robot_name_to_soc_instance_map[robot_name]
                if(net_soc_inst){
                    net_soc_inst.removeAllListeners()
                    net_soc_inst.destroy()
                    delete Socket.robot_name_to_soc_instance_map[robot_name]
                }
            }
        }
    }

    static prepare_for_re_init(robot_name){
            let rob = Robot[robot_name]
            const sim_actual = Robot.get_simulate_actual(rob.simulate)
            if ((sim_actual === true) || (sim_actual === "both")){ //simulation
                //DexterSim.close(robot_name) //commented out mar 21, 20201 because DexterSim.close didn't actually do anything.
                //if we stop a job, the robot still plays out its queue so simulator should too.
            }
            if ((sim_actual === false) || (sim_actual === "both")){
                 const net_soc_inst = Socket.robot_name_to_soc_instance_map[robot_name]
                 if(net_soc_inst){
                     net_soc_inst.removeAllListeners()
                     net_soc_inst.destroy()
                     delete Socket.robot_name_to_soc_instance_map[robot_name]
                 }
            }
    }

    /*this causes DexRun to crash. Ultimately we need to rewrite FPGA code to get this functionality.
    static empty_instruction_queue_now(robot_name){
        let rob = Robot[robot_name]
        const sim_actual = Robot.get_simulate_actual(rob.simulate)
        if ((sim_actual === true) || (sim_actual === "both")){ //simulation
            DexterSim.empty_instruction_queue_now(robot_name)
        }
        if ((sim_actual === false) || (sim_actual == "both")){
            const soc_inst = Socket.robot_name_to_soc_instance_map[robot_name]
            if(soc_inst && !soc_inst.destroyed){
                const oplet_array = make_ins("E") //don't expect to hear anything back from this.
                const arr_buff = this.oplet_array_or_string_to_array_buffer(oplet_array)
                try { soc_inst.write(arr_buff) } //band-aid for not knowing what's in Dexter's queue.
                                              //if the queue is empty we shouldn't do.
                                              //we should empty the queue whenever DDE detects an error,
                                              //but before closing the socket.
                catch(err) {
                    warning("Writing to the robot: " + robot_name +
                            " while emptying its queue failed, but that may be ok.")
                }
            }
        }
    }*/
}

//Socket.robot_is_waiting_for_reply = {} //robot_name to boolean map.
//Socket.max_dur_to_wait_for_reply_ms = 200

Socket.connect_timeout_seconds = 1
Socket.PAYLOAD_START = 7 * 4 //7th integer array index, times 4 bytes per integer
Socket.PAYLOAD_LENGTH = 6 //6th integer array index

////Socket.resend_count = null

Socket.robot_name_to_soc_instance_map = {}
Socket.DEGREES_PER_DYNAMIXEL_320_UNIT = 0.29   //range of motion sent is 0 to 1023
Socket.DEGREES_PER_DYNAMIXEL_430_UNIT = 360 / 4096
Socket.J6_OFFSET_SERVO_UNITS = 512
Socket.DEXTER_UNITS_PER_SECOND_FOR_SLEEP = 1000000 //ie microseconds

module.exports = Socket
var {Robot} = require("./robot.js")
var {Instruction, make_ins} = require("./instruction.js")
var DexterSim = require("./dextersim.js")
//var {_nbits_cf, _arcsec, _um} = require("./units.js") //don't do this. These units and all the rest are
//already global vars.

/*dexter0.joints = []
             joint_instances
                 motor_instance of a 2, 320, 430 or stepper
                        speed=30

                 min=-360
                 max=360
                 gear_ratio=1

                 convert_deg_to_dexter_units()
                 init() // ie like reboot_servo
                 set_indicator(val)   //ie turn on LED for J6
 */



//Socket.on_receive_added = false