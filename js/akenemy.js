    $.holdReady(true);
    var db = {};
    var d0 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/building_data.json",function(data){
        db["manufactformulas"] = data.manufactFormulas;
    });
    var d1 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/building_data.json",function(data){
        db["workshopformulas"] = data.workshopFormulas;
    });
    var d2 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/character_table.json",function(data){
        db["chars"] = data;
    });
    var d3 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/item_table.json",function(data){
        db["items"] = data.items;
    });
    var d4 = $.getJSON("json/tl-akhr.json",function(data){
        db["chars2"] = data;
    });
    var d5 = $.getJSON("json/tl-type.json",function(data){
        db["classes"] = data;
    });
    var d6 = $.getJSON("json/tl-tags.json",function(data){
        db["tags"] = data;
    });
    var d7 = $.getJSON("json/akmaterial.json",function(data){
        db["itemstl"] = data;
    });
    var d8 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/gamedata_const.json",function(data){
        db["dataconst"] = data;
    });
    var d9 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/enemy_handbook_table.json",function(data){
        db["enemy"] = data;
    });
    var d10 = $.getJSON("json/tl-enemy.json",function(data){
        db["enemytl"] = data;
    });
    var d11 = $.getJSON("json/gamedata/zh_CN/gamedata/levels/enemydata/enemy_database.json",function(data){
        db["enemyDetail"] = data.enemies;
    });
    // var d12 = $.getJSON("json/en/levels/enemydata/enemy_database.json",function(data){
    //     db["enemyDetailEN"] = data.enemies;
    // });
    var d13 = $.getJSON("json/gamedata/en_US/gamedata/excel/enemy_handbook_table.json",function(data){
        db["enemyEN"] = data;
    });
    $.when(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,d11,d13).then(function(){
        $.holdReady(false);
    });

    var lang;
    var reg;
    var selectedEnemy;
    var selectedLevel=0;
    var skeletonType = "skel"
    var chibitype = 'enemy'
    var charName = 'enemy_1510_frstar2';
    var chibipers = 'front'
    var chibiName = 'enemy_1510_frstar2'
    var folder = `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/spineassets/${chibitype}/`
    var spinewidget 
    var loadchibi = true;
    var defaultAnimationName = "Default";
    var animationqueue
    var chibiscaleweb = 0
    var chibiscaleweblist = [[0.5,-775],[0.6,-800],[0.7,-825],[0.8,-850],[0.9,-875],[1,-900]]
    var savenum = 0

    $(document).ready(function(){
        FilterType("BOSS")
        $('#to-tag').click(function() {      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });

        $('.dropdown-trigger').dropdown();
        $('[data-toggle="tooltip"]').tooltip();


        if(!localStorage.getItem('gameRegion') || !localStorage.getItem('webLang')){
            console.log("game region undefined");
            localStorage.setItem("gameRegion", 'cn');
            localStorage.setItem("webLang", 'en');
            reg = "cn";
            lang = "en";
        } else {
            console.log(localStorage.getItem('webLang'));
            reg = localStorage.getItem('gameRegion');
            lang = localStorage.getItem('webLang');
        }
        if(!localStorage.getItem('selectedEnemy')){
            localStorage.removeItem("selectedEnemy");
        } else {
            selectedEnemy = localStorage.getItem('selectedEnemy');
            var opname = db.chars[selectedEnemy].name;
            selectOperator(opname);
        }
        $('.reg[value='+reg+']').addClass('selected');
        $('.lang[value='+lang+']').addClass('selected');
        changeUILanguage();
    });

    $.getScript("js/arrive.min.js", function(){
        $(document).arrive("#regionDropdown", function(){
            $("#navitemRegion").addClass('ak-disable2');
            $("#navitemLanguage").addClass('ak-disable2');
        });
    });
    $('#Chibi-download').click(function(event){
        // var canvas = spinewidget.canvas
        
        var checkdiv = $("#spine-widget").children()[0]
        console.log(checkdiv)
        var img = checkdiv.toDataURL("image/png");
        var link = document.createElement("a");
        link.download = `${chibiName}-${savenum}.png`;
        savenum++
        link.href = img;
        link.click();
    });
    function regDropdown(el){
        localStorage.setItem('gameRegion', el.attr("value"));
        $(".dropdown-item.reg").removeClass("selected");
        el.addClass("selected");   
        changeUILanguage();
    }
                
    function langDropdown(el){
        localStorage.setItem('webLang', el.attr("value"));
        console.log(localStorage.getItem('webLang'))
        $(".dropdown-item.lang").removeClass("selected");
        el.addClass("selected");
        changeUILanguage();
    }
    

    function FilterType(type){
        charaFilter=[]
        let currHtml = []
        $("#tbody-list").empty()
        
        // currHtml.push(`</div></div> `)
        // console.log(currHtml)
        $("#tbody-list").html(currHtml.join(""))
    }
    function clickBtnClear(){
        console.log(lang);
        $("#tbody-list").empty()
    }
    function populateEnemy(el){
        // console.log(el)
        if(($('#enemyResult').css("display") == "block") &&el=="Browse"){
            // console.log($('#operatorsResult').css("display") == "none" )
            $('#enemyResult').hide();
            return;
        }
        
        if(el.value != ""||el=="Browse"){
            var result = [];
            $.each(db.enemy.enemyData,function(_,enemy){
                var languages = [db.enemy.enemyData, db.enemyEN];
                var found = false;
                var nameTL;
                if(el=="Browse"){
                    found=true;
                }else{
                    var input = el.value.toUpperCase();
                    $.each(languages, function(_,langDB){
                        if (!(enemy.enemyId in langDB))
                            return;
                        var charname = langDB[enemy.enemyId].name.toUpperCase();
                        if(charname.search(input) != -1){
                            nameTL = langDB[enemy.enemyId].name;
                            found = true;
                            return false;
                        }
                    });
                }
                if(found){
                    var id = enemy.enemyId;
                    var name = enemy.name;
                    var sortId = enemy.sortId;
                    result.push({'id':id,'name':name,'sortId':sortId,'nameTL':name == nameTL?null:nameTL});
                }
            });
            // console.log(result)
            let currHtml = []
            result.sort((a,b)=> a.sortId-b.sortId)
            if(result.length > 0){
                $('#enemyResult').empty();
                $('#enemyResult').show();
                for (var i = 0; i < result.length; i++) {
                    let currEnemy = query(db.enemy.enemyData,"enemyId",result[i].id)
                    let image = `<img style="height:80px;padding:1px" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/enemy/${result[i].id}.png">  `
                    // console.log(currEnemy)

                    if(el=="Browse"){
                        currHtml.push(`<li class="ak-btn ak-enemy" style="display:inline-block;cursor: pointer;width:90px;margin:2px;margin-bottom:2px;padding:1px;border-radius:2px" onclick="selectEnemy('${result[i].id}')"> 
                        <div class="col-12"style="white-space: nowrap;padding:0px;text-align:center;margin:0px ">
                            <div style="position:absolute;top:-2px;left:2px;white-space: nowrap;padding:3px;padding-top:1px;padding-bottom:0px;margin:0px;background:#222">${currEnemy.enemyIndex}</div>
                            ${image}
                        </div>
                        
                        </li>`)
                    }else{
                        $("#enemyResult").append("<li class=\"ak-shadow-small\" style=\"width:100%;cursor: pointer;margin-bottom:2px; color:#fff;\" onclick=\"selectEnemy('"+result[i].id+"')\">"+image+(result[i].nameTL?result[i].nameTL+" ("+result[i].name+")":result[i].name)+"</li>");
                    }
                }
            } else {
                $('#enemyResult').empty();
                $('#enemyResult').hide();
            }
            $("#enemyResult").append(currHtml.join(""));
        } else {
            $('#enemyResult').empty();
            $('#enemyResult').hide();
        }
    }
    function selectEnemy(el){
        $('#enemyResult').empty();
        $('#enemyResult').hide();
        let currEnemy = query(db.enemy.enemyData,"enemyId",el)
        LoadAnimation(el)
        // console.log(el)
        let currEnemyEN = db.enemyEN[el]
        let currEnemyDetail = db.enemyDetail.find(search=>search.Key == el)
        // let currEnemyDetailEN = db.enemyDetailEN.find(search=>search.Key == el)
        let currHtml = []    
        // console.log(query(db.enemytl,"name_cn",currEnemy.name).name_en)
        let tlname = query(db.enemytl,"name_cn",currEnemy.name).name_en 
        let tldesc = currEnemy.description
        let tlrace = currEnemy.enemyRace?currEnemy.enemyRace:""
        let tlability = currEnemy.ability?currEnemy.ability:""
        if (currEnemyEN) {
            // console.log(currEnemyEN)
            tlname = currEnemyEN.name
            tldesc = currEnemyEN.description
            tlrace = currEnemyEN.enemyRace?currEnemyEN.enemyRace:""
            tlability = currEnemyEN.ability?currEnemyEN.ability:""
        }
        let firstEnemyData = currEnemyDetail.Value[0].enemyData
        //Attack type
        let atktype =[]
        console.log(currEnemy)
        let atkrange = ""
        if(firstEnemyData){
            switch(firstEnemyData.applyWay.m_value){
                case "MELEE" : atkrange = "Melee" ;break;
                case "RANGED" : atkrange = "Ranged" ;break;
            }
        }
        currEnemy.damageType.forEach(element => {
            switch (element) {
                case "近战": atktype.push("Melee") ;break;
                case "远程": atktype.push("Ranged") ;break;
                case "法术": atktype.push("Spell") ;break;
                case "不攻击": atktype.push("No Attack") ;break;

                case "PHYSIC" : atktype.push("Physical") ;break;
                case "MAGIC" : atktype.push("Magic") ;break;
                case "NO_DAMAGE" : atktype.push("No Attack") ;break;
                case "HEAL" : atktype.push("Healing") ;break;
                default: atktype.push(element) ;break;
            }
        });
        
        currHtml.push(`
        <div class="ak-c-black col">
        
            <div style="padding-top:30px">
            <div  class="ak-shadow" style="margin-bottom:8px;padding:5px;padding-top:10px;background:#444;margin-top:2px;display:inline-block;padding-left:10px;padding-right:30px">
                <div style="display:inline-block"><img style="height:80px;padding:1px" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/enemy/${currEnemy.enemyId}.png"> </div>
                <div style="display:inline-block">
                    <div style="border:3px solid #FFF;text-align:center;margin:5px;padding:0px;height:50px;width:50px;display:inline-block;${currEnemy.enemyIndex.length==2?"font-size:30px":"font-size:15px;padding-top:10px"}">${currEnemy.enemyIndex}</div>
                    <div style="display:inline-block;vertical-align:top">   
                    <div>${tlname?tlname:""} [${currEnemy.name}] </div>
                    <div>${tlrace}</div>
                    </div>
                </div>
            
            <div>
                <button type="button" class="btn ak-button  browse-btn" style="width:90px" data-toggle="modal" data-target="#enemysd"">
                    Check SD
                </button>
            </div>
            <div>Enemy Type : ${currEnemy.enemyLevel.charAt(0) + currEnemy.enemyLevel.slice(1).toLowerCase()}</div>
            
            <div>Attack type : ${atkrange? atkrange + " ": "" }${atktype.join(" ")}</div>
            </div>
            </div>
            
            ${tlability ?
            `<div class="ak-shadow" style="margin-bottom:8px;padding-top:10px;padding:5px;background:#444">
                <div style="color:#BBB;font-size:17px;background:#222;padding:5px;border-radius:2px">Abilities</div>
                <div style="padding:6px"> ${tlability.split(";").join("</br>")}</div>
            </div>`:""}
            <div class="ak-shadow" style="margin:margin-bottom:8px;padding-top:10px;padding:5px;background:#444">
                <div style="color:#BBB;font-size:17px;background:#222;padding:5px;border-radius:2px">Description</div>
                <div style="padding:6px"> ${tldesc}</div>
            </div>
        </div>`)
        
        // <div style="max-width:100%;margin-bottom:15px;margin-top:15px" >
        //         <div class="col" style="border:3px solid #FFF;text-align:center;margin:5px;padding:0px;height:80px;width:100px;display:inline-block">
        //         <div style="padding:0px;font-size:12px">
        //             <img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/enemy/hp.png" style="margin-top:-5px;position:absolute;top:5px;left:0px">
        //             Health</div><div style="font-size:40px;margin-top:-5px">${currEnemy.endure}</div>
        //         </div>
        //         <div class="col" style="border:3px solid #FFF;text-align:center;margin:5px;padding:0px;height:80px;width:100px;display:inline-block">
                
        //         <div style="padding:0px;font-size:12px">
        //             <img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/enemy/atk.png" style="margin-top:-5px;position:absolute;top:5px;left:0px">
        //             Attack</div><div style="font-size:40px;margin-top:-5px">${currEnemy.attack}</div>
        //         </div>
        //         <div class="col" style="border:3px solid #FFF;text-align:center;margin:5px;padding:0px;height:80px;width:100px;display:inline-block">
        //         <div style="padding:0px;font-size:12px">
        //             <img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/enemy/defense.png" style="margin-top:-5px;position:absolute;top:5px;left:0px">
        //             Defense</div><div style="font-size:40px;margin-top:-5px">${currEnemy.defence}</div>
        //         </div>
        //         <div class="col" style="border:3px solid #FFF;text-align:center;margin:5px;padding:0px;height:80px;width:100px;display:inline-block">
        //         <div style="padding:0px;font-size:12px;text-align:right;margin-right:5px">
        //             <img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/enemy/resistance.png" style="margin-top:-5px;position:absolute;top:5px;left:0px">
        //             Spell Resist</div><div style="font-size:40px;margin-top:-5px">${currEnemy.resistance}</div>
        //         </div>
        //     </div>
        if(currEnemyDetail){
            currHtml.push(`<div class="ak-c-black" style="text-align:center;margin-top:5px;background:#222"> Detail </div> <div class="ak-c-black" style="background:#222">`)
            currEnemyDetail.Value.forEach(element => {
                // console.log(element)
                currHtml.push(`<div class="btn btn-sm ak-btn ak-mid"style="display:inline;border: 1px #222;background:#111" onclick='enemyDetail(\"${el}\",${element.level})'> Level ${element.level}</div>`)
            });
            enemyDetail(el,0)
        }else{
            $('#enemyDetail2').hide();
        }
        currHtml.push(`</div>`)
        
        $('#enemyDetail').html(currHtml.join(""))
        
        // console.log(el)
    }

    function enemyDetail(el,level){
        $('#enemyDetail2').empty();
        $('#enemyDetail2').hide();
        let currEnemy = query(db.enemy.enemyData,"enemyId",el)
        let currEnemyDetail = db.enemyDetail.find(search=>search.Key == el)
        let firstEnemyData = currEnemyDetail.Value[0].enemyData
        let currEnemyData = currEnemyDetail.Value[level].enemyData
        let currHtml = []
        console.log(currEnemyDetail)
        
        // console.log(query(db.enemytl,"name_cn",currEnemy.name).name_en)
        // <div>Attack Speed : ${currattr.attackSpeed.m_value}</div>
        let tlname = query(db.enemytl,"name_cn",currEnemy.name).name_en 

        var currattr = currEnemyData.attributes
        var firstattr = firstEnemyData.attributes
        currHtml.push(`
        <div class="ak-c-black col">    
            <div>Attack Damage : ${currattr.atk.m_value!=0?currattr.atk.m_value:firstattr.atk.m_value}</div>

            <div>Attack Time : ${currattr.baseAttackTime.m_value!=0?currattr.baseAttackTime.m_value:firstattr.baseAttackTime.m_value} Second</div>
            <div>Health : ${currattr.maxHp.m_value!=0?currattr.maxHp.m_value:firstattr.maxHp.m_value}</div>
            <div>Health Recovery : ${currattr.hpRecoveryPerSec.m_value!=0?currattr.hpRecoveryPerSec.m_value:firstattr.hpRecoveryPerSec.m_value} /Second</div>
            <div>Defense : ${currattr.def.m_value!=0?currattr.def.m_value:firstattr.def.m_value}</div>
            <div>Magic Resistance : ${currattr.magicResistance.m_value!=0?currattr.magicResistance.m_value:firstattr.magicResistance.m_value}</div>
            <div>Weight : ${currattr.massLevel.m_value!=0?currattr.massLevel.m_value:firstattr.massLevel.m_value}</div>
            <div>Move Speed : ${currattr.moveSpeed.m_value!=0?currattr.moveSpeed.m_value:firstattr.moveSpeed.m_value}</div>
            <div>Range : ${currEnemyData.rangeRadius.m_value!=0?currEnemyData.rangeRadius.m_value:firstEnemyData.rangeRadius.m_value} Tile</div>
            <div>Stun Immune : ${currattr.stunImmune.m_value!=0?currattr.stunImmune.m_value:firstattr.stunImmune.m_value}</div>
            <div>Silence Immune : ${currattr.silenceImmune.m_value!=0?currattr.silenceImmune.m_value:firstattr.silenceImmune.m_value}</div>
        `)
        currHtml.push(`</div>`)
        if(currEnemyData.talentBlackboard){
            currHtml.push(`<div class="ak-c-black" style="text-align:center;margin-top:5px;background:#222"> Abilities<div class="ak-c-black" style="text-align:left">`)
            currEnemyData.talentBlackboard.forEach(element=>{
                currHtml.push(`<div>${element.key} : ${element.value}</div>`)
            })
            currHtml.push(`</div></div> `)
        }
        
        $('#enemyDetail2').html(currHtml.join(""))
        $('#enemyDetail2').show();
    }    
    // function 

    function query(db,key,val,single=true,returnKey=false){
        if(single){
            var result = {};
        } else {
            var result = [];
        }
        var found = false;
        $.each(db,function(key2,v){
            if(v[key].toLowerCase() == val.toLowerCase()){
                found = true;
                if(single){
                    if(returnKey){
                        result[key2] = v;
                    } else {
                        result = v;
                    }
                    return false;
                } else {
                    if(returnKey){
                        var obj = {};
                        obj[key2] = v; 
                        result.push(obj);
                    } else {
                        result.push(v);
                    }
                }
            }
        });
        if(found){
            return result;
        } else {
            return false;
        }
    }

    function changeUILanguage(){
        reg = localStorage.getItem('gameRegion');
        lang = localStorage.getItem('webLang');

        $('#display-reg').text(reg.toUpperCase())
        
        switch (lang) {
            case "en":$('#display-lang').text("English");break;
            case "cn":$('#display-lang').text("Chinese");break;
            case "jp":$('#display-lang').text("Japanese");break;
        }
        
        localStorage.setItem("gameRegion", reg);
        localStorage.setItem("webLang", lang);
        getJSONdata("ui",function(data){
            if(data.length != 0){
                $.each(data, function(i,text){
                    $("[translate-id="+text.id).html(text['ui_'+lang]);
                });
            }
        });
    }

    function getJSONdata(type, callback){
        var x = 0;
        var req = $.getJSON("json/tl-"+type+".json");
        req.done(function(response){
            callback(response);
        });
        req.fail(function(response){
            console.log("type: "+type+" fail: ");
            console.log(response);
        });
    }

    function ChangeSkillAnim(skillnum,skillmax,token){
        // console.log(skillnum)
        // console.log(token)
        // console.log(skillmax)
        console.log(token)
        tokenname = token
        if(spinewidgettoken&&token&&spinewidgettoken.loaded){
            
            LoadAnimationToken(token)
        }else if(spinewidget&&spinewidget.loaded){
            var animlist = Object.keys(spinewidget.customanimation).filter(search=>search.includes("Skill"))

            animlist=animlist.sort((a,b)=>{
                if(a<b)return 1
                if(a>b)return -1
                return 0
            })
            
            if(animlist&&animlist.length>0){
                // console.log(animlist)
                // console.log(skillmax-skillnum-1)
                
                if(animlist[skillmax-skillnum-1]){
                    $("#spine-text").text(`Skill ${skillnum+1}`)
                    // console.log()
                    CreateAnimation(spinewidget,spinewidget.customanimation[animlist[skillmax-skillnum-1]],true)
                }
            }
            // console.log(currselectedanim)
            // CreateAnimation(spinewidget)
            
        }
    }

    function ConvertAtlas(atlas){
        var combined = []
        var eachpart = atlas.split(/\n\n/g)
        // console.log(eachpart)
        eachpart.forEach(part => {
            combined.push(ParseAtlas(part))
        });
        return combined
    }
    function ParseAtlas(texts){
        var json = {parts:[]}
        var eachlines = texts.split(/\n/g)
        var isheaderfinished=false
        var isheader = false
        var currheader
        var num = -1
        eachlines.forEach(line => {
            // console.log(line)
            if(line=="\r"){
                
            }
            else if(line!=""){
                if(!isheaderfinished){
                    if(!json.image){
                            json.image=line;
                        }else{
                            var currvalue = GetAtlasValue(line)
                            json[currvalue.key] = currvalue.value
                            if(currvalue.key=="repeat"){
                                isheaderfinished=true
                            }
                    }
                }else{
                    if((/(  )/g).test(line)&&currheader){
                        isheader = false
                        var currvalue = GetAtlasValue(line.replace("  ",""))
                        json.parts[currheader][currvalue.key] = currvalue.value
                    }else{
                        isheader = true
                        num =+1
                        currheader = line
                        json.parts[line]={}
                    }
                }
            }
        });
        return json
    }
    function GetAtlasValue(value){
        var content = value.split(":")
        var splitvalue = [content[1]]
        if(content[1]&&content[1].includes(",")){
          splitvalue = content[1].split(",")
        }
        return {key:content[0],value:splitvalue}
      }
    
    function LoadAnimation(chibiname = chibiName){
        // console.log(spinewidget)
        $("#loading-spine").text("Loading...")
        if(spinewidget){
            // spinewidget.loadWidgets()
            // spinewidget.loadTexture()
            spinewidget.pause()
            spinewidget = undefined
            $("#spine-widget").remove()
            currscale = chibiscaleweblist[chibiscaleweb]
            $("#spine-frame").append(`<div id="spine-widget" class="top-layer" style="position:absolute;width: 4000px; height: 4000px;top:-2200px;left:-1850px;pointer-events: none;z-index: 20;transform: scale(0.5);"></div>`)
            // console.log(loadchibi)
            // if(loadchibi)$("#spine-frame").fadeIn(100);
        }else{
            if(loadchibi)$("#spine-frame").fadeIn(100);
        }
        if (chibiname != null && defaultAnimationName != null) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', folder + chibiname + "." +skeletonType, true);
            xhr.responseType = 'arraybuffer';
            var array;
            $("#spine-widget").hide()
            var defaultskin ='default'
            
            $("#loading-spine").fadeIn(200)
            console.log(chibiname)
            chibiName = chibiname
            
            xhr.onloadend = function (e) {
                if (xhr.status != 404) {
                    buffer = xhr.response;
                    array = new Uint8Array(buffer);
                    // console.log(array);
                    skelBin = new SkeletonBinary();
                    var jsonskel
                    if(array.length==0){
                        $("#loading-spine").text("Load Failed")
                    }
                    if (skeletonType== "skel"){
                        skelBin.data = array
                        skelBin.initJson()
                        jsonskel = JSON.stringify(skelBin.json)
                        var parsedskeljson = JSON.parse(jsonskel)
                        console.log(JSON.parse(jsonskel))
                        if(!Object.keys(parsedskeljson.animations).find(search=>search==defaultAnimationName)){
                            defaultAnimationName = Object.keys(parsedskeljson.animations)[0]
                        }
                        if(!Object.keys(parsedskeljson.skins).find(search=>search==defaultskin)){
                            defaultskin = Object.keys(parsedskeljson.skins)[0]
                        }
                    }else if (skeletonType== "json"){
                        jsonskel = JSON.parse(new TextDecoder("utf-8").decode(array))
                        var parsedskeljson = jsonskel
                        console.log(JSON.parse(jsonskel))
                        if(!Object.keys(parsedskeljson.animations).find(search=>search==defaultAnimationName)){
                            defaultAnimationName = Object.keys(parsedskeljson.animations)[0]
                        }
                        if(!Object.keys(parsedskeljson.skins).find(search=>search==defaultskin)){
                            defaultskin = Object.keys(parsedskeljson.skins)[0]
                        }
                    }
                    
                    
                    
                    // var test = new TextDecoder("utf-8").decode(array);
                    // console.log(JSON.parse(test))
                    // console.log(JSON.stringify(skelBin.json, null, "\t"));
                    var spineX = parseFloat(4000)/2
                    var spineY = parseFloat(4000)/2 -900
                    var xhratlas = new XMLHttpRequest();
                    xhratlas.open('GET', folder + chibiname + ".atlas", true);
                    xhratlas.onloadend = function (e) {
                        if (xhratlas.status != 404) {
                            var loadedatlas = xhratlas.response;
                            var imagename = ConvertAtlas(loadedatlas)
                            var atlaslist = []
                            imagename.forEach(image => {
                                atlaslist.push(image.image)
                            });
                            console.log(atlaslist)
                            new spine.SpineWidget("spine-widget", {
                                jsonContent: jsonskel,
                                atlas: folder + chibiname + ".atlas",
                                atlasPages: atlaslist,
                                animation: defaultAnimationName,
                                backgroundColor: "#00000000",
                                skin : defaultskin,
                                // debug: true,
                                // imagesPath: chibiName + ".png", 
                                premultipliedAlpha: true,
                                fitToCanvas : false,
                                loop:true,
                                x:spineX,
                                y:spineY,
                                //0.5 for normal i guess
                                scale:1,
                                success: function (widget) {
                                    
                                    animIndex=0
                                    spinewidget = widget
                                    $("#spine-text").text(widget.skeleton.data.animations[0].name)
                                    $("#loading-spine").fadeOut(200)
                                    animations = widget.skeleton.data.animations;
                                    // console.log(animations)
                                    // console.log(widget)
                                    $("#spine-widget").show()
                                    if(animations.find(search=>search.name=="Start")){
                                        CreateAnimation(spinewidget,["Start","Idle"])
                                        $("#spine-text").text("Idle")
                                    }else if(animations.find(search=>search.name=="Relax")){
                                        CreateAnimation(spinewidget,"Relax")
                                        $("#spine-text").text("Relax")
                                    }

                                    // CreateAnimation(["Skill_Begin",["Skill_Loop",5],"Skill_End","Idle"],true)
                                    // CreateAnimation(["Skill_2_Begin",["Skill_2_Loop",5],"Skill_2_Loop_End","Idle"],true)

                                    widget.customanimation = CheckAnimationSet(animations)
                                    // console.log(widget)


                                    //ange skill 2
                                    // CreateAnimation(["Skill1_Begin",["Skill1_Loop",15],"Skill1_End",["Idle_Charge",2]],true)

                                    //ange skill 3 (is weird)
                                    // CreateAnimation(["Skill2_Begin",["Skill2_Loop",15],"Skill2_End",["Idle_Charge",2]],true)

                                    // Normal skill loop with begin and idle i guess (nian skill 2)
                                    // CreateAnimation(["Skill_2_Begin",["Skill_2_Loop",5],"Skill_2_Idle"],true,true)


                                    // console.log(widget.state)
                                    // console.log(widget.state.trackEntry)
                                    $("#spine-toolbar-next").onclick = function () {
                                        widget.state.clearTracks()
                                        if(animationqueue!=undefined)clearInterval(animationqueue)
                                        animIndex++;
                                        // console.log(animations)
                                        if (animIndex >= animations.length) animIndex = 0;
                                        widget.setAnimation(animations[animIndex].name)
                                        $("#spine-text").text(animations[animIndex].name)
                                    }
                                }
                            })
                        }
                        
                    }
                    xhratlas.send()
                }else{
                    $("#loading-spine").text("Load Failed")
                    // $("#spine-frame").fadeOut()
                }
            };
            xhr.send()
        }
    }


    function LoadAnimationToken(tokenkey=opdataFull.tokenKey){
        // console.log(spinewidgettoken)
        // console.log(opdataFull)
        // var tokenName =
        var tokenname = tokenkey
        var tokenfolder = `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/spineassets/token/${opdataFull.id}/${tokenkey}`
        console.log(tokenfolder)
        // $("#loading-spine").text("Loading...")
        if(spinewidgettoken){
            // spinewidget.loadWidgets()
            // spinewidget.loadTexture()
            spinewidgettoken.pause()
            spinewidgettoken = undefined
            $("#spine-widget-token").remove()
            currscale = chibiscaleweblist[chibiscaleweb]
            $("#spine-frame-token").append(`<div id="spine-widget-token" class="top-layer" style="position:absolute;width: 1800px; height: 1800px;top:${currscale[1]}px;left:-750px;pointer-events: none;z-index: 20;transform: scale(${currscale[0]});"></div>`)
            // console.log(loadchibi)
            // if(loadchibi)$("#spine-frame").fadeIn(100);
        }else{
            if(loadchibi)$("#spine-frame-token").fadeIn(100);
        }
        if (chibiName != null && defaultAnimationName != null) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', tokenfolder +"."+skeletonType, true);
            xhr.responseType = 'arraybuffer';
            var array;
            $("#spine-widget-token").hide()

            
            // $("#loading-spine").fadeIn(200)
            // console.log(chibiName)
            xhr.onloadend = function (e) {
                if (xhr.status != 404) {
                    buffer = xhr.response;
                    array = new Uint8Array(buffer);
                    // console.log(array);
                    skelBin = new SkeletonBinary();
                    var jsonskel
                    if(array.length==0){
                        // $("#loading-spine").text("Load Failed")
                    }
                    if (skeletonType== "skel"){
                        skelBin.data = array
                        skelBin.initJson()
                        jsonskel = JSON.stringify(skelBin.json)
                    }else if (skeletonType== "json"){
                        jsonskel = JSON.parse(new TextDecoder("utf-8").decode(array))

                    }
                    
                    
                    
                    // var test = new TextDecoder("utf-8").decode(array);
                    // console.log(JSON.parse(test))
                    // console.log(JSON.stringify(skelBin.json, null, "\t"));
                    new spine.SpineWidget("spine-widget-token", {
                        jsonContent: jsonskel,
                        atlas: tokenfolder + ".atlas",
                        animation: defaultAnimationName,
                        backgroundColor: "#00000000",
                        // debug: true,
                        // imagesPath: chibiName + ".png", 
                        premultipliedAlpha: true,
                        fitToCanvas : false,
                        loop:true,
                        x:900,
                        y:650,
                        //0.5 for normal i guess
                        scale:1,
                        success: function (widget) {
                            
                            // animIndex=0
                            spinewidgettoken = widget
                            // $("#spine-text").text(widget.skeleton.data.animations[0].name)
                            // $("#loading-spine").fadeOut(200)
                            tokenanimations = widget.skeleton.data.animations;
                            // console.log(animations)
                            // console.log(widget)
                            $("#spine-widget-token").show()
                            if(tokenanimations.find(search=>search.name=="Start")){
                                CreateAnimation(spinewidgettoken,["Start","Idle"])
                                // $("#spine-text").text("Idle")
                            }else if(tokenanimations.find(search=>search.name=="Relax")){
                                CreateAnimation(spinewidgettoken,"Relax")
                                // $("#spine-text").text("Relax")
                            }else if(tokenanimations.find(search=>search.name=="Idle")){
                                CreateAnimation(spinewidgettoken,"Idle")
                                // $("#spine-text").text("Relax")
                            }

                            widget.customanimation = CheckAnimationSet(tokenanimations)
                            console.log(widget)
                        }
                    })
                }else{
                }
            };
            xhr.send()
        }
    }
    function ChangeAnimation2(widget,widgettext,num){
        if(widget=="token") widget=spinewidgettoken
        else widget=spinewidget

        var curranimation = Object.keys(widget.customanimation)
        widget.state.clearTracks()
        if(animationqueue!=undefined)clearInterval(animationqueue)
        animIndex += num;
        // console.log(animIndex)
        // console.log(curranimation)
        
        if (animIndex >= curranimation.length) animIndex = 0;
        else if (animIndex < 0) animIndex = curranimation.length-1;
        // spinewidget.state.setDefaultMix(0.1);
        // spinewidget.config.scale = 2
        // console.log(widget)
        // console.log(animIndex)
        // widget.setAnimation(curranimation[animIndex].name)
        // console.log(widget.customanimation[Object.keys(widget.customanimation)[animIndex]])

        CreateAnimation(widget,widget.customanimation[Object.keys(widget.customanimation)[animIndex]],true)
        // console.log(widgettext)
        $(widgettext).text(Object.keys(widget.customanimation)[animIndex])
    }

    function ChangeAnimation(widget,widgettext,num){
        if(widget=="token") widget=spinewidgettoken
        else widget=spinewidget

        var curranimation = widget.skeleton.data.animations
        widget.state.clearTracks()
        if(animationqueue!=undefined)clearInterval(animationqueue)
        animIndex += num;
        // console.log(animIndex)
        // console.log(curranimation)
        
        if (animIndex >= curranimation.length) animIndex = 0;
        else if (animIndex < 0) animIndex = curranimation.length-1;
        // spinewidget.state.setDefaultMix(0.1);
        // spinewidget.config.scale = 2
        // console.log(widget)
        // console.log(animIndex)
        // widget.setAnimation(curranimation[animIndex].name)
        // console.log(widget.customanimation[Object.keys(widget.customanimation)[animIndex]])
        // console.log(curranimation[index])
        CreateAnimation(widget,curranimation[animIndex].name)
        // widget.setAnimation(curranimation[animIndex].name)
        // console.log(widgettext)
        $(widgettext).text(curranimation[animIndex].name)
    }

    function ChangeSkin(name="",pers=""){
        currskin = name
        var skinname = currskin.split(opdataFull.id)[1]?name.split(opdataFull.id)[1]:""
        console.log(opdataFull.id)
        console.log(skinname)
        if(spinewidgettoken){
            console.log("      waaa "+tokenname)
            LoadAnimationToken(tokenname+skinname)
        }
        if(name!="")chibiName=name
        if(pers!="")chibipers=pers
        if(chibipers=='build') {chibiName.includes("build")?chibiName=chibiName:chibiName= "build_"+chibiName}
        else chibiName.includes("build")?chibiName=chibiName.split("_").slice(1).join("_"):chibiName=chibiName
        folder = `https://raw.githubusercontent.com/Aceship/Arknight-Images/main/spineassets/${chibitype}/${charName}/${chibipers}/`
        if(spinewidget)LoadAnimation()

        
    }


    function PlayPause(widget){
        if(widget=="token") widget=spinewidgettoken
        else widget=spinewidget
        if(widget.isPlaying()){
            console.log("Playing")
            widget.pause()
        }else{
            console.log("Paused")
            widget.play()
        }
    }


    function CreateAnimation(chibiwidget,animArray,endloop = false,skipStart = false){
        // console.log(animArray)
        
        // console.log(Array.isArray(animArray))
        // console.log(animArray.length>1)
        // console.log(Array.isArray(animArray[0]))
        
        if((Array.isArray(animArray)&&animArray.length>1)){
            // console.log("ayyyyyy")
            var delay = 0
            var animNum = 0
            if(animationqueue!=undefined)clearInterval(animationqueue)
            var curranimplay = Array.isArray(animArray[0])?animArray[0][0]:animArray[0]
            if(chibiwidget.loaded)chibiwidget.setAnimation(curranimplay)
            chibiwidget.state.clearTracks()
            var curranimations = chibiwidget.skeleton.data.animations
            animArray.forEach(element => {
                var curranim = element
                var animTimes = 1
                var isloop = animNum==animArray.length-1
                
                if(Array.isArray(element)){
                    curranim = element[0]
                    animTimes = element[1]
                    isloop = true
                }
                if(animNum==0)chibiwidget.state.setAnimation(0,curranim,Array.isArray(animArray[0])&&animArray[0].length>1?true:false)
                else chibiwidget.state.addAnimation(animNum,curranim,isloop,delay)
                delay +=curranimations[GetAnimationIndex(curranimations,curranim)].duration*animTimes
                animNum++
                // console.log(element)
            });
            if(endloop){
                if(skipStart)animArray.shift()

                console.log(animArray)
                animationqueue = setInterval(function(){
                    var delay = 0
                    var animNum = 0
                    
                    chibiwidget.state.clearTracks()
                    animArray.forEach(element => {
                        var curranim = element
                        var animTimes = 1
                        var isloop = animNum==animArray.length-1
                        if(Array.isArray(element)){
                            curranim = element[0]
                            animTimes = element[1]
                            isloop = true
                        }
                        if(animNum==0)chibiwidget.state.setAnimation(0,curranim,Array.isArray(animArray[0])&&animArray[0].length>1?true:false)
                        else chibiwidget.state.addAnimation(animNum,curranim,isloop,delay)
                        delay +=curranimations[GetAnimationIndex(curranimations,curranim)].duration*animTimes
                        animNum++
                        console.log(element)
                    });
                },delay*1000)
            }
        }else{
            // chibiwidget.state.setAnimation(animArray)
            // console.log("WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
            
            if(animationqueue!=undefined)clearInterval(animationqueue)
            // console.log(animArray)

            var curranimplay = Array.isArray(animArray[0])?animArray[0][0]:animArray
            if(chibiwidget.loaded)chibiwidget.setAnimation(curranimplay)
            chibiwidget.state.clearTracks()
            
            chibiwidget.state.setAnimation(0,curranimplay,true)
        }
    }
    
    function CheckAnimationSet(anim){
        // console.log(anim)
        var curranimlist = {}
        if(anim.find(search=>search.name=="Interact")){
            //Build Mode
            // console.log("Is Build")

        }else if(anim.find(search=>search.name=="Idle")){
            //Battle Mode
            // console.log("Is Battle")
            anim.forEach(curranim => {
                var numberregx = /(\d)/
                var currsplit = curranim.name.split("_")[0]
                
                if(currsplit)
                var splitnum = numberregx.exec(curranim.name)
                if(splitnum){
                    var nameregex = /(.*)(?=\d)/g
                    var checkname = nameregex.exec(currsplit)
                    // console.log(checkname[0])
                    if(checkname)currsplit = checkname[0]
                    // console.log(checkname[0])
                    splitnum=splitnum[0]
                }
                else if (!splitnum) splitnum=""

                if(!curranimlist[`${currsplit}${splitnum}`]){
                    curranimlist[`${currsplit}${splitnum}`] = []
                }
                if(!curranim.name.includes("Down")){
                    curranimlist[`${currsplit}${splitnum}`].push(curranim.name)
                }
                
            });
            Object.keys(curranimlist).forEach(keys => {
                curranimlist[keys]= curranimlist[keys].sort((a,b)=>{
                    var sortarray = [
                        "Pre",
                        "Begin",
                        "Start",
                        "Idle",
                        "",
                        "Loop",
                        "End",
                        "Die"
                    ]
                    var anum = 0
                    var bnum = 0
                    for(i=0;i<sortarray.length;i++){
                        // console.log(sortarray[i])
                        if(sortarray[i]==""){
                            var isAfree = true
                            var isBfree = true
                            for(j=0;j<sortarray.length;j++){
                                if(sortarray[j]!=""){
                                    if(a.includes(sortarray[j]))isAfree=false
                                    if(b.includes(sortarray[j]))isBfree=false
                                }
                            }
                            if (isAfree) anum += 4
                            if (isBfree) bnum += 4
                        }else{
                            if(a.includes(sortarray[i]))anum+=i+1
                            if(b.includes(sortarray[i]))bnum+=i+1
                        }
                    }
                    return anum - bnum
                    
                })
                // curranimlist[keys].forEach(element => {
                //     if(curranimlist[keys].length>=2&&(element.includes("Loop")||element.includes("Idle"))){
                //         console.log(element)
                //         element = [element,5]
                //     }
                // });
                if(curranimlist[keys].find(search=>search.includes("End"))){
                    if(anim.find(search=>search.name.includes("Idle_Charge"))) curranimlist[keys].push("Idle_Charge")
                    else curranimlist[keys].push("Idle")
                }
                if(curranimlist[keys].find(search=>search.includes("Die"))){
                    if(anim.find(search=>search.name.includes("Start"))) curranimlist[keys].push("Start")
                }
                for(i=0;i<curranimlist[keys].length;i++){
                    var filterarray = [
                        "Pre",
                        "Begin",
                        "Start",
                        "Idle",
                        "Loop",
                        "End",
                        "Die"
                    ]
                    var iscomp = true
                    if (curranimlist[keys].length>=2&&(curranimlist[keys][i].includes("Loop")||curranimlist[keys][i].includes("Idle"))&&!curranimlist[keys][i].includes("End")) iscomp = false
                    else{
                        iscomp = false
                        filterarray.forEach(element => {
                            if(curranimlist[keys][i].includes(element)) iscomp = true
                        });
                    }
                    if(!iscomp){
                        // console.log(curranimlist[keys][i])
                        var currvariable = anim.find(search=> search.name == curranimlist[keys][i])
                        // console.log(currvariable)
                        // console.log("Got "+ Math.round(8/currvariable.duration))
                        if(curranimlist[keys][i].includes("Idle")){
                            if(Math.round(3/currvariable.duration)>3)curranimlist[keys][i] = [curranimlist[keys][i],Math.round(3/currvariable.duration)]
                        }else{
                            curranimlist[keys][i] = [curranimlist[keys][i],Math.round(8/currvariable.duration)]
                        }
                        
                    }
                }
            });

            
        }
        console.log(curranimlist)
        return curranimlist
    }

    function GetAnimationIndex(anim,name){
        
        return anim.map(function(e) { return e.name; }).indexOf(name)
    }