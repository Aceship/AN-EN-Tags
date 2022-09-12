$.holdReady(true);
const jsonList = {
    medal_table :"./json/gamedata/zh_CN/gamedata/excel/medal_table.json"


    //TL    
};

// const story = {
//     story0502 : "./json/en/story/obt/main/level_main_05-02_BEG.txt"
// }
var db = {}
LoadAllJsonObjects(jsonList).then(function(result) {
    db = result
    $.holdReady(false);
})

$(document).ready(function(){
    console.log(db)
    // console.log(db2)
    Start()
    // ListBanner()
});



function Start(){
    var html = ''
    $.each(db.medal_table.medalList,function(a,b){
        console.log(b.medalId)

        html +=`
        <div style='background:#222;color:#ddd;margin:5px'>
            <div style ='display:inline-flex'>
            
            <div style='background:#111;margin:auto;height:120px;width:120px;text-align:center;padding:5px'>
                <img height='110px' width='auto' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/medalicon/${b.medalId}.png'>
            </div>
            
            <div style='padding-left:5px;margin:auto'>
                <div style='background:#111;border-radius:4px;display:inline-flex;padding:5px'>
                    <b>${b.medalName}</b>
                </div>
                <br>
                <div style='background:#121212;padding:3px;margin:3px;display:inline-flex;border-radius:4px'>
                    How to get : 
                    ${b.getMethod}
                    
                </div>
                <div style='background:#1d1d1d;border-radius:4px;padding:2px;margin:5px'>
                    ${b.description}
                </div>
                
            </div>
            </div>
        </div>
        `
    })
    $('#MedalBody').html(html)
}

$('#to-tag').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});


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

// function LoadAll(obj) {
//     var result = {}
    
//     var promises = Object.entries(obj).map(function(url){
//         return readTextFile(url[1]).then(function(res){
//             result[url[0]]=res
//         }).fail(function() {
//             console.log( "error" );
//         })
//     })

//     return Promise.all(promises).then(function(){
        
//         return result
//     })
// }

function readTextFile(file)
{
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                return allText
            }
        }
    }
    rawFile.send(null);
}

let request = obj => {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(obj.method || "GET", obj.url);
        if (obj.headers) {
            Object.keys(obj.headers).forEach(key => {
                xhr.setRequestHeader(key, obj.headers[key]);
            });
        }
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        xhr.onerror = () => reject(xhr.statusText);
        xhr.send(obj.body);
    });
};


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