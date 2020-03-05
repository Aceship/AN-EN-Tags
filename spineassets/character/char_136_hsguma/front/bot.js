var fs = require('fs')
// var jbinary = require('jbinary')
// if (process.argv.length <= 2) {
//     console.log("Usage: " + __filename + " path/to/directory");
//     process.exit(-1);
// }
var folders = ["build","front","back"]
folders.forEach(element => {
  var files = fs.readdirSync('./'+element+'/');
  for (var i in files) {
    if(files[i].includes(" #")){
      var split = files[i].split(".")
      var name = files[i].split(" #")[0]
      var end = split[split.length-1]
      console.log(files[i])
      fs.renameSync(files[i], name.replace(/#/g,"_")+"."+end)
    }
  }

  var files = fs.readdirSync('./');
  for (var i in files) {
    if(files[i].endsWith(".atlas.txt")){
        var name = files[i].split(".")[0]
        console.log(files[i])
        fs.renameSync(files[i], name.replace(/#/g,"_")+".atlas")
    }else if(files[i].endsWith(".skel.txt")){
      var name = files[i].split(".")[0]
      console.log(files[i])
      fs.renameSync(files[i], name.replace(/#/g,"_")+".skel")
    }else if(files[i].endsWith(".png")){
      fs.renameSync(files[i], name.replace(/#/g,"_")+".png")
    }

  }
});

// fs.writeFile(`./output/skills-tl.json`, JSON.stringify(combinedData, null, '\t'), function (err) {
//         if (err) {
//             return console.log(err);
//         }
//     })
// fs.readFile("./input/caster.csv")
// console.log(data)