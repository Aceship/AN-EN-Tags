$.holdReady(true);
const jsonList = {
    gallerylist         :"./json/ace/gallerylist.json",
};

const story = {
    story0502 : "./json/en/story/obt/main/level_main_05-02_BEG.txt"
}
var db = {}
var db2 
LoadAllJsonObjects(jsonList).then(function(result) {
    db = result
    // storynow = readTextFile("./json/en/story/obt/main/level_main_05-02_BEG.txt")

    request({url:"./json/en/story/obt/main/level_main_05-02_BEG.txt"}).then(function(result2){
        db2 = result2
        $.holdReady(false);
    })
    
})
// .then(LoadAll(story).then(function(result2) {
//     db2 = result2
    
// }))

$(document).ready(function(){
    console.log(db)
    console.log(db2)
    // Start()
    // ListBanner()
    Check()
});

async function Check(){
    var data_txt = db2.split("\n")
    for(txt_num=0;txt_num<data_txt.length;txt_num++){

            if(data_txt[txt_num].match("^\\s+$")) //ONLY SPACE REGEX
        {
            return -1;
        }
        else if(data_txt[txt_num].match("^\\s*//.*$")) //COMMENT REGEX
        {
            return -1;
        }
        var data_command = data_txt[txt_num].match("^\\[\\s*(?:(.*)\\((.*)\\)|(?:([\\.|\\w]*)|(.*)))\\s*\\]\\s*(.*)");
        console.log(data_command)
    }
    // console.log(storynow)
}

function Start(){
    var html = []
    var html2=[]
    Object.keys(db.gallerylist).forEach(type => {
        html.push(`<li class="nav-item">
        <a class="nav-link ${type=="backgrounds"?"active":""}" style = "border:none;border-radius:2px" id="${type}-tab" data-toggle="tab" href="#${type}" role="tab" aria-controls="home" aria-selected="${type=="background"?"true":"false"}">${type.charAt(0).toUpperCase() + type.slice(1)}</a>
      </li>`)

        var imagelist= []
        db.gallerylist[type].forEach(images => {
            var namesplit = images.split("/")
            imagelist.push(`
            <a style="width:220px;margin-top:10px" onclick="ChangeImage('./img/avg/${images}')" >
            <img src="./img/smallavg/${images}" style="width:200px;margin-top:5px" title="${namesplit[namesplit.length-1]}"></img>
            </a>`)
        });
        html2.push(`
        <div class="tab-pane fade ${type=="backgrounds"?"show active":""}" style="margin-top:40px" id="${type}" role="tabpanel" aria-labelledby="${type}-tab">
            ${imagelist.join("")}
        </div>
        `)

    });
    $(`#gallerytabs`).html(html.join(""))
    $(`#gallerycontainer`).html(html2.join(""))
}
$('#to-tag').click(function() {      // When arrow is clicked
    $('body,html').animate({
        scrollTop : 0                       // Scroll to top of body
    }, 500);
});

// function ShowImages(imagename){
//     // $('#imagezoomcontainer').modal();
//     // var image = $('#tabs-opCG').children('.active').children('img').attr('src');
//     ChangeImage(imagename);
// }
function ChangeImage(src=''){
    // var namesplit = images.split("/")
    console.log(src)
    $("#imagezoom").attr("src","");
    $("#imagezoom").attr("src",src);
    $('#imagezoom').modal('handleUpdate')
    $('#imagezoomcontainer').modal("show");
}
// function ListBanner() {
    
//     CreateTenBanner2()
//     // CreateTenBanner()

//     var htmlcontent=[]
//     var htmlcontent2 = []
//     htmlcontent.push(`<div class='fg-border fg-bluefill' style="padding:30px">`)
//     for(i=0;i<db.recruitData.length;i++){
//         // console.log(db.recruitData[i])
//         var currRec= db.recruitData[i]
        
//         switch (currRec.RecruitType) {
//             case 0:
//                 var itemlisthtml = []
//                 currRec.RecruitNeed.forEach(element => {
//                     var currItem = db.itemData.find(search=>search.ID == element[0])
//                     // console.log(currItem)
//                     itemlisthtml.push(ItemBoxMaker(db.cnLang[currItem.Name],`./img/equippartsicon/item/${currItem.Icon}.png`,element[1],currItem.ItemQualityType))
//                 });
//                 // htmlcontent.push(`<div class='fg-inline'>`)
//                 // htmlcontent.push(CreateBox(`Item Required`,itemlisthtml.join(''),false))
//                 // htmlcontent.push(`<br>`)
//                 var girlListArray = []
//                 var filterRandomFull = db.recruitLibraryData.filter(search=> search.StuffType==0 && search.RandomLibraryID==currRec.FullValueRandom)
//                 var filterRandomNormal = db.recruitLibraryData.filter(search=> search.StuffType==0 && search.RandomLibraryID==currRec.NormalRandom)

