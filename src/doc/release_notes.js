export function install_release_notes(){
    doc_pane_content_id.innerHTML += content
    content = null //so it will be garbage collected
}

var content =
`<details><summary class="doc_top_level_summary">Release Notes</summary>
 <div style='font-size:16px;'>

<details class="doc_details"><summary>v 3.8.0, Jul 23, 2021</summary>
Highlights: Recording Jobs more reliable, simpler UI.<br/>
    Simulator improvements, including "both" option working.<br/>
    Simplified Jobs Model documentation for deeper understanding of Jobs.<br/>
    Jobs menu/Eval & Start Job improved.<br/>
    File menu new item: Load and start Job.<br/>
    Jobs menu item "Run Job on Dexter" improved.<br/>
    Dexter.set_follow_me and friends now working for J6 & J7.<br/>
    Job Engine extended with a bunch of DDE functions including require, get_page_async.
<ul>
    <li>Fixed 8 bugs in file_system_test_suite for folder_name_version_extension.</li>
    <li>Changed <code>dex_inst.remove_from_busy_job_array</code>
        to <code>Dexter.remove_from_busy_job_arrays</code>  in several places as this should
        usually be called instead.</li>
    <li>Now the simulator <b>both</b> option works.
       The simulator is about 10% faster or so than the <b>real</b> Dexter.
       Needs some work to get real dexter and sim in sync.</li>
    <li>Dexter UI: fixed a problem when you:<br/>
        1. launch DDE<br/>
        2. start Dexter UI<br/>
        3. uncheck the point down check box.<br/>
        It use to move Dexter into a bad configuration.
        Now it doesn't move Dexter at all (which is correct).</li>
    <li>Removed <i>Jobs menu/Run Instruction/PARKED_ANGLES</i>
        not useful and if Dexter is
         uncalibrated, it may run into itself.</li>
    <li>When you choose Jobs menu/<b>Dexter UI</b>,
       a warning message is printed that Dexter
        will move when you use this dialog box.</li>
    <li> <b>Dexter UI</b> tutorial improved slightly with a warning that Dexter will move.</li>
    <li>Fixed <code>Dexter.pid_move_to</code> to properly set up the passed in robot.</li>
    <li>Fixed <code>Job.send</code> when an oplet array is passed in that has a
        robot instance as its last element.</li>
    <li>Fixed Dexter <b>simulator</b> such that when simulating a PID move,
       and the simulator is not actually showing, it doesn't attempt to draw to it.</li>
    <li><b>Make Instruction</b>: twisting down the "Recording" arrow automatically scrolls
        the doc pane to documentation specific to Recording.</li>
    <li>Improved the doc for <b>Make Instruction's record</b> facility.</li>
    <li>Make Instruction record:
        fixes to controls for play, stepping and dragging the "play head" circle.</li>
    <li>Make Instruction record: insert now uses a new Brain robot for the high
        level Job so that we don't have 2 Jobs with the same default robot.</li>
    <li>Make Instruction record: clicking insert now does NOT pop up a dialog of
       options. Smarter analysis and insertion plus easer-to-understand functionality
       now make this unnecessary.</li>
    <li>Make Instruction record: clicking "record button" sets visible form's do_list
        to [] so user knows we're starting a new recording.</li>
    <li>Make Instruction insertion of trailing commas improved.</li>
    <li><code>Dexter.set_follow_me</code>, <code>force_protect</code>,
        <code>open_loop</code> and <code>keep_position</code> instructions
         now work for J6 and J7. Useful in Make Instruction record.</li>
    <li>Now there's an explicit warning for user clicking on the <button>Eval</button> button
          when only whitespace is selected.
          This can occur when user inserts a recording with a high level Job.</li>
    <li><b>Inspect</b> fixed for an edge case of inspecting 2D arrays.</li>
    <li>Ref Man/Job/Definition Time vs Run Time tweaked and greatly extended with a
          new sub-section: <b>Simplified Jobs Model</b>.
          Recommended reading if you really want to understand what Jobs are all about.</li>
    <li>Added to <b>Job engine</b> from regular DDE:<br/>
        <code>file_exists</code>, <code>is_folder</code>, <code>persistent_get</code>,
        <code>persistent_remove</code>, <code>persistent_save</code>,
        <code>make_folder</code></li>
    <li>new function: <code>append_to_file</code>
         See Ref Man/IO/File Access/append_to_file.
        Also in the Job Engine.</li>
    <li><code>get_page_async</code> now available in the Job engine.
        Doc improved at RefMan/IO/web/get_page_async</li>
    <li>Job engine index.js, <code>run_node_command</code> improved eval call to make <code>require</code> calls work.</li>
    <li>Fixed click help on a file name (path)</li>
    <li>Fixed <code>read_file_async</code> when reading a file with a defaulting folder
        name and we're reading from Dexter. This also fixes <code>copy_file_async</code>
         when copying from Dexter to DDE.</li>
    <li>Added an example to Ref Man/IO/File Access/copy_file_async for
        copying to a Dexter.</li>
    <li>DDE splitter-bar width increased from 5px to 8px to make dragging them easier.</li>
    <li><b>Jobs menu/Eval & Start Job</b>: if you select instructions to run NOT in a Job definition,
        a Job will be defined (as usual).
        But now, such defined Jobs will use the Dexter.default
        (selected in the Misc pane header.</li>
    <li>Jobs menu/Eval & Start Job now functionality better matches
        User Guide/User Interface/Editor Pane/Eval & Start Job menu item.</li>
    <li>File menu new item: Load and start Job... that lets you choose a file.
       It is loaded, and the first job in it (if any) is started.
         Particularly useful for demos.</li>
    <li><b>Simulator</b>: fixed to not attempt to display J6 & J7 movement if the simulator
        is not showing.</li>
    <li>Simulator controls for rotating Dexter improved.</li>
    <li>Simulator  Middle button/scroll_wheel down is now an additional way to pan,
        from the existing alt/option key down.</li>
    <li>Improved <code>Socket.on_receive</code> to take the Dexter instance as an argument
        rather than compute it,
       (somewhat heuristically) from a robot_status. More reliable, less code.</li>
    <li>Ref Man/Robot/Robot Instructions/<code>Control/break</code> extended to include
        an example of having an inner loop break out of an outer loop.</li>
    <li>Jobs menu item <b>Run Job on Dexter</b> fixed to work not just when
        you choose the menu item, but then click the Job button created to run the
        Job a 2nd (or 3rd ...) time. Improved the tooltip for the menu item.</li>

</ul>
</details>

<details class="doc_details"><summary>v 3.7.18, Jun 30, 2021</summary>
Highlights: New Job Param: when_do_list_done. Error system clean-up. Make Instrunction bugs fixed.
 New programmatic interface to versioned files.
<ul>
    <li><code>FileTransfer.customize_defaults_make_ins</code> def extended to
        have comments describing its inputs.</li>
    <li>Ref Man <code>choose_file</code> has a new example for choosing a folder.</li>
    <li><code>choose_file</code> doc improved.</li>
    <li><code>Simqueue.render_instruction</code> fixed warning message for job name.</li>
    <li><code>make_full_path</code> now documented in Ref Man/IO/File System/make_full_path</li>
    <li>Now, if you attempt to redefine a job while it is running, you will get a warning
        message telling you to explicitly stop the job before redefining it.
        This should lead to less surprising behavior and put the user in control if
        they accidentally attempt to re-define a job while its running.</li>
    <li>Fixed error handling in simulator for oplets "e" and "r".</li>
    <li>In <code>Dexter.robot_done_with_instruction</code> improved error handling for
        invalid job_id.</li>
    <li>In <code>Dexter.robot_done_with_instruction</code>, now set the robot's
         robot_status property earlier so its available for error cases.</li>
    <li>Improved <code>Job.prototype.rs_to_error_message</code> to show the error code if
        there's a robot_status error.</li>
    <li>In Make Instruction pane, fixed the "run" button for both simulator and real.</li>
    <li>Job parameters: new: <code>when_do_list_done</code>
         indicates action when the do_list as compeltely run.
         The existing <code>when_stopped</code> can no longer take a "wait" value,
         but you can obtain that effect by giving when_do_list_done a "wait" value.
         This makes it possible to have some 'clean up' code when a Job is finished but
         also allow a "wait" for additional instructions.</li>
    <li>Error system cleanup improving instructions: <code>Control.stop_job</code>,
         <code>Control.error</code>,
         and Job params: <code>if_instruction_error</code>, <code>if_robot_status_error</code>,
                 <code>if_dexter_connection_error</code>.</li>
    <li><code>get_latest_path</code> and <code>make_unique_path</code> for programmatically
      managing versioned files. See Ref man/IO/File Access/get_latest_path .</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.17, Jun 16, 2021</summary>
<ul>
    <li>Fixed 2 bugs in <code>Socket.instruction_array_degrees_to_arcseconds_maybe</code>
    S params affecting calibration. one for "J*Boundary*"
    and one for "CommandedAngles", "RawEncoderErrorLimits", "RawVelocityLimits".</li>
    <li>Improved error message for <code>Job.prototype.if_robot_status_error_default</code>
    when it can't get the errors.log file from Dexter.</li>
    <li>New Function under <code>FileTransfer</code> extended for customize_defaults_make_ins.
        This functionality not yet documented.</li>
    <li>HCA: Added cut, copy, paste keystroke commands to the network editor.
        This functionality is not yet documented or generally useful.
    </li>
    <li>Removed lots of <code>debugger;</code> statements.
</ul>
</details>
<details class="doc_details"><summary>v 3.7.16, Jun 10, 2021</summary>
Highlights: Improvements to simulation and Dexter UI esp. for pid moves.
 UpdateFirmware facility improved. Gameification for educational motivation added.
<ul>
    <li>Improved inspector for large 2D arrays:
      if there is more than 6 columns (or 10 rows),
      do not auto-expand the table in the inspector.</li>
   <li>First easter egg added</li>
    <li>New Misc pane sub-pane: Reward Board showing usage statistics and magic spells.</li>
    <li>FileTransfer.get_releases_page_callback fixed bug in call to decrypt_file
    that prevented sending files to Dexter.</li>
    <li>Uninstalled npm f4st-crypt (not used, using node's cryto instead.)</li>
    <li>Changed Jobs/Dexter Tools/Browse Dexter default to Jobs/Dexter Tools/Browse Dexter,
        to make it shorter and fit on one line of menu.</li>
    <li>Click help on a Job parameter now gives you an underlined blue link
    in the Output pane that you can click on and see the doc for that particular param.</li>
    <li>Dexter UI dialog box: new tooltips on the "donut" and the green dot to tell
        you their meanings.</li>
    <li>Uninstalled ml-classify-text.  Not used.</li>
    <li>Uninstalled zeromq package. No longer used.</li>
    <li>New Click help for <code>dexter</code> about Dexter and <code>Dexter.dexter0</code></li>
    <li><code>Dexter.prototype.is_direction</code> and <code>Kin.is_direction</code>
    methods added.</li>
    <li><code>Dexter.HOME_ANGLES</code> changed from [0,0,0,0,0,0,0] to [0,0,0,0,0,0,50] .
    If you move J7 to 0 it will likely overtorque when you have a parallel gripper on Dexter
    but by setting J7 to 50 and it won't overtorque.</li>
    <li>Reboot_joints job now uses brain robot so it can be used while Dexter UI job is running.</li>
    <li>load_job_engine.js:  exported and included about 10 fns from html_db.js</li>
    <li>Fixed bug in click help for <code>Js_info.get_info_string</code></li>
    <li><code>Editor.get_javascript</code> and <code>Editor.get_any_selection</code> now return empty string if
       the Editor.view is not  one of the standard types. Helps with experimentation.</li>
    <li>Edit menu new item 'Pretty print'. works on selection, or if none, whole editor buffer.</li>
    <li>Fixes to Dexter UI dialog, and simulator around pid moves.</li>
    <li> Dexter instruction <code>read_file</code> now does not attempt to put ANY prefix on the front
    of the path passed in. If its starts with a letter,
     it will get a file in /srv/samba/share/</li>
    <li>Robot status array for g0 for simulator now returns "angle" for J1 thru J5.</li>
    <li>Fixed bug in click help for Date instance methods like <code>getHours</code>.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.15, May 25, 2021</summary>
Highlights: Improvements to Jobs sending instructions to Dexter, esp.
            instructions that include a Dexter instance as their subject.
            Robot Status dialog now allows you to select the status mode (g number)
            displayed by "run rs_update job".
            Serial port, Make Instruction, Editor, doc improvements.
<ul>
    <li>Socket on error fixed bug of it not stopping the job when it should.</li>
    <li>Serial port: fixed numerous small problems including with serial_connect_low_level
        and serial_disconnect.</li>
    <li>Editor click-help Fixed infinite loop in some cases of clicking on the comment // .</li>
    <li>Editor click-help Fixed testing for end of /* and */ comments.</li>
    <li>Run Instruction dialog box: for the "mode" select box,
         the blank item now has a tooltip telling you not to select it,
         but if you do, you get a nice warning message instead of an error.</li>
    <li>Improved Ref Man/IO/File Access/ <code>read_file</code> and <code>write_file</code> for "encoding" parameter.</li>
    <li>Improved doc for <code>read_file</code> and <code>write_file</code>.</li>
    <li>Fixed bug in util: <code>is_generator_function</code> to correctly handling args
         passed of undefined, 0, null, false. This fixes a bug in the inspector when
         inspecting Jobs.</li>
    <li>Fixed similar bug in <code>is_iterator</code> .</li>
    <li><code>Dexter.set_link_lengths_using_node_server</code>
         now uses a timeout of 1 second so it will error quickly if there's no Dexter connected.</li>
    <li>Make Instruction: Now, clicking on "wrap in Job" button no longer scrolls doc to Job so
         that you don't lose doc on the inst you're wrapping,
         and makes it possible to follow the ref man tutorial.</li>
    <li>Make Instruction: updated User Guide for "Insert a Job" to "Wrap in Job."</li>
    <li>Make Instructions Insert Job dialog box, clicking the "insert" button,
         now closes the dialog box.</li>
    <li>Fixed <code>Instruction.text_for_do_list_item</code> to protect against circular printing,
          that happens sometimes in inspecting dl_list items.</li>
    <li>Made <code>folder_listing</code> accessible in the Job Engine.</li>
    <li>Now if there is an active job who's robot is a particular Dexter,
        and you start a 2nd job who's robot is that same particular dexter,
        the 2nd job will error.
        We now don't allow more than one active job to have the same dexter as its Dexter.</li>
    <li>Improvements to Dexter instructions that give a robot instance as their subject,
      ie <code>Dexter.dexter0.move_all_joints(...)</code>,
        <code>Dexter.dexter0.sleep(...)</code>.
      Using this mechanism, you can send an instruction from a job that doesn't
      have that Dexter instance as its job, to that dexter.</li>
    <li>Robot status dialog now allows you to select the status mode to be retrieved and
         shown when you click the "run update job' button, Other minor improvements to the dialog.</li>
    <li>Inspector: when passed a 2D array, it only "auto-expands it"
        if it has 10 pr fewer rows.
        This works on nested object & arrays, making it easier to see the high level structure
        of the data, but then click to see details of some part that you really care about.</li>
    <li>Fixed spelling recieve => receive in numerous doc and error messages. </li>
    <li><code>Job.prototype.send</code> now doesn't modify array instructions by popping off
       the robot on the end of a sent array,
       so that the do_list preserves the robot in it for use
       by Socket.find_dexter_instance_from_robot_status.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.12, Apr 23, 2021</summary>
Highlights: zeromq npm package re-installed, serial port and Dexter UI dialog tweaks.
<ul>
    <li>npm zeromq package installed version 6.0.0-beta:</li>
    <li>serial port: <code>old serial_path_to_info_map</code> is now defined to be same
        as the new <code>serial_port_path_to_info_map</code>,
        but <code>serial_path_to_info_map</code> is deprecated.</li>
    <li>serial port: <code>serial_connect_low_level</code> has a new last arg: <code>close_callback</code>
        that defaults to a callback fn that just prints out that the port has been closed.</li>
    <li>Dexter UI dialog box: improvements to underlying layout html and css.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.11, Apr 20, 2021</summary>
Highlights: improvements to socket handling. New Job status: "stopping'.
No longer using set_link_lengths_using_job.
<ul>
    <li>Lots of internal changes to Job and socket handling.
    Restriction of only 1 active job per robot.
    New status_code of <code>"stopping"</code> for handling jobs with <code>"F"</code>
    instructions that are stopped
    by user before the <code>"F"</code> instruction acknowledgement comes back from Dexter.
    Socket informal code to close socket now all call <code>Socket.close()</code>.
    Some calls to close now are passed true, to force close of the socket,
    ie when socket errors.</li>
    <li>No longer using  <code>Dexter.set_link_lengths_using_job</code>.
         This method is slow, unreliable and causes another job to be launched during
         the running of a job, which was confusing, and now not permitted with the
         new socket architecture.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.10, Apr 14, 2021</summary>
Highlights: Bug fix for re-initialization of a socket when in "real" mode.
Important bug fixes to J6 & J7 software.
Minor Improvements to Manage npm and Plot.show.
<ul>
    <li>DexterSim now correctly initializes Joint 6 to 0 degrees.</li>
    <li>Fixed conversion of degree-angles to dexter-units, to always return integers.
    <li>Fixed Socket code to properly re-initialize a socket if it times out.
    <li>Fixed the DDE Dexter settings such that if you start up DDE in real mode, and the "link lengths"
    (and min & max joint angles) are retrieved from defaults.makeins,
    but that file does not have min and max values for J6 and J7 (they don't now),
    then use default values for them.
    This fixes a bug in the Dexter UI sliders for J6 & J7 max values.</li>
    <li><code>J6_ANGLE_MIN</code> is now -150 (was 0).  <code>J6_ANGLE_MAX</code> is now 150 (was 296)</li>
    <li>Manage NPM, the help for creating the "require" code now has var names
        with hyphens changed to underscores to match JS syntax for var names.</li>
    <li>Manage NPM dialog, "List" buttons now print out list items with a new tooltip
        that tells you that clicking it will insert that package name into the NPM dialog box.</li>
    <li>Manage NPM dialog: added tooltips to the bottom 6 buttons.</li>
    <li>Ref Man: Minor reorganization of <code>DDE_NPM</code> documentation.</li>
    <li><code>Plot.show</code> fixed the show_window title default for multiple traces of 2D plots.</li>
    <li><code>Plot.show</code> Ref Man, added example for the show_window_options argument.</li>
    <li>Click_help on a string that looks like a path to a file but isn't, now doesn't error.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.9, Apr 7, 2021</summary>
Highlights: Fixed crashing DexRun due to faulty sending of instruction.
            Fixed Py.eval for global variables.
            Ref Man new section: "Math in JavaScript"
<ul>
    <li>Fixed DexRun crashing by removing faulty sending of instruction "E".</li>
    <li>Welcome to DDE dialog increased height slightly to avoid scroll bar.</li>
    <li>Robot Status dialog can now be brought up when no Job has run on the given robot.</li>
    <li>Robot Status dialog no longer shows incorrect units for 'Measured Torque".</li>
    <li>When you choose "JS" in the command line language menu,
        the doc pane scrolls to the User Guide section on "JavaScript".</li>
    <li>When the command line has language "Python" selected and you click one some text in it,
         now instead of erroring, you get a link to Python documentation in the output pane.</li>
    <li>Fixed <code>Py.eval</code> bug for global variables.</li>
    <li>Ref Man <code>Py.eval</code> has been extended to be a mini tutorial in Python basics.</li>
    <li>The Ref Man intro to Python in DDE has been extended to encompass a wider programming picture.</li>
    <li>Python documntation: new examples for <code>Py.init()</code> and <code>Py.kill()</code> added.</li>
    <li>Jobs bar height increased to show the bottom of the "circle i" character for inspecting
        the Job.</li>
    <li>Ref Man new top level section: <b>Math in JavaScript</b></li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.8, Apr 2, 2021</summary>
Highlights: Simulator now more accurately reflects Dexter hardware.
   Simulator new "Show Q" button.
   New Reboot Joints menu item and instruction.
   New help button on Editor pane menu bar replaces big blue quesiton mark in upper right.
   Dexter UI and its tutorial improved.
<ul>
    <li>Improved robot status to g0 to convert the "sent" j1 thru 5 from arcseconds to degrees.</li>
    <li>DDE_NPM bug fix: when clicking on File menu/Manage npm, the test for whether npm is installed on the machine or not was faulty.</li>
    <li>Bug fix for browsing several external links in the Ref Man under Python and Plot.</li>
    <li>If a file is in DDE's files menu list, and you quit DDE and the file is deleted in the OS, and you then launch DDE,
        DDE use to error or at least put deleted files on the file menu.
        Now it doesn't.</li>
    <li>Make Instruction: Dexter rare instructions menu, respelled "write" to "write_fpga".</li>
    <li>Simulator re-architecture to more accurately reflect Dexter.
        Much better simulation of J6 & 7 and Dexter.sleep</li>
    <li>Simulator: Click on the the "Show Q" button in the Misc pane,
        sim header to display a dynamic representation of Dexter's queue.</li>
    <li>Minor extension to the tooltip for the Doc pane's "Find" type in field.</li>
    <li>Dexter UI, Improved tooltip help on J4 and J5 sliders.</li>
    <li>Extended the Ref Man Python doc to be clearer about what contexts Python
        code is accepted in, and the intention of DDE's Python interface.</li>
    <li>For the 'find' results printing in the output pane: Made this non-temporary.
        Also, if not found in any TestSuites, just print nothing.
        Too confusing to tell users it isn't in test suites.</li>
    <li>Welcome to DDE window now tells you, at the bottom,
        how to get this dialog back if you close it.</li>
    <li>Improved a Job button's tooltip while running a Dexter.sleep instruction to
         include the duration.</li>
    <li>User Guide/Workflow extended to advise evaling small amounts of code often
        and keeping File Menu/Auto Save checkbox checed to avoid losing work in the event
        of a crash.</li>
    <li>New instruction: <code>Dexter.reboot_joints() </code>.
       This functionality for the default robot can also be achieved via the new item: Jobs Menu/Dexter Tools/Reboot Joints.</li>
    <li>The functionality of the upper right big blue question mark has
        been moved to the end of the Editor pane menu bar in a button named "Help"</li>
    <li>The Editor pane font size change widget and the * mark showing that the
        editor pane content needs saving is now under the "Editor" label in
        the upper left of the Editor pane.</li>
    <li>Dexter UI tutorial panes are now slightly lighter to increase contrast for
        the text in the panes.</li>
    <li>Dexter UI tutorial extended to make it more obvious what happens when "real"
        is selected but no working Dexter is connected.</li>
    <li>Dexter UI: launching this does not move Dexter (or the sim),
        it just changes the UI to conform to where Dexter (or sim) is.</li>
    <li>Dexter UI: improved tutorial flow towards the end of the tutorial and other minor fixes.</li>
    <li>Bug Fix: For robot status G0, The mapping between the robot status indexes and their names
        has been restored to the same as it was in DDE LTS, ie:<br/>
         38 J6_MEASURED_ANGLE,<br/>
         48  J6_MEASURED_TORQUE,<br/>
          18  J7_MEASURED_ANGLE,<br/>
         28  J7_MEASURED_TORQUE</li>
    <li>Inspector: now catches infinite recursion bug on computing source code. </li>
    <li>When Inspecting a 2D array, it will be "open" when you first inspect it.
        This saves the step of expanding it to see its contents.</li>
</ul>
</details>


<details class="doc_details"><summary>v 3.7.7, Mar 12, 2021</summary>
Highlghts: Significant enhancements to Plot and DDE_NPM for programmatic interface,
GUI interface and Documentation.
<ul>
    <li><code>DDE_NPM</code> now prints a helpful error message if npm is not installed when
        you choose File menu/Manage npm</li>
    <li><code>inspect_one_liner</code> for an array of strings now handles strings containing both
        single and double quotes better.</li>
    <li>Manage npm dialog now has buttons for
        <input type="button" value="info"/>,
        <input type="button" value="doc"/>,
        <input type="button" value="search"/>.</li>
    <li><code>DDE_NPM.list</code> now gets info from the relevant folder names AND prints e
        ach package_name in the inspector as a clickable link that inserts the package_name
        into the Manage npm dialog box.</li>
    <li>New Method: <code>DDE_NPM.is_installed</code>.
        See RefMan/Add Javascript/DDE_NPM.is_installed.</li>
    <li><code>DDE_NPM.uninstall</code> now won't uninstall built_in packages,
        and prints helpful warning messages.</li>
    <li>Manage npm <input type="button" value="insert require"/>
        button now fixes inserted variable names
        for package with hyphens in them to have underscores instead.</li>
    <li>Removed "npm" package from DDE."npm": "^6.13.7"</li>
    <li><code>Plot.is_3d_array(data)</code> fixed to more throughly check that it really
        has a 3D array with only numbers in it. Fixes a bug in the inspector.</li>
    <li><code>Plot.show</code> fix for title defaulting.</li>
    <li>New example in: RefMan/Window System/Plot/Plot.show/heat map.</li>
    <li>RefMan/Window System/Plot/Plot.show has lots of stying and descriptive improvements.</li>
    <li>When inspecting a 2D array of numbers, it will now always show a plot button.
        If the 2D array is not one of the special kinds of 2D array used for other plots,
        a heat map plot will be shown when you click on the plot button.</li>
    <li><code>show_window</code>: Removed the default callback of "show_window_values".
        Now no callback is called when you don't specify one and you click the
        close window button.</li>
    <li>New function: <code>browse_page</code> browses a url in your default browser.
        Unlike <code>show_page</code>, this shows you the url in an editable text field.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.6, Mar 8, 2021</summary>
    Highlights: New facility for DDE users installing and using NPM packages
     both in the user interface, and programmatically.
     Plot code and doc enhanced.
<ul>
    <li>Fixed a Python Ref Man example to not be in test suite as its not relevant.</li>
    <li>Fix for Plot titles that contain html.</li>
    <li>New <code>Plot.show</code> examples in Ref Man/Window System/Plot/Plot.show</li>
    <li><code>Plot.show</code> first arg can now be <code>null</code> to cause it to default to "plot_id". (<code>null</code> is shorter than <code>undefined</code>.)
    <li><code>Plot.show</code> now takes a 5th arg of <code>show_window</code> options.
        These are the same as the keyword args to show_window with some different
        defaults that make more sense for plots.
        Thus a plot can have both a show_window title and a plot title.</li>
    <li><code>Plot.show</code> now handles margins better such that you can see both the
         numbers of an axis and its axis title (if it has one).</li>
    <li><code>Plot.show</code> now doesn't (by default) inspect the values that are passed to
        <code>show_window</code>'s callback. With the new 5th arg to Plot.show,
        you can explicitly pass a callback for the show_window and
         have it do something different than nothing if you like.</li>
    <li>New File menu item: "Manage npm" for listing,
         installing and uninstalling npm packages.</li>
    <li>New class <code>DDE_NPM</code> for listing, installing and uninstalling npm packages.
        See Ref Man/Adding JavaScript</li>
    <li>New start screen tutorial: <b>Adding JavaScript</b>. It
        opens up the new Ref Man section on Adding JavaScript.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.5, Mar 2, 2021</summary>
Highlights: Python Interface much more useful.
            New Plot class and inspector integration.
            Simulator fixes.
<ul>
    <li>Extensions to Ref Man/Python documentation. The most substantial of which is for Windows Installation.</li>
    <li> Instruction: <code>Brain.eval_python</code> that facilitates integrating Python code into a Job.</li>
    <li>Fix for Py.init under certain circumstances for Linux.</li>
    <li>The default for the python installation in non-mac, non-windows (ie Linux, etc)
        is now "python3" instead of "python".</li>
    <li>Fixed bug in <code>Py.load_file</code> when processing slashes.</li>
    <li><code>load_files</code> can now take a .py file and it loads it using <code>Py.load_file</code>.</li>
    <li>When a Python numpy array is about to be returned to DDE,
        it is automatically converted to a list so that it can be converted to a JSON array
        and returned as a JS array.</li>
    <li>Improved callback default for <code>copy_file_async</code> to tell you the names of the files.</li>
    <li>Fixed simulator header pane numerical display for J2, J3, J4. The sign was wrong.</li>
    <li>Fixed simulator for J6 and J7.</li>
    <li>Serial Port: improved documentation on <code>serial_devices</code>.</li>
    <li>Added about 10 set_parameters to the set parameters series that shows up
        in the MakeInstruction dialog box for <code>Dexter.set_parameter</code>.</li>
    <li>Fixed Dexter set_link_lengths_using_dde_db for J6_angle_max and J7_angle_max.</li>
    <li>Compartmentalization of conversion of degrees to dexter_units (such as arcseconds) and back.</li>
    <li>Make Instruction, instructions menu now has "empty_instruction_queue" before "empty_instruction_queue_immediately"</li>
    <li>When launching DDE, now dde_init.js never comes up in the editor.
        If dde_init.js is the last file saved or it is the only file ever edited, a new buffer will come up instead.
        This prevents mistakes with this file, but you can still explicitly edit it.</li>
    <li>New class <code>Plot</code>, makes it easy to plot 1D, 2D and 3D arrays as well as move-points in Jobs.
        See Ref Man/Window System/Plot</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.4, Feb 5, 2021</summary>
Fix for initializing Python process with the file system.
</details>

<details class="doc_details"><summary>v 3.7.3, Feb 5, 2021</summary>
Highlights: New Python interface. New easy way to turn on/off the Startup operations
in Dexter like the PHUI interface. Bug fixes for Linux, node server interface, show_window
<ul>
<li><code>set_link_lengths_using_node_server</code> now gets it's ip address from the robot of the "job_to_start"</li>
<li><code>set_link_lengths_using_node_server</code> now sets a timeout for its attempt at 1 second, making it fail faster.</li>
<li>Now linux keybindings are like Windows keybindings,
    not like Mac as they previously were.</li>
<li>Fixed bug in switching to a file on the menu of files.</li>
<li>Minor bug fix in <code>show_window</code> callback function handling for anonymous functions.</li>
<li>Minor bug fix in <code>show_window</code>. Now passing in title: ""
     will create a window with no title bar without erroring.</li>
<li>Extended the documentation for <code>new Job</code> parameter,
    <code>if_robot_status_error</code> to include how to ignore an error.
     Extended the description of the different kinds of instructions to include null and undefined,
     under Ref Man/Robot and Ref Man/Robot/Robot Instructions.</li>
<li>Fixed <code>read_file_async</code> for node server to leave in beginning slash of path.</li>
<li>New menu item: Jobs menu/dexter tools/start options to "edit" Dexter's autoexec.jobs file
    controlling Dexter start up operations.
    Let's you turn on and off PHUI mode amongst other operations.</li>
<li>Improved User Guide/Debugging/Syntax Checker, first paragraph.</li>
<li>Fixed click_help doc scrolling for patch system methods.</li>
<li>New class <code>Py</code> for running Python code from within DDE JavaScript code.
   DDE user interface access with:
   <ul>
       <li>Eval button</li>
       <li>Command Line</li>
       <li>File menu/Load...</li>
   </ul>
    Documentation in RefMan/Python
</ul>
</details>

<details class="doc_details"><summary>v 3.7.2, Jan 13, 2021</summary>
Highlights: Improved robustness of connecting DDE to Dexter including error handling
      and no longer uses ping (to aid Linux installations and speedup).
      Simplified Misc Pane header/Simulation panel header by removing the extra "Dexter" menu.
      robot_status: now 4 different possibilities: g0 (the original), g1, g2, and g_other
      for statuses that are not yet well defined, but we can still look at them in the
      robot status dialog. TestSuite enhancements.
<ul>
    <li>Fixed the Jobs menu/Dexter Tools/Browse Dexter to always browse the current Dexter.default
        and not always 192.168.1.142</li>
    <li>Now when a user quits DDE from the Electron menu quit,
        from the Electron menu item "close window" or from clicking the main DDE window's close box,
          and there is a file in the editor with unsaved changes,
          they will be prompted as to whether they want to quit DDE without saving or not.</li>
    <li>Removed Sim pane header job and robot menu. Now just use the menu in the Misc pane header for selecting
        the default Dexter.</li>
    <li>Misc pane robot menu only gets dexter instance names on it,
        sans the "Dexter." prefix. A bunch of other code simplifcations around this.</li>
    <li>Redefined <code>default_robot_name()</code>  to return "Dexter." + Dexter.default.name
        and respelled this method to: <code>default_dexter_full_name()</code></li>
    <li> Pane header: respelled text: "default robot" to "Dexter.default:"
    <li>Changed instruction: <code>Dexter.get_robot_status</code>'s only argument's default from null to 0.
         Passing in an empty argument or null, now results in changing Dexter's status mode to 0, if it wasn't already.
         Documented in Ref Man/Robot/Dexter/Dexter Instructions/get_robot_status.</li>
    <li>Misc Pane Header: now has circle i  inspect button to inspect <code>Dexter.default</code>.</li>
    <li>When starting a Job using a Dexter for the first time since lanuching DDE,
      DDE gets the link_lengths and other settings from a file on Dexter.
      Now we first try to get that file via Dexter's node server,
      and if that fails, we fall back to getting it via a Job which is slower and more error prone.</li>
    <li>The Robot Status dialog box now has a circle-i icon to the right of the selected robot.
        Clicking it inspects the selected robot.</li>
    <li>When Inspecting a Dexter, the line for "robot_status" now has a button on the end of it
        named "Robot Status Dialog" that brings up the dialog for the inspected robot.</li>
    <li>Improved the error message: "Error running instruction" to give more information about the error.</li>
    <li>Fixed bug in sending <code>Dexter.get_robot_status(1)</code> with converting from an ascii digit
        to an integer.</li>
    <li>Robot status g2 implemented. New TestSuite file for RobotStatus.</li>
    <li><code>Dexter.start</code> removed "ping" from checking for existence of Dexter.
        This simplifies the underlying code, speeds up the starting of a job,
        and doesn't depend on Ping so should work better on Linux OS.</li>
    <li>DDE's default link length and joint angle min & max now set to Dexter HDI values.</li>
    <li>Fixed bug in <code>SimUtils.is_simulator_showing()</code></li>
    <li>Fixed when_stopped_testsuite to handle new pingless architecture.</li>
    <li>Option_click on editor now improves the display of Make Instruction by
         setting the Misc pane header correctly to "Make Instruction".</li>
    <li>Improved <code>show_in_misc_pane</code> to accept arg1 of the source code for make_instruction.</li>
    <li>Improved logic in <code>show_in_misc_pane</code> to coordinate its setting from various sources.</li>
    <li>Improved instruction <code>Control.wait_until</code> by not having it send periodic
        "keep_alive" g instructions during a long wait.
         This new code is simpler, removes a bug in waiting,
         and shifts the retrying to Socket.send which already had that mechanism in place.</li>
    <li>Fixed the setting of the Misc pane menu item in two places.</li>
    <li>Using option-click to select a whole <code>new TestSuite</code> expression in the editor
        no longer switches the Misc pane to "Make Instruction"
        because usually you want to run a TestSuite with Simulate Dexter in the Misc pane.</li>
    <li>The Output Pane header STOP button now also stops running TestSuites.</li>
    <li>Fixed Simulator to compute the <i>actual</i> last frame of simulation instead of one short,
       thus improving the accuracy of simulation.</li>
    <li>The manual TestSuite has been improved with a large PHUI_GUI test.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.7.1, Dec 27, 2020</summary>
Highlights: Support for robot status's g1, and g_other.
<ul>
    <li>Jobs menu/Run Instruction/Show_dialog the "Change mode to" select element now is initialized to empty.
        It did not show correct mode on initialization (and can't) so better to show blank.</li>
    <li>Bug fix to <code>is_phui_button_down()</code> which was returning the opposite of the correct boolean.</li>
    <li>User Guide/User Interface/Dexter User Interface: new section describing the "point down" checkbox.</li>
    <li>Robot Status now supports g0 (the original), g1(measured angles, velocity, torque) and
        g_other (generic, any non 0 or 1 status_mode).
        Lots of improvements to the robot_status dialog box.</li>
    <li>The "I" letter to the lower right of a Job button is now a &#9432; (circle i)
          for inspecting the job. &#9432; is used other places in DDE for inspecting objects.</li>
    <li>Ref Man/Robot/Dexter/Dexter Modes/set_keep_position,
         <code>set_open_loop</code> documentation extended slightly to be clearer.</li>
    <li>Instruction <code>IO.out</code> now takes a new 4th optional arg, print_job_info.
        If true, it prints the extra info it use to: Job name, instruction ID and instruction type.
         Default is false so that old calls to this instruction now won't have this "job info".</li>
</ul>
</details>
<details class="doc_details"><summary>v 3.7.0, Dec 14, 2020</summary>
Highlights: Dexter User Interface: numerous fixes. Support for Robot Status "g1".
<ul>
    <li>Fixed (on WinOS only) run the "Buttons column" example code in RefMan/Lesson.
        Fixed the bug when you clicked on the button "Dexter Picture".</li>
    <li>Remove from the testsuite, the RefMan example of:  new Job({name: "my_job8",
        works on WinOS but is intermittent on MacOS. See Doc on <code>Picture</code>.</li>
    <li>Fixed bug when choosing: File menu/New (also fixed in patch_3.6.9_1.dde)</li>
    <li>Dexter User Interface dialog improvements:
    <ul><li>Reduced width of row under big square so it wouldn't wrap to another line</li>
        <li>User Guide/User Interface/Dexter User Interface now documents keyboard control
             and the FromDex checkbox</li>
        <li>Now has a ? button in its upper right, to scroll the doc to help.</li>
        <li>Initial instructions are now a <code>Dexter.move_all_joints</code> and a
             <code>Dexter.pid_move_all_joints</code></li>
        <li>Now uses <code>insert_last_instruction_overwrite</code>
              which doesn't cause the do_list to continually
              build up but rather replaces the last instruction.</li>
        <li>Fixed: when user holds down only the shift key,
              now nothing happens, not even a warning message.</li>
        <li>Now the number keys increment the corresponding joint angle and shift-number-key decrements
            it. It use to be the reverse.</li>
    </ul>
    <li>Job now has defaults:<br/>
     keep_history: false, <br/>
     show_instructions: false</li>
    <li><code>Dexter.END_EFFECTOR_IN</code> has been deprecated.
        The new, and distant past spelling is <code>Dexter.END_EFFECTOR_IO_IN</code> which is compatible
         with Dexter firmware.</li>
    <li><code>Dexter.get_robot_status</code> now takes an optional argument, status_mode,
         which can be null (the default) 0, or 1.</li>
    <li><code>make_ins</code> now doesn't warn or error.</li>
    <li>DexterSim improvements now more accurately model Dexter.</li>
</ul>
</details>
<details class="doc_details"><summary>v 3.6.9, Nov 30, 2020</summary>
    <ul>
        <li> Fixed Release 3.6.8 build problems</li>
    </ul>
</details>
<details class="doc_details"><summary>v 3.6.8, Nov 27, 2020</summary>
<ul>
    <li> Fixed Release 3.6.7 build problems</li>
    <li>Fixed bug in simulator: when the Misc pane is not showing the graphical simulator.
         Now there's  a clear warning message.</li>
    <li>Improved the Ref Man/Lesson/Other Outputs for Education/Insert into Editor Pane/ "everything" example.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.6.7, Nov 27, 2020</summary>
    Highlights: Dexter User Interface: support for keystrokes, getting points from Dexter, and more.
    Big fix for the editor interface to the file system.
    Fix for MotionSetup code.
    Lesson improvements for helping teachers create tutorials for students.
    Jobs menu/Show Robot Status improvments.
    copy_file_async now is much more "async" for copying files from DDE to Dexter.
    Jobs Menu/Show Robot Status: fixes and extensions.
<ul>
    <li><code>get_in_ui</code> bug fix which fixes bug in MotionSetup code.</li>
    <li>TestSuite: added "typical duration" to the final report for comparison of that
        test suite run time.</li>
    <li>New Job Instruction: <code>Control.continue</code> for use within <code>Control.loop</code>.
        See Ref Man/Robot/Robot Instructions/Control.</li>
    <li>Improved click_help for Job.</li>
    <li>Fixed click_help for all "Control." and "IO." paths, especially <code>Control.break</code>
       which was confused with Javascript break.</li>
    <li>Fixed Jobs/Dexter Tools/ Calibrate Dexter dialog when clicking the close dialog box.
        Now does not display errors or warnings in the output pane.</li>
    <li>Fixed Jobs/Dexter Tools/ Calibrate Dexter dialog when simulate is on.
        Changed the alert box telling you more accurately how to change from simulate to real,
        and changed it from a "confirm" dialog to an "alert" as only 1 button is needed.</li>
    <li>Ammo caused infinite loop on JSON.stringify(Ammo) and inspect(Ammo)
         so those calls have been eliminated. This was breaking inspect(window)</li>
    <li>The asterisk that shows that the current editor needs saving now has a tooltip that explains it.</li>
    <li>Fixed bugs in the editor's file handling</li>
    <li>Extended <code>Lesson.make_button_column</code>
        with an example of a button that evals any JavaScript.</li>
    <li>Organized RefMan/Lesson/Lesson  and extended it with new section:
       Insert into Editor Pane, which lets you also replace the selection or all editor content,
       and select the newly inserted text.</li>
    <li>Improved the definition of a Job at the top of  RefMan/Job</li>
    <li>New User Guide/Installation/Multiple DDEs Installed</li>
    <li><code>copy_file_async</code> now truely is async and works for copying nested folders
        from laptop to Dexter's linux file system.</li>
    <li>Dexter User Interface: added methods: <code>Kin.J6_to_roll</code> and <code>Kin.roll_to_j6</code>
    which support the new Dexter User Interface dialog J6 roll feature.</li>
    <li>Dexter User Interface: Fixed dui2.dui_instance_under_mouse() that caused problems.</li>
    <li>Dexter User Interface: changed initial value of j3 from 0 to epslion, like J2 is now.
        This gets rid of the bug on initial start of the dialog and decrimenting Z.</li>
    <li>Dexter User Interface: can now be controlled by keyboard keys. This is modified
        by the new "key inc" menu.
        See tooltip on big x-y square for doc.</li>
    <li>Dexter User Interface: now has "FromDex" checkbox to populate the fields with values
         from Dexter after setting it to follow_me mode.
         Doc printed in Output pane when you check it.</li>
    <li>Dexter User Interface:  insert "Job" button now does not insert a first instruction,
         it just inserts an empty Job. This is better if you are using from Dexter to get points.</li>
    <li>When launching DDE, the initial file edited will be the file you were editing when you quit DDE.</li>
    <li>When launching DDE, the initial file edited will be the file you were editing when you quit DDE.</li>
    <li>Jobs menu/Show Robot Status: bug fix for
           <ol>
               <li>when simulate off</li>
               <li>choose jobs menu/Show Robot Status</li>
               <li>click Run update job</li>
               <li>click window close box, get error.</li>
           </ol>
    </li>
    <li>Jobs menu/Show Robot Status: Fix: when the latest run Job had a robot that wasn't a Dexter.</li>
    <li>Jobs menu/Show Robot Status:  New button <button>Inspect Array</button> that shows you the robot status array with the index numbers, labels, and values.</li>
    <li>Jobs menu/Show Robot Status:  New button <button>Browse</button> that let's you see the main web page for the selected Dexter.</li>
    <li>Editor: The most common syntactic stylistic "errors" have been removed or replaced with warnings.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.6.6, Nov 5, 2020</summary>
Highlights: Fix to Job Engine build process.
<ul>
    <li>patch_3.6.5_1 Extension to Ref Man/IO/Picture/Camera IO about setting permissions for camera in MacOS.</li>
    <li><code>write_file_async</code> fixed to not print contents to the Chrome console.</li>
    <li>Fix for Job Engine build process by removing unused npm package
        uvc-control that required package usb@1.6.3 which couldn't compile.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.6.5, Nov 3, 2020</summary>
Highlights: New PatchDDE for deprecation, 2_to_3 compatibility and patching system.
            New Tutorial authoring tools.
            Serial port, File handling, Picture improvements.

<ul>
    <li> serial.js imported <code>stringify_value</code> to fix bug in
          <code>serial_connect_low_level</code>
          Also imported it to messaging.js and robot.js</li>
    <li>serial.js <code>serial_connect_low_level</code> new arg: open_callback</li>
    <li>serial: changed "path" to "port_path" in most places.
        Changed "options" to "port_options" in parameter names.</li>
    <li> serial port: <code>serial_get_or_make_port</code> now if it finds an existing port,
         and that port is  not open, it opens it.</li>
    <li><code>serial_disconnect</code>  improved version that prints status to Output pane
         and has more reliable algorithm</li>
    <li>Changed hover cursor for big blue question mark to a pointer.</li>
    <li>Welcome screen tutorial items now have a hover background color and a pointer cursor.</li>
    <li>"Move Dexter" steptorial now does not present the
         Dexter UI dialog box until after the user has chosen simulate or real
         so that that choice will be used.</li>
    <li>Fix to <code>espeak</code> for text to speech on Dexter </li>
    <li>Fix for the "double rendering of Dexter" problem.</li>
    <li>JS Editor Lint: Eliminated warning for not having spacing around a colon f
         or a JS literal object.
         Also eliminated warning for <code>typeof(foo)</code>.</li>
    <li>JS Editor Lint: now "unused variables & uncalled fn defs get a warning
          (yellow triangle , not an error (red dot in left margin.)</li>
    <li>Fixed click help infinite loop with unclosed open bracket inside of a /* ..*/ comment.</li>
    <li><code>Editor.enable_click_help</code> is a new global variable to
         turn on or off click help.
         Its default value is true.
         See User Guide/User Interface/Editor Pane/Editor.enable_click_help.</li>
    <li><code>show_in_misc_pane</code>, if passed a string starting with &lt; will display it as html.</li>
    <li><code>show_in_misc_pane</code> if passed a dom elt, displays it in the misc pane.</li>
    <li>Ref Man new top level section "Lesson" on how to create lessons in DDE.</li>
    <li>New utility function: <code>is_string_base64</code>.
         See Ref man/IO/Picture/Low Level/is_string_base64</li>
    <li>Fix for taking pictures on Mac OS</li>
    <li><code>Picture.show_picture</code> can now take a base64 string as its "content" to display.</li>
    <li><code>Picture.save_picture()</code> now works for using all defaults for args.
        Better error message for no valid canvas_or_mat arg.</li>
    <li>Improvements to inspect for inspecting a class.</li>
    <li>Exported function: <code>folder_separator</code>, now available in DDE and job engine.
         Was formerly available only in LTS.</li>
    <li>Fixed <code>new Dexter()</code> to work just like  <code>new Dexter({})</code>
         This also fixed Jobs menu/Insert Example/Human Instrs/</li>
    <li>New class <code>PatchDDE</code> which formalizes deprecate,
        loading code to make DDE 3 more compatible with DDE 2,
        and provides a patching facility for quick fixes to a given release.</li>
    <li><code>patch_until</code> fixed, deprecated, moved to <code>PatchDDE.patch_until</code> and
          added to dde_2_to_3 compatibility.
          See Ref Man/PatchDDE/patch system/patch_until</li>
    <li>Ref Man documentation for <code>write_file</code>'s 3rd (encoding) parameter has been written.</li>
    <li>Ref man for <code>write_file_async</code> was mislabeled. Now fixed.</li>
    <li>New function: <code>copy_file_async</code>.
          See Ref Man/IO/File Access/copy_file_async</li>
    <li>fixed doc for <code>write_file_async</code>.
        The callback takes only 1 arg, an error object,
        but not a 2nd arg of content as previously documented.</li>
    <li><code>write_file_async</code> extended.
        Now if the path argument contains folder(s)
        that don't exist, they are automatically created.</li>
    <li>new function: <code>copy_folder_async</code>. See Ref Man/IO/File Access/copy_folder_async.
           Not yet working for copying folders to and from Dexter.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.6.4, Sep 29, 2020</summary>
Highlights: New Steptorial for Learn JS.
            Improvements to the Welcome window.
            read_file_sync and write_file_sync now have efficient file transfer between
            DDE and Dexter.
            Saving Files UI in DDE improved.
            Bug fix for Dexter.set_parameter("CartesianSpeed") and friends.
    <ul>
        <li>Welcome Dialog: shortened title to "Welcome to DDE" so that you can drag the title bar
             to reposition it.</li>
        <li>Welcome dialog now when you click an item, it checks it and leaves it checked.
            User can no longer uncheck it by clicking on it. This is just simpler.</li>
        <li>When you close the Welcome dialog, a printout in the output pane tells you
            how to get it back.</li>
        <li>Clicking on the big blue question mark in the upper right now shows
            the Welcome dialog box of tutorials. The last one is "help system" to see what
            the big blue question mark use to show you.</li>
        <li>Misc Pane new checkbox "Expand". Check to maximize the Misc pane,
            uncheck to put it back where it was. Pays attention to the Edit menu "animate ui"
             checkbox.</li>
        <li>serial_disconnect now has flush before close, and a try_catch around it.</li>
        <li>Improved error message when selecting from Misc Pane menu fails.</li>
        <li>"Save on eval" and "Animate UI" menu item checkboxes now check and uncheck
            if you choose the menu item OUTSIDE of the checkbox.</li>
        <li>For a lesson's button, checks a button at most once.</li>
        <li>Misc pane menu is now a combo box allowing type in, and it is
            automatically updated when the content of the Misc pane changes,
            esp when choosing "Choose File"</li>
        <li>Bug fix for instruction <code>Dexter.set_parameter("CartesianSpeed", 300000)</code>
             and similar fix for  set_parameter of names that start with: "Link"</li>
        <li>ESLint added ok to have node.js fns, commonjs fns, and globals
            that are not known to eslint, but are none the less defined.</li>
        <li> Adjusted Move Dexter tutorial to allow you to select simulate OR real,
            (with a warning).</li>
        <li>Clicking on Welcome dialog "Learn JavaScript now brings up a guided tour of
            how to learn JS, closes the Welcome dialog and tells you how to get it back.</li>
        <li> File menu/Save (ctrl S) now always saves to the local computer. </li>
            It does not ask you what dexter you might want to save on.</li>
        <li>File menu/Save to Dexter as:  removed incorrect first para in the dialog box.</li>
        <li>Minor improvement to User Guide/Configure Dexter/Data Connection/on MacOS</li>
        <li><code>read_file_async</code> and <code>write_file_async</code> can now write to Dexter efficiently.
           See Ref Man/IO/File Access/read_file_async, write_file_async.
        </li>
</ul>
</details>
<details class="doc_details"><summary>v 3.6.3, Sep 4, 2020</summary>
Hightlights: Simulator now displays much more realistic Dexter.
             New tutorial for Dexter UI.
             New "Dexter Platform Architecture" diagram.
             Green blinking to alert for hidden info displays.
             Bug fixes for low level instructions.
<ul>
    <li>Much more realistic simulated dexter from the CAD files that print its skin.</li>
    <li>Support for displaying glTF files in Misc Pane/choose file.</li>
    <li>Adjusted initial splitter panes now show more of output and misc panes.</li>
    <li>Wecome screen top tutorial title now spelled "Move Dexter".</li>
    <li>When you click on the Welcome dialog box's "Move Dexter" tutorial, you get a multi-step,
            highlighted region guided tour of the dialog box.</li>
    <li>Fixed <code>append_in_ui</code> by replacing call of insertAdjacentElement with insertAdjacentHTML.</li>
    <li>Moved <code>html_db</code> to core folder so that now make_html and friends are available in job engine.</li>

    <li>Fix "Making Music" url in Ref man to point at the specific making music video.</li>
    <li>Inspector: extended to show "name: foo" for each item when inspecting an array of objects and an object has a name property.</li>
    <li>Inspector: title when inspecting an object, if that has a "class" or "type", its shown.</li>
    <li>Misc Pane now remembers, across dde launches,  the file shown in it and displays it upon relaunch if the file still exists.</li>
    <li>to_source_code: Changed its depth_limit default value from Infinity to 100, and for newObjects, now passes in a depth of depth + 1 to stop infinite recursion potential.</li>
    <li>speak extended to work on Job Engine. See  Ref Man/IO/Sound/speak/node_callback</li>
    <li>Improved messaging dialog insert button formatting of inserted text.</li>
    <li>New Insert menu show_window example for input range sliders.</li>
    <li>Fixed to_source code for make_ins instruction via aux fn to_source_code_instruction_array</li>
    <li>Fixed is_literal_object utility. And that fixed:inspect(make_ins("S", "RebootServo", 3))</li>
    <li>When there is new output in the doc pane or the output pane, and the pane is hidden (collapsed),
         its corresponding splitter bar control blinks green to let the user know there is
         something new to see in the hidden pane.</li>
    <li>User Guide/Calibrate Dexter updated for Dexter HDI.</li>
    <li>Fixed show_window menu widgets and the Insert menu/show_window/Menu example</li>
    <li>Misc pane new option "Dexter Architecture" shows The Dexter Platform Architecture block diagram.</li>
    <li>Dexter UI: zslider appearance and color tweaks.</li>
    <li>Dexter UI: When DUI is initialized, its job moves the robot to 0,0,0,90,0,0,0.</li>
    <li>Fixed Dexter Photo   ... now part of DDE instead of hitting hdrobotic.com</li>
    <li>SimBuild the template block and the new blocks made now have phong shading material for a more 3D look.
        (but this still needs work)</li>
    <li>Bug fix: when picking up an already made block, it doesn't make a copy, it just grips the existing block.</li>
    <li>Extensions to "manual_testsuite" to make it more definitive for running all tests.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.6.2, Aug 10, 2020</summary>
Highlights: Dexter User Interface dialog extensions.<br/>
            Simplified "Welcome" dialog box.
<ul>
    <li>Fixed Job Human instruction examples (actually done in 3.6.1)</li>
    <li>Fixed inserting a color such that # will be inserted before a
        hex value of a color. (actually fixed in 3.6.1)</li>
    <li>Windows version now no longer has redundant File/Edit/etc menu bar.
       (actually fixed in 3.6.1)</li>
    <li>Fixed initialization of the new "misc_pane_content" persistent variable by correctly
        setting defaults.</li>
    <li>Internal: Removed font "creepster" that was used in the Welcome dialog.</li>
    <li>Removed "Configure DDE" from "Getting Started". Its not important to know when first
        learning DDE and its covered in its own section in the User Guide.</li>
    <li>On DDE launch, if the only remembered edited file is dde_init.js (as it is on initial launch),
        then it does not show up in the editor but rather a new buffer does.</li>
    <li>Improved formatting in User Guide/Doc Pane.</li>
    <li>Reduced welcome dialog from 17 tutorial to 9, no scrolling.
       Also removed reference to the big blue question mark, but have a new last tutorial of
       "Help System".</li>
    <li>Improved confusing persistent.json formatting.</li>
    <li>Reworded "no dde_init.json" error message, and made it not come up if user hasn't
        saved any files as in when they first launch DDE.</li>
    <li>Fixed the link to the debugging video in the User Guide Debugging section.</li>
    <li>Fixed show_window content elements of class "clickable" that have a "name" property to have
         that be the value of the literal object passed in to the show_window callback's
         clicked_button_value property, and that such elements will have their "innerHTML"
         be the value of their "name" or "id" in the show_window callback.
         See Ref Man/Window System/show_window/content/clickable.</li>
    <li>Testsuite: selection_to_test now automatically computes a reasonable testsuite name
        when making a new testsuite.</li>
    <li>Dexter UI: Improved Documentation.</li>
    <li>Dexter UI: Now there's 4 arrow buttons for stepping through the instructions of
        a Job defined in the editor.</li>
    <li>Dexter UI: The dialog now has a horizontal line above the Insert row to separate it
        from the rest of the dialog.</li>
    <li>Dexter UI: Jobs menu/Dexter Tools/Dexter UI has been moved to Jobs menu/Dexter UI
        for easier access.</li>
    <li>Simulator: in Sim pane header, respelled "Move duration 2.1 seconds" => "Move dur: 2.1 s"
        and shift it to right of the job/robot select menu to save vertical space. (actually done in 3.6.1)</li>
    <li>Simulator: Tooltips now shown on radio and checkbox labels, J1 through J7 labels,
        and X, Y, Z labels.</li>
    <li>Fixed click-help and inspector when clicking on file names of long files.</li>
    <li>MacOS certificate installed so users won't get warning of untrusted file when installing DDE.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.6.1, Jul 24, 2020</summary>
Highlights: Significant extensions for Simulator, Dexter User Interface, SimBuild.
New "Splash Screen" of tutorials for aiding new users.
Minor bugs fixed in Kin.js and serial.js.
<ul>
    <li>Removed underline from the big blue question mark and made it slightly larger.</li>
    <li> Extended Inflow doc with how to pass in options query args to <b>get</b>
         to increase records returned, sorting order, etc.</li>
    <li>Fixed Test Suite bug: Inflow.put call should have been "not in testsuite" now it isn't.</li>
    <li>Removed printout in output pane for the big blue question mark as that's now in the splash screen.</li>
    <li>Improved <code>Dexter.move_to</code> such that if what's passed in for J6 and J7 is the default, [0],
        then only 5 angles are sent to Dexter. If only J7 is the default,
        then only 6 angles are sent to Dexter.
        If J5 is [0] but J7 is not, then 7 "angles" are sent to dexter,
        but the angle for J6 is "N" meaning "don't change it from its current position.
        This means Dexter will "do nothing" for those unpassed in Joints,
        solving a problem with the gripper.</li>
    <li>Improved <code>Dexter.move_all_joints</code> similarly, ie if j6 and/or j7 is [0], send a NaN to dexter.</li>
    <li>Removed folder .license_temp_gen from the electron_dde folder .It never should have been there.</li>
    <li>Splash screen comes up when you first launch DDE. Provides convenient check-box menu of
       17 tutorials to view with a click. Checks are perisistent accross launches of DDE so you can
       keep track of what you've seen and what you haven't.</li>
    <li><code>show_window</code>
        <ul>
            <li>show_window with a title of "" will now have NO title bar, meaning no title, close box, collapse control, and you can't drag the window.</li>
            <li>show_window has two new init params: title_bar_height, title_bar_color</li>
            <li>show_window collapse icon improved.</li>
            <li>show_window, when the user clicks the "X" to close the window, now the show_window's
                callback function is also called, with the clicked_button_value
                value of  "close_button".</li>
            <li><code>show_window_values</code> The default callback for show_window is now a global variable so it is available for all show_window calls.</li>
        </ul>
    </li>
    <li>Click help for Control.loop fixed.</li>
    <li>RefMan for <code>Control.loop</code> extended to have 4 more examples and
        a more complete explanation of body_fn returned instructions.</li>
    <li>In DDE 3.4.7, 17 "Robot" instructions were deprecated and replaced with same_named
       "Control" or "IO" instructions.
    Example: <code>Robot.loop</code> is now  <code>Control.loop</code>.
    The depricated insructions are;
    <ul><li><code>Robot.break</code></li>
        <li><code>Robot.go_to</code></li>
        <li><code>Robot.loop</code></li>
        <li><code>Robot.label</code></li><li><code>Robot.suspend</code></li>
        <li><code>Robot.unsuspend</code></li>
        <li><code>Robot.sync_point</code></li>
        <li><code>Robot.wait_until</code></li>

        <li><code>Robot.include_job</code></li>
        <li><code>Robot.send_to_job</code></li>
        <li><code>Robot.sent_from_job</code></li>
        <li><code>Robot.start_job</code></li>
        <li><code>Robot.stop_job</code></li>

        <li><code>Robot.debugger</code></li>
        <li><code>Robot.step_instructions</code></li>
        <li><code>Robot.error</code></li>
        <li><code>Robot.if_any_errors</code></li>
    </ul>
    New in this release is click help for each of those deprecated instructions
    telling you that they are deprecated, and directing you to their replacements.</li>
    <li>RefMan/Robot/Dexter/Dexter Instructions/move_to for Dexter.move_to instruction extended
        to contain "move to" so that it will be found when searching with the Find button.
        Also added 2 examples.</li>
    <li>RefMan for <code>Dexter.pid_move_all_joints</code> and <code>Dexter.pid_move_to</code> now have examples.
        Minor improvements made to other examples in the "move" instruction documentation.</li>
    <li>Find type in: click help now works on this text.</li>
    <li>Jobs menu/Dexter tools/Ping Dexter now auto-scrolls to the User Guide section on Ping.
        Also Ping in "Test Connectivity" section, now has a link to the User Guide section on Ping.</li>
    <li>The big blue question mark is now visible even when the doc pane is very narrow.</li>
    <li>Getting started: first line: removed the word "fundamentally".</li>
    <li>If user is not running the latest dde beta version, its now not printed out
       in the Out pane as a 'warning' but just a note in purple.
       The Doc pane is no longer auto-scrolled to the page for downloading the latest version.</li>
    <li>Simulator
        <ul>
            <li>Simulator: fixed new DexterSim to init <code>J6_MEASURED_ANGLE</code> to 512.</li>
            <li>Upon first DDE launch, the content of the misc pane is the simulator.</li>
            <li>Misc pane content is now a persistent variable meaning whatever was in the
                content when you quit DDE, that will be the content when you relaunch it.</li>
         </ul>
    </li>
    <li>Simulator_builder
        <ul>
            <li>Simulator can sense J7 (gripper) as open or closed</li>
            <li>A "template" box that can be cloned when the gripper closes on it.</li>
            <li>New button in Misc pane header for "load sim build".
        </ul>
    </li>
    <li>Simulator Extensions
        <ul>
            <li>Sim pane now oriented to up up with +X on the right.</li>
            <li>The "Z" label now shows you a non-backwards Z in the default view.</li>
            <li>Simulator table changed to Dexcell dimensions</li>
        </ul>
    </li>
    <li>Dexter User Interface
    <ul><li>For insert instruction into editor, improved whitespace.</li>
        <li>The "editor" button grabs the instruction in the editor and populates the Dexter UI dialog with it.
        <li>Smarter pruning of default args when inserting instructions into the Editor.
        <li>Respelled Dexter User Interface 2 to Dexter User Interface.
            Respelled old Human Instruction Job of Dexter User Interface to
            Dexter Simple UI to avoid confusion.</li>
        <li>Now preventing the dragging of the  green X,Y dot into the donut hole.</li>
        <li>New button called "ready" which moves robot (and GUI) to angles[0, 0, 90, 0, 0]
            because that positions robot to be good for normal moving whereas home position isn't.</li>
        <li>New button called "editor" to grab an instruction from the editor and populate
            the dialog plus move the robot.</li>
        <li>New User Guide section for Dexter User Interface.
           The doc is scrolled to automatically when the dialog comes up.</li>
        <li>When inserting an instruction into the editor for move_all_joints, now all 7 args are inserted.</li>
    </ul>
    <li>DDE now automatically creates the dde_apps folder if it doesn't exist.</li>
    <li>Replaced Ref Man and other code examples of deprecated <code>Robot.out</code>
        with <code>IO.out</code></li>
    <li>Fixed <code>Kin.point_down</code> for J5.</li>
    <li>The menu item Jobs menu/Run Instruction/selection can now be invoked with
        Ctr-R on windows and Cmd-R on MacOS.</li>
    <li>Jobs menu/Run Instruction/HOME_ANGLES has been extended to to run,
        after <code>Dexter.move_all_joints(0,0,0,0,0,0,0)</code>,
        a <code>Dexter.pid_move_all_joints(0,0,0,0,0,0,0)</code>
        and <code>Dexter.empty_instruction_queue()</code></li>
    <li>Fixed import/export problems with dde_error in Kin.js and serial.js</li>
    <li>Fixed click-help and inspector when clicking on file names of long files.</li>
    <li>MacOS certificate installed so users won't get warning of untrusted file when installing DDE.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.6.0, Jul 4, 2020</summary>
Highlights: Updated versions of foundational software.<br/>
    Doc improvements, esp. Learning JS via Stepping
    and JavaScript for Python programmers.<br/>
    Simulator bugs fixed.<br/>
    Dexter UI improvements.<br/>
    Improvement for Kin.point_down<br/>
<ul>
    <li>Underlying Software updates:
        <ul>
            <li>node.js   version upped from 10 to 12.</li>
            <li>Electron  version upped from 4 to 5.</li>
            <li>serial_port version upped from ^7.0.2 to ^8.0.0</li>
            <li>jqxwdigets upgraded from version 5 to version 9.</li>
            <li>Three.js upgraded to v 0.118.3 and converted to using npm to install it.</li>
            <li>three-2dtext upgraded to v0.6.0 and converted to using npm to install it.</li>
        </ul>
    </li>
    <li>TestSuite "Run TestSuite File" extended to be able to accept ref_man.html and guide.html
         when chosen by the user to run those doc files as testsuites.</li>
    <li>Cleaned up User Guide Help System section including fixed webinar videos url in
        The User Guide to:https://www.hdrobotic.com/blog/programming-in-dexter-development-environment-archive</li>
    <li>Fixed bug in latest release so that clicking on a splitter pane "expander" bar will
         expand the editor pane or doc pane, not the other panes like it did in DDE v 2.</li>
    <li>User Guide: Improvements to "JavaScript" section.</li>
    <li>User Guide: new section: "JavaScript for Python Programmers"</li>
    <li>Added tooltips to all menu bar menus</li>
    <li>Updated Help System doc
        <ul>
            <li>At top of Help system doc, new paragraph about different learning styles</li>
            <li>User Guide section on Learning JavaScript extended to have a step by step tutorial on using the stepper to learn JS.</li>
            <li>Added Jobs menu/Dexter Tools/Dexter U2 for the "donut dialog".</li>
            <li>Emphahsized "STRUCTURED LEARNING" where relevent</li>
        </ul>
    </li>
    <li>User Guide new section under Javascript/Learning JavaScript for learning via Stepping.</li>
    <li>New doc: User Guide/JavaScript/JS for Python Programmers</li>
    <li>New function: <code>is_folder</code> returns true if the passed in string is a folder.
        See Ref Man/IO/File Access/is_folder</li>
    <li>New function: <code>folder_listing</code> returns an array of the files and/or subfolders of a folder.
        See Ref Man/IO/File Access/folder_listing</li>
    <li>Output pane made slightly less high to reduce wasted vertical space.</li>
    <li>Dexter UI2 and simulator
        <ul>
            <li>Dexter UI2 extended to have its Job name the same as its file name WHEN it is running on the Job Engine.</li>
            <li>Choosing Dexter UI2 Jobs menu item automatically switches Misc Pane to "Simulate Dexter" .</li>
            <li>Dexter UI2 fix X axis wrong sign for the green dot, sim j1 and j5 fixed.</li>
            <li>New limits to j1 thru j5 sliders of: [185, 105, 150, 120, 185] in
                robot.js J1_ANGLE_MIN and friends.</li>
            <li>Dexter UI2 bug fixed when updating Joint angles via the number spinners.</li>
            <li>Dexter UI2 now points down by default.</li>
            <li>Dexter UI2 New button "home"</li>
            <li>Fixed <code>Kin.point_down</code></li>
            <li>Dexter UI2 New controls for Inserting JS of current location, only when Dexter UI2 running in DDE.</li>
            <li>Fixed relaunching of Dexter UI2 dialog</li>
        </ul>
    <li>New oplet: "C" for pid_move_to</li>
    <li>New Oplet "D" for pid_move_to_straight</li>
    <li>New class: Inflow for reading and writing data from the Inflow inventory management system.
        See Ref Man/IO/Inflow</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.5.12, Jun 16, 2020</summary>
 Highlights: version 3.5.11 build did not produce a .exe file so
            this release was made.
<ul>
    <li> Fixed Messaging.login call in ref man to not be run in TestSuite.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.5.11, Jun 16, 2020</summary>
Highlights: Inspector extended with 2D capability for arrays of objects.
            WinOS: fix for tiny window on launch and workaround documented for
                 installation hang bug.
            Serial port fix, and many others.
<ul>
    <li> Fixed bug in TestSuite for <code>Vectorproject_point_onto_line</code> </li>

    <li> Documented <code>Control.start_job</code>'s if_started parameter's default.</li>

    <li> <code>Control.start_job</code> added: "running_when_stopped" processing.</li>

    <li> <code>Control.stop_job</code> fixed bug wherein a job that has
         when_stopped="wait" and
         a Control.stop_job didn't, in fact, stop.
         New TestSuite test added for it.</li>

    <li> Inspecting a array of literal objects now can be displayed as a 2D table.</li>

    <li> Inspecting arrays now has a "2D" checkbox to toggle 2D vs 1D display formats.</li>

    <li> When DDE is launched, the Output pane now includes:<br/>
          "For help on using DDE, click ? in the upper right."</li>

    <li> On DDE launch, changed the printout:
         "The latest beta version" to "The latest public beta version"
         as that's more accurate.</li>

    <li> Test menu/Navigation/* fixed keystroke designations on MacOS from "Alt-" to "Opt-".</li>

    <li> Fix for DDE coming up as a tiny window in WinOS.</li>

    <li> The install bug for Windows 10 of ""Installing, please wait..." forever.
         Documented workaround in User Guide/Installation/Windows OS Problems/Install Hang Bug
        and Github DDE Issues.</li>

    <li> <code>Human.notify</code> instruction has a new parameter:
        close_same_titled_windows.
       Like its same-named parameter in <code>show_window</code>
        except that the default is <code>false</code>.</li>

    <li> serial port:  Now caches the port object so that at most,
         only one is created for a path in a given DDE session.</li>

    <li> <code>serial_disconnect_all</code> now documented under Ref Man/Robot/Serial/Low Level Serial/
    </li>
</ul>
</details>

<details class="doc_details"><summary>v 3.5.10, May 30, 2020</summary>
Highlights: Bugs fixed in serial port, the "out" function, Job.start,
    show_window, click-help,
    Vector.project_point_onto_line, Kin.three_torques_to_force,
    Editor keystroke: ctrl-O (for open), Editor coloring JavaScript keywords.<br/>
    Editor now displays "unsaved" state.<br/>
    Inspector works on HTML DOM elements.
<ul>
    <li> serial.js fixed bugs in <code>serial_onReceiveCallback</code></li>

    <li> Respelled serial_devicies_async_callback_default to
         <code>serial_devices_async_callback_default</code></li>

    <li> DDE buttons now look more like buttons: rounded corners, outset border shading,
         hover border color to let you know you're really on the button.</li>

    <li> Improved Job.start and Job.init_do_list to better handle a new do_list
         passed in to <code>Job.start</code>'s options.</li>

    <li> Fixed the <code>out</code> function argument of "code" to properly print in
         the HTML <code>code</code> font.</li>

    <li> Extended User Guide/Editor Pane with "Click, Select, Drag" section now containing:
        <ul>
            <li>If you click anywhere in the editor, you'll get "click help" printed in the Output pane
                about the code you clicked on.</li>
            <li>If you double click, it will select the "word" under the mouse.</li>
            <li>If you triple click, it will select the whole line under the mouse.</li>
            <li>You can drag a selection of text to a new location.
                On MacOS: mouse down on the selection and hold on that selected text.
                Then drag it to a new location. A cursor shows you the new location.
                When you release the mouse, the text will be moved from its original location
                to the new location.<br/>
                On WinOS: Mouse down then up then down and hold. Now you can drag the
                text to a new location. Mouse up to "drop it off".
            </li>
        </ul>
    </li>

    <li> Fixed bug in <code>Vector.project_point_onto_line</code>
         of misspelling of Vector.project_point_onto_linepoint.</li>

    <li> Fixed a bug in <code>Kin.three_torques_to_force</code> with
         sign error in y and z.</li>

    <li> new TestSuites for <code>Vector.project_point_onto_line</code> and
         <code>Kin.three_torques_to_force</code>.</li>

    <li> Vastly improved error message for when a show_window callback errors.</li>

    <li> Fixed on Mac & windows ctrl-O (for open)</li>

    <li> Now the editor pane colors JS keywords  such as
        "return", "function", "debugger" purple like it use to in DDE version 2.</li>

    <li> in dde editor, put a "*" to the left of the file name in the Editor Header
    to indicate that the file needs savings.</li>

    <li> show_window fixed bug in <code>SW.get_show_window_title</code> which also fixes a bug in
         <code>SW.windows_of_title</code></li>

    <li> inspector can now inspect HTML DOM Elements.</li>

    <li> click_help onclick_for_click_help now protects against getting a "full_src" that isn't a string.</li>

    <li> Fix for <code>params_string_to_param_names_and_defaults</code>
         when clicking on certain fn calls with keyword args.</li>

    <li> Job engine: now defines global vars: <code>dde_version</code> and <code>dde_release_date</code>.
        Previously these vars were defined in DDE proper only.
        They are printed to the console when index.js (the job_engine) is loaded.</li>
    </ul>
</details>

<details class="doc_details"><summary>v 3.5.9, May 14, 2020</summary>
Highlights: bug fixes.
<ul>
    <li> Slight improvement of doc for <code>New Serial</code>New parameter: capture_extras.</li>

    <li>  <code>show_window</code> textarea now sets in the arg lit obj to a show_window handler
        the textarea "id" if there is no "name" attribute in the
        html for the show_window content.</li>

    <li>  Fix to utils.js  <code>params_string_to_param_names</code> when the string starts with a "{"</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.5.8, May 9, 2020</summary>
Highlights: New Job debugging facility for stepping through JavaScript.<br/>
            Improvements to the auto-generated email when you make a suggestion/bug report.<br/>
            Signficant bugs fixed.
<ul>
    <li> Removed redundancy from Ref Man/IO/Web/get_page</li>

    <li> Now when choosing from the Insert menu, the items:
         beep, beeps, get_page, show_page, speak, speak with options,<br/>
         the doc pane will scroll to their documentation.</li>

    <li> show_page is now known by the linter and won't give you a warning.</li>

    <li> show_page now returns a window instance that you can call
         win.chose() on plus a variety of other methods.
         See: Ref Man/Window System/show_page.</li>

    <li> get_page: improved Ref Man doc, eliminated comments inserted
         when choosing Insert menu, get_page because
         they are now redundant with the Ref Man.</li>

    <li> Fixed bug that the back and forward arrows in the Doc pane didn't work
         for most of the time.</li>

    <li> The former <code>Control.debugger</code> instruction has been renamed to
         <code>Control.step_instructions</code> </li>

    <li> <code>Control.debugger</code> now means an instruction that pauses a Job
        and allows you to step through the JavaScript of a running job,
        not just each instruction. This is a low-level but powerful tool.
        See User Guide/Debugging/Stepping Instructions/step_instructions.</li>

    <li> The Misc Pane header has a new checkbox, "Js debugger". This
         allows you to start stepping the JavaScript of a running Job.</li>

    <li> Improved the organization of the User Guide for debugging,
        especially for stepping.</li>

    <li> Fixed a click help bug that caused an error when clicking in the editor.</li>

    <li> Calls to the function <code>shouldnt</code> improved by scrolling the
         doc pane to user guide Contacts.</li>

    <li> Improvements to the auto-generated email that is created when you
        click on the email address to send bug reports to in User Guide/Contact.
        Now the editor selection and a list of the running Jobs with
        their status and currently executing instruction are shown.</li>

    <li> Removed the "save file when DDE quits" functionality
        because it looks like that was causing an empty file to be saved
        for the current file, thus losing the whole contents of the file.
        Now you may lose the contents of the buffer since you last saved it
        if there is an unexpected quit of DDE.
        Note that if you have the File menu item "Auto Save" checked,
        saves will happen upon clicking the eval button and switching
        editor buffers, so with this checked, if you eval via the
        Eval button some horrible crashing code, your latest editor buffer
        will still be saved (with the crashing code!)</li>

    <li> robustified utils is_string_a_integer to return false if passed a non-string.</li>

    <li> fixed bug in Job.report() of undefined fn now in SW class.</li>

    <li> serial_port_init() is no longer called during startup, to
        avoid the message:
        "Warning: Calling serial_port_init() is no longer necessary to use the serial port
        capability. It now does nothing."</li>

    <li> tweaked Job.insert_instruction so that instructions inserted at location "end"
        always are top level instructions on the do_list.
        This improves inspecting the do_list hierarchy.</li>

    <li> RefMan/Robot/Robot Instructions/Control/start_job  improved.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.5.7, Apr 21, 2020</summary>
Highlights: Extensive Error handling improvements.<br/>
    See Ref Man/Job/Error Handling for an overview.<br/>
    Expanded click help & doc on make_ins("w" ...)<br/>
    modbus-serial installed<br/>
    serial port improvements for Job Engine.<br/>
    Bug fix for Control.loop/Control.break with nested loops.
<ul>
    <li>Fix to ref man example in Object.entries_doc_id
        for the function definition that screwed up the test suite.</li>

    <li> Changed generator (function*) examples in the ref man and in
        Jobs menu/Insert Example/Generators from
        function* foo(){...} to
        var foo function* (){...}
        because JavaScript doesn't bind the "foo" in function* foo(){...}</li>


    <li> Jobs menu/Insert Example/Human Instr/ Job Example 7g: Dexter User Interface
          replace min & max of ranges on the
          7 sliders with actual J1 thru j7 min and max.</li>

    <li> inspect improvements:
      <ul>
          <li>when calling inspect(foo) the source of the arg is shown.</li>
          <li>primitives (numbers, etc.) are shown in a proper inspect formatting
              including their type, instead of just printing the primitive.</li>
          <li>inspecting NaN improved with type information and NaN as
              an array element.</li>
          <li>Proper grammar in Inspect title w.r.t. "a" and "an", esp. with noun "array".</li>
      </ul>
    </li>

    <li> Improved the stop reasons in many Human instructions.</li>

    <li> Now npm modbus-serial package is installed in DDE.
         See Ref Man/Robot/Serial/Modbus</li>

    <li> Serial Port improvements:
         <ul>
            <li>serial_port_init() is now no longer necessary.
                Calling it does nothing except print out a warning that it is no longer necessary.</li>
             <li> Function: <code>serial_devices</code> can only work on the dde platform, not on the Job Engine.
                  New method <code>serial_devices_async</code> works on both dde and Job Engine.
                  See Ref Man/Robot Serial/Low Level Serial/serial_devices/async</li>
             <li>Other serial port functions now available in the job engine.</li>
         </ul>
    </li>

    <li> Improved documentation of User Guide/User Interface/Help System/Eval button</li>

    <li> Fixed bug in "Save on eval" that was not saving the editor buffer every time
         the eval button was clicked.</li>

    <li> Improved doc and tooltip help for keystrokes that run test suites.</li>

    <li>The Recording INSERT dialog  box: improved radio button label from
        "Job containing reference" to  "new Job def containing reference"
        to make it clearer what that radio button inserts.</li>

    <li> In Make Instruction pane, Instructions menu, improved tooltips for
         Misc/function, function*, new Dexter, new Serial.</li>

    <li> Job.prototype.to_source_code now prints out the robot property
         if the robot is NOT Dexter.dexter0</li>

    <li>Error Handling
       <ul>
           <li> Control.error The reason for the Job ending made less redundant.</li>
           <li> Improved error messages:
               When a job's instruction errors, an error message with
               the source code of that instruction is printed in the output pane.</li>
           <li><b>if_error</b> Job Param replaced with Params:
               <code>if_robot_status_error</code>,
               </code>if_instruction_error</code>/>
               See Ref Man/Job/New Job Parameters.
            </li>
           <li><code>if_dexter_connect_error</code> added to catch connection errors.
               See Ref Man/Job/New Job Parameters.
           </li>
           <li><code>when_stopped</code> extended: See Ref Man/Job/New Job Parameters.</li>
           <li><code>when_stopped_conditions</code>: See Ref Man/Job/New Job Parameters.</li>
           <li>Instructions: <code>Control.stop_job</code> and <code>Control.error</code>
               now both take a  perform_when_stopped argument
               that defaults to <code>true</code>.
            </li>
           <li>New Job status_code:  <code>"running_when_stopped"</code> which is
              used when the Job is performing the when_stopped instruction while
              finishing a Job.</li>
           <li>New testsuite files: when_stopped_testsuite.js, manual_testsuite.js</li>
           <li>New doc Ref Man/Job/Error Handling</li>
       </ul>
    </li>
    <li><code>Control.break</code> bug fix for when you had a
        nested Control.loop, and a break instrution in the outer loop but
        after the nested loop.
    </li>

    <li> Lots of improvements to: make_ins("w", ...)
        <ul>
           <li> click help including replace the numerical address with a symbolic one.</li>
           <li> documentation including
                new Ref Man doc for Dexter.write_fpga.</li>

            <li>New series on Series menu/DDE/Dexter Robot/w oplet address.</li>

            <li> make_ins now allows any non-neg integer to be a valid address (first arg after "w")</li>
            <li> Links to https://github.com/HaddingtonDynamics/Dexter/wiki/oplet-write</li>
         </ul>
    </li>

    <li> Ref Man Jobs slight reorganization for improved modularity with
         Starting and Stopping Jobs, a job's <code>start</code> method,
         as well as insert_instruction (with improved doc).
    </li>
</ul>
</details>

<details class="doc_details"><summary>v 3.5.5, Feb 19, 2020</summary>
  Fix for build problems.
</details>


<details class="doc_details"><summary>v 3.5.4, Feb 19, 2020</summary>
<ul>
    <li>Uninstalled npm three-text2d to fix a build problem.</li>

    <li>Removed print statements: "in drag x:" and "inserted instr:"</li>
</ul>
</details>


<details class="doc_details"><summary>v 3.5.3, Feb 18, 2020</summary>
Highlights: User Interface 2 extended.
            Simulator extended.
            New Kin functions for Dexter control.
            Experimental code for camera control.
<ul>
    <li> When defining a new Job, if your job name is invalid, such as starting with a digit,
        it errors, telling you why and what to do about it.</li>

    <li> When defining a new Robot, if your Robot name is invalid, such as starting with a digit,
          it errors, telling you why and what to do about it.</li>

    <li> <code>selector_set_in_ui</code>, when used to set the <code>checked</code> property of
        an INPUT checkbox element,
        the second arg to <code>selector_set_in_ui</code> can be:
        <code>false</code>, <code>"false"</code>, <code>null</code> or <code>undefined</code>
        (not passed) to indicate unchecked. All other values indicate checked.
        See Ref Man/Window System/Window Utilities/selector_set_in_ui</li>
    <li>Dexter UserInterface 2 improvements
        <ul>
            <li> Fixed bug in Dexter UserInterface 2 that caused a low-level warning
                 upon initialization.</li>

            <li> Dexter User Interface 2 now uses pid_move_all_joints to get smoother movement.</li>

            <li> Dexter User Interface 2 window title bar now tells you the name of the
                 Dexter its controlling.</li>

            <li> Dexter User Interface 2 window title bar now tells you the name of the
                 Dexter its controlling.</li>

            <li> Dexter User Interface 2 now has a "Point Down" checkbox so that
                regardless of other controls, Dexter tries to point the end effector down
                towards the table.</li>

            <li> Dexter User Interface 2, when point_down is checked, the sliders for sliders for j4 and j5
                are disabled since user shouldn't be able to adjust those,
                but they will be adjusted automatically.</li>

            <li> Dexter User Interface 2, xy slider now has pink background
                 with a white donut. The white area is valid territory for the
                 green dot (end effector).
                 That donut size will be affected by the Z position of the end effector.</li>

            <li> Dexter User Interface 2, Z slider now has its height adjusted according
                to the maximum Z that can be acheived with the given x, y position.
                This maximum Z will be dynamically adjusted as you drag x & y green dot.</li>
        </ul>
    </li>

    <li> Kin (kinematics) improvements:
       <ul>
            <li> Kin.xy_donut_slice_approx(a_z, a_dir) Now never returns a NaN.
                If the outer_r was going to be a NaN, now it returns 0, and
                in such cases the inner_r is made 0 as well.</li>

            <li> New fn: <code>Kin.reach_extents()</code></li>

            <li> New fn: <code>Kin.max_z()</code></li>

            <li> New fn: <code>Kin.J_angles_to_dir(angles)</code> => direction of link 5.</li>

            <li> Simplified <code>Kin.point_down</code> implementation.</li>

            <li> None of these new Kin fns now take L (for Links). At a later date,
                they will take a Dexter instance and get link lengths from that.</li>
        </ul>
    </li>

    <li> Improved display of info in Output Pane from Picture.show_video_cameras.</li>

    <li> Fixed console.log error about "Cannot find module './robot.js'
         Despite this error message, DDE robots still worked,
         but there was some inconsequential code causing this error message
         that has been fixed.</li>

    <li> DDE menu Insert/Color added suffix "..." to indicate that it causes a dialog to pop up.</li>

    <li> Simulator improvements:
        <ul>
            <li>  got rid of the "tool rack".</li>
            <li>  added bright green labels for x, y and z dimensions.</li>
            <li>  added a maroon circuit board to one side of link 2 so that you
                   can tell Dexter's orientation.</li>
            <li> repositioned the virtual camera on the simulation so that when
                 the simulator comes up,
                 you see +x pointing to the right, and +y pointing towards you.</li>
         </ul>
    </li>

    <li> Added  multicast-dns package to DDE
        now var mdns = require('multicast-dns')()
        is available as documented in https://www.npmjs.com/package/multicast-dns</li>

    <li> Fix documentation so that the version of the User Guide that is on hdrobotic.com
         has the correct version number and release date under About.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.5.2, Jan 21, 2020</summary>
Highlights: New function for dynamically setting show_window elements: selector_set_in_ui.
            New Dexter User Interface dialog for operating Dexter via sliders.
            Increased flexibility for show_video and take_picture.
            Lots of Window System tweaks.
<ul>
    <li><code>show_window combo_box</code> now has a wider "down arrow".</li>

    <li> For the Human instructions, if a dependent job doesn't exist and we're trying to stop
        all the dependent jobs because the user is stopping the job of the human instruction,
        don't error, just do nothing
        as the dependent job already isn't running.</li>

    <li> Control.wait_until(a_num) and Control.loop had a bug in that
        if the job its in was stopped in the middle of one of these instructions,
        then the NEXT time you ran the job, it would not be properly initialized.
        Fixed.</li>

    <li> For Human instructions, new init param: <code>add_stop_button=true</code>
        (not for speak, recognize_speech, but for:
        <ul>
            <li> task</li>
            <li> enter_choice</li>
            <li> enter_instruction</li>
            <li> notify </li>
         </ul>
         Other Human instructions where this button makes sense already have this option.
    </li>

    <li> Much more complete documentation under Ref Man/Robot/Human on the
        parameters that are in common with most Human Instructions.</li>

    <li> svg functions extended to be able to take NO args and not error.</li>

    <li> Dragging svg elements in a show_window can now be enabled.
        See Ref Man/Window System/SVG/html_class.</li>

    <li> Fixed bug in Job.insert_instruction that caused an error message,
        but often wouldn't affect job performance.</li>

    <li> Drastically reduced calls to <code>color_job_button</code>
         when a job is waiting for more instructions.
        This reduces computation for waiting jobs esp.
        more important for job engine browser interface.</li>

    <li> Bug fixed in simulator pane header that was causing x,y,z values not to update properly.</li>

    <li> Simulator pane header Joint degrees formatting improved.</li>

    <li> New hidden input to a <code>show_window</code> content of "show_window_elt_id"
         with the string value of the id,
          so that the handler fn can easily find the show-window in order to modify it.</li>

    <li> Sim pane header x,y,z display now shows millimeters, not just centimeters,
         for negative number.</li>

    <li> added to each Dexter instance, the properties:
         J6_angle_min, J6_angle_max, J7_angle_min, J7_angle_max.</li>

    <li> now SW.all_show_windows returns a proper array instead of a nodelist.</li>

    <li> Fixed <code>SW.close_all_show_windows()</code> to not depend on its subject to work.</li>


    <li> New Jobs menu/Dexter Tools/Dexter UI... item that brings up a show_window to
        operate Dexter. Jas slider and number controls for J1 -> J7 and X,Y,Z.</li>

    <li> SW.close_window, fixed internal bug.</li>

    <li> <code>Picture.save_picture</code> and <code>IO.save_picture</code>
        no longer display the picture that it is saving.
        If you want that, you'll have to explicitly show_picture it.</li>


    <li> Fixed bug in <code>Picture.show_video</code> for its "playing" state.</li>


    <li> Add a visible=true init param to <code>show_video</code>.</li>

    <li><code>take_picture</code> doesn't automatically <code>show_video now</code>.</li>

    <li> Fixed  dragging a <code>show window</code> in Job Engine browser interface.</li>

    <li> New function: <code>selector_set_in_ui</code>.
         Uses CSS selector syntax to identify HTML elements which
        can be removed, replaced, modified, or extended.
        See Ref Man/ Window System/Window Utilities/selector_set_in_ui.</li>

    <li> New Insert menu item: show_window/Modify Window
        Inserts an example of using the new <code>selector_set_in_ui</code>
        to change a button color
        and insert HTML into a show_window.</li>

    <li> New Example under Jobs menu/Insert Example/Human Instrs
         for "Dexter User Interface" (the simple version with just 7 sliders, one for each joint).
        This is far simpler than the Insert menu item: show_window/Modify Window,
        and so much easier to understand as a code tutorial.</li>

    <li> During the "progress" report on a job, if a function is encountered,
        it prints out the NAME of the function, not its entire def.
        This gets rid of what is usually unnecessary detail for certain
        debugging situations.</li>

    <li> The <code>RobotStatus</code> class is now part of the Job engine.</li>

    <li> <code>Control.loop</code> documentation extended with a description to the loop example
         and an additional loop example added.</li>

    <li> <code>SW.close_window</code> extended to take a dom elt as its arg.
         If that dom_elt is within a <code>show_window</code>, that show_wikndow is closed.</li>

    <li> <code>Kin.point_down</code> and <code>Kin.xy_donut_slice_approx</code> added.
        These are still experimental and so not yet documented.</li>

    <li> <code>write_file</code>  Improved error message when the file to write is in a non-exisitent folder.</li>

    <li> <code>make_folder</code> fixed for passing in an arg of the empty string and
          some other cases.</li>
</ul>
</details>

<details class="doc_details"><summary>v 3.5.1, Dec 23, 2019</summary>
Updated npm packages only to get Mac version to build.

</details>
</details> <!-- end rel notes -->
`
