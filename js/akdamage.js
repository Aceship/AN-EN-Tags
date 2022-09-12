
$.holdReady(true);
const jsonList = {
    chars           :"./json/gamedata/zh_CN/gamedata/excel/character_table.json",
    charsTL         :"./json/tl-akhr.json",
    classesTL       :"./json/tl-type.json",
    tagsTL          :"./json/tl-tags.json",
    dataconst       :"./json/gamedata/zh_CN/gamedata/excel/gamedata_const.json",
    genderTL        :"./json/tl-gender.json",
    skills          :"./json/gamedata/zh_CN/gamedata/excel/skill_table.json",
    skillsTL        :"./json/ace/tl-skills.json",
    range           :"./json/gamedata/zh_CN/gamedata/excel/range_table.json",
    atkType         :"./json/tl-attacktype.json",
    unreadableTL    :"./json/tl-unreadablename.json",
    potsTL          :"./json/tl-potential.json",
    talentsTL       :"./json/ace/tl-talents.json",
    campdata        :"./json/tl-campdata.json",
    enemyData       :"./json/gamedata/zh_CN/gamedata/excel/enemy_handbook_table.json",
    enemyStats      :"./json/gamedata/en_US/gamedata/levels/enemydata/enemy_database.json",
    enemyTL         :"./json/gamedata/en_US/gamedata/excel/enemy_handbook_table.json"
};

var db = {}
LoadAllJsonObjects(jsonList).then(function(result) {
    db = result
    $.holdReady(false);
});


var opLevel = 1;
var opElite = 0;
var selectedOp;
var selectedEn;

var applyTrust = false;
if(!localStorage.getItem('applyTrusts')){
    localStorage.setItem("applyTrusts", JSON.stringify(applyTrust));
} else {
    applyTrust = JSON.parse(localStorage.getItem('applyTrusts'));
}

var isMobile = false; //initiate as false
// device detection
if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
    isMobile = true;
}

$(document).ready(function(){
    //console.log(db.chars);

    // Add listener to class tabs
    $("#classlist .nav-item").children().each(function(i){
        $(this).click(function(){
            selOpClass($(this).attr("data-opclass"));
        })
    });

    if(!localStorage.getItem('selectedOp')){
        localStorage.removeItem("selectedOp");
    } else {
        selectedOp = localStorage.getItem('selectedOp');
        $('#hideable1').show();
    }

    if(!localStorage.getItem('selectedEn')){
        localStorage.removeItem("selectedEn");
    } else {
        selectedEn = localStorage.getItem('selectedEn');
        $('#hideable1').show();
    }

    RefreshAlldata();
});

function RefreshAlldata() {
    console.log(selectedOp);
    if(selectedOp != "" && selectedOp != undefined){
        var opData = db.chars[selectedOp];
        var opDataTL = query(db.charsTL,'name_cn',opData.name,true,false);

        $("#opimage").attr("src","https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/"+selectedOp+".png");
        $("#opname").html(opDataTL.name_en);

        $('#eliteSelections').empty();
        for (var i = 0; i < opData.phases.length; i++) {
            if(i == opElite){ var active = 'active';} else { var active = '';}
            $('#eliteSelections').append(`
                <li class="nav-item">
                    <a class="nav-link ${active}" onclick="selectElite('${i}')">Elite ${i}</a>
                </li>
                `);
        }

        var maxLevel = opData.phases[opElite].attributesKeyFrames[1].level;
        $("#levelSlider").attr('max',maxLevel);
        if(opLevel > maxLevel){
            $("#levelSlider").val(maxLevel);
            $("#levelDisplay").val(maxLevel);
        }
    }
    if(selectedEn != "" && selectedEn != undefined){
        ///////////// Enemy Section ////////////

        var enemydb;
        if(selectedEn in db.enemyTL){
            enemydb = db.enemyTL[selectedEn];
        } else {
            enemydb = db.enemyData[selectedEn];
        }
        //console.log(selectedEn);
        var enemystats = query(db.enemyStats.enemies,'Key',selectedEn,true,false).Value[0].enemyData;
        //console.log(enemystats);
        //console.log(enemydb);

        $("#enimage").attr("src","img/enemy/"+selectedEn+".png");
        $("#enname").html(enemydb.name);  
    }
    RefreshStats();
}

