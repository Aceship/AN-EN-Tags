$.holdReady(true);
var db = {};
var d0 = $.getJSON("json/home.json",function(data){
        db["homedata"] = data;
    });
$.when(d0).then(function(){
    $.holdReady(false);
});
    
    $(document).ready(function(){
		$('#to-tag').click(function(){      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });

	    $("#navitemRegion").addClass('ak-disable2');
        $("#navitemLanguage").addClass('ak-disable2');
        
        var html = ""
        console.log(db.homedata)
        db.homedata.contents.forEach(eachcontent => {
            html += `
            <div class="featurebtn-container" onclick="window.location.href = '${eachcontent.link}'">
                <div class="featurebtn-open"><div>Open</div></div>
                <div class="featurebtn-button">
                    <div class="left"><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/home/${eachcontent.image}.PNG">
                    <div class="onimage"><div class="titleonimage">${eachcontent.title}</div></div>
                    </div><div class="right"><div class="featurebtn-info">
                    <div class= "featurebtn-header"><h4>${eachcontent.title}</h4></div>
                    <div class="subfeature">Current Features :</div>
                    <ul class="home-feature-content" style="list-style-type: none; padding-left: 20px;">
            `
            eachcontent.content.forEach(element => {
                html+=`<li><i class="home-small">■</i> ${element}</li>`
            });
            html +=`
                        </ul>
                    </div>
                    </div>
                </div>
            </div>
            `
        });
        


        $('#home-content').html(html)
	});
	$.getScript("js/arrive.min.js", function(){
        $(document).arrive("#regionDropdown", function(){
            $("#navitemRegion").addClass('ak-disable2');
            $("#navitemLanguage").addClass('ak-disable2');
        });
    });