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
    var d15 = $.getJSON("json/tl-unreadablename.json",function(data){
            db["unreadNameTL"] = data;
        });
    $.when(d0,d1,d2,d3,d4,d5,d6,d7,d8,d15).then(function(){
        $.holdReady(false);
    });

    var lang;
    var reg;
    var reqmats = [];
    var selectedOP;
    var chosen_ops = {};

    $(document).ready(function(){
        $('#to-tag').click(function() {      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });

        $(window).click(function() {
            // $('#operatorsResult').empty();
            // $('#operatorsResult').hide();
        });
        // $('.browse-btn').click(function(event){
        //     console.log($('#operatorsResult').css("display") == "none")
        //     if($('#operatorsResult').css("display") == "none"){
        //         // console.log($('#operatorsResult'))
        //         $('#operatorsResult').hide();
        //     }
        // });
        $('#operatorsResult').click(function(event){
            event.stopPropagation();
        });
        $('#opname').click(function(event){
            event.stopPropagation();
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
        $('#opname').bind("enterKey",function(e){
            // console.log()
            populateOperators($('#opname').val(),true)
         });
         $('#opname').keyup(function(e){
             if(e.keyCode == 13)
             {
                 $(this).trigger("enterKey");
             }
         });

        if(typeof localStorage.selectedOP === "undefined" || localStorage.selectedOP == ""){
            localStorage.setItem("selectedOP","");
        } else {
            selectedOP = localStorage.selectedOP;
            var opname = db.chars[selectedOP].name;
            selectOperator(opname);
        }

        if (typeof localStorage.chosenOps !== "undefined") {
            let chosen_ids = JSON.parse(localStorage.chosenOps);
            for (let id of chosen_ids) addOperator(id);

            calculateCombined();
            calculateBreakdown();
        } else {
            localStorage.setItem("chosenOps", "[]");
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

    
    function clickBtnClear(){
        $("#opname").val("");
        $('#operatorsResult').empty();
        $('#operatorsResult').hide();
        localStorage.selectedOP = "";
        selectedOP = localStorage.selectedOP;
        $("#reqmats-container").empty();
        $("#tbody-materials").empty();
        $("#eliteReqMats").hide();
        $("#opClassImage").attr('src','');
            console.log(lang);
        $("#op-nametl").empty();
        $("#op-name").empty();
        $("#op-rarity").empty();
        $("#op-tags").empty();
        $("#opImage").attr('src','img/chara/empty.png');
        $("#opHeader").attr('src','');
        $("#opBg").attr('src','');
        $("#opGlow").attr('src','');
        $("#opBanner").attr('src','');
        $("#detail").empty();
        $("#opID").val("");
        localStorage.chosenOps = "[]";
        chosen_ops = {};
        $("#add-op").empty();
        $("#selectops-container").empty();
        $("#comb-reqmats-container").empty();
    }



    function populateOperators(el,isenter=false){
        // console.log(el)
        let inputs
        if(isenter)
            inputs = el
        else
            inputs = el.value
        if(($('#operatorsResult').css("display") == "block") &&el=="Browse"){
            // console.log($('#operatorsResult').css("display") == "none" )
            $('#operatorsResult').hide();
            return;
        }
        if(el.value != ""||el=="Browse"||isenter){
            var result = [];
            $.each(db.chars2,function(_,char){
                var languages = ['cn','en','jp','kr'];
                var found = false;
                if(el=="Browse"){
                    found=true;
                }else{
                    for (var i = 0; i < languages.length; i++) {
                        var charname = char['name_'+languages[i]].toUpperCase();
                        var unreadable = query(db.unreadNameTL,"name",char.name_en)
                        var input = inputs.toUpperCase();
                        var search = (unreadable?unreadable.name_en.toUpperCase().search(input):charname.search(input));
                        if(search != -1){
                            found = true;
                            break;
                        };
                    }
                }
                if(found){
                    // console.log(char)
                    var name_cn = char.name_cn;
                    var name = char['name_'+reg];
                    var nameTL = char['name_'+lang];
                    var unreadable = query(db.unreadNameTL,"name",char.name_en).name_en
                    var img_name = query(db.chars,"name",char.name_cn,true,true); 
                    // console.log(Object.keys(img_name))
                    var rarity = img_name[Object.keys(img_name)] ? img_name[Object.keys(img_name)].rarity + 1 : 0;
                    // console.log(rarity);
                    if(rarity!=0)
                    result.push({'name':name,'name_cn':name_cn,'name_readable':unreadable,'nameTL':nameTL,'img_name':Object.keys(img_name),rarity});
                }
            });
            // console.log(result)
            result.sort((a,b)=> b.rarity-a.rarity)
            if(result.length > 0){
                if(isenter){
                    $('#operatorsResult').hide();
                    selectOperator(result[0].name_cn)
                    return
                }
                $('#operatorsResult').empty();
                $('#operatorsResult').show();
                for (var i = 0; i < result.length; i++) {
                    let image = `<img style="height:40px;padding:2px" src="./img/avatars/${result[i].img_name}.png">  `
                    // console.log(image)
                    if(el=="Browse"){
                        image = `<img style="height:70px;padding:2px" src="./img/avatars/${result[i].img_name}.png">  `
                        $("#operatorsResult").css("max-width","100vw");
                        $("#operatorsResult").append(
                            "<li class=\"col-2 col-sm-1 ak-shadow-small ak-rare-"+result[i].rarity+"\"style=\"display:inline-block;cursor: pointer;width:75px;margin:2px;margin-bottom:2px;padding:1px;border-radius:2px\" onclick=\"selectOperator('"+result[i].name_cn+"')\">"
                            +"<div style=\"white-space: nowrap;padding:0px;text-align:center;margin:0 \">"+image+"</div>"
                            +"<div style=\"white-space: nowrap;padding:0px;text-align:center;margin:0 \">"+`${result[i].name_readable?`[${result[i].name_readable}]`:""}`+result[i].nameTL+"</div>"
                            +"</li>");
                    }else{
                        $("#operatorsResult").css("max-width","290px");
                        $("#operatorsResult").append(`<li class=" ak-shadow-small ak-rare-${result[i].rarity}"style="width:100%;cursor: pointer;margin-bottom:2px" onclick="selectOperator('${result[i].name_cn}')">${image} ${result[i].name_readable?`[${result[i].name_readable}]`:""} ${result[i].nameTL} (${result[i].name})</li>`);
                    }
                }
            }
            console.log( $("#operatorsResult")  )
            // $('#operatorsResult').show();
        } else {
            $('#operatorsResult').empty();
            $('#operatorsResult').hide();
        }
    }

    function selectOperator(opname){
        if(opname != ""){
            console.log("SELECT OPERATOR");
            console.log(opname);
            $("#opname").val("");
            $('#operatorsResult').empty();
            $('#operatorsResult').hide();
            var opdata = query(db.chars2,"name_cn",opname);
            var opclass = query(db.classes,"type_cn",opdata.type);
            console.log(opdata);
            var opdata2 = query(db.chars,"name",opdata.name_cn,true,true);
            console.log(opdata2);
            $.each(opdata2,function(key,v){
                $("#opImage").attr('src','img/portraits/'+key+'_1.png');
                // $("#opGlow").attr('src','img/ui/chara/glow-'+(opdata2[key].rarity+1)+'.png');
                $("#opHeader").attr('src','img/ui/chara/header-'+(opdata2[key].rarity+1)+'.png');
                $("#opBg").attr('src','img/ui/chara/bg-'+(opdata2[key].rarity<=2? 1:opdata2[key].rarity+1 )+'.png');
                // $("#opBanner").attr('src','img/ui/chara/banner-'+(opdata2[key].rarity<=2? 1:opdata2[key].rarity+1 )+'.png');
                $("#opID").val(key);
                localStorage.selectedOP = key;
                return false
            });
            $("#opClassImage").attr('src','img/classes/black/icon_profession_'+opclass.type_en.toLowerCase()+'_large.png');
            console.log(lang);
            $("#op-nametl").html(opdata['name_'+lang]);
            $("#op-name").html(opdata['name_'+reg]);
            $("#detail").html("<a type=\"button\" class=\"btn btn-sm ak-btn ak-shadow ak-shadow-small my-1\" style=\"background:#444444DD\"data-toggle=\"tooltip\" data-placement=\"right\" href=\"./akhrchars.html?opname="+opdata.name_en.replace(/ /g,"_")+"\">Detail</button>")
            $("#add-op").html(`<a type="button" class="btn btn-sm ak-btn ak-shadow ak-shadow-small my-1" style="background:#444444DD" onclick="addCurrentOperator()" data-toggle="tooltip" data-placement="left">Add</a>`);
            var rarity = "";
            for (var i = 0; i < opdata.level; i++) {
                rarity = rarity + " ★";
            }
            $("#op-rarity").html(rarity);
            var tags_html = [];
            $.each(opdata.tags,function(_,v){
                var tag = query(db.tags,"tag_cn",v);
                if(tag){
                    var tagReg = tag['tag_'+reg];
                    var tagTL = tag['tag_'+lang];
                    tags_html.push("<li style=\"list-style-type:none; padding-bottom: 10px;\"><button readonly type=\"button\" class=\"btn btn-sm ak-shadow-small ak-btn btn-secondary btn-char my-1\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+ tagReg +"\">" +
                            (tagReg == tagTL ? "" : '<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">'+tagReg+'</a>') +tagTL + "</button></li>");
                }
            });
            $("#op-tags").html(tags_html.join(""));

            $("#eliteReqMats").show();
            selectElite(1);
        }
    }

    var reqmats = [];
    function selectElite(num){
        console.log("SELECT ELITE");
        $("#tbody-materials").empty();
        $("#eliteDropBtn").html("Elite "+num);
        let curChara = db.chars[$("#opID").val()];
        reqmats = [];
        if(reqmats){
            if(curChara.phases[num]){
                // console.log(curChara.rarity+1)
                // console.log(db.dataconst["evolveGoldCost"][curChara.rarity][num-1])
                reqmats=([{"count":(db.dataconst["evolveGoldCost"][curChara.rarity][num-1]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                            , "id" :4001
                            ,"type":"GOLD" }])
            }
        }
        reqmats = curChara.phases[num] ? reqmats.concat(curChara.phases[num].evolveCost) : undefined;
        // console.log(reqmats)
        // console.log(reqmats)
        var html = [];
        $.each(reqmats,function(_,v){
            var itemdata = db.items[v.id];
            var itemdataTL = query(db.itemstl,"name_cn",itemdata.name);
            
            // console.log(itemdataTL)
            html.push("<li>"
                    +       "<div class=\"internal-container\" style=\"position: relative;\">"
                    +           "<div class=\"item-name\">"+itemdataTL.name_en+"</div>"
                    +           "<div class=\"item-image\">"
                    +               "<span></span>"
                    +               "<img id=\"item-image\" src=\"img/items/"+itemdata.iconId+".png\">"
                    +           "</div>"
                    +           "<img class=\"item-rarity\" src=\"img/material/bg/item-"+(itemdata.rarity+1)+".png\">"
                    +           "<div class=\"item-amount\">"+v.count+"x</div>"
                    +       "</div>"
                    +   "</li>");
        });
        $("#reqmats-container").html(html.join(""));

        calculateBreakdown();
    }

    function addOperator(key) {
        // index of chosen_ops are `${id}${level}` with level 1 for E1 or 2 for E2
        let level = key.slice(-1);
        let id = key.slice(0, -1);

        let char = db.chars[id];
        let gold = [{"id": "4001",
                     "count": db.dataconst["evolveGoldCost"][char.rarity][level - 1],
                     "type": "GOLD"}];

        if (gold[0].count > 0) {
            if (typeof char.phases[level] === "undefined")  {
                chosen_ops[key] = gold;
            } else {
                chosen_ops[key] = gold.concat(char.phases[level].evolveCost);
            }
        } else {
            chosen_ops[key] = [];
        }

        var opdata = query(db.chars2, "name_cn", db.chars[id].name);
        let name = `${opdata[`name_${lang}`]} E${level}`;

        $("#selectops-container").append(`<li><div style="display: block; padding:2px;"> ${name} ` +
                                         `<a type="button" class="btn btn-sm ak-btn ak-shadow shadow-small my-1" ` +
                                         `style="background:#444444;" op-id="${key}" ` +
                                         `onclick="rmOperator(this)"></div></li>`);

        localStorage.setItem("chosenOps", JSON.stringify(Object.keys(chosen_ops)));
    }

    function addCurrentOperator() {
        let id = localStorage.selectedOP;
        let level = $("#eliteDropBtn").text()[6];

        let key = `${id}${level}`;
        if (key in chosen_ops) return;

        addOperator(key);

        calculateCombined();
        calculateBreakdown();
    }

    function rmOperator(el) {
        delete chosen_ops[$(el).attr("op-id")];

        // remove button -> div -> li
        $(el).parent().parent().remove();

        calculateCombined();
        calculateBreakdown();

        localStorage.setItem("chosenOps", JSON.stringify(Object.keys(chosen_ops)));
    }

    var combined = [];
    function calculateCombined() {
        combined_tmp = {};
        for (let mats of Object.values(chosen_ops)) {
            for (let mat of mats) {
                if (!(mat.id in combined_tmp)) {
                    combined_tmp[mat.id] = $.extend(true, {}, mat);
                } else {
                    combined_tmp[mat.id].count += mat.count;
                }
            }
        }

        combined = Object.values(combined_tmp);
        /** TODO: fix issue
         *  After sorting, complex materials, such as Polymerization Preparation
         *  or D32 Steel have their last 3 items of the 3rd column leak in the
         *  row under.
         *  Sorting would be great, else it can become quite messy at some point
         */
/*        combined.sort(function (a, b) {
            let itemdata1 = db.items[a.id];
            let itemdataTL1 = query(db.itemstl, "name_cn", itemdata1.name);
            let itemdata2 = db.items[b.id];
            let itemdataTL2 = query(db.itemstl, "name_cn", itemdata2.name);

            return ((b.id === "4001") - (a.id === "4001")) * 100 +  // put GOLD first
                   (itemdata2.rarity - itemdata1.rarity) * 10 +
                   itemdataTL1[`name_${lang}`].localeCompare(itemdataTL2[`name_${lang}`]);
        });*/

        let html = [];
        $("#comb-reqmats-container").html("");
        for (let mat of combined) {
            let itemdata = db.items[mat.id];
            let itemdataTL = query(db.itemstl, "name_cn", itemdata.name);

            let formated_count = mat.count;
            if (formated_count >= 1000) {
                formated_count = formated_count.toString().split("");
                for (i = formated_count.length - 3; i > 0; i -= 3) formated_count.splice(i, 0, ".");
                formated_count = formated_count.join("");
            }

            html.push(``
            +   `<li>`
            +       `<div class="internal-container" style="position: relative;">`
            +           `<div class="item-name">${itemdataTL["name_" + lang]}</div>`
            +           `<div class="item-image">`
            +               `<span></span>`
            +               `<img id="item-image" src="img/items/${itemdata.iconId}.png">`
            +           `</div>`
            +           `<img class="item-rarity" src="img/material/bg/item-${itemdata.rarity + 1}.png">`
            +           `<div class="item-amount">${formated_count}x</div>`
            +       `</div>`
            +   `</li>`);
        }

        $("#comb-reqmats-container").html(html.join(""));
    }

    function calculateBreakdown() {
        $("#tbody-materials").html("");

        let mats = $.isEmptyObject(combined) ? reqmats : combined;
        if (typeof mats === "undefined") return;

        for (let v of mats) {
            let itemdata = db.items[v.id];
            var itemdataTL = query(db.itemstl, "name_cn", itemdata.name);

            var tr = $(`<tr></tr>`);
            var td = $(`<td style="vertical-align:middle; text-align: center; width: 180px; padding-left: 30px;"></td>`);
            var L1 = $(`<div class="reqmats-container smallcontainer"><li>`
                   +       `<div class="internal-container" style="position: relative;">`
                   +           `<div class="item-name">${itemdataTL.name_en}</div>`
                   +           `<div class="item-image">`
                   +               `<span></span>`
                   +               `<img src="img/items/${itemdata.iconId}.png">`
                   +           `</div>`
                   +           `<img class="item-rarity" src="img/material/bg/item-${itemdata.rarity + 1}.png">`
                   +           `<div class="item-amount">${v.count}x</div>`
                   +       `</div>`
                   +   `</li></div>`);
            td.append(L1);
            tr.append(td);

            if (itemdata.buildingProductList.length > 0) {
                var parentcount = v.count;
                var formulaId = itemdata.buildingProductList[0].formulaId;
                var skip = false;

                if (itemdata.buildingProductList[0].roomType == "MANUFACTURE") {
                    var formula = db.manufactformulas[formulaId];
                } else {
                    var formula = db.workshopformulas[formulaId];
                    var check = db.items[formula.costs[0].id];

                    if(itemdata.rarity == check.rarity &&
                       itemdata.iconId.search("MTL_ASC") != -1 &&
                       check.iconId.search("MTL_ASC") != -1) {
                        skip = true;
                    }
                }

                if (!skip) {
                    let td = $(`<td style="vertical-align:middle; text-align: center; padding-bottom: 30px; border-right: 5px solid darkgrey; margin-bottom: 20px;"></td>`);
                    td.append(`<div style="font-size:2em; font-weight: bold;"><span><img class="ak-btn ak-c-black ak-shadow-small" src="./img/ui/Arrow.png"></span></div>`);
                    tr.append(td);
                    var td2 = $("<td></td>");
                    for (let v of formula.costs) {
                        var row1 = $(`<div class="row"></div>`);
                        var col1 = $(`<div class="col-3"></div>`);
                        let itemdata = db.items[v.id];
                        let itemdataTL = query(db.itemstl, "name_cn", itemdata.name);

                        if(!itemdataTL.name_en) console.log(itemdata.name)

                        let li = $(`<div class="reqmats-container smallcontainer"><li>`
                               +       `<div class="internal-container" style="position: relative;">`
                               +           `<div class="item-name">${itemdataTL.name_en}</div>`
                               +           `<div class="item-image">`
                               +               `<span></span>`
                               +               `<img src="img/items/${itemdata.iconId}.png">`
                               +           `</div>`
                               +           `<img class="item-rarity" src="img/material/bg/item-${itemdata.rarity + 1}.png">`
                               +           `<div class="item-amount">${v.count * parentcount}x</div>`
                               +       `</div>`
                               +   `</li></div>`);

                        col1.append(li);
                        row1.append(col1);


                        if (itemdata.buildingProductList.length > 0) {
                            var parentcount2 = v.count * parentcount;
                            var formulaId = itemdata.buildingProductList[0].formulaId;
                            var skip = false;

                            if (itemdata.buildingProductList[0].roomType == "MANUFACTURE") {
                                var formula = db.manufactformulas[formulaId];
                            } else {
                                var formula = db.workshopformulas[formulaId];
                                var check = db.items[formula.costs[0].id];

                                if (itemdata.rarity == check.rarity &&
                                    itemdata.iconId.search("MTL_ASC") != -1 &&
                                    check.iconId.search("MTL_ASC") != -1)
                                        skip = true;
                            }

                            if (!skip) {
                                var col2 = $("<div class=\"col-2\" style=\"border-right: 5px solid darkgrey; margin-bottom: 20px;\"></div>");
                                col2.append("<div style=\"margin-top: 50%; font-size:2em; font-weight: bold; min-width: 80px; max-width: 80px;\"><span><img class=\"ak-btn ak-c-black ak-shadow-small\" style =\" width:100%\"src=\"./img/ui/Arrow.png\"></span></div>");
                                row1.append(col2)
                                var col3 = $("<div class=\"col-3\"></div>");

                                for (let v2 of formula.costs) {
                                    let itemdata = db.items[v2.id];
                                    let itemdataTL = query(db.itemstl,"name_cn",itemdata.name);
                                    let li = $("<div class=\"reqmats-container smallcontainer\"><li>"
                                    +       "<div class=\"internal-container\" style=\"position: relative;\">"
                                    +           "<div class=\"item-name\">"+itemdataTL.name_en+"</div>"
                                    +           "<div class=\"item-image\">"
                                    +               "<span></span>"
                                    +               "<img class=\" ak-mat-img\" id=\"item-image\" src=\"img/items/"+itemdata.iconId+".png\">"
                                    +           "</div>"
                                    +           "<img class=\"item-rarity\" src=\"img/material/bg/item-"+(itemdata.rarity+1)+".png\">"
                                    +           "<div class=\"item-amount\">"+(v2.count*parentcount2)+"x</div>"
                                    +       "</div>"
                                    +   "</li></div>");

                                    col3.append(li);
                                }
                            }

                            row1.append(col3);
                        }

                        td2.append(row1);
                    }

                    tr.append(td2);
                }
                $("#tbody-materials").append(tr);
            }
        }
    }

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