//                 // console.log(filterRandomNormal)
//                 // console.log(filterRandomFull)
                
//                 var probability = db.cnLang[currRec.ProbabilityPrew].split(";")
//                 var probhtml = []
//                 probability.forEach(element => {
//                     var raritydrop = element.replace('机师','').split(',')
//                     probhtml.push(`<img class='fg-raritysubbox'style="height:30px;padding:1px" src="./img/extra/rarity/${raritydrop[0]}.png"> <div class='fg-inline fg-raritysubbox'>${raritydrop[1]}</div>`)
//                 });

//                 var rateUpGirl
//                 if(currRec.UpGirl){
//                     var upGirlList = []
//                     var currUpGirlList = currRec.UpGirl.split(";")
//                     // htmlcontent.push(`</br>Rate Up : </br>`)
//                     currUpGirlList.forEach(UpGirl => {
//                         var currgirl = db.girlData.find(search=>search.ID == UpGirl.split(",")[0])
//                         var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
//                         upGirlList.push({girl:currgirl,skin:currskin,rate:UpGirl.split(",")[1]})
//                     });

//                     var upGirlArray=[]
//                     upGirlList.forEach(element => {
//                         upGirlArray.push(`
//                         <div class='rarity-${element.girl.GirlQualityType}' style='display:inline-block;text-align:center'>
//                         ${db.cnLang[element.girl.Name]}<br>
//                         ${element.girl.EnglishName}<br>
                        
//                             <img style="height:180px;padding:1px" src="./img/equippartsicon/pilot/squarehead/${element.skin.HeadIcon_square}.png" title='${db.cnLang[element.girl.Name]} ${element.girl.EnglishName}'><br>
//                             <div class='rarity-back-${element.girl.GirlQualityType}'>${element.rate}</div>
//                         </div>
//                         `)
//                     });
                    
//                     rateUpGirl = upGirlArray.join('')
//                 }
//                 var randomNormal=[]
//                 var randomFull = []
//                 filterRandomNormal.forEach(element => {
//                     var currgirl = db.girlData.find(search=>search.ItemID == element.StuffID)
//                     if(currgirl){
//                         var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
//                         if(currgirl.ID<1000){
//                             girlListArray.push({girl:currgirl,skin:currskin})
//                         }
//                     }
//                 });
//                 girlListArray.sort((a,b)=>{
//                     return b.girl.GirlQualityType - a.girl.GirlQualityType
//                 })
                
//                 girlListArray.forEach(element => {
                    
//                     randomNormal.push(`<img class='rarity-${element.girl.GirlQualityType}' style="height:40px;padding:1px" src="./img/equippartsicon/pilot/head/${element.skin.HeadIcon}.png" title='${db.cnLang[element.girl.Name]} ${element.girl.EnglishName}'> `)
//                 });

//                 if(filterRandomFull.length>0){
//                     girlListArray = []
//                     filterRandomFull.forEach(element => {
//                         var currgirl = db.girlData.find(search=>search.ItemID == element.StuffID)
//                         if(currgirl){
//                             var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
//                             if(currgirl.ID<1000){
//                                 girlListArray.push({girl:currgirl,skin:currskin})
//                             }
//                         }
//                     });
//                     girlListArray.sort((a,b)=>{
//                         return b.girl.GirlQualityType - a.girl.GirlQualityType
//                     })
                    
//                     girlListArray.forEach(element => {
                        
//                         randomFull.push(`<img class='rarity-${element.girl.GirlQualityType}' style="height:40px;padding:1px" src="./img/equippartsicon/pilot/head/${element.skin.HeadIcon}.png" title='${db.cnLang[element.girl.Name]} ${element.girl.EnglishName}'> `)
//                     });
                    
//                 }

//                 htmlcontent.push(`
//                         <div style='text-align:center'>
//                             <div class='fg-recruitBanner-container fg-border' style='background:#00225533'>
//                                 <div class='fg-recruitBanner-name fg-thinborder fg-darkfill'>
//                                 ${db.cnLang[currRec.RecruitName]}
//                                 </div>
//                                 <div class='fg-recruitBanner-item fg-thinborder'> ${itemlisthtml.join('')}</div>
//                                 <div class='fg-recruitBanner-rate fg-thinborder'> 
//                                     <div class='fg-inline fg-raritybox'>${probhtml[0]}</div><div class='fg-inline fg-raritybox'>${probhtml[1]}</div>
//                                     <br>
//                                     <div class='fg-inline fg-raritybox'>${probhtml[2]}</div><div class='fg-inline fg-raritybox'>${probhtml[3]}</div>
//                                 </div>

