

$(document).ready(function(){
    let dropdown = []
    dropdown.push({name:"Home",content:"index.html"})
    dropdown.push({
        name:"Calculator",
        content:[
            {
                href:"akhr.html",
                name:"Recruitment",
            },{
                href:"aklevel.html",
                name:"Leveling"
            },{
                href:"akevolve.html",
                name:"Material"
            },{
                href:"akmatuses.html",
                name:"Material Total Usage"
            }]
    })
    dropdown.push({
        name:"Information",
        content:[
        {
            href:"akhrchars.html",
            name:"Operator"
        },{
            href:"akenemy.html",
            name:"Enemy"
        },{
            href:"akriic.html",
            name:"Infrastructure Skill"
        },{
            href:"akhrelite.html",
            name:"Elite Materials"
        },{
            href:"akhrcompare2.html",
            name:"Comparing (WIP)"
        },{
            href:"akstage.html",
            name:"Stage (WIP)"
        },{
            href:"akmedal.html",
            name:"Medal List (WIP)"
        },{
            href:"akrogue.html",
            name:"Roguelike Relic List (WIP)"
        },{
            href:"akstory.html",
            name:"Mission Story"
        }]
    })
    dropdown.push({name:"Guide",content:"akguide.html"})
    dropdown.push({
        name:"Extra",
        content:[
        {
            href:"aklinker.html",
            name:"bilibili Linker"
        },
        {
            href:"akgallery.html",
            name:"CG Gallery"
        }]
    })
    // console.log(window.location.href.split("/")[window.location.href.split("/").length-1])
    let currentHtml= window.location.href.split("/")[window.location.href.split("/").length-1];
    let navDropdown = []
    dropdown.forEach(drop => {

        let isCurrent = undefined
        let isGroup = undefined
        
        // console.log(typeof drop.content)
        if(typeof drop.content == "string"){
            if(currentHtml.includes(drop.content)) {
                isGroup = true;
            }
            navDropdown.push(`
            <li class="nav-item ${isGroup?"active":""}">
                <a class="nav-link " href="${drop.content}">${drop.name}</a>
            </li> 
            `)
        }else{
            drop.content.forEach(dropelement => {
                if(currentHtml.includes(dropelement.href)) {
                    isCurrent=dropelement.name;
                    isGroup = true;
                }
                
            })
            isCurrent = isCurrent?isCurrent:"Menu"
            navDropdown.push(`
            <li class="nav-item dropdown ${isCurrent!="menu"&&isGroup?"active":""}">
            <a class="nav-link dropdown-toggle" style="display:inline-flex;padding-left:25px;"href="#" id="regionDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" >
                    <div class="ak-subtitle ak-disable">${drop.name}</div>
            `)
            
            
            // console.log(isCurrent)
            navDropdown.push(`
                    <div class="ak-disable ">${isCurrent}</div>
                    </a>
                    <div class="dropdown-menu expanded-small" aria-labelledby="navbarDropdown">
            `)
            // console.log(navDropdown)
            drop.content.forEach(dropelement => {
                navDropdown.push(`
                <a class="dropdown-item" href="${dropelement.href}" >${dropelement.name}</a>
                `)
            });
            navDropdown.push(`</div>`)
        }
    })
    var reg;
    var lang, langText;

    // console.log(localStorage.getItem('gameRegion'))

    if(!localStorage.getItem('gameRegion') || !localStorage.getItem('webLang')){
        localStorage.setItem("gameRegion", 'cn');
        localStorage.setItem("webLang", 'en');
        reg = "cn";
        lang = "en";
    } else {
        reg = localStorage.getItem('gameRegion');
        lang = localStorage.getItem('webLang');
    }
    switch (lang) {
        case "en":langText = 'English';break;
        case "cn":langText = 'Chinese';break;
        case "jp":langText = 'Japanese';break;
        case "kr":langText = 'Korean';break;
    }
    // console.log(reg)
    let html = `
    <img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/factions/logo_rhodes.png" width="40" height="40" style="transform:scale(1.2,1.2)translate(-8px,1px)"class="d-inline-block align-top" alt="">
        <a class="navbar-brand" href="index.html" translate-id="topbar-1">Aceship's Toolbox</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="展开">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
            <ul class="navbar-nav">
                    ${navDropdown.join("")}
                    
                    
                </ul>
            <ul class="navbar-nav ml-auto">
                <li class="nav-item dropdown">
                    <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ace-donatemodal"><img height='20px' style='border:0px;height:20px;margin-top:-5px' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/items/GOLD.png'>  Donate</button>
                </li>

                <li class="nav-item dropdown" id="navitemRegion">
                        <a class="nav-link dropdown-toggle" style="display:inline-flex;padding-left:25px;"href="#" id="regionDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" >
                                <div class="ak-subtitle ak-disable" translate-id="language-1">Server</div>
                                <div class="ak-disable" id="display-reg">${reg.toUpperCase()}</div>
                        </a>
                        
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item reg unselectable" onclick="regDropdown($(this))" value="cn">Chinese</a>
                            <a class="dropdown-item reg unselectable" onclick="regDropdown($(this))" value="en">English</a>
                            <a class="dropdown-item reg unselectable" onclick="regDropdown($(this))" value="jp">Japanese</a>
                            <a class="dropdown-item reg unselectable" onclick="regDropdown($(this))" value="kr">Korean</a>
                        </div>
                    </li>
                <li class="nav-item dropdown" id="navitemLanguage">
                    <a class="nav-link dropdown-toggle" style="display:inline-flex;padding-left:25px"href="#" id="languageDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <div class="ak-subtitle ak-disable" translate-id="language-2">Language</div>
                            <div class="ak-disable" id="display-lang">`+langText+`</div>
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item lang unselectable" onclick="langDropdown($(this))" value="en">English</a>
                        <a class="dropdown-item lang unselectable" onclick="langDropdown($(this))" value="cn">Chinese</a>
                        <a class="dropdown-item lang unselectable" onclick="langDropdown($(this))" value="jp">Japanese</a>
                        <a class="dropdown-item lang unselectable" onclick="langDropdown($(this))" value="kr">Korean</a>
                    </div>
                </li>
            </ul>
        </div>
    `
    $('#aknav').html(html)

    var donate = `
    <div class="modal fade " id="ace-donatemodal">
        <div class="modal-dialog modal-dialog-centered modal" >
            <div class="modal-content" style="background:#444">
        
            <!-- Modal Header -->
            <!-- <div class="modal-header">
                <h4 class="modal-title"></h4>
                
            </div> -->
        
            <!-- Modal body -->
            <div class="modal-body acedonate-body">
            	<div style="text-align:left; margin: 5px;">
            		<h5>Help us maintain the website</h5>
            		<p>We made this website on our spare time and it took us quite some time to get into what it is now. Currently we do have some list of new features that we want to implement, but the progress is slow because we only work on it when we have the time and motivation to do it.</p>
            		<p>Aside from implementing a new feature, fixing bugs, and receiving feedbacks, we prioritizes updating our database whenever the game got updated.
            		<p>Your donation will definitely help on improving the website, keeping it updated, and motivating us to keep doing what we're doing and this is completely optional for you to do.</p>
            	</div>
            	<div class="row" style="padding: 10px; max-height: 160px; background-color: #333;">
            		<div class="col-md-6">
	            		<a class="btn btn-info" style="padding:15px; width: 100%; height: 100%" href='https://ko-fi.com/aceship' target='_blank'>
	            			<b style=" color: white;">Donate on Ko-fi</b>
	            			<div style="display:block; margin-top: 20px;">
	            				<img height="50" src="https://theme.zdassets.com/theme_assets/2141020/171bb773b32c4a72bcc2edfee4d01cbc00d8a004.png">
	            				<img height="30" style="filter: brightness(100)" src="https://pngimg.com/uploads/paypal/paypal_PNG4.png">
	            			</div>
	            		</a>
            		</div>
            		<div class="col-md-6">
	            		<a class="btn btn-info" style="padding:15px 10px 10px 10px; width: 100%;" href='https://trakteer.id/Aceship123' target='_blank'>
	            			<b style=" color: white;">Donate on Trakteer</b>
	            			<div style="display:block;">
	            				<div style="background-color: #bf202f; display: inline-block; border-radius: 6px; padding: 5px 10px; vertical-align: middle;">
	            					<div style="background-image: url('https://trakteer.id/images/mix/navbar-logo-lite-white-beta.png'); background-size: cover; height: 43px; width: 28px; background-position: 0% 0%;"></div>
	            				</div>

	            				<div style="display: inline-block; padding: 5px 10px; position: relative; width: 100px; height: 90px; vertical-align: middle;">
	            					<div style="filter: brightness(100); height: 110px; width: 100px; left: 0px; top: -10px; position: absolute; background-position: 0% 0%; background-size: cover; background-image: url('./img/extra/gopay.png');"></div>
	            				</div>
	            			</div>
	            		</a>
            		</div>
            	</div>

            </div>
        
            <!-- Modal footer -->
            <div class="modal-footer" style="border-top: 1px solid #2f2f2f">
                <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
            </div>
        
            </div>
        </div>
    </div>
    `
    $('#acedonate').html(donate)
});

function hideload(){
    $("#loadingOverlay").fadeOut(); 
}