function RefreshStats(){
    if(selectedOp != "" && selectedOp != undefined){
        var opData = db.chars[selectedOp];
        var opDataTL = query(db.charsTL,'name_cn',opData.name,true,false);
        $("#opstats-maxHp").html(statsInterpolation('maxHp',opLevel,opElite,opData));
        $("#opstats-atk").html(statsInterpolation('atk',opLevel,opElite,opData));
        $("#opstats-def").html(statsInterpolation('def',opLevel,opElite,opData));
        $("#opstats-magicResistance").html(statsInterpolation('magicResistance',opLevel,opElite,opData));
        $("#opstats-respawnTime").html(statsInterpolation('respawnTime',opLevel,opElite,opData));
        $("#opstats-cost").html(statsInterpolation('cost',opLevel,opElite,opData));
        $("#opstats-blockCnt").html(statsInterpolation('blockCnt',opLevel,opElite,opData));
        $("#opstats-baseAttackTime").html(statsInterpolation('baseAttackTime',opLevel,opElite,opData));
    }

    ///////////// Enemy Section ////////////

    if(selectedEn != "" && selectedEn != undefined){
        var enemydb;
        if(selectedEn in db.enemyTL){
            enemydb = db.enemyTL[selectedEn];
        } else {
            enemydb = db.enemyData[selectedEn];
        }
        var enemystats = query(db.enemyStats.enemies,'Key',selectedEn,true,false).Value[0].enemyData;
        $("#enstats-maxHp").html(enemystats.attributes.maxHp.m_value);
        $("#enstats-atk").html(enemystats.attributes.atk.m_value);
        $("#enstats-def").html(enemystats.attributes.def.m_value);
        $("#enstats-magicResistance").html(enemystats.attributes.magicResistance.m_value);
        $("#enstats-moveSpeed").html(enemystats.attributes.moveSpeed.m_value);
        $("#enstats-baseAttackTime").html(enemystats.attributes.baseAttackTime.m_value);
        $("#enstats-hpRecoveryPerSec").html(enemystats.attributes.hpRecoveryPerSec.m_value);
        $("#enstats-massLevel").html(enemystats.attributes.massLevel.m_value);
        if(enemystats.attributes.stunImmune.m_value){
            var stunimmune = 'True';
        } else {
            var stunimmune = 'False';
        }
        $("#enstats-stunImmune").html(stunimmune);
        $("#enstats-rangeRadius").html(enemystats.rangeRadius.m_value);
    }

    if(selectedEn != "" && selectedEn != undefined && selectedOp != "" && selectedOp != undefined){

        ////////////// Operator Calcs Section //////////////

        var opatkTime = statsInterpolation('baseAttackTime',opLevel,opElite,opData);
        var opatk = parseInt(statsInterpolation('atk',opLevel,opElite,opData));
        var opdps = opatk * (1/opatkTime);
        $("#calcs-oprawDPS").html(parseInt(opdps));

        var enkilltime = "-";
        var opdamageDealt = 0;
        if(opData.profession != "MEDIC"){
            var enHP = parseInt($("#enstats-maxHp").html());
            var enDef = parseInt($("#enstats-def").html());
            var enMRes = parseInt($("#enstats-magicResistance").html());
            var trait = getProcessedTexts('traits',opData,true)[0];
            if(trait.search("Spell") != -1){
                opdamageDealt = opatk * (1-enMRes/100);
                enkilltime = enHP / (opdamageDealt * (1/opatkTime));
            } else {
                var minDamage = opatk * 5 / 100;
                if((opatk-enDef) < minDamage){
                    opdamageDealt = minDamage;
                } else {
                    opdamageDealt = opatk - enDef;
                }
                enkilltime = enHP / (opdamageDealt * (1/opatkTime));
            }
        }
        $("#calcs-opDPS").html((opdamageDealt * (1/opatkTime)).toFixed(2));
        if(enkilltime != "-"){
            $("#calcs-enkilltime").html(enkilltime.toFixed(2));
        } else {
            $("#calcs-enkilltime").html("Infinity ");
        }
        $("#calcs-opDPH").html(opdamageDealt);

        var totalDamage = 0;
        var totalHits;
        for (var i = 1; totalDamage < enHP; i++) {
            totalDamage += opdamageDealt;
            totalHits = i;
        }
        $("#calcs-enkillhits").html(totalHits);
        ///////////////// Enemy Calcs Section ////////////////

        var enatkTime = enemystats.attributes.baseAttackTime.m_value;
        var enatk = enemystats.attributes.atk.m_value;
        var endps = enatk * (1/enatkTime);
        $("#calcs-enrawDPS").html(parseInt(endps));

        var opkilltime = "-";
        var endamageDealt = 0;
        if(enemydb.attackType != "None" || enemydb.attackType != "不攻击"){
            var opHP = parseInt($("#opstats-maxHp").html());
            var opDef = parseInt($("#opstats-def").html());
            var opMRes = parseInt($("#opstats-magicResistance").html());
            if(enemydb.attackType.search("Arts") != -1 ||enemydb.attackType.search("法术") != -1 ){
                endamageDealt = enatk * (1-opMRes/100);
                opkilltime = opHP / (endamageDealt * (1/enatkTime));
            } else {
                var minDamage = enatk * 5 / 100;
                if((enatk-opDef) < minDamage){
                    endamageDealt = minDamage;
                } else {
                    endamageDealt = enatk - opDef;
                }
                opkilltime = opHP / (endamageDealt * (1/enatkTime));
            }
        }
        $("#calcs-enDPS").html((endamageDealt * (1/enatkTime)).toFixed(2));
        $("#calcs-opkilltime").html(opkilltime.toFixed(2));
        $("#calcs-enDPH").html(endamageDealt);

        var totalDamage = 0;
        var totalHits;
        for (var i = 1; totalDamage < opHP; i++) {
            totalDamage += endamageDealt;
            totalHits = i;
        }
        $("#calcs-opkillhits").html(totalHits);
    }
}