//                                 <div class='fg-recruitBanner-rateuph fg-thinborder fg-darkfill'> Rate Up Girl </div>
//                                 <div class='fg-recruitBanner-rateup fg-thinborder'> ${rateUpGirl}</div>
//                                 <div class='fg-recruitBanner-randomnh fg-thinborder fg-darkfill'>Random Normal</div>
//                                 <div class='fg-recruitBanner-randomn fg-thinborder'>${randomNormal.join('')}</div>
//                                 <div class='fg-recruitBanner-randomfh fg-thinborder fg-darkfill'>Random Full Bar</div>
//                                 <div class='fg-recruitBanner-randomf fg-thinborder'>${randomFull.join('')}</div>
//                             </div>
//                         </div>
//                 `)
//                 break;
//             case 1:
//                 var islimited=0;
//                 var mechPartsHtml= []
//                 var itemlisthtml = []
//                 currRec.RecruitNeed.forEach(element => {
//                     var currItem = db.itemData.find(search=>search.ID == element[0])
//                     // console.log(currItem)
//                     islimited+=1
//                     if(element[1]==20){
//                         islimited=0
//                     }
                    
//                     itemlisthtml.push(ItemBoxMaker(db.cnLang[currItem.Name],`./img/equippartsicon/item/${currItem.Icon}.png`,element[1],currItem.ItemQualityType))
//                 });

//                 var filterRandomFull = db.recruitLibraryData.filter(search=> search.StuffType==1 && search.RandomLibraryID==currRec.FullValueRandom)
//                 var filterRandomNormal = db.recruitLibraryData.filter(search=> search.StuffType==1 && search.RandomLibraryID==currRec.NormalRandom)

//                 var probhtml=[]
//                 var probability = db.cnLang[currRec.ProbabilityPrew].split(";")
//                 probability.forEach(element => {
//                     var raritydrop = element.replace(/\n/g, "<br />");
//                     raritydrop=raritydrop.replace("111111","").replace("1111111率率率","")

//                     probhtml.push(`${raritydrop}<br>`)
//                 });
//                 var suitListArray = []
//                 if(currRec.GirlList){
//                     var suitList = currRec.GirlList.split(",")
//                     console.log(suitList)
//                     suitList.forEach(element => {
//                         var suitCheck = element.split(";")
//                         console.log(suitCheck)
//                         var suitCheck2 = suitCheck[1]?suitCheck[1]:suitCheck[0]
//                         var currgirl = db.girlData.find(search=>search.SuitID == suitCheck2)
//                         if(currgirl){
//                             var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
//                             if(currskin&&currskin.MachineArmorModel1[1]){
//                                 var currSuitData = db.equipLegData.find(search=>search.ID ==currskin.MachineArmorModel1[1])
//                                 var currSuit = db.suitData.find(search=>search.ID ==currgirl.SuitID)
//                                 // console.log(currSuit)
//                                 suitListArray.push(`<img style="height:120px;padding:1px" src="./img/equippartsicon/preview/leg/${currSuitData.preview1}.png" title='${db.cnLang[currSuit.SuitName]}'>`)
//                             }
//                         }
//                     });
//                 }

//                 var randomNormal= []
//                 var randomFull = []
//                 filterRandomNormal.forEach(element => {
//                     var currwidget = db.widgetData.find(search=> search.ID==element.StuffID )
//                     randomNormal.push(`<img style="height:40px;padding:1px" src="./img/equippartsicon/${EquipType(currwidget.EquipType)}/${currwidget.Icon}.png" title='${db.cnLang[currwidget.Name]}'> `)
//                 });
//                 if(filterRandomFull.length>0){
//                     filterRandomFull.forEach(element => {
//                         var currwidget = db.widgetData.find(search=> search.ID==element.StuffID )

//                         randomFull.push(`<img style="height:40px;padding:1px" src="./img/equippartsicon/${EquipType(currwidget.EquipType)}/${currwidget.Icon}.png" title='${db.cnLang[currwidget.Name]}'> `)
//                     });
//                 }

//                 var checkTime = db.tenRecruitTimeData.find(search=>search.LibraryID==currRec.ID)
                
                
//                 console.log(checkTime)
//                 mechPartsHtml.push(`
//                 <div style='text-align:center'>
//                     <div class='fg-mechDevBanner-container fg-border' style='background:#00225533'>
//                         <div class='fg-mechDevBanner-name fg-thinborder fg-darkfill'>${db.cnLang[currRec.RecruitName]}</div>
//                         <div class='fg-mechDevBanner-item'> <div class='fg-centered'>${itemlisthtml.join('')}</div></div>
//                         <div class='fg-mechDevBanner-rate'>  ${probhtml.join('')}</div>
//                         <div class='fg-mechDevBanner-random'>  
                            
//                 `)
//                 if(checkTime){
//                     var openTime = new Date(checkTime.AndOpenTime)
//                     var closeTime = new Date(checkTime.AndCloseTime)
//                     mechPartsHtml.push(`<div class='fg-mechDevBanner-time fg-darkfill fg-thinborder'>${formatDate(openTime)} - ${formatDate(closeTime)}</div>`)
//                 }

