$(document).ready(function() {
    let assignments = [-1,-1,-1,-1,-1,-1];
    function display_placeholder(i) {
        let placeholder_container = $("<div class='quiz-placeholder-container col-4'><div class='quiz-placeholder-dummy'></div></div>");
        let placeholder = $("<div class='quiz-placeholder droppable' data-id='"+pitches[i].id+"'></div>");
        let header = $("<div class='quiz-placeholder-header-row row'><div class='quiz-placeholder-header-title col-8'>"+pitches[i].name+"</div></div>");
        // let img = $("<img class='flashcard-pitch-img' src='/static/images/pitch_mlb_gifs/gif-"+pitches[i].id+"/1.gif'>");
        placeholder.append(header);
        // placeholder.append(img);
        $(placeholder).css("background-color","white");
        $(placeholder).css("justify-content","space-between");
        placeholder_container.append(placeholder);
        return placeholder_container;
    }
    function display_flashcard(i) {
        let flashcard = $("<div class='quiz-flashcard col-4'></div>");
        let img = $("<img class='quiz-flashcard-pitch-img draggable' data-id='"+pitches[i].id+"' src='/static/images/quiz_pitch_diagrams/diagram-"+pitches[i].id+".png'>");
        $(flashcard).append(img);
        $(flashcard).css("justify-content","space-between");
        return flashcard;
    }
    function check_if_all_placeholders_filled() {
        let completed = true;
        for (let i = 0; i < assignments.length; i++) {
            completed &&= (assignments[i] != -1);
        }
        if (completed) {
            $("#submit-btn").removeClass("disabled");
        }
        console.log(completed);
        console.log(assignments);
    }
    function check_quiz() {
        let score = 0
        for (let i = 0; i < assignments.length; i++) {
            if (i == assignments[i]) {
                mark_placeholder(i,true);
                score++;
            } else {
                mark_placeholder(i,false);
            }
        }
        $("#submit-btn").addClass("disabled");
        if (score > 3) {
            $("#score").text(score+" out of 6. You Passed! Continue to the next module.");
            $("#score").css("color","#48A047");
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
            $("#cont-btn").css("visibility","visible");
        } else {
            $("#score").text(score+" out of 6. You Failed. Restart and try again.");
            $("#score").css("color","red");
        }
        $("#score").css("visibility","visible");
        // Randomize placeholders and flashcards
        $.ajax({
            type: "POST",
            url: "initialize_quiz",
            dataType: "json",
            async: false,
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(
                {
                    "moduleId":moduleId
                }
            ),
            success: function(result) {
                modules = result["modules"]
                pitches = result["pitches"]
                quiz    = result["quiz"]
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });
    }
    function mark_placeholder(idx,correct) {
        let placeholder = $(".droppable[data-id='"+(idx+1)+"']")
        $(placeholder).css("border-width","3px");
        if (correct) {
            $(placeholder).css("border-color","#48A047");
        } else {
            $(placeholder).css("border-color","red");
        }
        $(placeholder).css("border-style","solid");
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
        console.log(quiz);
        // Randomize placeholders and flashcards
        $.ajax({
            type: "POST",
            url: "initialize_quiz",
            async: false,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(
                {
                    "moduleId":moduleId
                }
            ),
            success: function(result) {
                modules = result["modules"]
                pitches = result["pitches"]
                quiz    = result["quiz"]
            },
            error: function(request, status, error){
                console.log("Error");
                console.log(request)
                console.log(status)
                console.log(error)
            }
        });
    }
    // Iterate through each placeholder ID and display placeholder of randomized pitch
    let row = $("<div class='row'></div>");
    for (let i = 0; i < pitches.length; i++) {
        if (i == 3) {
            // Append first row of three to flashcards section and restart 
            $(".flashcards").append(row);
            row = $("<div class='row'></div>");
        }
        row.append(display_placeholder(quiz.placeholders[i]));
    }
    $(".flashcards").append(row);
    // Iterate through flashcard ID and display flashcard of randomized pitch
    row = $("<div class='row'></div>");
    for (let i = 0; i < pitches.length; i++) {
        row.append(display_flashcard(quiz.flashcards[i]));
    }
    $(".flashcards").append(row);

    // Setup restart btn
    $("#return-btn").click(function(){
        window.location.href = '/';
    })
    // Setup continue btn
    $("#cont-btn").click(function(){
        window.location.href = '/';
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
            assignments[$(this).data("id")-1] = $(ui.draggable).data("id")-1;
            $(this).droppable("destroy");
            $(ui.draggable).css("cursor","default");
            $(ui.draggable).draggable("destroy");
            // // Update quiz variable
            // $.ajax({
            //     type: "POST",
            //     url: "assign",
            //     async: false,
            //     dataType: "json",
            //     contentType: "application/json; charset=utf-8",
            //     data: JSON.stringify(
            //         {
            //             "moduleId":      moduleId,
            //             "placeholderIx": $(this).data("id"),
            //             "flashcardIx":   $(ui.draggable).data("id")
            //         }
            //     ),
            //     success: function(result) {
            //         modules = result["modules"]
            //         pitches = result["pitches"]
            //         quiz    = result["quiz"]
            //     },
            //     error: function(request, status, error){
            //         console.log("Error");
            //         console.log(request)
            //         console.log(status)
            //         console.log(error)
            //     }
            // });
            check_if_all_placeholders_filled();
            $("#rest-btn").removeClass("disabled");
        },
        over: function( event, ui ) {
          $(this).addClass("hover");
        },
        out: function( event, ui ) {
          $(this).removeClass("hover");
        }
    });
    $("#submit-btn").click(function(){
        if (!$("#submit-btn").hasClass("disabled")) {
            check_quiz();
        }
    })
    $("#return-btn").css("visibility","visible");
    $("#return-btn").click(function(){
        window.location.href = '/';
    })
    $("#rest-btn").click(function(){
        if (!$("#rest-btn").hasClass("disabled")) {
            window.location.href = '/module-'+moduleId+'-quiz';
        }
    })
})