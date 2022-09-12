$.holdReady(true);
const jsonList = {
    stage_table             :"./json/gamedata/zh_CN/gamedata/excel/stage_table.json",
    zone_table              :"./json/gamedata/zh_CN/gamedata/excel/zone_table.json",
    
    stage_table_en          :"./json/gamedata/en_US/gamedata/excel/stage_table.json",
    zone_table_en           :"./json/gamedata/en_US/gamedata/excel/zone_table.json",


    //TL
    stagedesc_tl            :"./json/tl-stagedesc.json"
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

var challengeList={}
var conditionList ={}
var stagesObject = {
    "MAIN":{},
    "ACTIVITY":{},
    "CAMPAIGN":{},
    "DAILY":{}
}

var isperspective = false

async function Check(){
    // console.log(db.stage_table)
    Object.keys(db.zone_table.zones).forEach(zoneName => {
        var zone = db.zone_table.zones[zoneName]
        if(zone.type =="CAMPAIGN"){
            stagesObject.CAMPAIGN[zone.zoneID]={}
            // stagesObject.ACTIVITY[zone.zoneID]={}
        }else if(zone.type =="MAINLINE"){
            stagesObject.MAIN[zone.zoneID]={}
        }else if(zone.type =="WEEKLY"){
            stagesObject.DAILY[zone.zoneID]={}
        }
    });

    console.log(stagesObject)

    $.each(db.stage_table.stages,function(stagename,stage){
        $.each(stagesObject,function(a,b){
            if(a=="MAIN"&&(stage.stageType=="MAIN"||stage.stageType=="SUB")){
                b[stage.zoneId][stagename]=stage
            }else if(a==stage.stageType&& a=="ACTIVITY"){
                var splitstagename = stage.stageId.split("_")[0]
                console.log(splitstagename)
                if(!b[splitstagename]){
                    b[splitstagename]={}
                }
                b[splitstagename][stagename]=stage

            }else if (a==stage.stageType&&a=="CAMPAIGN"){
                console.log(stage)
                b[stage.zoneId][stagename]=stage
                // console.log(stage)
            }else if(a==stage.stageType&&a=="DAILY"){
                console.log(stage)
                b[stage.zoneId][stagename]=stage
            }
        })
        if(stage.difficulty=="FOUR_STAR"){
            // challengeList[]
            var stagedesc = stage.description
            var stagedescsplit = stage.description.split(/\\n/g)[1]
            var prefix = `<b>Condition:</b>`
            if(db.stage_table_en.stages[stagename]){
                stagedesc = db.stage_table_en.stages[stagename].description.split(/\n/g)[1]
                if(!conditionList[stagedescsplit])conditionList[stagedescsplit] =  db.stage_table_en.stages[stagename].description.split(/\n/g)[1]
            }else if(conditionList[stagedescsplit]){
                stagedesc= conditionList[stagedescsplit]
                // console.log(conditionList[stagedescsplit])
            }else if (db.stagedesc_tl[stagedescsplit]){
                stagedesc= db.stagedesc_tl[stagedescsplit]
                // console.log(db.stagedesc_tl[stagedescsplit])
            }else if(stage.description.split(/\\n/g)[2]){
                var splitloc = stage.description.split(/\\n/g)
                stagedesc = splitloc[1]
            }
            var regexcond = /(<@lv.fs>)(.*)(<\/>)(\\n||\n)(.*)/g
            var split = regexcond.exec(stagedesc)
            if(split&&split[5]!=""){
                stagedesc = `${split[5]}`
            }
            challengeList[stage.code] = stagedesc
        }
    })
    
    $("#challengelist").empty()
    var stagecodelist = {}
    $.each(challengeList,function(chname,ch) {
        var splitname = chname.split("-")
        
        var combname =[]
        splitname.forEach(currname => {
            combname.push(`<a style="color:#999;font-size:13px;background:#222;display:inline-block;padding:2px;margin:2px;border-radius:1px;width:26px;text-align:center">${currname}</a>`)
        });
        var chtml = `<div style='color:#999999;font-size:12px'>
            ${combname.join(`<a style="color:#999;font-size:13px;background:#222;display:inline-block;padding:2px 4px;margin:0px;border-radius:2px">-</a>`)}
            <a style="color:#222;font-size:13px;background:#999;display:inline-block;padding:2px;margin:2px;border-radius:2px">:</a>
            ${ch}</div>`
        if(!stagecodelist[splitname[0]])stagecodelist[splitname[0]]=[]
        stagecodelist[splitname[0]].push(`
        <div style="background:#444;margin:4px;padding:2px;padding-top:2px;background:#444;border-radius:2px;">
        ${chtml}
        </div>
        `)
    })

    $.each(stagecodelist,function(cname,htcontent){
        var stagetitle = `<div style="color:#222;font-size:13px;background:#999;display:inline-block;padding:4px;margin:2px;border-radius:1px;width:200px;text-align:center"><b>${cname}</b></div></br>`
        $("#challengelist").append(`
        
        <div class="ak-shadow" style="margin-bottom:8px;padding-top:10px;padding:2px;background:#666">
        ${stagetitle}${htcontent.join("")}
                </div>`)
    })
    // Object.keys(db.stage_table.stages).forEach(stageName => {
    //     var stage = db.stage_table.stages[stageName]
        

    //     // Object.keys(stagesObject).forEach(eachzonename => {
    //     //     var eac
    //     //     if(Object.keys(stagetype)==stage.stagetype){
    //     //         eachzone[stage.zoneID].push(stage)
    //     //     }
    //     // });
    // });


    console.log(stagesObject)
    // console.log(challengeList)
    // LoadStage("obt/main/level_main_00-01.json")
    // LoadStage("obt/main/level_main_01-12.json")
    
    // LoadStage("obt/main/level_main_02-09.json")

    // LoadStage("obt/main/level_main_03-08.json")
    // LoadStage("obt/main/level_main_06-14.json")
    // LoadStage("obt/main/level_main_06-15.json")
    // LoadStage("obt/main/level_main_05-05.json")
    // LoadStage("obt/main/level_main_04-04.json")
    // LoadStage("obt/main/level_main_04-06.json")
    // LoadStage("obt/main/level_main_04-07.json")
    // LoadStage("obt/main/level_main_04-09.json")
    // LoadStage("obt/main/level_main_04-10.json")

    // LoadStage("obt/campaign/level_camp_01.json")
    // LoadStage("obt/campaign/level_camp_02.json")
    // LoadStage("obt/campaign/level_camp_03.json")

    // LoadStage("obt/weekly/level_weekly_fly_5.json")

    // LoadStage("obt/weekly/level_weekly_armor_5.json")
    // LoadStage("obt/promote/level_promote_d_2.json")

    // LoadStage("obt/weekly/level_weekly_killcost_4.json")
    // LoadStage("obt/weekly/level_weekly_killcost_5.json")
    
    // LoadStage("obt/weekly/level_weekly_melee_5.json")
    // LoadStage("obt/weekly/level_weekly_melee_5.json")


    //big force 
    // LoadStage("activities/act7d5/level_act7d5_05.json")

    // LoadStage("activities/act7d5/level_act7d5_05.json")

    // act7d5_05

    // LoadStage("obt/main/level_main_04-03.json")
    // LoadStage("activities/act7d5/level_act7d5_03.json")


    // LoadStage("obt/main/level_sub_04-1-1.json")
    // LoadStage("obt/main/level_sub_04-3-1.json")
}


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