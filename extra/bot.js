var fs = require('fs')
const { Image } = require('image-js');
// var jbinary = require('jbinary')
// if (process.argv.length <= 2) {
//     console.log("Usage: " + __filename + " path/to/directory");
//     process.exit(-1);
// }
// let exceldir = "../excel/"
// let itemdir = exceldir + "item_table.json"
// let furnituredir = exceldir + "building_data.json"
// let stagedir = exceldir+"stage_table.json"
// // let data = fs.readFileSync("./input/all.csv", 'utf8')
// let itemdetail = JSON.parse(fs.readFileSync(itemdir,"utf8"))
// let builddetail = JSON.parse(fs.readFileSync(furnituredir,"utf8"))
// let stageDetail =  JSON.parse(fs.readFileSync(stagedir,"utf8"))
// let keys = JSON.parse(fs.readFileSync("./input/tl-stagedesc.json","utf8"))

var json = {}
walk("../../Arknight-Images/avg/", function(err, results) {
    if (err) throw err;
    
    results.forEach(async results => {
        var text = results.split('\\avg\\')[1].replace(/\\/g,"/")
        var text1 = text.split('/')[0]
        var text2 = text.split('/')[1]
        // console.log(text)
        // console.log(text1)
        // console.log(text2)

        if(!json[text.split("/")[0]]) json[text.split("/")[0]]=[]
        json[text.split("/")[0]].push(text1+'/'+encodeURIComponent(text2))

        // console.log("./img/avg/"+text.replace(/\\/g,"/"));
        var currfolder = text.split("/")
        currfolder =["Arknight-Images","smallavg"].concat( currfolder.splice(currfolder.length-2,1))
        // console.log(currfolder)
        var folder= ""
        // fs.readdirSync(folder)
        for(i=0;i<currfolder.length;i++){
            
            var folder2 =currfolder[i]+"/"
            
            if(!fs.readdirSync("../../"+folder).includes(currfolder[i])){
                fs.mkdirSync(`${"../../"+folder}${currfolder[i]}`);
            // console.log(folder+currfolder[i])
            }
            folder+=currfolder[i]+"/"
            
        }
        
        await execute(text,async function(response){
            console.log(response)
            // await 
        })
    });
    // console.log(json)
    fs.writeFile(`../json/ace/gallerylist.json`, JSON.stringify(json, null, '\t'), function (err) {
        if (err) {
            return console.log(err);
        }
    })
  });

  
var fs = require('fs');
var path = require('path');
function walk(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) return done(null, results);
      file = path.resolve(dir, file);
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};

function createfolder(folder){

}
async function execute(imgname,callback) {
  console.log(imgname)
    let image = await Image.load('../../Arknight-Images/avg/'+imgname);    
    var newimage = await image.resize({ width: 200 })
     newimage.save('../../Arknight-Images/smallavg/'+imgname)
    callback('../../Arknight-Images/smallavg/'+imgname +" Clear") 
}
// // console.log(stageDetail.stages)
// // var keys = {}
// Object.keys(stageDetail.stages).forEach(element => {
//     var currentStage = stageDetail.stages[element]
//     if(currentStage.description.includes("\\n")){
//         // console.log(currentStage.description)
//         var currentreplace = currentStage.description.split("\\n")
//         // console.log(currentreplace)
//         currentreplace.forEach(keying => {
//             if(!keys[keying]){
//                 console.log(keying)
//                 keys[keying]=""
//             }
//         });
//     }
    
// });

// fs.writeFile(`./output/tl-stagedesc.json`, JSON.stringify(keys, null, '\t'), function (err) {
//     if (err) {
//         return console.log(err);
//     }
// })

// Object.keys(stageDetail.stages).forEach(element => {
//     var currentStage = stageDetail.stages[element]
//     if(currentStage.description.includes("\\n")){
//         // console.log(currentStage.description)
//         var currentreplace = currentStage.description.split("\\n")
//         // console.log(currentreplace)
//         currentreplace.forEach(keying => {
//             if(keys[keying]&&keys[keying]!=""){
                
//             }
//         });
//     }
    
// });
