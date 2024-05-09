$(document).ready(function() {
    // Add module page title
    $(".module-page-title").append(modules[moduleId-1].id+". &emsp; "+modules[moduleId-1].title);
    // Setup return btn
    $("#return-btn").css("visibility","visible");
    $("#return-btn").click(function(){
        window.location.href = '/';
    })
    // Setup continue btn
    $("#start-btn").click(function(){
        window.location.href = '/module-'+moduleId+'-minigame';
    })
    if (modules[moduleId-1].started) {
        $("#start-btn").text("Resume Game");
    } else {
        $("#start-btn").text("Start Game");
    }
})