//                 if(randomFull.length>0){
//                     mechPartsHtml.push(`
//                             <div class='fg-mechDevBanner-split-container' >
//                                 <div class='fg-mechDevBanner-split-randomnh fg-thinborder fg-darkfill'> Random Normal</div>
//                                 <div class='fg-mechDevBanner-split-randomn fg-thinborder'> ${randomNormal.join('')}</div>
//                                 <div class='fg-mechDevBanner-split-randomfh fg-thinborder fg-darkfill'> Random Full Bar</div>
//                                 <div class='fg-mechDevBanner-split-randomf fg-thinborder'> ${randomFull.join('')}</div>
//                             </div>
//                     `)
//                 }else{
//                     mechPartsHtml.push(`
//                                 <div class='fg-mechDevBanner-special fg-thinborder'> ${suitListArray.join('')}</div>
//                                 <div class='fg-mechDevBanner-random fg-thinborder fg-mechDevBanner-extrapadding'> ${randomNormal.join('')}</div>
//                     `)
//                 }
//                 mechPartsHtml.push(`     
//                         </div>
//                     </div>
//                 </div>
//                 `)
                
//                 htmlcontent2.push({ID:currRec.ID,limited:islimited,html:mechPartsHtml})
//                 break;
//             default:
//                 break;
//         }
        
       
//     }
//     htmlcontent.push(`</div>`)
//     $("#recruitpull").html(htmlcontent.join(""))

//     var sortedTime = []

//     // console.log(htmlcontent2)
//     htmlcontent2 = htmlcontent2.sort((a,b)=>{
//         var sorter = 0
//         if(a.limited>b.limited) sorter= 1
//         if(a.limited<b.limited) sorter= -1

//         return sorter
//     } )
//     // console.log(htmlcontent2)
//     db.tenRecruitTimeData.forEach(timedata => {
//         var openTime = new Date(timedata.AndOpenTime)
//         var closeTime = new Date(timedata.AndCloseTime)
//         var timeState = openTime<= Date.now()? closeTime> Date.now()?'Ongoing':'Finished' :'Upcoming'

//         console.log(`Schedule: ${openTime.toLocaleDateString()} - ${closeTime.toLocaleDateString()} ` +timeState)
//         sortedTime.push({openTime:openTime,closeTime:closeTime,timeState:timeState,detail:timedata})
//     });

//     sortedTime = sortedTime.sort((a,b)=> b.openTime-a.openTime)
//     // console.log(sortedTime)

//     var usedUpHtml = []
//     var htmlFinished =[]
//     var htmlOngoing =[]
//     var htmlUpcoming = []
//     sortedTime.forEach(timeEvent => {
//         // var htmlcontent =[]
//         var timedata = timeEvent.detail
//         if(timedata.RecruitActivityType==2){
//             var recruitsData = htmlcontent2.find(search=>search.ID==timedata.LibraryID)
//             console.log(recruitsData)
//             switch (timeEvent.timeState) {
//                 case 'Ongoing': htmlOngoing.push(recruitsData.html.join(''));break;
//                 case 'Finished': htmlFinished.push(recruitsData.html.join(''));break;
//                 case 'Upcoming': htmlUpcoming.push(recruitsData.html.join(''));break;
//                 default:
//                     break;
//             }
//             usedUpHtml.push(recruitsData.ID)
//         }
//     })

//     // console.log(usedUpHtml)
//     var nonTimedBanner =[]
//     htmlcontent2.forEach(element => {
//         if(!usedUpHtml.includes(element.ID)){
//             nonTimedBanner.push(element.html.join(''))
//         }
//     });
    


//     var htmlCompiled = []
//     htmlCompiled.push(`<div class='fg-header fg-border' style='background:#22AA55;color:#000000;padding:10px'>Ongoing Banner</div>`)
//     htmlCompiled.push(`<div class='fg-header fg-bluefill fg-border' style='padding:10px;margin-bottom:10px'>`)
//     htmlCompiled.push(htmlOngoing.join(""))
//     htmlCompiled.push(nonTimedBanner.join(""))
//     htmlCompiled.push(`</div>`)
//     if(htmlUpcoming!=''){
//         htmlCompiled.push(`<div class='fg-header fg-border' style='background:#2255AA;color:#000000;padding:10px'>Upcoming Banner</div>`)
//     htmlCompiled.push(htmlUpcoming.join(""))
//     }
//     htmlCompiled.push(`<div class='fg-header fg-border' style='background:#AA2255;color:#000000;padding:10px'>Previous Banner</div>`)
//     htmlCompiled.push(htmlFinished.join(""))
//     $("#developpull").html(htmlCompiled.join(""))
// }

// function CreateTenBanner2(){
    
//     console.log(db.tenRecruitTimeData)

//     var sortedTime = []

//     db.tenRecruitTimeData.forEach(timedata => {
//         var openTime = new Date(timedata.AndOpenTime)
//         var closeTime = new Date(timedata.AndCloseTime)
//         var timeState = openTime<= Date.now()? closeTime> Date.now()?'Ongoing':'Finished' :'Upcoming'

