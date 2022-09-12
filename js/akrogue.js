$.holdReady(true);
const jsonList = {
    roguelike_table             :"./json/gamedata/zh_CN/gamedata/excel/roguelike_topic_table.json",

    //TL

    tl_effect                   :"./json/tl-effect.json",
    tl_rogue                    :"./json/tl-rogue.json"
    // stagedesc_tl            :"./json/tl-stagedesc.json"
};

// const story = {
//     story0502 : "./json/en/story/obt/main/level_main_05-02_BEG.txt"
// }
var db = {}
var db2 
LoadAllJsonObjects(jsonList).then(function(result) {
    db = result
    // storynow = readTextFile("./json/en/story/obt/main/level_main_05-02_BEG.txt")

    // request({url:"./json/en/story/obt/main/level_main_05-02_BEG.txt"}).then(function(result2){
    //     db2 = result2
    //     
    // })
    $.holdReady(false);
})
// .then(LoadAll(story).then(function(result2) {
//     db2 = result2
    
// }))

$(document).ready(function(){
    $('#BrowseStage').click(function(event){
        $("#stagechoosemodal").modal('show');
    });
    console.log(db)
    // console.log(db2)
    // Start()
    // ListBanner()
    Check()
});

var relicshtml=[]
var isperspective = false

async function Check(){

    $.each(db.roguelike_table.details.rogue_1.items,function(relicid,relic){
        // console.log(relicid)
        // if(!relicid.includes("b")){
        //     relicshtml.push(RelicBox(relic))
        // }
        if(relic.type =="RELIC")
        relicshtml.push(RelicBox(relicid,relic))
    })
    $("#reliclist").html(relicshtml.join(""))
}

function RelicBox(relicid,relic){
    // console.log(relic.id)
    
    var item = relic
    var desc = !db.tl_rogue.desc[relicid]?item.usage:db.tl_rogue.desc[relicid]

    var name = !db.tl_rogue.name[relicid]?item.name:db.tl_rogue.name[relicid]
    var rarity = item.rarity
    console.log(rarity)
    var html = `
    <div class="relic-box">
    <div class="relic-title relic-rarity relic-rarity-${rarity}">${name}</div>
    
    <div class="relic-imagebox">
    <img style="margin:auto;width: 80px; height: 80px;object-fit: contain;" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/roguelike/item/${relic.iconId}.png">
    </div>

    <div class="relic-effect">
        ${desc}
    </div>
    </div>
    `
    return html
}

// function Relicbuffs(relic){
//     var grouping = []

//     relic.buffs.forEach(buff => {
//         var text = db.tl_rogue[buff.key]
//         var textinfo = []
//         var mod = RelicModifier(buff.key)

//         if(buff.key=="imidiate_reward"){
//             textinfo.push(`${db.tl_rogue[buff.blackboard[0].valueStr]} +${db.tl_rogue[buff.blackboard[1].value]}`)
//         }
//         else{
//             buff.blackboard.forEach(bb=>{
//                 var valuecheck = RelicValue(bb)
//                 textinfo.push(`${db.tl_effect[bb.key]} ${mod}${valuecheck}`)
//             })
//         }

//         console.log(text)

//         console.log(textinfo)
//     });
// }

// function RelicModifier(mod){
//     if(mod.includes("enemy")){
//         return "-"
//     }else if(mod.includes("squad")){
//         return "+"
//     }else return ""
// }

// function RelicValue(bb){
//     if(isNaN(bb.value)){
//         if(bb.value%1!=0)
//         return `${bb.value*100}%`
//         else
//         return bb.value
//     }
    
//     else 
//     return bb.value
// }
function Start(){

}
$('#to-tag').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});


function StageSubList(el){
    // $(el).attr("data-stage")
    console.log($($(el).attr("href")+"-selection"))
    
    var selection = $(el).attr("data-stage")
    var currhtml =''
    var first = ''
    $.each(stagesObject[selection],function(a,b){
        // console.log(a)
        // console.log(b)
        console.log(db.zone_table.zones[a])
        // b
        var name = ''
        var size = 110
        var img = ''
        if(a.split("_")[1]) {
            if(a.includes("main")){
                name = "Episode "+a.split("_")[1]
                img = `<img width='${size}' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/banner/${selection.toLowerCase()}/small/${a}.png'>`
            }
            else if(a.includes("camp")){
                name = "Annihilation "+a.split("_")[1]
                img = `<img width='300' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/banner/${selection.toLowerCase()}/${a}.png'>`
            }
            else if(a.includes("weekly")){
                var weeklyname = db.zone_table_en.zones[a]
                name = weeklyname.zoneNameSecond
                img = `<img width='150' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/banner/${selection.toLowerCase()}/small/${a}.png'>`
            }
        }else{
            size = 140
            img = `<img width='${size}' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/banner/${selection.toLowerCase()}/small/${a}.png'>`
        }
        // else if(a.includes)
        var button =`
        <a class='nav-link' data-toggle='tab' style='padding:2px' href='#' onclick="StageList(this)"data-stage='${selection}-${a}'>
                <div>
                    ${img}
                    <div class='stage-subTtitle'>${name}</div>
                </div>
            </a>`
        if(!first) first = button
        currhtml+= `
        <li class='nav-item'>
            ${button}
        </li>
        `
    });
    $('#stageList').empty()
    if(!first) $('#stageList').fadeOut()
    StageList(first)
    $($(el).attr("href")+"-selection").html(currhtml)
    
    
}

