	$(document).ready(function(){
		$('#to-tag').click(function(){      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });

	    $("#navitemRegion").addClass('ak-disable2');
	    $("#navitemLanguage").addClass('ak-disable2');
	});
	$.getScript("js/arrive.min.js", function(){
        $(document).arrive("#regionDropdown", function(){
            $("#navitemRegion").addClass('ak-disable2');
            $("#navitemLanguage").addClass('ak-disable2');
        });
    });