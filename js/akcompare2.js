
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
    console.log(selectedOpList);

    for (var i = 0; i < selectedOpList.length; i++) {
        var opID = selectedOpList[i];
        var opData = eval('db.chars.'+opID);
        var html = `
            <div class='opcontainer ak-shadow'>
                <div class='removebtn float-right'>
                    <a href='#' class='btn btn-info btn-sm' style='border-radius: 0px;' onclick='deleteOp(${i})'>
                    <i class='fa fa-close'></i></a></div>
                <div class='opname ak-font-novecento lp-row'>${getENname(opData.name)}</div>
                <div><img class='opimage ak-shadow mx-auto d-block' src='img/avatars/${opID}_1.png'></div>


                <div id='stats-${opID}'>
                    <div class='lp-row light'>
                        test
                    </div>
                    <div class='lp-row light'>
                        test
                    </div>
                    <div class='lp-row light'>
                        test
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
}