//         console.log(`Schedule: ${openTime.toLocaleDateString()} - ${closeTime.toLocaleDateString()} ` +timeState)
//         sortedTime.push({openTime:openTime,closeTime:closeTime,timeState:timeState,detail:timedata})
//     });

//     sortedTime = sortedTime.sort((a,b)=> b.openTime-a.openTime)
//     console.log(sortedTime)


//     var htmlFinished =[]
//     var htmlOngoing =[]
//     var htmlUpcoming = []
    
//     sortedTime.forEach(timeEvent => {
//         var htmlcontent =[]
//         var timedata = timeEvent.detail
//         if(timedata.RecruitActivityType==1){
//             var recruitsData = db.tenRecruitData.filter(search=>search.TenRecruitID==timedata.LibraryID)
//             console.log(recruitsData)
//             if(recruitsData){
                
//                 var openTime = timeEvent.openTime
//                 var closeTime = timeEvent.closeTime
//                 // console.log(openTime.toLocaleDateString())
                
//                 var tenBanner=[]
//                 for(i=0;i<recruitsData.length;i++){
//                     var currRec= recruitsData[i]
//                     var girlListArray = []
//                     var filterRandomTen = db.recruitLibraryData.filter(search=> search.StuffType==0 && search.RandomLibraryID==currRec.TenRandomLibraryID)
//                     var filterRandomNormal = db.recruitLibraryData.filter(search=> search.StuffType==0 && search.RandomLibraryID==currRec.RandomLibraryID)
//                     // console.log(filterRandomTen)
//                     // console.log(currRec.TenRecruitID)
//                     if(!tenBanner[currRec.TenRecruitID]){
//                         tenBanner[currRec.TenRecruitID]={}
//                         tenBanner[currRec.TenRecruitID].list=[]
//                         tenBanner[currRec.TenRecruitID].detail=[]
//                         tenBanner[currRec.TenRecruitID].total = 0
//                     }

//                     tenBanner[currRec.TenRecruitID].list.push(filterRandomTen)
//                     tenBanner[currRec.TenRecruitID].detail.push(currRec)
//                     tenBanner[currRec.TenRecruitID].total++
//                 }
//                 tenBanner.forEach(recruitData => {
//                     var mainRateUp = ''
//                     var upGirlHtml 
//                     if(recruitData.detail[0].UpGirl){
//                         var upGirlList = []
//                         var currUpGirlList = recruitData.detail[0].UpGirl.split(";")
//                         // htmlcontent.push(`</br>Rate Up : </br>`)
//                         currUpGirlList.forEach(UpGirl => {
//                             var currgirl = db.girlData.find(search=>search.ID == UpGirl.split(",")[0])
//                             var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
//                             upGirlList.push({girl:currgirl,skin:currskin,rate:UpGirl.split(",")[1]})
//                         });
            
//                         var upGirlArray=[]
                        
//                         upGirlList.forEach(element => {
//                             if(mainRateUp==''){
//                                 mainRateUp = `${db.cnLang[element.girl.Name]} ${element.girl.EnglishName}`
//                             }
//                             upGirlArray.push(`<div class='rarity-${element.girl.GirlQualityType}' style='display:inline-block;text-align:center'>
//                             ${db.cnLang[element.girl.Name]}<br>
//                             ${element.girl.EnglishName}<br>
                            
//                                 <img style="height:180px;padding:1px" src="./img/equippartsicon/pilot/squarehead/${element.skin.HeadIcon_square}.png" title='${db.cnLang[element.girl.Name]} ${element.girl.EnglishName}'><br>
//                                 <div class='rarity-back-${element.girl.GirlQualityType}'>${element.rate}</div>
//                             </div>
//                             `)
//                         });
//                         upGirlHtml = upGirlArray.join('')
//                     }
//                     var girlListHtml=[]
//                     var girlListArray = []
//                     recruitData.list[0].forEach(element => {
//                         var currgirl = db.girlData.find(search=>search.ItemID == element.StuffID)
//                         if(currgirl){
//                             var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
//                             if(currgirl.ID<1000){
//                                 girlListArray.push({girl:currgirl,skin:currskin})
//                             }
//                         }
//                     });
//                     girlListArray.sort((a,b)=>{
//                         return b.girl.GirlQualityType - a.girl.GirlQualityType
//                     })
                    
//                     girlListArray.forEach(element => {
//                         girlListHtml.push(`<img class='rarity-${element.girl.GirlQualityType}' style="height:40px;padding:1px" src="./img/equippartsicon/pilot/head/${element.skin.HeadIcon}.png" title='${db.cnLang[element.girl.Name]} ${element.girl.EnglishName}'> `)
//                     });

