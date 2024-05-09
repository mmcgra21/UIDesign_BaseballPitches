$(document).ready(function() {
    function display_flashcard(i) {
        let col = $("<div class='flashcard-col col-4'></div>");
        let btn = $("<button type='submit' id='pitch-"+pitches[i].id+"-btn' class='flashcard-btn'></button>");
        let header = $("<div class='flashcard-header-row row'><div class='flashcard-header-title col-8'>"+pitches[i].name+"</div><div class='flashcard-header-speed col-4'><div class='"+pitches[i].speed_id+"-circle-xx'></div></div></div>");
        let img = $("<img class='flashcard-pitch-img' src='/static/images/pitch_diagrams/diagram-"+pitches[i].id+".png'>");
        btn.append(header);
        btn.append(img);
        $(btn).click(function(){
            window.location.href = '/flashcard-easy-'+pitches[i].id+'-sg';
        });
        $(btn).css("background-color","white");
        $(btn).css("justify-content","space-between");
        col.append(btn);
        return col;
    }
    function download_study_guide() {
        // Create hidden link element
        let link = document.createElement('a');
        link.href = "/static/study_guide/study-guide.pdf";
        link.download = "study-guide.pdf";
        // link.target = '_blank';
        // link.style.display = 'none';
        // link.css('visibility','hidden');

        // Append link to body and trigger click event
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
    }
    // Add module page title
    $(".module-page-title").append("Study Guide");
    // First if study guide flag is false, update it to true
    if (!studyGuideFlag) {
        $.ajax({
            type: "POST",
            url: "update",
            async: false,
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(
                {
                    "id":0,
                    "variable":"studyGuideFlag",
                    "field":"",
                    "value":true
                }
            ),
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
    }
    // Iterate through each pitch and display flashcard
    let row = $("<div class='row'></div>");
    for (let i = 0; i < pitches.length; i++) {
        if (i == 3) {
            // Append first row of three to flashcards section and restart 
            $(".flashcards").append(row);
            row = $("<div class='row'></div>");
        }
        // Display flashcard
        row.append(display_flashcard(i));
    }
    $(".flashcards").append(row);

    // Setup return btn
    $("#return-btn").css("visibility","visible");
    $("#return-btn").click(function(){
        window.location.href = '/';
    })
    // Setup download btn
    $("#download-btn").css("visibility","visible");
    $("#download-btn").click(function(){
        download_study_guide();
    })
})