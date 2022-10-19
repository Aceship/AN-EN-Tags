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
    // console.log(element)
    akhrtlFile.forEach(element2 => {
        if (element2.id == element){
            isExist = true;
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
        console.log(sex)
        if(currChara.subProfessionId.startsWith("notchar")||element.startsWith("trap")||element.startsWith("token")||currChara.isNotObtainable == true || !sex){

        }else{
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
                type: "",
                level: currChara.rarity+1,
                sex: sex,
                tags: [
                ],
                hidden: true,
                globalHidden:true
            })
        }
        
    }
});


function getSex(name){
    var currCharaBook = handbook.handbookDict[name]
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
    if (err) {
        return console.log(err);
    }
})