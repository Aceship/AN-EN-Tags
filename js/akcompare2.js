
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
    named_effects   :"./json/named_effects.json"
};

var db = {}
LoadAllJsonObjects(jsonList).then(function(result) {
    db = result
    $.holdReady(false);
});


var slotnum;
var opLevel = 1;
var opElite = 0;

var applyTrust = false;
if(!localStorage.getItem('applyTrusts')){
    localStorage.setItem("applyTrusts", JSON.stringify(applyTrust));
} else {
    applyTrust = JSON.parse(localStorage.getItem('applyTrusts'));
}

var showMode = false;
if(!localStorage.getItem('showMode')){
    localStorage.setItem("showMode", JSON.stringify(showMode));
} else {
    showMode = JSON.parse(localStorage.getItem('showMode'));
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
    var selectedOpList = [];
    if(!localStorage.getItem('selectedOpList')){
        localStorage.setItem('selectedOpList', JSON.stringify(selectedOpList));
    }

    RefreshSlots()


    $("#applyTrustSwitch").btnSwitch({
        Theme:'Swipe',
        ToggleState:applyTrust,
        OnCallback: function(val) {
            if(!localStorage.getItem('applyTrusts')){
                localStorage.setItem("applyTrusts", JSON.stringify(true));
            } else {
                localStorage.setItem("applyTrusts", JSON.stringify(true));
                applyTrust = JSON.parse(localStorage.getItem('applyTrusts'));
                RefreshValues();
            }
        },
        OffCallback: function (val) {
            if(!localStorage.getItem('applyTrusts')){
                localStorage.setItem("applyTrusts", JSON.stringify(false));
            } else {
                localStorage.setItem("applyTrusts", JSON.stringify(false));
                applyTrust = JSON.parse(localStorage.getItem('applyTrusts'));
                RefreshValues();
            }
        }
    });


    $("#modeSwitch").btnSwitch({
        Theme:'Swipe',
        ToggleState:showMode,
        OnText: 'Stats',
        OffText: 'Skills',
        OnCallback: function(val) {
            if(!localStorage.getItem('showMode')){
                localStorage.setItem("showMode", JSON.stringify(true));
            } else {
                localStorage.setItem("showMode", JSON.stringify(true));
                showMode = JSON.parse(localStorage.getItem('showMode'));
                $(".statsSection").show();
                $("#attributesPanel").show();
                $(".skillsSection").hide();
            }
        },
        OffCallback: function (val) {
            if(!localStorage.getItem('showMode')){
                localStorage.setItem("showMode", JSON.stringify(false));
            } else {
                localStorage.setItem("showMode", JSON.stringify(false));
                showMode = JSON.parse(localStorage.getItem('showMode'));
                $(".statsSection").hide();
                $("#attributesPanel").hide();
                $(".skillsSection").show();
            }
        }
    });
    // ListBanner()
    
});

