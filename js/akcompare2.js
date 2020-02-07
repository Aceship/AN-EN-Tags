
$.holdReady(true);
const jsonList = {
    chars           :"./json/excel/character_table.json",
    charsTL         :"./json/tl-akhr.json",
    classesTL       :"./json/tl-type.json",
    tagsTL          :"./json/tl-tags.json",
    dataconst       :"./json/excel/gamedata_const.json",
    genderTL        :"./json/tl-gender.json",
    skills          :"./json/excel/skill_table.json",
    skillsTL        :"./json/ace/tl-skills.json",
    range           :"./json/excel/range_table.json",
    atkType         :"./json/tl-attacktype.json",
    unreadableTL    :"./json/tl-unreadablename.json",
    potsTL          :"./json/tl-potential.json",
    talentsTL       :"./json/ace/tl-talents.json",
    campdata        :"./json/tl-campdata.json"
};

var db = {}
LoadAllJsonObjects(jsonList).then(function(result) {
    db = result
    $.holdReady(false);
});


var slotnum;
var opLevel = 1;
var opElite = 0;

$(document).ready(function(){
    //console.log(db.chars);

    // Add listener to class tabs
    $("#classlist .nav-item").children().each(function(i){
        $(this).click(function(){
            selOpClass($(this).attr("data-opclass"));
        })
    });
    var selectedOpList = [];
    if(typeof localStorage.selectedOpList === "undefined" || localStorage.selectedOpList == ""){
        localStorage.selectedOpList = JSON.stringify(selectedOpList);
    }

    RefreshSlots()
    // ListBanner()
    
});

function RefreshSlots(){
    $("#slotsContainer").html("");

    var selectedOpList = [];
    try {
        selectedOpList = JSON.parse(localStorage.selectedOpList);
    } catch (e) {
        localStorage.selectedOpList = JSON.stringify(selectedOpList);
    }
    //console.log(selectedOpList);

    for (var i = 0; i < selectedOpList.length; i++) {
        var opID = selectedOpList[i];
        var opData = eval('db.chars.'+opID);
        var html = `
            <div class='opcontainer ak-shadow'>
                <div class='removebtn float-right'>
                    <a href='#' class='btn btn-danger btn-sm' style='border-radius: 0px;' onclick='deleteOp(${i})'>
                    <i class='fa fa-close'></i></a></div>
                <div class='opname ak-font-novecento lp-row'>${getENname(opData.name)}</div>
                <div><img class='opimage ak-shadow mx-auto d-block' src='img/avatars/${opID}_1.png'></div>


                <div id='slot-${i}-stats' style='margin-top:42px;'>
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
                </div>
            </div>
            `;
        $("#slotsContainer").append(html);
    }

    $("#slotsContainer").append("<div class='opcontainer ak-shadow'><div>"
                            +   "<button type='button' data-toggle='modal' data-target='#opchoosemodal' class='mx-auto d-block' id='addoperatorbtn' style=''>"
                            +       "<i class='fa fa-plus'></i> "
                            +   "</button></div></div>");
    initDragScroll();
    RefreshValues();
}

function RefreshValues(){

    var selectedOpList = [];
    try {
        selectedOpList = JSON.parse(localStorage.selectedOpList);
    } catch (e) {
        localStorage.selectedOpList = JSON.stringify(selectedOpList);
    }

    for (var i = 0; i < selectedOpList.length; i++) {
        var opID = selectedOpList[i];
        var opData = eval('db.chars.'+opID);

        var maxElite = opData.phases.length-1;
        var elite = opElite;
        if(maxElite < elite){ elite = maxElite}
        var maxLevel = opData.phases[elite].attributesKeyFrames[1].level;
        var level = opLevel;
        if(maxLevel < level){ level = maxLevel}

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
        var atkTime = statsInterpolation('baseAttackTime',level,elite,opData);
        var atk = parseInt($("#slot-"+i+"-atk").html());
        var dps = atk * (1/atkTime);
        $("#slot-"+i+"-dps").html(parseInt(dps));
    }
    RefreshHighlight();
}

function RefreshHighlight(){
    var selectedOpList = [];
    try {
        selectedOpList = JSON.parse(localStorage.selectedOpList);
    } catch (e) {
        localStorage.selectedOpList = JSON.stringify(selectedOpList);
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
        selectedOpList = JSON.parse(localStorage.selectedOpList);
    } catch (e) {
        localStorage.selectedOpList = JSON.stringify(selectedOpList);
    }
    if(selectedOpList.indexOf(opID) == -1){
        selectedOpList.push(opID);
        localStorage.selectedOpList = JSON.stringify(selectedOpList);
        $("#opchoosemodal").modal('hide');
        RefreshSlots();
    } else {
        alert("This Operator is already selected");
    }
}

function deleteOp(index){
    var selectedOpList = [];
    try {
        selectedOpList = JSON.parse(localStorage.selectedOpList);
    } catch (e) {
        localStorage.selectedOpList = JSON.stringify(selectedOpList);
    }
    if(selectedOpList.length > 0){
        selectedOpList.splice(index,1);
        localStorage.selectedOpList = JSON.stringify(selectedOpList);
        RefreshSlots();
    }
}

function selOpClass(cname){
    $("#selectedopclass").html("");

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
                            <img src='img/avatars/${key}_1.png'>
                            <div class='name ak-font-novecento'>${getENname(val.name)}</div>
                            <div class='rarity op-rarity-${val.rarity+1}'> 
                                ${(`<i class='fa fa-star'></i>`).repeat(val.rarity+1)}
                            </div></li>
                            `
                    break;

                case "Grid":
                            html =
                            `<li class='selectop-grid ak-shadow' onclick='selectOp("${key}")'>
                            <img src='img/avatars/${key}_1.png'>
                            <div class='name ak-font-novecento ak-center'>${getENname(val.name)}</div>
                            <div class='ak-rare-${val.rarity+1}'></div>
                            ${cname==""?`<div class='ak-showclass'><img src='img/classes/class_${eval("type.type_en").toLowerCase()}.png'></div>`:""}
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
        if(eval('v.'+key).toLowerCase() == val.toLowerCase()){
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
        if(eval('val.name_cn').toLowerCase() == CNname.toLowerCase()){
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

    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        var e = e.touches[0];
        slider.classList.add('active');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });
    slider.addEventListener('touchcancel', () => {
        isDown = false;
        slider.classList.remove('active');
    });
    slider.addEventListener('touchend', () => {
        isDown = false;
      slider.classList.remove('active');
    });
    slider.addEventListener('touchmove', (e) => {
        if(!isDown) return;
        var e = e.touches[0];
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 1.5; //scroll-fast
        slider.scrollLeft = scrollLeft - walk;
        //console.log(walk);
    });
}