$(document).ready(function() {
    // Add module page title
    $(".module-page-title").append(modules[moduleId-1].id+". &emsp; "+modules[moduleId-1].title);
    // Create the flashcard page for the current pitch and add it to the flashcard page
    let col = $("<div class='col-8'></div>");
    col.append($("<div class='title txt-xx-large row'>"+pitches[pitchId-1].name+"</div>"));
    col.append($("<div class='speed-desc row'><div class='flashcard-fields col-6'>Speed:</div><div class='flashcard-values col-6'>"+pitches[pitchId-1].speed_desc+"&nbsp;<div class='"+pitches[pitchId-1].speed_id+"-circle'></div></div></div>"));
    col.append($("<div class='movement-desc row'><div class='flashcard-fields col-6'>Movement:</div><div class='flashcard-values col-6'>"+pitches[pitchId-1].movement_desc+"</div></div>"));
    col.append($("<div class='img-row row'><img class='flashcard-pitch-img' src='/static/images/pitch_mlb_gifs/gif-"+pitches[pitchId-1].id+"/1.gif'></div>"));
    col.append($("<div class='done-btn-row row'><button type='submit' id='done-btn'>Done</button></div>"));
    $(".flashcard-page").append(col);
    // Mark current pitch's hard flashcard as completed
    if (!pitches[pitchId-1].flashcard_hard_completed) {
        $.ajax({
            type: "POST",
            url: "update",
            async: false,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(
                {
                    "id":pitchId,
                    "variable":"pitches",
                    "field":"flashcard_hard_completed",
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
    // Check if all pitches are completed and mark module 1 as complete
    if (!modules[0].completed) {
        let isComplete = true;
        for (let i = 0; i < pitches.length; i++) {
            isComplete &&= pitches[i].flashcard_hard_completed;
        }
        if (isComplete) {
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
        }
    }

    // Setup done btn
    $("#done-btn").click(function(){
        // Send user back to the page they came from
        window.location.href = '/module-4';
    })

    // Should we add timer so that user is forced to look at flashcard of certain period of time?
    // setTimeout(function() {
    //     $("#done-btn").css("visibility","visible");
    // }, 2000); // 2000 milliseconds = 2 seconds
    $("#done-btn").css("visibility","visible");
})