function RefreshSlots(){
    $("#slotsContainer").empty();

    var selectedOpList = [];
    try {
        selectedOpList = JSON.parse(localStorage.getItem('selectedOpList'));
    } catch (e) {
        localStorage.setItem('selectedOpList', JSON.stringify(selectedOpList));
    }
    //console.log(selectedOpList);

    for (var i = 0; i < selectedOpList.length; i++) {
        var opID = selectedOpList[i];
        var opData = db.chars[opID];
        var html = `
            <div class='opcontainer ak-shadow'>
                <div class='removebtn float-right'>
                    <a href='#' class='btn btn-danger btn-sm' style='border-radius: 0px;' onclick='deleteOp(${i})'>
                    <i class='fa fa-close'></i></a></div>
                <div class='opname ak-font-novecento lp-row'>${getENname(opData.name)}</div>
                <div><img class='opimage ak-shadow mx-auto d-block' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${opID}.png'></div>


                <div id='slot-${i}-stats' class='statsSection' style='margin-top:42px;'>
                    <div class='lp-row light'>
                        Elite <span id='slot-${i}-elite'>1</span>
                    </div>
                    <div class='lp-row light' style='margin-top:19px;'>
                        Level <span id='slot-${i}-level'></span>
                    </div>
                    <div class='lp-row light' style='margin-top:23px;'>
                        <span id='slot-${i}-maxHP'></span>
                    </div>
                    <div class='lp-row light'>
                        <span id='slot-${i}-atk'></span>
                    </div>
                    <div class='lp-row light'>
                        <span id='slot-${i}-def'></span>
                    </div>
                    <div class='lp-row light'>
                        <span id='slot-${i}-mRes'></span>
                    </div>
                    <div class='lp-row light'>
                        <span id='slot-${i}-rTime'></span> Seconds
                    </div>
                    <div class='lp-row light'>
                        <span id='slot-${i}-cost'></span>
                    </div>
                    <div class='lp-row light'>
                        <span id='slot-${i}-block'></span>
                    </div>
                    <div class='lp-row light'>
                        <span id='slot-${i}-atkT'></span> Seconds
                    </div>
                    <div class='lp-row light'>
                        <span id='slot-${i}-dps'></span>
                    </div>
                    <div class='separator ak-shadow'></div>
                    <div class='lp-row light'>
                        <span id='slot-${i}-trust'></span>
                    </div>
                </div>

                <div id='slot-${i}-skills' class='skillsSection' style'margin-top:42px;'>
                    <div class='lp-row light'>
                        <span id='slot-${i}-traits'></span>
                    </div>
                    <div class='lp-row light'>
                        <span id='slot-${i}-skills'>(WIP)</span>
                    </div>
                </div>
            </div>
            `;
        $("#slotsContainer").append(html);
    }

    $("#slotsContainer").append("<div class='opcontainer ak-shadow'><div>"
                            +   "<button type='button' data-toggle='modal' data-target='#opchoosemodal' class='mx-auto d-block' id='addoperatorbtn' style=''>"
                            +       "<i class='fa fa-plus'></i> "
                            +   "</button></div></div>");

    if(!isMobile){
        initDragScroll();
    }
    RefreshValues();

    if(showMode){
        $(".statsSection").show();
        $("#attributesPanel").show();
        $(".skillsSection").hide();
    } else {
        $(".statsSection").hide();
        $("#attributesPanel").hide();
        $(".skillsSection").show();
    }
}

function RefreshValues(){

    var selectedOpList = [];
    try {
        selectedOpList = JSON.parse(localStorage.getItem('selectedOpList'));
    } catch (e) {
        localStorage.setItem('selectedOpList', JSON.stringify(selectedOpList));
    }

    for (var i = 0; i < selectedOpList.length; i++) {
        var opID = selectedOpList[i];
        var opData = db.chars[opID];
        var opDataTL = query(db.charsTL,'name_cn',opData.name,true,false);

        ///////////////// STATS SECTION //////////////////

        var maxElite = opData.phases.length-1;
        var elite = opElite;
        if(maxElite < elite){ elite = maxElite}
        var maxLevel = opData.phases[elite].attributesKeyFrames[1].level;
        var level = opLevel;
        if(maxLevel < level){ level = maxLevel}
        if(opElite > maxElite){ level = maxLevel}

        var statNames = ['maxHP','atk','def','mRes','rTime','cost','block','atkT','dps'];
        for (var j = 0; j < statNames.length; j++) {
            $("#slot-"+i+"-"+statNames[j]).nextAll().remove();
        }

        $("#slot-"+i+"-elite").html(elite);
        $("#slot-"+i+"-level").html(level);
        $("#slot-"+i+"-maxHP").html(statsInterpolation('maxHp',level,elite,opData));
        $("#slot-"+i+"-atk").html(statsInterpolation('atk',level,elite,opData));
        $("#slot-"+i+"-def").html(statsInterpolation('def',level,elite,opData));
        $("#slot-"+i+"-mRes").html(statsInterpolation('magicResistance',level,elite,opData));
        $("#slot-"+i+"-rTime").html(statsInterpolation('respawnTime',level,elite,opData));
        $("#slot-"+i+"-cost").html(statsInterpolation('cost',level,elite,opData));
        $("#slot-"+i+"-block").html(statsInterpolation('blockCnt',level,elite,opData));
        $("#slot-"+i+"-atkT").html(statsInterpolation('baseAttackTime',level,elite,opData));

        var buffs = getTrustBonuses(opData);
        var s = {
            maxHp:'maxHP',
            atk:'atk',
            def:'def',
            magicResistance:'mRes',
            respawnTime:'rTime',
            cost:'cost',
            blockCnt:'block',
            baseAttackTime:'atkT',
        };
        $("#slot-"+i+"-trust").empty();
        $.each(buffs,function(key,v){
            $("#slot-"+i+"-trust").html($("#slot-"+i+"-trust").html()+" "+key+" +"+v);
            if(applyTrust){
                var base = parseInt($("#slot-"+i+"-"+s[key]).html());
                $("#slot-"+i+"-"+s[key]).html(base+v);
                $("<i class='fa fa-plus-circle' style='margin-left:2px; color:lightblue'></i>").insertAfter($("#slot-"+i+"-"+s[key]));
            }
        });

        var atkTime = statsInterpolation('baseAttackTime',level,elite,opData);
        var atk = parseInt($("#slot-"+i+"-atk").html());
        var dps = atk * (1/atkTime);
        $("#slot-"+i+"-dps").html(parseInt(dps));

        //////////////////// SKILLS SECTION /////////////////////

        var traitsText = getProcessedTexts('traits',opData);
        $("#slot-"+i+"-traits").empty();
        $("#slot-"+i+"-traits").html(traitsText);

    }
    RefreshHighlight();
}

