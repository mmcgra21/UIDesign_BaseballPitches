$(document).ready(function() {
    // If first module not completed, do not show study guide download btn
    // If study guide download btn has been pressed in the passed, the btn should be green
    if (modules[0].completed) {
        $("#study-guide-download-btn").css("visibility","visible")
        if (studyGuideFlag) {
            $("#study-guide-download-btn").css("background-color","lightgreen");
        } else {
            $("#study-guide-download-btn").css("background-color","lightgray");
        }
    } else {
        $("#study-guide-download-btn").css("visibility","hidden");
    }
    // Set the on click function for the study guide download btn
    $("#study-guide-download-btn").click(function(){
        window.location.href = '/study-guide';
    })
    // If any of the modules have been completed, then show restart tutorial button
    let started = false;
    for (let i=0; i < modules.length; i++) {
        started ||= (modules[i].started || modules[i].completed);
    }
    if (started) {
        $("#restart-btn").css("visibility","visible");
    } else {
        $("#restart-btn").css("visibility","hidden");
    }
    // Now lets add the modules.
    let completed = true;
    for (let i=0; i < modules.length; i++) {
        // Check to see if we are completed up until this point 
        // (this will be used to decide whether the arrow after the module is green)
        completed &&= modules[i].completed;
        // Make row
        let module_row = $("<div class='module-row row'></div>")
        // Add description, make text gray if completed, black otherwise
        let desc_col = $("<div class='col-6'><div class='col-1 module-id'>"+modules[i].id+".</div><div class='col-11 module-desc'>"+modules[i].description+"</div></div>");
        if (modules[i].completed) {
            $(desc_col).css("color","lightgray");
        } else {
            $(desc_col).css("color","black");
        }
        // Add button, make background green if completed, gray otherwise
        let btn_col = $("<div class='col-6'></div>");
        let btn = $("<button type='submit' id='button-"+modules[i].id+"' class='module-btn'><span class='module-id'>"+modules[i].id+".</span><span class='module-title'>"+modules[i].title+"</span></button>");
        if (modules[i].started && !modules[i].completed) {
            $(btn).css("background-color","lightyellow");
        } else if (modules[i].completed) {
            $(btn).css("background-color","lightgreen");
        } else {
            $(btn).css("background-color","lightgray");
        }
        // Add click feature
        $(btn).click(function(){
            window.location.href = '/module-'+modules[i].id;
        })
        btn_col.append(btn);
        // Add columns to row and append row to the modules section
        module_row.append(desc_col);
        module_row.append(btn_col);
        $("#modules").append(module_row);
        // Now we create the row for the down arrow, make it green if we have completed every module up to this point
        if (i < modules.length-1) {
            let arrow_row = $("<div class='down-arrow-row row justify-content-end'></div>");
            let arrow_col = $("<div class='down-arrow-col col-6'></div>");
            let arrow_border = $("<div class='down-arrow-border'></div>");
            let arrow = $("<div class='down-arrow-inner'></div>");
            if (completed) {
                $(arrow).css("border-top-color","lightgreen");
            } else {
                $(arrow).css("border-top-color","lightgray");
            }
            // Add arrow to column, column to row, and row to modules section
            arrow_border.append(arrow);
            arrow_col.append(arrow_border);
            arrow_row.append(arrow_col);
            $("#modules").append(arrow_row);
        }
    }
    // Add Tutorial complete message if the last module has been completed
    if (modules[modules.length-1].completed) {
        $("#tutorial-complete-msg").css("visibility","visible");
    } else {
        $("#tutorial-complete-msg").css("visibility","hidden");
    }
    $("#restart-btn").click(function(){
        $("<div title='Confirm Restart'><p>Are you sure you want to restart this tutorial? All progress will be lost.</p></div>").dialog({
            resizable: false,
            height: "auto",
            width: 400,
            modal: true,
            buttons: {
                "Restart": function() {
                    // User clicked "Restart", proceed with discarding changes
                    console.log("Tutorial restarted");
                    $(this).dialog("close");
                    $.ajax({
                        type: "POST",
                        url: "restart-tutorial",
                        async: false,
                        dataType: "json",
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify(),
                        success: function(result) {
                            modules = result["modules"]
                            pitches = result["pitches"]
                            studyGuideFlag = result["studyGuideFlag"]
                        },
                        error: function(request, status, error){
                            console.log("Error");
                            console.log(request)
                            console.log(status)
                            console.log(error)
                        }
                    });
                    window.location.href = '/';
                },
                "Cancel": function() {
                    // User clicked "Cancel", close the dialog
                    $(this).dialog("close");
                }
            }
        });
    })
});