function StageList(el){
    var selection = $(el).attr("data-stage")
    var selectionsplit = selection.split("-")
    var currhtml =''
    $('#stageList').empty()
    $.each(stagesObject[selectionsplit[0]][selectionsplit[1]],function(a,b){
        // console.log(b)
        console.log(a)
        if(b.levelId&&b.difficulty!="FOUR_STAR"){
            var img =''
            var highlight =''
            var stageEn = db.stage_table_en.stages[a]
            var stagecode = b.code
            if(stageEn){
                if(stageEn.code =="Annihilation") stagecode = stageEn.name
                else stagecode = stageEn.code
            }

            if(b.bossMark)img = `<img class='stage-btn-icon' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/icon/icon_boss_hilight.png'>`
            if(b.appearanceStyle==4) img = `<img class='stage-btn-icon' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/icon/bkg_spike_mark.png'>`
            if(b.performanceStageFlag=="PERFORMANCE_STAGE") img = `<img class='stage-btn-icon' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/icon/bkg_story_only_mark.png'>`
            
            if(b.hilightMark || b.appearanceStyle==4)highlight = 'stage-btn-header-h'
            currhtml+= `
            <li class='nav-item'>
                <a class='stage-btn-bg nav-link' class='' data-toggle='tab' style='padding:2px' href='#' onclick="LoadStage('${b.levelId.toLowerCase()}.json')"data-stage=''>
                    <div class='stage-btn stage-subTtitle stage-inline'>
                        ${img}
                        <div class='stage-btn-header'>
                            <div class='stage-code ${highlight}'>${stagecode}</div>
                        </div>
                    </div>
                </a>
            </li>
            `
        }
    })
    $('#stageList').fadeIn()
    $('#stageList').html(currhtml)
}
function LoadStage(stage){
    $('#StagePreview').show()
    var stagelevelfolder ="./json/gamedata/zh_CN/gamedata/levels/"
    // var stagelevelfolder ="https://ak-data.mooncell.wiki/gamedata/levels/"


    // console.log(stagelevelfolder+stage)
    var xhr = new XMLHttpRequest();
    xhr.open('GET', stagelevelfolder+stage, true);
    xhr.responseType = 'arraybuffer';
    var array;
    xhr.onloadend = function (e) {
        // console.log(e)
        if (xhr.status != 404) {
            buffer = xhr.response;
            array = new Uint8Array(buffer);

            var jsonstage = JSON.parse(new TextDecoder("utf-8").decode(array))
            // console.log(jsonstage)

            GenerateMap(jsonstage)
        }else{
            // console.log("Error ?")
            // $("#spine-frame").fadeOut()
        }
        
    }
    xhr.send()

}

function GenerateMap(stagejson){
    var mapdata = stagejson.mapData
    var tiledata = mapdata.tiles
    var tiles = []

    $.each(mapdata.map,function(rowname,row) {
        var currrow = [ ]
        // console.log(rowname)
        $.each(row,function(cellname,cell){
            // console.log(cellname)
            currrow.push(GenerateTile(tiledata,rowname,cellname,mapdata.map))
        })
        tiles.push(`
        <div class='tile-row '> 
            ${currrow.join("")}
        </div>
        `)
    })

    $('#MapPreview').html(`
    <div id='mappreview'class='mainmap ${isperspective?"perspectiveMap":""}'>
        ${tiles.join("")}
    </div>
    `)
}

function TogglePerspective(){
    isperspective = !isperspective
    $('#mappreview').toggleClass('perspectiveMap')
}