//                     var probability = db.cnLang[currRec.ProbabilityPrew].split(";")
//                     var probhtml = []
//                     probability.forEach(element => {
//                         var raritydrop = element.replace('机师','').split(',')
//                         probhtml.push(`<img class='fg-raritysubbox'style="height:30px;padding:1px" src="./img/extra/rarity/${raritydrop[0]}.png"> <div class='fg-inline fg-raritysubbox'>${raritydrop[1]}</div>`)
//                     });

//                     var tenpullrewards = []
//                     // console.log(recruitData)
//                     tenpullrewards.push(`<div style='display:inline-block;padding:2px'>`)
//                     for(i=0;i<recruitData.total;i++){
                        
//                         var currItem = db.itemData.find(search=>search.ID == recruitData.detail[i].TenRecruitNeed[0])
                        
//                         tenpullrewards.push(`<div class='tenpull-container shadow-thin fg-border fg-thinfill' >
//                         <div>Pull <div class="tenpull-number">${recruitData.total==i+1?(i+1)+"+":i+1}</div></div>
//                         <div style="display: inline-block;margin:auto">
//                         ${ItemBoxMaker(db.cnLang[currItem.Name],`./img/equippartsicon/item/${currItem.Icon}.png`,recruitData.detail[i].TenRecruitNeed[1],currItem.ItemQualityType)}
//                         </div>`)
//                         if(recruitData.detail[i].Award){
//                             var awardSplit = recruitData.detail[i].Award.split(",")
//                             var currReward = db.itemData.find(search=>search.ID == awardSplit[0])
//                             tenpullrewards.push(`
//                             Rewards<br>
//                             <div style="display: inline-block;margin:auto">
//                             ${ItemBoxMaker(db.cnLang[currReward.Name],`./img/equippartsicon/item/${currReward.Icon}.png`,awardSplit[1],currReward.ItemQualityType)}
//                             </div>
//                             `)
//                         }
//                         tenpullrewards.push('</div>')
//                     }

//                     htmlcontent.push(`
//                     <div class='fg-border fg-bluefill' style="padding:30px">
//                         <div style='text-align:center'>
//                             <div class='fg-tenbanner-container fg-border'  style="background:#00225533">
//                                 <div class='fg-tenbanner-name fg-darkfill fg-thinborder'>[ ${mainRateUp} ] Rate UP</div>
//                                 <div class='fg-tenbanner-time fg-darkfill fg-thinborder'>${formatDate(openTime)} - ${formatDate(closeTime)}</div>
//                                 <div class='fg-tenbanner-rate fg-thinborder fg-darkfill'>
//                                     <div class='fg-inline fg-raritybox'>${probhtml[0]}</div><div class='fg-inline fg-raritybox'>${probhtml[1]}</div>
//                                     <br>
//                                     <div class='fg-inline fg-raritybox'>${probhtml[2]}</div><div class='fg-inline fg-raritybox'>${probhtml[3]}</div>
//                                 </div>
//                                 <div class='fg-tenbanner-a fg-thinborder fg-darkfill'>Rate Up Girls</div>
//                                 <div class='fg-tenbanner-b fg-thinborder'>${upGirlHtml}</div>
//                                 <div class='fg-tenbanner-c fg-thinborder fg-darkfill'>Random List</div>
//                                 <div class='fg-tenbanner-d fg-thinborder'>${girlListHtml.join('')}</div>
                                
//                                 <div class='fg-tenbanner-tenpull fg-thinborder'>${tenpullrewards.join('')}</div>
//                             </div>
//                         </div>
//                     </div>
//                     `)

//                     htmlcontent.push(`</div><br>`)
//                 });
//             }
//         }
//         // console.log(timeEvent.timeState)
//         switch (timeEvent.timeState) {
//             case 'Ongoing': htmlOngoing.push(htmlcontent.join(""));break;
//             case 'Finished': htmlFinished.push(htmlcontent.join(""));break;
//             case 'Upcoming': htmlUpcoming.push(htmlcontent.join(""));break;
//             default:
//                 break;
//         }
//     });
//     var htmlCompiled = []
//     if (htmlOngoing!=""){
//         htmlCompiled.push(`<div class='fg-header fg-border' style='background:#22AA55;color:#000000;padding:10px'>Ongoing Banner</div>`)
//         htmlCompiled.push(htmlOngoing.join(""))
//     }
//     console.log(htmlUpcoming)
//     if(htmlUpcoming!=''){
//         htmlCompiled.push(`<div class='fg-header fg-border' style='background:#2255AA;color:#000000;padding:10px'>Upcoming Banner</div>`)
//         htmlCompiled.push(htmlUpcoming.join(""))
//     }
//     htmlCompiled.push(`<div class='fg-header fg-border' style='background:#AA2255;color:#000000;padding:10px'>Previous Banner</div>`)
//     htmlCompiled.push(htmlFinished.join(""))
//     $("#tenpull").html(htmlCompiled.join(""))
// }

