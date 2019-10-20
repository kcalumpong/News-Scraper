$(document).ready(function() {

    $(".save-article").on("click", function(event) {
        event.preventDefault();

        var id = $(this).parent().attr("id")
        console.log(id)
 
        $.ajax({
            method: "PUT",
            url: "/articles/save/" + id,
            data: {
              saved: true
            }
        }).then (function(data) {
            location.reload();
            console.log(data);
        })

    })          
 })
