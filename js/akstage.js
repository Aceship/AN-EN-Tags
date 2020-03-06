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
    console.log(db)
    // console.log(db2)
    // Start()
    // ListBanner()
    Check()
});
var stagesObject = {
    "MAIN":{},
}

var challengeList={

}

var conditionList ={

}

async function Check(){
    // console.log(db.stage_table)
    Object.keys(db.zone_table.zones).forEach(zoneName => {
        var zone = db.zone_table.zones[zoneName]
        if(zone.type =="MAINLINE"){
            stagesObject.MAIN[zone.zoneID]={}
        }
    });


    $.each(db.stage_table.stages,function(stagename,stage){
        $.each(stagesObject,function(a,b){
            // console.log(a)
            // console.log(stage.stageType)
            if(a==stage.stageType){
                // console.log(stage.code)
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
                console.log(db.stagedesc_tl[stagedescsplit])
            }else if(stage.description.split(/\\n/g)[2]){
                var splitloc = stage.description.split(/\\n/g)
                stagedesc = splitloc[1]
            }

            
            var regexcond = /(<@lv.fs>)(.*)(<\/>)(\\n||\n)(.*)/g
            var split = regexcond.exec(stagedesc)
            console.log(split)

            
            if(split&&split[5]!=""){
                stagedesc = `${split[5]}`
                // var splitreplace = `<b>Condition:</b> ${split[5]}`
                // split[0] = "<B>"
                // split[1] = "Condition:"
                // split[2] = "</B>"
                // split[3] = ""

                
                // console.log(splitreplace)
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
    console.log(challengeList)
    // LoadStage("obt/main/level_main_00-01.json")
    
    // LoadStage("obt/main/level_main_02-09.json")

    // LoadStage("obt/main/level_main_03-08.json")
    // LoadStage("obt/main/level_main_06-15.json")
    // LoadStage("obt/main/level_main_05-05.json")
    // LoadStage("obt/main/level_main_04-04.json")
    // LoadStage("obt/main/level_main_04-06.json")
    // LoadStage("obt/main/level_main_04-07.json")
    // LoadStage("obt/main/level_main_04-09.json")

    // LoadStage("obt/campaign/level_camp_01.json")
    // LoadStage("obt/campaign/level_camp_02.json")
    // LoadStage("obt/campaign/level_camp_03.json")

    // LoadStage("obt/weekly/level_weekly_fly_5.json")

    // LoadStage("obt/weekly/level_weekly_armor_5.json")
    LoadStage("obt/promote/level_promote_d_2.json")

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

function LoadStage(stage){
    var stagelevelfolder ="./json/gamedata/zh_CN/gamedata/levels/"

    console.log(stagelevelfolder+stage)
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
            console.log(jsonstage)

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
    mapdata.map.forEach(row => {
        var currrow = [ ]
        row.forEach(cell => {
            console.log(tiledata[cell])
            currrow.push(GenerateTile(tiledata[cell]))
        });

        tiles.push(`
        <div class='tile-row'> 
            ${currrow.join("")}
        </div>
        `)
    });

    $('#MapPreview').html(`
    <div id='mappreview'class='mainmap perspectiveMap'>
        ${tiles.join("")}
    </div>
    `)
}

function TogglePerspective(){
    $('#mappreview').toggleClass('perspectiveMap')
}

function GenerateTile(tiletype){
    var content = ''
    var tile = tiletype.tileKey
    var height = tiletype.heightType
    var extraprop = ''

    switch(tiletype.tileKey){
        case 'tile_healing': 
            content =`<img style='width:100%' src='img/ui/stage/tile/healing.png'>` 
            extraprop+=' tile-bg '
            ;break;
        case 'tile_bigforce': 
            if(tiletype.blackboard[0].value==1)content =`<img style='width:100%' src='img/ui/stage/tile/force.png'>` 
            if(tiletype.blackboard[0].value==2)content =`<img style='width:100%' src='img/ui/stage/tile/force2.png'>` 
            extraprop+=' tile-bg '
            break;
        case 'tile_infection': 
            content =`<img style='width:100%' src='img/ui/stage/tile/infection.png'>` 
            extraprop+=' tile-bg '
            break;
        case 'tile_volcano': 
            content =`<img src='img/ui/stage/tile/volcano3.png'>` 
            extraprop+=''
            break;
        case 'tile_defup': 
            content =`<img style='width:100%' src='img/ui/stage/tile/def.png'>` 
            extraprop+=' tile-bg '
            break;
        case 'tile_gazebo': 
            content =`<img style='width:100%' src='img/ui/stage/tile/air.png'>` 
            extraprop+=' tile-bg '
            break;
            
        case 'tile_floor': 
            content =`<img class='tilebg' src='img/ui/stage/tile/forb.png'>` 
            
            break;
        case 'tile_flystart': 
            content =`<img src='img/ui/stage/tile/drone.png'>` 
            break;    
        case 'tile_start': 
        case 'tile_end' :
            content =`<img src='img/ui/stage/tile/base.png'>` 
            break;  
            
        default:

    }
    if(height>0){
        content+= `<div class='tileside-front'> </div><div class='tileside-right'> </div><div class='tileside-left'> </div><div class='tileside-back'> </div>`
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