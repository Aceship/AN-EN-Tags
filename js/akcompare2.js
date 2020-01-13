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
    talentsTL       :"./json/ace/tl-talents.json"
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
        var html = "<div class='opcontainer ak-shadow'><div class='removebtn float-right'>"
                +   "<a href='#' class='btn btn-info btn-sm' style='border-radius: 0px;' onclick='deleteOp("+i+")'>"
                +   "<i class='fa fa-close'></i></a></div>"
                +   "<div class='opname ak-font-novecento lp-row'>"+getENname(opData.name)+"</div>"
                +   "<div><img class='opimage ak-shadow mx-auto d-block' src='img/avatars/"+opID+"_1.png'></div>";
        html += "</div>";
        $("#slotsContainer").append(html);
    }

    $("#slotsContainer").append("<div class='opcontainer ak-shadow'><div>"
                            +   "<button type='button' data-toggle='modal' data-target='#opchoosemodal' class='mx-auto d-block' id='addoperatorbtn' style=''>"
                            +       "<i class='fa fa-plus'></i> "
                            +   "</button></div></div>");

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
    var result = query(db.chars,"profession",cname,false,true);
    //console.log(result);
    for (var i = 0; i < result.length; i++) {
        var html;
        $.each(result[i],function(key,val){ // key = char_230_savage, val = data (obj)
            html = "<li class='selectop-list ak-shadow' onclick=\'selectOp(\""+key+"\")\'>"
                    + "<img src='img/avatars/"+key+"_1.png'>"
                    + "<div class='name ak-font-novecento'>"+getENname(val.name)+"</div>"
                    + "<div class='rarity op-rarity-"+(val.rarity+1)+"'>";
            for (var i = 0; i < (val.rarity+1); i++) {
                html += "<i class='fa fa-star'></i>";
            }
            html += "</div></li>";
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