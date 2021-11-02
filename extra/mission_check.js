var fs = require('fs')

var activity_table = fs.readFileSync('../json/gamedata/zh_CN/gamedata/excel/activity_table.json','utf8');
activity_table = JSON.parse(activity_table)
activity_table.missionData.forEach(element => {
    if(element.id.includes("13side")){
        console.log(element.description)
    }
    
});