var fs = require('fs')

var storysumdir = '../json/gamedata/zh_CN/gamedata/story/[uc]info/'

var storydirlist =[
    'obt/main/',
    'obt/guide/beg/'
]
fs.readdir(storysumdir+'activities',(err,files)=>{
    // console.log(files)
    files.forEach(element => {
        storydirlist.push('activities/'+element+"/")
    });
    console.log(storydirlist)   

    // storydirlist= storydirlist.sort((a,b)=>{
        
    // })
    // console.log(storydirlist)   
    let storytexts = []
    var bar = new Promise((resolve, reject) => {
        var length = 0
        storydirlist.forEach((element,index,array)=>{
            length = length + array.length
            var directory = storysumdir+element
            fs.readdir(directory, (err, files) => {
                files.forEach(file => {
                    
                    let title = file.split(".")[0]
                    let text = fs.readFileSync(directory+file,'utf8');
                    // console.log(title);
                    storytexts.push({title:title,content:text,directory:directory+file})
                    // console.log(text)
                    // console.log("")
                    if(storytexts.length == length) {
                        console.log(length)
                        resolve()
                    }
                });
            });
            // console.log(`${index} . ${array}`)
            
        })
        
    });
    
    bar.then(()=>{
        // console.log(storytexts)
        storytexts= storytexts.sort((aj,bj)=>{
            var a = aj.title
            var b = bj.title
            var sortid = 0
            if (a<b) sortid=sortid-1
            if (a>b) sortid=sortid+1
            if (a.includes("main")) sortid=sortid-200
            if (a.includes("beg")) sortid=sortid-300
            if (a.includes("activities")) sortid = sortid+10
            if (a.includes("a001")) sortid = sortid-9
            if (a.includes("act")&&b.includes("act")) {
                var num = a.split("act")[2]
                var num2 = b.split("act")[2]
                if(num&&num2){
                    num =  parseInt(num.split("d")[0])
                    num2 = parseInt(num2.split("d")[0])
                    
                    if(num < num2) sortid=sortid-10
                    if(num > num2) sortid=sortid+10
                }
            }
            return sortid
        })
        storytexts.forEach(element => {
            // console.log(element.title)
            // console.log(element.content)
        });

    })
})


// console.log(storydirlist)    