function changeLevel(val){
    $("#levelSlider").val(val);
    $("#levelDisplay").val(val);
    opLevel = val;
    RefreshStats();
}

function selectElite(val){
    opElite = val;
    RefreshAlldata();
}

function selectOp(opID){
    localStorage.setItem("selectedOp", opID);
    selectedOp = localStorage.getItem('selectedOp');
    console.log(selectedOp);
    RefreshAlldata();
    opElite = 0;
    $("#opchoosemodal").modal('hide');
}

function selOpClass(cname){
    $("#selectedopclass").empty();

    var result 
    if(cname!=""){
        result= query(db.chars,"profession",cname,false,true);
    }else{
        result= ObjectToArray(db.chars)
        
    }
    // console.log(result.length);


    //add extra filter later
    result = result.filter(search=>{
        var searchOb = search[Object.keys(search)[0]]

        switch(searchOb.profession){
            case "TOKEN" :
            case "TRAP" : return false
        }
        return true
    })

    //add extra sort later
    result = result.sort((ak,bk)=>{
        var a = ak[Object.keys(ak)[0]]
        var b = bk[Object.keys(bk)[0]]
        //console.log(ak)
        if(a.rarity<b.rarity) return 1
        if(a.rarity>b.rarity) return -1
        if(a.appellation>b.appellation)return 1
        if(a.appellation<b.appellation)return -1
    })
    var listtype = "Grid"
    var showtype = "a"
    for (var i = 0; i < result.length; i++) {
        var html;
        // console.log(result[i])
        $.each(result[i],function(key,val){ // key = char_230_savage, val = data (obj)
            var type = query(db.classes,"type_data",val.profession);
            switch (listtype) {
                case "List":
                            html =
                            `<li class='selectop-list ak-shadow' onclick='selectOp("${key}")'>
                            <img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${key}.png'>
                            <div class='name ak-font-novecento'>${getENname(val.name)}</div>
                            <div class='rarity op-rarity-${val.rarity+1}'> 
                                ${(`<i class='fa fa-star'></i>`).repeat(val.rarity+1)}
                            </div></li>
                            `
                    break;

                case "Grid":
                            html =
                            `<li class='selectop-grid ak-shadow' onclick='selectOp("${key}")'>
                            <img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${key}.png'>
                            <div class='name ak-font-novecento ak-center'>${getENname(val.name)}</div>
                            <div class='ak-rare-${val.rarity+1}' style='height: 2px;'></div>
                            ${cname==""?`<div class='ak-showclass'><img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_${type.type_en.toLowerCase()}.png'></div>`:""}
                            ${showtype?`<div class='ak-showfaction'><img src='img/factions/${val.displayLogo.toLowerCase()}.png' title='${db.campdata[val.displayLogo]}' ></div>`:""}
                            <div class='grid-box op-rarity-${val.rarity+1}'> 
                            </div></li>
                            `

                    break;

                default:
                    break;
            }
        });
        $("#selectedopclass").append(html);
    }
    
}

function selectEnemy(id){
    localStorage.setItem("selectedEn", id);
    selectedEn = localStorage.getItem('selectedEn');
    console.log(selectedEn);
    RefreshAlldata();
    $("#enchoosemodal").modal('hide');
}

function populateEnemyList(){
    console.log(db.enemyData);
    $("#enemyList").empty();
    var html = "";
    $.each(db.enemyData,function(key,v){
        html +=
            `<li class='selectop-grid ak-shadow' onclick='selectEnemy("${key}")'>
            <img src='img/enemy/${key}.png'>
            <div class='name ak-font-novecento ak-center'>${getEnemyName(key)}</div>
            </li>
            `
    });
    $("#enemyList").html(html);
}

function getEnemyName(id){
    var enemydb;
    if(id in db.enemyTL){
        enemydb = db.enemyTL;
    } else {
        enemydb = db.enemyData;
    }

    return enemydb[id].name;
}

function getProcessedTexts(type,opdataFull,getTraitText){

    if(type == 'traits'){
        var description = opdataFull.description
        //gonna need to split on "," and "\n" and repeat it
        let descriptions = description.split(/[，(\\n)]/)
        let splitdesc = []
        // console.log("=====================")
        // console.log(descriptions)
        descriptions.forEach(element => {
            if(element){
                let muhRegex = /<@ba\.kw>(.*?)<\/>/g
                let currSpeciality = muhRegex.exec(element)
                // console.log(currSpeciality)
                let filterDesc
                if(currSpeciality){
                    splitdesc.push([element.replace(currSpeciality[0],""),currSpeciality[1]])
                }else{
                    splitdesc.push([element])
                }
            }
        });
        // console.log(splitdesc)
        // console.log("===========================")

        let splitdescTL = []
        let color = ""
        let trait = opdataFull.trait
        // console.log(trait)
        let isReplaced = false
        splitdesc.forEach(element => {
            if(element.length>1){
                let typetl = db.atkType.find(search=>search.type_cn==element.join(""))
                // if(!typetl) typetl = db.attacktype.find(search=>search.type_cn==element[1])
                if(typetl&&!color) color = typetl.type_color?typetl.type_color:undefined

                // console.log(element)
                let muhRegex = /(.*){(.*?)}(.*)/g
                let currTLconv = muhRegex.exec(typetl?typetl.type_en:element.join(""))
                if(currTLconv){
                    console.log(currTLconv)
                    var textreplace = 'Value'
                    if(trait && trait.candidates.length>1){
                        textreplace =  `<div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px">(value)</div>`
                    }else if (trait && trait.candidates.length==1) {
                        textreplace = trait.candidates[0].blackboard[0].value
                        if(currTLconv[2].includes("%")){
                            textreplace= textreplace*100 +("%")
                        }
                        isReplaced = true
                    }
                }
                let currTLconvfinal = currTLconv?currTLconv[1] + textreplace + currTLconv[3]:typetl?typetl.type_en:element.join("")
                splitdescTL.push(currTLconvfinal)
            }else{
                var typetl = db.atkType.find(search=>{
                    if(search.type_detail=="common")
                    return search.type_cn==element[0]
                })
                if(!typetl){
                    typetl = db.atkType.find(search=>search.type_cn==element.join(""))
                }
                // console.log(element.join(""))

                // console.log(typetl)
                
                if(typetl&&!color) color = typetl.type_color?typetl.type_color:undefined
                splitdescTL.push(typetl?typetl.type_en:element[0])
            }
        });
        if(trait&&!(isReplaced)){
            trait.candidates.forEach(element => {
                var imagereq = []
                    if(element.unlockCondition.level >0)
                    imagereq.push(`Lv.${element.unlockCondition.level}`)
                    if(element.unlockCondition.phase >0)
                    imagereq.push(`<img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/${element.unlockCondition.phase}.png" style="width:20px;margin-top:-5px" title="Elite ${element.unlockCondition.phase}">`)
    
                // console.log(s)
                var each = []
                element.blackboard.forEach(eachbb => {
                    each.push(`${eachbb.key} : ${eachbb.value}`)
                });
                var info = `<div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px;margin-right:3px">${ each.join(" ")}</div>
                <div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px">${imagereq.join("")}</div>`
                splitdescTL.push(info)
            });
        }
        // console.log(color)
        if(getTraitText){
            return splitdescTL;
        } else {
            return titledMaker(splitdescTL.join("</br>"),"Traits",`ak-trait-${color}`);
        }
    }

    function titledMaker (content,title,extraClass="",extraId="",extraStyle=""){
        let titledbutton = `
        <div style="padding-top:5px;display:inline-block">
        <div class=\"ak-btn-non btn-sm ak-shadow-small ak-btn ak-btn-bg btn-char  ${extraClass}\" style="text-align:left;min-width:80px;${extraStyle}" data-toggle=\"tooltip\" data-placement=\"top\" id="${extraId}">
        ${(title==""?"":`<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">${title}</a>`)}${content}</div>
        </div>`

        return titledbutton
    }
}

function statsInterpolation(key,level,elite_no,opdata,isround=true){
    var kf = [];
    $.each(opdata.phases[elite_no].attributesKeyFrames,function(j,v){
        kf[j] = v;
    });
    //console.log([kf[0].level,kf[1].level])
    //console.log([kf[0].data[key],kf[1].data[key]])
    if(kf[0].data[key] == kf[1].data[key]){
    return kf[0].data[key]
    }else {
        var pol = everpolate.linear([level],[kf[0].level,kf[1].level],[kf[0].data[key],kf[1].data[key]]);
        if(isround)
        return Math.round(pol);
            else
        return parseFloat(Math.round(pol*100))/100;
    }
    
}

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

function getENname (CNname){
    var result;
    var found = false;
    $.each(db.charsTL,function(key,val){
        if(val.name_cn.toLowerCase() == CNname.toLowerCase()){
            found = true;
            result = val.name_en;
        }
    });
    if(found){
        return result;
    } else {
        return false;
    }
}



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

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}