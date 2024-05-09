$(document).ready(function() {
    function display_flashcard(i) {
        let col = $("<div class='flashcard-col col-4'></div>");
        let btn = $("<button type='submit' id='pitch-"+pitches[i].id+"-btn' class='flashcard-btn'></button>");
        let header = $("<div class='flashcard-header-row row'><div class='flashcard-header-title col-8'>"+pitches[i].name+"</div><div class='flashcard-header-speed col-4'><div class='"+pitches[i].speed_id+"-circle-xx'></div></div></div>");
        let img = $("<img class='flashcard-pitch-img' src='/static/images/pitch_diagrams/diagram-"+pitches[i].id+".png'>");
        btn.append(header);
        btn.append(img);
        $(btn).click(function(){
            window.location.href = '/flashcard-easy-'+pitches[i].id+'-m1';
        });
        $(btn).css("background-color","white");
        $(btn).css("justify-content","space-between");
        col.append(btn);
        return col;
    }
    function display_placeholder_btn(i) {
        let col = $("<div class='flashcard-col col-4'></div>");
        let btn = $("<button type='submit' id='pitch-"+pitches[i].id+"-btn' class='flashcard-btn'>Click<br>Here!</button>");
        $(btn).click(function(){
            window.location.href = '/flashcard-easy-'+pitches[i].id+'-m1';
        });
        col.append(btn);
        return col;
    }
    // Add module page title
    $(".module-page-title").append(modules[moduleId-1].id+". &emsp; "+modules[moduleId-1].title);
    // First if module not already started, update modules such that it has started
    if (!modules[moduleId-1].started) {
        $.ajax({
            type: "POST",
            url: "update",
            async: false,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(
                {
                    "id":moduleId,
                    "variable":"modules",
                    "field":"started",
                    "value":true
                }
            ),
            success: function(result) {
                modules = result["modules"]
                pitches = result["pitches"]
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });
    }
    // Iterate through each pitch and display flashcard if that pitch has been viewed, hide otherwise
    let row = $("<div class='row'></div>");
    for (let i = 0; i < pitches.length; i++) {
        if (i == 3) {
            // Append first row of three to flashcards section and restart 
            $(".flashcards").append(row);
            row = $("<div class='row'></div>");
        }
        // If pitch has been viewed, display flashcard, otherwise display Click Here! btn
        if (pitches[i].flashcard_easy_completed) {
            row.append(display_flashcard(i));
        } else {
            row.append(display_placeholder_btn(i));
        }
    }
    $(".flashcards").append(row);

    // Only show legend if at least one pitch has been viewed
    // If all pitches have been viewed, then show continue btn instead of return btn
    let started = false;
    let completed = true;
    for (let i = 0; i < pitches.length; i++) {
        started ||= pitches[i].flashcard_easy_completed;
        completed &&= pitches[i].flashcard_easy_completed;
    }
    if (started) {
        $("#legend").css("visibility","visible");
    } else {
        $("#legend").css("visibility","hidden");
    }
    if (completed) {
        $("#return-btn").css("visibility","hidden");
        $("#continue-btn").css("visibility","visible");
        // Update modules variable to show this module as completed
        $.ajax({
            type: "POST",
            url: "update",
            async: false,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(
                {
                    "id":moduleId,
                    "variable":"modules",
                    "field":"completed",
                    "value":true
                }
            ),
            success: function(result) {
                modules = result["modules"]
                pitches = result["pitches"]
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });
    } else {
        $("#return-btn").css("visibility","visible");
        $("#continue-btn").css("visibility","hidden");
    }
    // Setup return btn
    $("#return-btn").click(function(){
        window.location.href = '/';
    })
    // Setup continue btn
    $("#continue-btn").click(function(){
        window.location.href = '/';
    })
})