function getTrustBonuses(opdata){
    var favorData = opdata.favorKeyFrames[1].data;
    var buffs = {};
    $.each(favorData,function(key,v){
        if(v != 0){
            buffs[key] = v;
        }
    });
    return buffs;
}

function RefreshHighlight(){
    var selectedOpList = [];
    try {
        selectedOpList = JSON.parse(localStorage.getItem('selectedOpList'));
    } catch (e) {
        localStorage.setItem('selectedOpList', JSON.stringify(selectedOpList));
    }
    var statNames = ['maxHP','atk','def','mRes','rTime','cost','block','atkT','dps'];
    //console.clear();
    for (var i = 0; i < statNames.length; i++) {
        var maxVal = 0;
        var minVal = 9999;
        var slot = [];
        for (var j = 0; j < selectedOpList.length; j++) {
            $("#slot-"+j+"-"+statNames[i]).css({"font-weight":"unset","color":"white"});
            var val = parseInt($("#slot-"+j+"-"+statNames[i]).html());

            if(statNames[i] == 'rTime' || statNames[i] == 'cost' || statNames[i] == 'atkT'){
                if(val < minVal){ 
                    minVal = val;
                    slot = [j]; 
                } else if(val == minVal){
                    slot.push(j);
                }
            } else {
                if(val > maxVal){ 
                    maxVal = val;
                    slot = [j]; 
                } else if(val == maxVal){
                    slot.push(j);
                }
            }
        }
        if(slot.length > 1){
            if(selectedOpList.length > slot.length){
                for (var j = 0; j < 2; j++) {
                    $("#slot-"+slot[j]+"-"+statNames[i]).css({"font-weight":"bold","color":"lightgreen"});
                }
            }
        } else {
            $("#slot-"+slot[0]+"-"+statNames[i]).css({"font-weight":"bold","color":"lightgreen"});
        }
    }
}

function changeLevel(val){
    $("#levelSlider").val(val);
    $("#levelDisplay").val(val);
    opLevel = val;
    RefreshValues();
}

function changeElite(val){
    opElite = val;
    changeLevel(1);
    RefreshValues();
}

function selectOp(opID){
    var selectedOpList = [];
    try {
        selectedOpList = JSON.parse(localStorage.getItem('selectedOpList'));
    } catch (e) {
        localStorage.setItem('selectedOpList', JSON.stringify(selectedOpList));
    }
    if(selectedOpList.indexOf(opID) == -1){
        selectedOpList.push(opID);
        localStorage.setItem('selectedOpList', JSON.stringify(selectedOpList));
        $("#opchoosemodal").modal('hide');
        RefreshSlots();
    } else {
        alert("This Operator is already selected");
    }
}

