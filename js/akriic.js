    $.holdReady(true);
    var db = {};
    var d0 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/building_data.json",function(data){
            db["manufactformulas"] = data.manufactFormulas;
        });
    var d1 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/building_data.json",function(data){
            db["workshopformulas"] = data.workshopFormulas;
        });
    var d2 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/character_table.json",function(data){
            db["chars"] = data;
        });
    var d3 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/item_table.json",function(data){
            db["items"] = data.items;
        });
    var d4 = $.getJSON("json/tl-akhr.json",function(data){
            db["chars2"] = data;
        });
    var d5 = $.getJSON("json/tl-type.json",function(data){
            db["classes"] = data;
        });
    var d6 = $.getJSON("json/tl-tags.json",function(data){
            db["tags"] = data;
        });
    var d7 = $.getJSON("json/akmaterial.json",function(data){
            db["itemstl"] = data;
        });
    var d8 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/gamedata_const.json",function(data){
            db["dataconst"] = data;
        });
    var d9 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/building_data.json",function(data){
            db["building_buff"] = data.buffs;
        });
    var d10 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/building_data.json",function(data){
            db["building_chars"] = data.chars;
        });
    var d11 = $.getJSON("json/ace/riic.json",function(data){
            db["riic"] = data;
        });
    var d12 = $.getJSON("json/named_effects.json",function(data){
            db["named_effects"] = data;
        });
    $.when(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11).then(function(){
        $.holdReady(false);
    });

    var lang;
    var reg;
    var reqmats = [];
    var selectedOP;
    let bufflist = []
    let bufflist2 = []
    
    let charaBuff = {}
    let charaFilter= []
    $(document).ready(function(){
        // console.log(db.building_buff)
        // console.log(db.riic)
        Object.keys(db.building_buff).forEach(element => {
            // let currdb = [element]
            let splitted = element.split("_")
            if(!bufflist.find(search=> search == splitted[0])){
                bufflist.push(splitted[0])
            }
            // console.log(splitted)
        });
        // console.log(bufflist)
        // array.forEach(element => {
        //     <button type="button" onclick="clickBtnTag(this)" class="btn btn-sm btn-secondary ak-btn btn-tag my-1 tags-qualifications button-tag" data-toggle="tooltip" data-placement="top" title="Newbie" cn-text="新手">新手</button>
        // });
        // 0: "control"
        // 1: "power"
        // 2: "manu"
        // 3: "trade"
        // 4: "workshop"
        // 5: "train"
        // 6: "dorm"
        // 7: "hire"
        // 8: "meet"
        // bufflist.forEach(element => {
        //     console.log(Object.keys(db.building_buff).filter(search=>search.includes(element)))
        // });

        bufflist2 = Object.keys(db.building_buff).filter(search=>search.includes("meet"))


        
        Object.keys(db.building_chars).forEach(element => {
            let currChara = db.building_chars[element]
            charaBuff[element]= []
            // console.log(element)
            currChara.buffChar.forEach(element2 => {
                // console.log(element2)
                if(element2.buffData){
                    element2.buffData.forEach(element3 => {
                        if(element3.buffId){
                            // console.log(element3.buffId)
                            charaBuff[element].push({"buffId":element3.buffId,"cond":element3.cond})
                        }
                    });
                    // console.log(buffId)
                }
            });
            // console.log(currChara.buffs)
        });
        
        // console.log(charaFilter)

        
        // console.log(chara)
        // chara.forEach(element => {
        //     console.log(element)
        // });
        // console.log(chara)
        
        // .forEach(element => {
        //     let splitted = element.split("_")
        //     console.log(splitted)
        // });
        
        $('#to-tag').click(function() {      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });

        $('.dropdown-trigger').dropdown();
        $('[data-toggle="tooltip"]').tooltip();


        if(!localStorage.getItem("gameRegion") || !localStorage.getItem("webLang")){
            console.log("game region undefined");
            localStorage.setItem("gameRegion", 'cn');
            localStorage.setItem("webLang", 'en');
            reg = "cn";
            lang = "en";
        } else {
            console.log(localStorage.getItem("webLang"));
            reg = localStorage.getItem("gameRegion");
            lang = localStorage.getItem("webLang");
        }

        if(!localStorage.getItem("selectedOP")){
            localStorage.removeItem("selectedOP");
        } else {
            selectedOP = localStorage.getItem("selectedOP");
            var opname = db.chars[selectedOP].name;
            // selectOperator(opname);
        }
        $('.reg[value='+reg+']').addClass('selected');
        $('.lang[value='+lang+']').addClass('selected');
        changeUILanguage();
    });

    $.getScript("js/arrive.min.js", function(){
        $(document).arrive("#regionDropdown", function(){
            $("#navitemRegion").addClass('ak-disable2');
            $("#navitemLanguage").addClass('ak-disable2');
        });
    });

    function regDropdown(el){
        localStorage.setItem("gameRegion", el.attr("value"));
        $(".dropdown-item.reg").removeClass("selected");
        el.addClass("selected");   
        changeUILanguage();
    }
                
    function langDropdown(el){
        localStorage.setItem("webLang", el.attr("value"));
        console.log(localStorage.getItem("webLang"))
        $(".dropdown-item.lang").removeClass("selected");
        el.addClass("selected");
        changeUILanguage();
    }

    function FilterType(type){
        charaFilter=[]
        var sortby
        Object.keys(charaBuff).forEach(element => {
            // charaFilter.push()
            let currChara=charaBuff[element]
            var currspecific =""
            if(currChara.find(search=> {
                // console.log(search.buffId)
                // console.log(type)
                if(currspecific =search.buffId.startsWith(type)){
                    currspecific = search.buffId
                    if(!sortby && db.building_buff[currspecific].description.includes("%"))
                        sortby = true
                }
                return search.buffId.startsWith(type)
            }))
            charaFilter.push({"name":element,"buff": currChara,"specific":currspecific})
        });
        // console.log(db.building_buff)
        console.log(charaFilter)
        charaFilter.sort((a,b)=>{
            // var acurr 
            // var bcurr
            
            var acurr = db.building_buff[a.specific]
            var bcurr = db.building_buff[b.specific]
            
            // console.log(db.building_buff[b.specific])
            
            let muhRegex = /<@cc\.vup>(.*?)<\/>/
            
            var acurrreg = muhRegex.exec(acurr.description)
            var bcurrreg = muhRegex.exec(bcurr.description)
            if(acurrreg&bcurrreg){
                var acurrNum = muhRegex.exec(acurr.description)[1]
                var bcurrNum = muhRegex.exec(bcurr.description)[1]
                let muhRegex2 = /(\d+)(%?)/ 
                var acurrNum2 = parseInt(muhRegex2.exec(acurrNum)[1])
                var bcurrNum2 = parseInt(muhRegex2.exec(bcurrNum)[1])
                return (acurrNum2 < bcurrNum2)
            }
            
            
        })

        // charaFilter.forEach(element => {
        //     var acurr = db.building_buff[element.specific]
        //     let muhRegex = /<@cc\.vup>(.*?)<\/>/
        //     var acurrNum = muhRegex.exec(acurr.description)[1]
        //     // console.log(acurrNum)
        // });
        let currHtml = []
        $("#tbody-list").empty()
        charaFilter.forEach(element => {
            let chara = db.chars[element.name]
            let charaRiic = db.building_chars[element.name]
            
            let extraInfo =""
            let extrainfo2 = ''

            GetRiicDetail(element.name)
            // console.log(element.name)
            
            currHtml.push(`<div class="row riicbody" style="">
                            <div class="riic-avatar" style="">
                                <div class="riic-avatar2">
                                    <div ><img class='riic-pic' src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${element.name}.png"></div>
                                    <div class="riic-name">${chara.appellation}</div>
                                </div>
                            </div>
                            <div class="riic-desc" style=""> ` )
            // console.log(charaRiic)
            // console.log(charaRiicTL)
            // console.log(chara)
            // if (charaRiicTL){
                element.buff.forEach((buff, i) => {
                    // console.log(buff)
                    // console.log(building_chars[element].buffChar[i] )
                    let buffId = buff.buffId;
                    let currBuff2 = db.building_buff[buffId]
                    let charaRiicTL = db.riic[buffId]
                    let clue = ''
                    let buffName = charaRiicTL?charaRiicTL.name:currBuff2.buffName
                    let description = charaRiicTL?charaRiicTL.descformat:currBuff2.description
                    let cndesc = currBuff2.description
                    let place = currBuff2.roomType.toLowerCase()
                    // console.log(place)
                    // console.log(place)

                    // console.log(currBuff2)
                    extrainfo2 = ''
                    extraInfo = ``
                    
                    if(buffId.startsWith("control")){
                        extraInfo = `<div class="btn btn-sm ak-disable ak-btn riic-type ak-riic-control" style=""><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/control.png" style="height:20px;padding-bottom:3px"> HQ </div>`
                    }else if(buffId.startsWith("power")){
                        extraInfo = `<div class="btn btn-sm ak-disable ak-btn riic-type ak-riic-power" style=""><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/power.png" style="height:20px;padding-bottom:3px"> Power </div>`
                    }else if(buffId.startsWith("manu")){
                        extraInfo = `<div class="btn btn-sm ak-disable ak-btn riic-type ak-riic-manu" style=""><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/manu.png" style="height:20px;padding-bottom:3px">Manufacture </div>`
                        let currbuff = description
                        // console.log([currBuff2.buffId])
                        // console.log(currbuff)
                        // console.log(`${description}`)
                        if(buffId.includes("prod")){
                            
                        }else if (buffId.includes("formula")){
                            let muhRegex = /<@cc\.kw>(.*?)<\/>/g
                            let muhRegex2 = /<@cc\.vup>(.*?)<\/>/g
                            let extra = muhRegex.exec(currbuff)[1]
                            let extra2 = muhRegex2.exec(currbuff)[1]
                            // console.log([extra])
                            // switch (extra) {
                            //     case "源石": console.log(["Originium"]) ;extrainfo2=`Originium ${extra2}`;break;
                            //     case "贵金属": console.log(["Gold Bar"]);extrainfo2=`Gold Bar ${extra2}`;break;
                            //     case "作战记录": console.log(["EXP Card"]);extrainfo2=`EXP Card ${extra2}`;break;
                            //     default: break;
                            // }
                        }
                    
                    }else if(buffId.startsWith("trade")){
                        extraInfo = `<div class="btn btn-sm ak-disable ak-btn riic-type ak-riic-trade" style=""><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/trade.png" style="height:20px;padding-bottom:3px"> Trading </div>`
                    }else if(buffId.startsWith("workshop")){
                        extraInfo = `<div class="btn btn-sm ak-disable ak-btn riic-type ak-riic-workshop" style=""><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/workshop.png" style="height:20px;padding-bottom:3px"> Workshop </div>`
                    }else if(buffId.startsWith("train")){
                        extraInfo = `<div class="btn btn-sm ak-disable ak-btn riic-type ak-riic-train" style=""><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/train.png" style="height:20px;padding-bottom:3px"> Training </div>`
                    }else if(buffId.startsWith("dorm")){
                        extraInfo = `<div class="btn btn-sm ak-disable ak-btn riic-type ak-riic-dorm" style=""><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/dorm.png" style="height:20px;padding-bottom:3px"> Dorm </div>`
                    }else if(buffId.startsWith("hire")){
                        extraInfo = `<div class="btn btn-sm ak-disable ak-btn riic-type ak-riic-hire" style=""><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/hire.png" style="height:20px;padding-bottom:3px"> Hiring </div>`
                    }else if(buffId.startsWith("meet")){
                        extraInfo = `<div class="btn btn-sm ak-disable ak-btn riic-type ak-riic-meet" style=""><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/meet.png" style="height:20px;padding-bottom:3px"> Meeting </div>`
    
                        if(buffId.includes("team")||buffId.includes("flag")){
                            // console.log(buffId)
                            let currbuff = cndesc
                            // console.log(cndesc)
                            // (buffId.match(/\[.+?\]/g)|| []).map(function(str) { return str.slice(1,-1).slice(1,-1)});
                            // console.log(currbuff.indexOf("<@cc.kw>"))
                            // console.log(currbuff.indexOf("<@cc.kw>"))
                            if(currbuff.indexOf("<@cc.kw>")>0){
                                
                                let muhRegex = /<@cc\.kw>(.*?)<\/>/g
                                
                                currbuff = muhRegex.exec(currbuff)[1]
                                if(buffId=="meet_spd&team[060]")
                                console.log(currbuff)
                                
                                
                                switch (currbuff) {
                                    case "莱茵生命": clue = 1;break;
                                    case "企鹅物流": clue = 2;break;
                                    case "黑钢国际": clue = 3;break;
                                    case "乌萨斯学生自治团": clue = 4;break;
                                    case "格拉斯哥帮": clue = 5;break;
                                    case "喀兰贸易": clue = 6;break;
                                    case "罗德岛制药": clue = 7;break;
                                }
                            }
                        }
                    }
                    
                    description = description.replace(/\\n/g,"<br><br>")
                    // console.log(description)
                    // description = description.replace(/<@(.+?)>(.+?)<\/>/g, function(m, rtf, text) {
                    //     // console.log(m, rtf, text);
                    //     let rich = db.dataconst.richTextStyles[rtf];
                    //     if (rich) {
                    //         let colorRTF = /<color=(#[0-9A-F]+)>\{0\}<\/color>/;
                    //         if (colorRTF.test(rich)) {
                    //             let color = colorRTF.exec(rich)[1]
                    //             return `<span style="color:${color}">${text}</span>`
                    //         } else {
                    //             return rich.replace('{0}', text)
                    //         }
                    //     }
                    // })
                    description = ChangeDescriptionColor2(description)
                    // console.log(description)
                    let req =``
                    // console.log(`Lv.${buff.cond.level}/ Elite ${buff.cond.phase}`)
                    if(buff.cond.level>1){
                        req = `Lv.${buff.cond.level}`
                    }
                    if(buff.cond.phase>0){
                        req += `<img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/${buff.cond.phase}.png" style="width:20px;height:20px" title="Elite ${buff.cond.phase}">`
                    }
                    if(req!==""){
                        req = `<div class="riic-req" style="">${req}</div>`
                    }
                    // console.log(req)     
                    var bufficon = `<img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/infrastructure/skill/${currBuff2.skillIcon}.png" style="width:40px;height:40px" title="">`
                    currHtml.push(`
                    <div class='riic-tab'>
                    <div class='riic-icon'>${bufficon}
                    ${clue?`<div class='riic-clue'><img src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/clue/${clue}-s.png" style="width:40px" title="Clue ${clue}"></div>`:""}
                    </div>
                    
                    <div class="riic-eachdesc">
                        
                            <div class='riic-desc-title riic-color-${place}' style="">${extraInfo}${req}${buffName}</div>
                                <div class='riic-desc-desc riic-color-${place}-sub'style="">
                                    ${extrainfo2==""?"":`<div style="display:inline;background:#222;padding:3px">${extrainfo2}</div>
                                <div>
                            </div>`} 
                        ${description}
                        </div>
                    </div>
                    </div>
                    
                    ` )
                });
            // }
            currHtml.push(`</div></div> `)
        });
        // console.log(currHtml)
        $("#tbody-list").html(currHtml.join(""))
    }

    function GetRiicDetail(charaname){
        let chara = db.chars[charaname]
        let charaRiic = db.building_chars[charaname]
        let charaRiicTL = db.riic[charaname]

        let detail = {}
        

    }
    function clickBtnClear(){
        console.log(lang);
        $("#tbody-list").empty()
    }
    
    function ChangeDescriptionColor2(desc,addbackgroundcolor = false){
        desc = ChangeDesc1(desc,addbackgroundcolor)
        desc = ChangeDesc2(desc)
        return desc
    }

    function CreateTooltip(desc,addbackgroundcolor = false){
        desc = ChangeDesc1(desc,addbackgroundcolor)
        desc = desc.replace(/<[$](.+?)>(.+?)<\/>/g, function(m, rtf, text) {
            let rich2 = db.named_effects.termDescriptionDict[rtf];
            console.log(m)
            if (!rich2){
                rich2 = db.dataconst.termDescriptionDict[rtf]
            }
            if (rich2) {
                return `<span class="stat-important tooltip3" style="color:#0098DC">${text}<span class="tooltiptext2" style="display:inline-block"><div class="tooltipHeader">${rich2.termName}</div>${CreateTooltip2(rich2.description)}</span></span>`
            }
        })
        return desc
    }
    function CreateTooltip2(desc,addbackgroundcolor = false){
        desc = ChangeDesc1(desc,addbackgroundcolor)
        desc = desc.replace(/<[$](.+?)>(.+?)<\/>/g, function(m, rtf, text) {
            let rich2 = db.named_effects.termDescriptionDict[rtf];
            console.log(m)
            if (!rich2){
                rich2 = db.dataconst.termDescriptionDict[rtf]
            }
            if (rich2) {
                return `<span class="stat-important" style="color:#0098DC">${text}</span>`
            }
        })
        return desc
    }

    function ChangeDesc1(desc,addbackgroundcolor = false){
        desc = desc.replace(/<[@](.+?)>(.+?)<\/>/g, function(m, rtf, text) {
            let rich = db.dataconst.richTextStyles[rtf];
            if (rich) {
                let colorRTF = /<color=(#[0-9A-F]+)>\{0\}<\/color>/;
                if (colorRTF.test(rich)) {
                    let color = colorRTF.exec(rich)[1]
                    return `<span class="${addbackgroundcolor?`stat-important2`:""}" style="color:${color}">${text}</span>`
                } else {
                    return rich.replace('{0}', text)
                }
            }else{
                return text
            }
        })
        return desc
    }
    function ChangeDesc2(desc){
        desc = desc.replace(/<[$](.+?)>(.+?)<\/>/g, function(m, rtf, text) {
            let rich2 = db.named_effects.termDescriptionDict[rtf];
            if (!rich2){
                rich2 = db.dataconst.termDescriptionDict[rtf]
            }
            if (rich2) {
                return `<span class="stathover tooltip2" style="color:#0098DC">${text}<span class="tooltiptext" style="display:inline-block"><div class="tooltipHeader">${rich2.termName}</div>${CreateTooltip(rich2.description)}</span></span>`
            }
        })
        return desc
    }
    // function 

    function query(db,key,val,single=true,returnKey=false){
        if(single){
            var result = {};
        } else {
            var result = [];
        }
        var found = false;
        $.each(db,function(key2,v){
            if(v[key].toLowerCase() == val.toLowerCase()){
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

    function changeUILanguage(){
        reg = localStorage.getItem("gameRegion");
        lang = localStorage.getItem("webLang");

        $('#display-reg').text(reg.toUpperCase())
        
        switch (lang) {
            case "en":$('#display-lang').text("English");break;
            case "cn":$('#display-lang').text("Chinese");break;
            case "jp":$('#display-lang').text("Japanese");break;
        }
        
        localStorage.setItem("gameRegion", reg);
        localStorage.setItem("webLang", lang);
        getJSONdata("ui",function(data){
            if(data.length != 0){
                $.each(data, function(i,text){
                    $("[translate-id="+text.id).html(text['ui_'+lang]);
                });
            }
        });
    }

    function getJSONdata(type, callback){
        var x = 0;
        var req = $.getJSON("json/tl-"+type+".json");
        req.done(function(response){
            callback(response);
        });
        req.fail(function(response){
            console.log("type: "+type+" fail: ");
            console.log(response);
        });
    }