function GenerateTile(tiledata,row,cell,mapdata){
    // console.log(mapdata)
    var tiletype = tiledata[mapdata[row][cell]]
    var content = ''
    var tile = tiletype.tileKey
    var height = tiletype.heightType
    var extraprop = ''
    var isheight = true

    if(height>0&&isheight){
        if(row==0||(row>0&&tiledata[mapdata[row-1][cell]].heightType==0)){
            content+=`<div class='tileside tileside-back'> </div>`
        }
        if(row==mapdata.length-1||(row<mapdata.length-1&&tiledata[mapdata[row+1][cell]].heightType==0)){
            content+=`<div class='tileside tileside-front'> </div>`
        }
        if(cell==mapdata[row].length-1||(cell<mapdata[row].length-1&&tiledata[mapdata[row][cell+1]].heightType==0)){
            content+=`<div class='tileside tileside-right'> </div>`
        }
        if(cell==0||(cell>0&&tiledata[mapdata[row][cell-1]].heightType==0)){
            content+=`<div class='tileside tileside-left'> </div>`
        }
    }else{
        if(row==0||(row>0&&tiledata[mapdata[row-1][cell]].tileKey=="tile_hole")){
            content+=`<div class='tileside tileside-back'> </div>`
        }
        if(row==mapdata.length-1||(row<mapdata.length-1&&tiledata[mapdata[row+1][cell]].tileKey=="tile_hole")){
            content+=`<div class='tileside tileside-front'> </div>`
        }
        if(cell==mapdata[row].length-1||(cell<mapdata[row].length-1&&tiledata[mapdata[row][cell+1]].tileKey=="tile_hole")){
            content+=`<div class='tileside tileside-right'> </div>`
        }
        if(cell==0||(cell>0&&tiledata[mapdata[row][cell-1]].tileKey=="tile_hole")){
            content+=`<div class='tileside tileside-left'> </div>`
        }
    }
    switch(tiletype.tileKey){
        case 'tile_healing': 
            content +=`<img class='tile-img' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/healing.png'>` 
            extraprop+=' tile-bg '
            ;break;
        case 'tile_bigforce': 
            if(tiletype.blackboard[0].value==1)content =`<img class='tile-img' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/force.png'>` 
            if(tiletype.blackboard[0].value==2)content =`<img class='tile-img' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/force2.png'>` 
            extraprop+=' tile-bg '
            break;
        case 'tile_infection': 
            content +=`<img class='tile-img' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/infection.png'>` 
            extraprop+=' tile-bg '
            break;
        case 'tile_volcano': 
            content +=`<img class='tile-img' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/volcano3.png'>` 
            // content =`<img class='tile-img' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/mc/volcano2.png'>` 
            extraprop+=''
            break;
        case 'tile_defup': 
            content +=`<img class='tile-img' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/def.png'>` 
            extraprop+=' tile-bg '
            break;
        case 'tile_gazebo': 
            content +=`<img class='tile-img' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/air.png'>` 
            extraprop+=' tile-bg '
            break;
        case 'tile_floor': 
            content +=`<img class='tilebg' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/forb.png'>` 
            break;
        case 'tile_flystart': 
            content +=`<img class='tile-img'  src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/drone.png'>` 
            break;    
        case 'tile_start': 
        case 'tile_end' :
            content +=`<img class='tile-img'  src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/base.png'>` 
            break;  
        case 'tile_telin' :
            content +=`<img class='tile-img'  src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/telin.png'>` 
            break;  
        case 'tile_telout' :
            content +=`<img class='tile-img'  src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/telout.png'>` 
            break;  
        case 'tile_deepwater' :
            // content =`<img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/mc/water.png'>` 
            // isheight=false
            break;  
        case 'tile_grass' :
            content +=`<img class='tile-img' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/grass.png'>` 
            content +=`<img class='grass grass-1' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/grass2.png'>` 
            content +=`<img class='grass grass-2' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/grass2.png'>` 
            content +=`<img class='grass grass-3' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/grass2.png'>` 
            content +=`<img class='grass grass-4' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/grass2.png'>` 
            break;  
        // case 'tile_road' :
        //     content =`<img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/mc/path.png'>` 
        //     break;  
        // case 'tile_wall' :
        //     content =`<img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/mc/slab.png'>` 
        //     break;  
        // case 'tile_forbidden' :
        //     content =`<img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/mc/bedrock.png'>` 
        //     break;  
        // case 'tile_hole' :
        //     content =`<img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/stage/tile/hole.png'>` 
        //     break;  
        default:

    }
    

    var tile = `<div class='tile tile-height-${height} ${extraprop} tiledata-spec-${tile}'>${content}</div>`
    return tile
}
// function ShowImages(imagename){
//     // $('#imagezoomcontainer').modal();
//     // var image = $('#tabs-opCG').children('.active').children('img').attr('src');
//     ChangeImage(imagename);
// }
// function ChangeImage(src=''){
//     // var namesplit = images.split("/")
//     console.log(src)
//     $("#imagezoom").attr("src","");
//     $("#imagezoom").attr("src",src);
//     $('#imagezoom').modal('handleUpdate')
//     $('#imagezoomcontainer').modal("show");
// }


function LoadAllJsonObjects(obj) {
    var result = {}
    
    var promises = Object.entries(obj).map(function(url){
        return $.getJSON(url[1]).then(function(res){
            result[url[0]]=res
        })
    })

    return Promise.all(promises).then(function(){
        return result
    })
}

// function LoadAll(obj) {
//     var result = {}
    
//     var promises = Object.entries(obj).map(function(url){
//         return readTextFile(url[1]).then(function(res){
//             result[url[0]]=res
//         }).fail(function() {
//             console.log( "error" );
//         })
//     })

//     return Promise.all(promises).then(function(){
        
//         return result
//     })
// }

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                return allText
            }
        }
    }
    rawFile.send(null);
}

let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};


function formatDate(date) {
    var monthNames = [
      "January", "February", "March",
      "April", "May", "June", "July",
      "August", "September", "October",
      "November", "December"
    ];
  
    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
  
    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}