function deleteOp(index){
    var selectedOpList = [];
    try {
        selectedOpList = JSON.parse(localStorage.getItem('selectedOpList'));
    } catch (e) {
        localStorage.setItem('selectedOpList', JSON.stringify(selectedOpList));
    }
    if(selectedOpList.length > 0){
        selectedOpList.splice(index,1);
        localStorage.setItem('selectedOpList', JSON.stringify(selectedOpList));
        RefreshSlots();
    }
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
                            <div class='ak-rare-${val.rarity+1}'></div>
                            ${cname==""?`<div class='ak-showclass'><img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/class_${type.type_en.toLowerCase()}.png'></div>`:""}
                            ${showtype&&val.displayLogo?`<div class='ak-showfaction'><img src='img/factions/${val.displayLogo.toLowerCase()}.png' title='${db.campdata[val.displayLogo]}' ></div>`:""}
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

function getProcessedTexts(type,opdataFull){
    console.log(opdataFull)
    if(type == 'traits'){
        return GetTrait(opdataFull.description,opdataFull.trait)
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

function initDragScroll(){
    const slider = document.querySelector('.right-panel');
    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('mouseup', () => {
        isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('mousemove', (e) => {
        if(!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
        //console.log(walk);
    });

}
function GetTrait(desc,trait,traitname = "Traits"){
    console.log(desc)
    console.log(trait)
    if(trait&&(trait.candidates[0].overrideDescripton||trait.candidates[0].additionalDescription)){
        var num = 1
        var tabs = []
        var contents = []
        var color 
        trait.candidates.forEach(element => {
            var imagereq = []
            if(element.unlockCondition.phase >=0)
            imagereq.push(`<img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/${element.unlockCondition.phase}.png" style="width:20px;margin:-12px 0px -6px 0px" title="Elite ${element.unlockCondition.phase}">`)
            if(element.unlockCondition.level >1)
            imagereq.push(`Lv.${element.unlockCondition.level}`)
            // console.log(s)
            var each = []
            element.blackboard.forEach(eachbb => {
                each.push(`${eachbb.key} : ${eachbb.value}`)
            });
            console.log(num)
            //<div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px;margin-right:3px;margin-bottom:2px;margin-top:2px">${each.join("</br>")}</div>
            var info =`
            <li class='nav-item' style="background:#444;">                     
                <button class='btn horiz-small nav-link ${(num!=trait.candidates.length ? '' : 'active')} equiplink' data-toggle='pill' href='#trait${num}' style="padding:0px 4px">
                ${imagereq.join(" ")}
                </button>
            </li>
            `
            var tl = GetFullTraitsTranslation(trait.candidates[trait.candidates.length-1].overrideDescripton)
            console.log(trait.candidates[trait.candidates.length-1])
            if(!tl){
                tl = GetFullTraitsTranslation(trait.candidates[trait.candidates.length-1].additionalDescription)
            }
            console.log(`Trait info : ${trait.candidates[trait.candidates.length-1].overrideDescripton}`)
            var traitdescription = ""
            var traitcolor = ""
            if(tl){
                traitdescription = tl.en
                traitcolor = tl.color
            }else{
                traitdescription = trait.candidates[trait.candidates.length-1].overrideDescripton
            }
            contents.push(`
            <div class='tab-pane container ${num!=trait.candidates.length ? '' : 'active'}' id='trait${num}'>
                ${ChangeDescriptionColor(ChangeDescriptionContent(traitdescription,element.blackboard),true)}
            </div>
            `)
            
            num +=1
            if(tl&&!color){
                color = traitcolor
            }
            if(trait.candidates.length>1){
                tabs.push(info)
            }
        });

        return titledMaker(`
        <div class="traitsection-container" id="sidemenutab-traits" style="position: relative; margin-top: 0px">
        <ul class='nav nav-pills' id='traits-tabs' style="margin: 4px 0px 0px 0px;">
        ${tabs.join("")}
        </ul>
            <div class="tab-content" id="traits-contents" style="margin: 2px 0px 2px 0px;">
            ${contents.join("")}
            </div>
        </div>
        `,traitname,`${color?`ak-trait-${color}`:""}`,"","white-space:initial;width:160px")

    }else{
        var curspec = GetFullTraitsTranslation(desc)
        console.log(`Trait info (no candid) : ${desc}`)
        if(curspec){
            var content = curspec.en
            var text = `
            ${ChangeDescriptionColor(content,true)}</br>
            
            `
            return titledMaker(text,traitname,`ak-trait-${curspec.color}`,"","white-space:initial;width:160px")
        }
        else{
            return titledMaker(ChangeDescriptionColor(desc).replace("\\n","</br>"),traitname,``,"","white-space: normal;width:160px")
        }
    }
}
function GetFullTraitsTranslation(description){
    var tl = db.atkType.full[description]
    if(tl){
        return tl
    }
    return false
}
function ChangeDescriptionColor(desc,addbackgroundcolor = false){

    desc = desc.replace(/<[$](.+?)>(.+?)<\/>/g, function(m, rtf, text) {
        let rich2 = db.named_effects.termDescriptionDict[rtf];
        if (rich2) {
            return `<span class="stathover tooltip2" style="color:#0098DC">${text}<span class="tooltiptext" style="display:inline-block"><div class="tooltipHeader">${rich2.termName}</div>${CreateTooltip(rich2.description)}</span></span>`
        }
    })
    desc = desc.replace(/<[@](.+?)>(.+?)<\/>/g, function(m, rtf, text) {
        let rich = db.dataconst.richTextStyles[rtf];
        if (rich) {
            let colorRTF = /<color=(#[0-9A-F]+)>\{0\}<\/color>/;
            if (colorRTF.test(rich)) {
                let color = colorRTF.exec(rich)[1]
                return `<span class="${addbackgroundcolor?`stat-important2`:""}" style="color:${color}">${text}</span>`
            } else {
                return rich.replace('{0}', text)
            }
        }
        
    })
    return desc
}

function CreateTooltip(desc){

    desc = desc.replace(/<[$](.+?)>(.+?)<\/>/g, function(m, rtf, text) {
        let rich2 = db.named_effects.termDescriptionDict[rtf];
        console.log(m)
        if (rich2) {
            return `<span class="stat-important tooltip3" style="color:#0098DC">${text}<span class="tooltiptext2" style="display:inline-block"><div class="tooltipHeader">${rich2.termName}</div>${CreateTooltip2(rich2.description)}</span></span>`
        }
    })
    return desc
}
function CreateTooltip2(desc){

    desc = desc.replace(/<[$](.+?)>(.+?)<\/>/g, function(m, rtf, text) {
        let rich2 = db.named_effects.termDescriptionDict[rtf];
        console.log(m)
        if (rich2) {
            return `<span class="stat-important" style="color:#0098DC">${text}</span>`
        }
    })
    return desc
}

function ChangeDescriptionContent(desc,blackboard,getNum = false){
    var num = 0
    var skill 
    if(blackboard.blackboard){
        skill = blackboard
        blackboard = skill.blackboard
    }
    console.log(desc)
    desc = desc.replace(/\{{0,1}\{([A-Z@_a-z\[\]0-9.]+)\}{0,1}:(.{1,4})\}/g, function(m, content, format) {
        for (var i = 0; i < blackboard.length; i++) {
            if (blackboard[i].key==content){
                // console.log(blackboard[i].value)
                let value = blackboard[i].value
                if (format && format.includes("%")) value = Math.round((value * 100000))/1000 + "%";
                num +=1
                return `<div class="stat-important">${value}</div>`
            }
        }
        return m
    })

    desc = desc.replace(/\{([A-Z_@a-z.0-9\[\]]+)\}/g, function(m, content) {
        for (var i = 0; i < blackboard.length; i++) {
            if (blackboard[i].key==content){
                // console.log(blackboard[i].value)
                value = blackboard[i].value
                if(skill && skill.prefabId == "skchr_angel_3"&&blackboard[i].key =='base_attack_time'){
                    value = value*2;
                    // console.log("DOUBLE!!")
                }
                num+=1
                return `<div class="stat-important">${value}</div>`
            }
        }
        return m
    })
    if(getNum){
        return {desc:desc,num:num}
    }
    return desc
    
}

function titledMaker (content,title,extraClass="",extraId="",extraStyle=""){
    let titledbutton = `
    <div style="padding-top:5px;display:inline-block">
    <div class=\"ak-btn-non btn-sm ak-shadow-small ak-btn ak-btn-bg btn-char  ${extraClass}\" style="text-align:left;min-width:80px;${extraStyle}" data-toggle=\"tooltip\" data-placement=\"top\" id="${extraId}">
    ${(title==""?"":`<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">${title}</a>`)}${content}</div>
    </div>`

    return titledbutton
}