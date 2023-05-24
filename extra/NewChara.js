var fs = require('fs')
let charaFile = JSON.parse(fs.readFileSync("../../ArknightsGameData2/zh_CN/gamedata/excel/character_table.json","utf8"))
let charaFileJP = JSON.parse(fs.readFileSync("../../ArknightsGameData2/ja_JP/gamedata/excel/character_table.json","utf8"))
let charaFileKR = JSON.parse(fs.readFileSync("../../ArknightsGameData2/ko_KR/gamedata/excel/character_table.json","utf8"))
let akhrtlFile = JSON.parse(fs.readFileSync("../json/tl-akhr.json","utf8"))
let handbook =  JSON.parse(fs.readFileSync("../../ArknightsGameData2/zh_CN/gamedata/excel/handbook_info_table.json","utf8"))

let json = []

Object.keys(charaFile).forEach(element => {
    var currChara = charaFile[element]
    var isExist = false
    akhrtlFile.forEach(element2 => {
        if (element2.id == element){
            isExist = true;
            element2.tags = checkTag(currChara)
            element2.type = getClass(currChara)
            if(charaFileJP[element]){
                element2.name_jp = charaFileJP[element].name
            }
            if(charaFileKR[element]){
                element2.name_kr = charaFileKR[element].name
            }
        }
    });
    if(!isExist){
        var sex = getSex(element)
        if(currChara.subProfessionId.startsWith("notchar")||element.startsWith("trap")||element.startsWith("token")||currChara.isNotObtainable == true ){

        }else{
            var taglist = checkTag(currChara)
            console.log(currChara.appellation)
            json.push({
                id:element,
                name_cn:currChara.name,
                name_en:currChara.appellation,
                name_jp:"",
                name_kr:"",
                characteristic_cn: "",
                characteristic_en: "",
                characteristic_jp: "",
                characteristic_kr: "",
                camp: "",
                type: getClass(currChara),
                level: RarityConvert(currChara.rarity)+1,
                sex: sex,
                tags:  taglist,
                hidden: true,
                globalHidden:true
            })
        }
        
    }
});

function RarityConvert(tier){
    console.log(tier)
    return tier.split("_").length>1 ? parseInt(tier.split("_")[1])-1 : tier
}


function checkTag(currChara){
    var taglist = []
    if(RarityConvert(currChara.rarity)==5){
        taglist.push("高级资深干员")
    }else if(RarityConvert(currChara.rarity)==4){
        taglist.push("资深干员")
    }else if(RarityConvert(currChara.rarity)==0){
        taglist.push("支援机械")
    }

    if(currChara.position == "MELEE"){
        taglist.push("近战位")
    } else if(currChara.position == "RANGED"){
        taglist.push("远程位")
    }

    currChara.tagList.forEach(element => {
        taglist.push(element)
    });

    

    return taglist
}

function getClass(currChara){
    switch(currChara.profession){
        case ("WARRIOR"): return "近卫";
        case ("MEDIC"): return "医疗";
        case ("PIONEER"): return "先锋";
        case ("CASTER"): return "术师";
        case ("SNIPER"): return "狙击";
        case ("TANK"): return "重装";
        case ("SUPPORT"): return "辅助";
        case ("SPECIAL"): return "特种";
        default : return "";
    }
}

function getSex(name){
    var currCharaBook = handbook.handbookDict[name]
    console.log(name)
    if(currCharaBook){
        var currinfo = currCharaBook.storyTextAudio[0].stories[0].storyText.split("\n")[1].split("【性别】")[1]
        return currinfo
    }
    return null
}

json = json.sort((a,b)=>{
    var sexMultiplierA = a.sex == "女"? 1 :0
    var sexMultiplierB = b.sex == "女"? 1 :0

    var calc = 0
    calc += ((b.level-a.level) *100)
    calc += ((sexMultiplierB - sexMultiplierA) *10) 
    calc += (b.name_en > a.name_en? -1:1)
    return calc
})
json.forEach(element => {
    akhrtlFile.push(element)
});


fs.writeFile(`../json/tl-akhr.json`, JSON.stringify(akhrtlFile, null, '\t'), function (err) {
    
})