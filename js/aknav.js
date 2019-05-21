

$(document).ready(function(){
    let dropdown = []
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
        }]
    })
    // console.log(window.location.href.split("/")[window.location.href.split("/").length-1])
    let currentHtml= window.location.href.split("/")[window.location.href.split("/").length-1];
    let navDropdown = []
    dropdown.forEach(drop => {
        navDropdown.push(`
        <li class="nav-item dropdown">
        <a class="nav-link dropdown-toggle" style="display:inline-flex;padding-left:25px;"href="#" id="regionDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" >
                <div class="ak-subtitle ak-disable">${drop.name}</div>
        `)
        let isCurrent =undefined
        drop.content.forEach(dropelement => {
            if(currentHtml.includes(dropelement.href)) isCurrent=dropelement.name;
        })
        isCurrent = isCurrent?isCurrent:"Menu"
        // console.log(isCurrent)
        navDropdown.push(`
                <div class="ak-disable">${isCurrent}</div>
                </a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
        `)
        // console.log(navDropdown)
        drop.content.forEach(dropelement => {
            navDropdown.push(`
            <a class="dropdown-item" href="${dropelement.href}" >${dropelement.name}</a>
            `)
        });
        navDropdown.push(`</div>`)
    })
    let html = `
    <img src="./img/factions/logo_rhodes.png" width="40" height="40" style="transform:scale(1.2,1.2)translate(-8px,1px)"class="d-inline-block align-top" alt="">
        <a class="navbar-brand" href="#" translate-id="topbar-1">Arknights Toolbox</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav"
                aria-controls="navbarNav" aria-expanded="false" aria-label="展开">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
            <ul class="navbar-nav">
                    ${navDropdown.join("")}
                    <li class="nav-item">
                        <a class="nav-link" href="akhrelite.html" translate-id="topbar-3">Elite Materials</a>
                    </li>
                    <li class="nav-item">
                            <a class="nav-link" href="akguide.html" translate-id="topbar-5">Guide</a>
                    </li>
                    <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" style="display:inline-flex;padding-left:25px;"href="#" id="regionDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" >
                                    <div class="ak-subtitle ak-disable">Extra</div>
                                    <div class="ak-disable">Menu</div>
                            </a>
                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                <a class="dropdown-item" href="aklinker.html">bilibili Linker</a>
                            </div>
                    </li>
                </ul>
            <ul class="navbar-nav ml-auto">

                <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" style="display:inline-flex;padding-left:25px;"href="#" id="regionDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" >
                                <div class="ak-subtitle ak-disable" translate-id="language-1">Server</div>
                                <div class="ak-disable" id="display-reg">CN</div>
                        </a>
                        
                        <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                            <a class="dropdown-item reg unselectable" onclick="regDropdown($(this))" value="cn">Chinese</a>
                        </div>
                    </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" style="display:inline-flex;padding-left:25px"href="#" id="languageDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                            <div class="ak-subtitle ak-disable" translate-id="language-2">Language</div>
                            <div class="ak-disable" id="display-lang">English</div>
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item lang unselectable" onclick="langDropdown($(this))" value="en">English</a>
                        <a class="dropdown-item lang unselectable" onclick="langDropdown($(this))" value="cn">Chinese</a>
                        <a class="dropdown-item lang unselectable" onclick="langDropdown($(this))" value="jp">Japanese</a>
                    </div>
                </li>
            </ul>
        </div>
    `
    $('#aknav').html(html)
})