// function CreateTenBanner(){
//     var htmlcontent =[]
//     var tenBanner=[]
//     for(i=0;i<db.tenRecruitData.length;i++){
//         var currRec= db.tenRecruitData[i]
//         var girlListArray = []
//         var filterRandomTen = db.recruitLibraryData.filter(search=> search.StuffType==0 && search.RandomLibraryID==currRec.TenRandomLibraryID)
//         var filterRandomNormal = db.recruitLibraryData.filter(search=> search.StuffType==0 && search.RandomLibraryID==currRec.RandomLibraryID)
//         // console.log(filterRandomTen)
//         // console.log(currRec.TenRecruitID)
//         if(!tenBanner[currRec.TenRecruitID]){
//             tenBanner[currRec.TenRecruitID]={}
//             tenBanner[currRec.TenRecruitID].list=[]
//             tenBanner[currRec.TenRecruitID].detail=[]
//             tenBanner[currRec.TenRecruitID].total = 0
//         }

//         tenBanner[currRec.TenRecruitID].list.push(filterRandomTen)
//         tenBanner[currRec.TenRecruitID].detail.push(currRec)
//         tenBanner[currRec.TenRecruitID].total++
//     }
//     console.log(tenBanner)

//     tenBanner.forEach(recruitData => {
//         htmlcontent.push(`
//         <div class='fg-border fg-bluefill' style="padding:10px">
//         `)
//         var tenpullrewards = []
//         // console.log(recruitData)
//         tenpullrewards.push(`<div style='display:inline-block;padding:2px'>`)
//         for(i=0;i<recruitData.total;i++){
            
//             var currItem = db.itemData.find(search=>search.ID == recruitData.detail[i].TenRecruitNeed[0])
//             // htmlcontent.push(ItemBoxMaker(currItem.Name,`./img/equippartsicon/item/${currItem.Icon}.png`,recruitData.detail[i].TenRecruitNeed[1],currItem.ItemQualityType))

            
//             tenpullrewards.push(`<div class='tenpull-container shadow-thin fg-border fg-thinfill' >
//             <div>Pull <div class="tenpull-number">${recruitData.total==i+1?(i+1)+"+":i+1}</div></div>
//             <div style="display: inline-block;margin:auto">
//             ${ItemBoxMaker(currItem.Name,`./img/equippartsicon/item/${currItem.Icon}.png`,recruitData.detail[i].TenRecruitNeed[1],currItem.ItemQualityType)}
//             </div>`)

//             // htmlcontent.push(`<div class='tenpull-container shadow-thin fg-border fg-thinfill'>
//             // <div>Pull <div class="tenpull-number">${recruitData.total==i+1?(i+1)+"+":i+1}</div></div>
//             // <img style="height:40px;padding:1px" src="./img/equippartsicon/item/${currItem.Icon}.png" title='${currItem.Name}'>
//             // x${recruitData.detail[i].TenRecruitNeed[1]} `)
//             if(recruitData.detail[i].Award){
//                 var awardSplit = recruitData.detail[i].Award.split(",")
//                 var currReward = db.itemData.find(search=>search.ID == awardSplit[0])
//                 tenpullrewards.push(`
//                 Rewards<br>
//                 <div style="display: inline-block;margin:auto">
//                 ${ItemBoxMaker(currReward.Name,`./img/equippartsicon/item/${currReward.Icon}.png`,awardSplit[1],currReward.ItemQualityType)}
//                 </div>
//                 `)
//                 // htmlcontent.push(`<br>
//                 // Reward<br>
//                 // <img style="height:40px;padding:1px" src="./img/equippartsicon/item/${currReward.Icon}.png" title='${currReward.Name}'>
//                 // x${awardSplit[1]}
//                 // `)
//             }
//             tenpullrewards.push('</div>')
//         }
//         htmlcontent.push(`
//         <div style='text-align:center'>
//             ${CreateBox(`10x Pull`,tenpullrewards.join(''),true,false)}
//         </div>
//         `)
//         htmlcontent.push(`</div>`)
//         var probability = currRec.ProbabilityPrew.split(";")
//         var probhtml = []
//         probability.forEach(element => {
//             var raritydrop = element.replace('机师','').split(',')
//             probhtml.push(`<img class='fg-raritysubbox'style="height:30px;padding:1px" src="./img/extra/rarity/${raritydrop[0]}.png"> <div class='fg-inline fg-raritysubbox'>${raritydrop[1]}</div>`)
//         });

//         htmlcontent.push(`<br>`)
//         htmlcontent.push(`<div style='text-align:center'>`)
//         htmlcontent.push(CreateBox('Rate Per Rarity',`
//         <div class='fg-inline fg-raritybox'>${probhtml[0]}</div><div class='fg-inline fg-raritybox'>${probhtml[1]}</div>
//         <br>
//         <div class='fg-inline fg-raritybox'>${probhtml[2]}</div><div class='fg-inline fg-raritybox'>${probhtml[3]}</div>
//         `))
//         htmlcontent.push(`</div>`)
//         if(recruitData.detail[0].UpGirl){
//             var upGirlList = []
//             var currUpGirlList = recruitData.detail[0].UpGirl.split(";")
//             // htmlcontent.push(`</br>Rate Up : </br>`)
//             currUpGirlList.forEach(UpGirl => {
//                 var currgirl = db.girlData.find(search=>search.ID == UpGirl.split(",")[0])
//                 var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
//                 upGirlList.push({girl:currgirl,skin:currskin,rate:UpGirl.split(",")[1]})
//             });

