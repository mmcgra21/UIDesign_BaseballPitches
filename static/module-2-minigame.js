$(document).ready(function() {
    function check_game() {
        $("#submit-btn").addClass("disabled");

        // If movement not specified, assume None (replace draggable and droppable with image)
        if ($("#None").length){
            $("#None").append($("#ball"));
            // Need to replace droppables and draggables with correct image.
            $("#movement-img").attr("src","/static/images/minigame_pitch_diagrams/None.png");
            $(".direction-selection-box").remove();
        }

        // Check if speed is correct\
        let speedSelection = $(".speed-selection-box .circle").attr('class').split('-')[0];
        let speedCheck = pitches[game.order[game.idx]].speed_id === speedSelection;
        // Check if movement is correct
        let movementSelection = $("#movement-img").attr("src").split("/").slice(-1)[0].split(".")[0].replace("_","/");
        let movementCheck = pitches[game.order[game.idx]].movement_desc === movementSelection;

        // Highlight speed and movement boxes with correct color.
        if (speedCheck) {
            $(".speed-selection-box").css("border-color","#48A047");
        } else {
            $(".speed-selection-box").css("border-color","red");
        }
        $(".speed-selection-box").css("border-style","solid");
        $(".speed-selection-box").css("border-width","3px");
        if (movementCheck) {
            $(".movement-selection-box").css("border-color","#48A047");
        } else {
            $(".movement-selection-box").css("border-color","red");
        }
        $(".movement-selection-box").css("border-width","3px");

        if (speedCheck && movementCheck) {
            $("#submit-btn").remove();
            $(".submit-btn-col").append($("<button type='submit' id='cont-btn'>Next Pitch</button>"));
            $("#cont-btn").css("visibility","visible");
            // Setup continue btn
            $("#cont-btn").click(function(){
                window.location.href = '/module-2-minigame';
            })
            // User got pitch correct...
            $("#score").text("Correct.");
            $("#score").css("color","#48A047");
            $("#score").css("border-color","#48A047");
            $("#score").css("box-shadow-color","#48A047");
            $.ajax({
                type: "POST",
                url: "update_minigame",
                async: false,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(),
                success: function(result) {
                    modules = result["modules"]
                    pitches = result["pitches"]
                    game    = result["game"]
                },
                error: function(request, status, error){
                    console.log("Error");
                    console.log(request)
                    console.log(status)
                    console.log(error)
                }
            });
            if (game.idx == pitches.length) {
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
                // Randomize pitch order and restart counter
                $.ajax({
                    type: "POST",
                    url: "initialize_minigame",
                    async: false,
                    dataType: "json",
                    contentType: "application/json; charset=utf-8",
                    success: function(result) {
                        modules = result["modules"]
                        pitches = result["pitches"]
                        game    = result["game"]
                    },
                    error: function(request, status, error){
                        console.log("Error");
                        console.log(request)
                        console.log(status)
                        console.log(error)
                    }
                });
                $("#cont-btn").click(function(){
                    window.location.href = '/';
                })
                $("#cont-btn").text("Return Home");
                $("#score").text("Correct. Game complete, return home or restart minigame.");
            }
            $("#rest-pitch-btn").addClass("disabled");
        } else {
            // Incorrect, display message.
            if (speedCheck && !movementCheck) {
                $("#score").text("Movement is incorrect, please restart pitch and try again.");
            } else if (!speedCheck && movementCheck) {
                $("#score").text("Speed is incorrect, please restart pitch and try again.");
            } else {
                $("#score").text("Both speed and movement are incorrect, please restart pitch and try again.");
            }
            $("#score").css("color","red");
            $("#score").css("border-color","red");
            $("#score").css("box-shadow","0 0 1em red");
        }
        $("#score").css("visibility","visible");
    }
    // function mark_placeholder(idx,correct) {
    //     let placeholder = $(".droppable[data-id='"+(idx+1)+"']")
    //     $(placeholder).css("border-width","3px");
    //     if (correct) {
    //         $(placeholder).css("border-color","#48A047");
    //     } else {
    //         $(placeholder).css("border-color","red");
    //     }
    //     $(placeholder).css("border-style","solid");
    // }

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
        // Randomize pitch order and restart counter
        $.ajax({
            type: "POST",
            url: "initialize_minigame",
            async: false,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            success: function(result) {
                modules = result["modules"]
                pitches = result["pitches"]
                game    = result["game"]
                console.log(game);
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });
    }
    // Write name of pitch at the top
    $(".minigame-header .minigame-counter").text("Pitch ("+(game.idx+1)+"/"+pitches.length+"):");
    $(".minigame-header .minigame-pitch").text(pitches[game.order[game.idx]].name);
    // Setup restart btn
    $("#return-btn").click(function(){
        window.location.href = '/';
    })
    // Setup restart pitch btn
    $("#rest-pitch-btn").click(function(){
        if (!$("#rest-pitch-btn").hasClass("disabled")) {
            window.location.href = '/module-2-minigame';
        }
    })

    // Make tiles draggable
    $(".draggable").draggable({
        revert: true,
    });

    // Make bins droppable
    $(".droppable").droppable({
        accept: ".draggable",
        drop: function(event, ui) {
            $(this).append($(ui.draggable));
            // Need to replace droppables and draggables with correct image.
            $("#movement-img").attr("src","/static/images/minigame_pitch_diagrams/"+$(this).attr("id")+".png");
            $(".direction-selection-box").remove();
            $("#rest-pitch-btn").removeClass("disabled");
        }
    });
    $("#submit-btn").click(function(){
        if (!$("#submit-btn").hasClass("disabled")) {
            check_game();
        }
    })
    $("#return-btn").css("visibility","visible");
    $("#return-btn").click(function(){
        window.location.href = '/';
    })
    $("#rest-btn").click(function(){
        if (!$("#rest-btn").hasClass("disabled")) {
            $.ajax({
                type: "POST",
                url: "initialize_minigame",
                async: false,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify(),
                success: function(result) {
                    modules = result["modules"]
                    pitches = result["pitches"]
                    game    = result["game"]
                },
                error: function(request, status, error){
                    console.log("Error");
                    console.log(request)
                    console.log(status)
                    console.log(error)
                }
            });
            window.location.href = '/module-2-minigame';
        }
    })
    // Setup speed btns
    $("#speed-list-row .btn").click(function(){
        if (!$(this).hasClass("disabled")) {
            let speedSelection = $(this).children(".row").children(".circle").clone();
            $(".speed-selection-box").append(speedSelection);
            $("#speed-list-row .btn").addClass("disabled");
            $("#speed-list-row .btn").removeClass("btn");
            $("#submit-btn").removeClass("disabled");
            $(".speed-selection-box").css("cssText", "background-color: white !important;");
            $("#rest-pitch-btn").removeClass("disabled");
        }
    })
})
