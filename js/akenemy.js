    $.holdReady(true);
    var db = {};
    var d0 = $.getJSON("json/excel/building_data.json",function(data){
            db["manufactformulas"] = data.manufactFormulas;
        });
    var d1 = $.getJSON("json/excel/building_data.json",function(data){
            db["workshopformulas"] = data.workshopFormulas;
        });
    var d2 = $.getJSON("json/excel/character_table.json",function(data){
            db["chars"] = data;
        });
    var d3 = $.getJSON("json/excel/item_table.json",function(data){
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
    var d8 = $.getJSON("json/excel/gamedata_const.json",function(data){
            db["dataconst"] = data;
        });
    var d9 = $.getJSON("json/excel/enemy_handbook_table.json",function(data){
            db["enemy"] = data;
        });

    $.when(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9).then(function(){
        $.holdReady(false);
    });

    var lang;
    var reg;
    var selectedEnemy;

    $(document).ready(function(){
        // console.log(db.building_buff)
        // console.log(db.riic)
        // Object.keys(db.enemy).forEach(element => {
        //     // let currdb = [element]
        //     console.log(element)
        // });
        // console.log()

        
        // Object.keys(db.building_chars).forEach(element => {
        //     let currChara = db.building_chars[element]
        //     charaBuff[element]= []
        //     // console.log(element)
        //     currChara.buffChar.forEach(element2 => {
        //         // console.log(element2)
        //         if(element2.buffData){
        //             element2.buffData.forEach(element3 => {
        //                 if(element3.buffId){
        //                     console.log(element3.buffId)
        //                     charaBuff[element].push({"buffId":element3.buffId,"cond":element3.cond})
        //                 }
        //             });
        //             // console.log(buffId)
        //         }
        //     });
        //     // console.log(currChara.buffs)
        // });
        FilterType("BOSS")

        
        $('#to-tag').click(function() {      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });

        $('.dropdown-trigger').dropdown();
        $('[data-toggle="tooltip"]').tooltip();


        if(typeof localStorage.gameRegion === "undefined" || localStorage.gameRegion == ""|| localStorage.webLang == ""){
            console.log("game region undefined");
            localStorage.setItem("gameRegion", 'cn');
            localStorage.setItem("webLang", 'en');
            reg = "cn";
            lang = "en";
        } else {
            console.log(localStorage.webLang);
            reg = localStorage.gameRegion;
            lang = localStorage.webLang;
        }
        if(typeof localStorage.selectedEnemy === "undefined" || localStorage.selectedEnemy == ""){
            localStorage.setItem("selectedEnemy","");
        } else {
            selectedEnemy = localStorage.selectedEnemy;
            var opname = db.chars[selectedEnemy].name;
            selectOperator(opname);
        }
        $('.reg[value='+reg+']').addClass('selected');
        $('.lang[value='+lang+']').addClass('selected');
        changeUILanguage();
    });
    
    function regDropdown(el){
        localStorage.gameRegion = el.attr("value");
        $(".dropdown-item.reg").removeClass("selected");
        el.addClass("selected");   
        changeUILanguage();
    }
                
    function langDropdown(el){
        localStorage.webLang = el.attr("value");
        console.log(localStorage.webLang)
        $(".dropdown-item.lang").removeClass("selected");
        el.addClass("selected");
        changeUILanguage();
    }
    

    function FilterType(type){
        charaFilter=[]
        // let currEnemy = query(db.enemy,"enemyLevel",type,false)
        // console.log(currEnemy)
        // Object.keys(charaBuff).forEach(element => {
            // charaFilter.push()
            
            // let currChara=charaBuff[element]
            // if(currChara.find(search=> search.buffId.includes(type)))
            // charaFilter.push({"name":element,"buff": currChara})
        // });
        // Object.keys()
        // console.log(charaFilter)
        let currHtml = []
        $("#tbody-list").html("")
        
        // currHtml.push(`</div></div> `)
        // console.log(currHtml)
        $("#tbody-list").html(currHtml.join(""))
    }
    function clickBtnClear(){
        console.log(lang);
        $("#tbody-list").html("")
    }
    function populateEnemy(el){
        // console.log(el)
        if(($('#enemyResult').css("display") == "block") &&el=="Browse"){
            // console.log($('#operatorsResult').css("display") == "none" )
            $('#enemyResult').hide();
            return;
        }
        
        if(el.value != ""||el=="Browse"){
            var result = [];
            $.each(db.enemy,function(_,enemy){
                var languages = ['cn','en','jp','kr'];
                var found = false;
                if(el=="Browse"){
                    found=true;
                }else{
                    for (var i = 0; i < languages.length; i++) {
                        // var charname = eval('char.name_'+languages[i]).toUpperCase();
                        var input = el.value.toUpperCase();
                        var search = charname.search(input);
                        if(search != -1){
                            found = true;
                            break;
                        };
                    }
                }
                if(found){
                    var id = enemy.enemyId;
                    var name = enemy.name;
                    var sortId = enemy.sortId;
                    result.push({'id':id,'name':name,'sortId':sortId});
                }
            });
            // console.log(result)
            let currHtml = []
            result.sort((a,b)=> a.sortId-b.sortId)
            if(result.length > 0){
                $('#enemyResult').html("");
                $('#enemyResult').show();
                for (var i = 0; i < result.length; i++) {
                    let currEnemy = query(db.enemy,"enemyId",result[i].id)
                    let image = `<img style="height:80px;padding:1px" src="./img/enemy/${result[i].id}.png">  `
                    // console.log(currEnemy)

                    if(el=="Browse"){
                        currHtml.push(`<li class="ak-btn ak-enemy" style="display:inline-block;cursor: pointer;width:90px;margin:2px;margin-bottom:2px;padding:1px;border-radius:2px" onclick="selectEnemy('${result[i].id}')"> 
                        <div class="col-12"style="white-space: nowrap;padding:0px;text-align:center;margin:0px ">
                            <div style="position:absolute;top:-2px;left:2px;white-space: nowrap;padding:3px;padding-top:1px;padding-bottom:0px;margin:0px;background:#222">${currEnemy.enemyIndex}</div>
                            ${image}
                        </div>
                        
                        </li>`)
                    }else{
                        // $("#operatorsResult").append("<li class=\" ak-shadow-small ak-rare-"+result[i].rarity+"\"style=\"width:100%;cursor: pointer;margin-bottom:2px\" onclick=\"selectOperator('"+result[i].name_cn+"')\">"+image+result[i].nameTL+" ("+result[i].name+")"+"</li>");
                    }
                }
            }
            $("#enemyResult").append(currHtml.join(""));
            // console.log( $("#operatorsResult")  )
            $('#operatorsResult').show();
        } else {
            $('#enemyResult').html("");
            $('#enemyResult').hide();
        }
    }
    function selectEnemy(el){
        $('#enemyResult').html("");
        $('#enemyResult').hide();
        let currEnemy = query(db.enemy,"enemyId",el)
        let currHtml = []
        currHtml.push(`
        <div class="ak-c-black col">
            <div>${currEnemy.name}  ${currEnemy.enemyIndex}</div>
            
            <div><img style="height:80px;padding:1px" src="./img/enemy/${currEnemy.enemyId}.png"> </div>
            
            <div>Enemy Type : ${currEnemy.enemyLevel.charAt(0) + currEnemy.enemyLevel.slice(1).toLowerCase()}</div>
            <div>${currEnemy.enemyRace?`Enemy Race : ${currEnemy.enemyRace}`:""}</div>
            <div>Attack type : ${currEnemy.attackType}</div>
            <div>Attack : ${currEnemy.attack}</div>
            <div>Defense : ${currEnemy.defence}</div>
            <div>Endure : ${currEnemy.endure}</div>
            <div>resistance : ${currEnemy.resistance}</div>
            <div>${currEnemy.ability ?`Ability : ${currEnemy.ability}`:""}</div>
            <div>Description : ${currEnemy.description}</div>
        </div>
        
        
        `)
        $('#enemyDetail').html(currHtml)
        // console.log(el)
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

    function changeUILanguage(){
        reg = localStorage.gameRegion;
        lang = localStorage.webLang;

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
                    $("[translate-id="+text.id).html(eval('text.ui_'+lang));
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