//             var upGirlArray=[]
//             upGirlList.forEach(element => {
//                 upGirlArray.push(`
//                 <div class='rarity-${element.girl.GirlQualityType}' style='display:inline-block;text-align:center'>
//                 ${element.girl.Name}<br>
//                 ${element.girl.EnglishName}<br>
                
//                     <img style="height:180px;padding:1px" src="./img/equippartsicon/pilot/squarehead/${element.skin.HeadIcon_square}.png" title='${element.girl.Name} ${element.girl.EnglishName}'><br>
//                     <div class='rarity-back-${element.girl.GirlQualityType}'>${element.rate}</div>
//                 </div>
//                 `)
//             });
//             htmlcontent.push(`</br>`)
//             htmlcontent.push(`<div style='text-align:center'>`)
//             htmlcontent.push(CreateBox(`Rate Up`,upGirlArray.join('')))
//             htmlcontent.push(`</div>`)
//         }
//         htmlcontent.push(`</br>Random List </br>`)
//         var girlListArray = []
//         recruitData.list[0].forEach(element => {
//             var currgirl = db.girlData.find(search=>search.ItemID == element.StuffID)
//             if(currgirl){
//                 var currskin = db.girlSkinData.find(search=>search.ID == currgirl.BasicSkin)
//                 if(currgirl.ID<1000){
//                     girlListArray.push({girl:currgirl,skin:currskin})
//                 }
//             }
//         });
//         girlListArray.sort((a,b)=>{
//             return b.girl.GirlQualityType - a.girl.GirlQualityType
//         })
        
//         girlListArray.forEach(element => {
            
//             htmlcontent.push(`<img class='rarity-${element.girl.GirlQualityType}' style="height:40px;padding:1px" src="./img/equippartsicon/pilot/head/${element.skin.HeadIcon}.png" title='${element.girl.Name} ${element.girl.EnglishName}'> `)
//         });
        
//         htmlcontent.push(`</div><br>`)
//     });
    
//     $("#tenpull").html(htmlcontent.join(""))
// }
// function EquipType(n){
//     switch(n){
//         case 0 : return "arm"
//         case 1 : return "body"
//         case 2 : return "leg"
//         case 3 : return "bag"
//         case 4 : return "item"
//         default: return n 
//     }
// }

// function RarityImg(n){
//     switch(n){
//         case 0 :
//         case "N" : return `<img style="height:40px;padding:1px" src="./img/equippartsicon/${EquipType(currwidget.EquipType)}/${currwidget.Icon}.png"> `
//     }
// }

// function ItemBoxMaker(titlename,imagelink,quantity = "",rarity = "",scale=50) {
//     var height = 128/100*scale;
//     var width = 128/100*scale;
//     var header = 26/100*scale;
//     var rare = QualityToRarity(rarity)
//     // console.log(rare)
//     var boxhtml = `
//     <div style="position:relative;height:${height}px;width:${width}px;margin:4px;display:inline-block">
//         <div class='rarity-back-${rarity}' style='height:${header}px;width:${width}px;position:absolute'>
//         <div class='fg-subtitlefont' style="float:right;font-size:${header}px;margin-right:2px;margin-top:-4px">${rare}</div>
//         </div>
//         <div class='rarity-${rarity}'style='height:${height}px;width:${width}px;position:absolute'><img style="width:${width}px;height:${height}px;padding:0px" src="${imagelink}" title='${titlename}' ></div>
//         <div class='fg-itemQuantityfont' style='position:absolute;text-align:right;bottom:0px;right:2px;margin:auto;display:inline-block'>${quantity?`x${quantity}`:``}</div>
//         <div class='fg-corner' style="pointer-events: none;position:relative;height:${height}px;width:${width}px;"></div>
//     </div>
//     `
//     return boxhtml
// }

// function CreateBox(header,content,inline=true,thinfill=true){
//     return `
//     <div class='${inline?'fg-inline':''}'>
//         <div class='${thinfill?'fg-thinfill':''} fg-border fg-mainbox fg-header'>
//             ${header}
//         </div>
//         <div class='${thinfill?'fg-thinfill':''} fg-border fg-mainbox'>
//             ${content}
//         </div>
//     </div>
//     `
// }

// function QualityToRarity(n){
//     switch(n){
//         case 0 : return "N"
//         case 1 : return "R"
//         case 2 : return "SR"
//         case 3 : return "SSR"
//     }
//     return ""
// }

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