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
    var d7 = $.getJSON("./json/tl-item.json",function(data){
            db["itemstl"] = data;
        });
    var d8 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/gamedata_const.json",function(data){
            db["dataconst"] = data;
        });
    var d15 = $.getJSON("json/tl-unreadablename.json",function(data){
            db["unreadNameTL"] = data;
        });
    var d16 = $.getJSON("json/akmaterial.json",function(data){
            db["material"] = data.filter(e => !e.hidden).sort((a, b) => b.level - a.level);
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

        Object.keys(db.chars).forEach(id =>{
            var currentop = db.chars[id]
            currentop.rarity = RarityConvert(currentop.rarity)
        })

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


        if(!localStorage.getItem('gameRegion') || !localStorage.getItem('webLang')){
            console.log("game region undefined");
            localStorage.setItem("gameRegion", 'cn');
            localStorage.setItem("webLang", 'en');
            reg = "cn";
            lang = "en";
        } else {
            console.log(!localStorage.getItem('webLang'));
            reg = localStorage.getItem('gameRegion');
            lang = localStorage.getItem('webLang');
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

        if(!localStorage.getItem('selectedOP')){
            localStorage.removeItem("selectedOP");
        } else {
            selectedOP = localStorage.getItem('selectedOP');
            var opname = db.chars[selectedOP].name;
            selectOperator(opname);
        }

        if (localStorage.getItem('chosenOps')) {
            let chosen_ids = JSON.parse(localStorage.getItem('chosenOps'));
            for (let id of chosen_ids) addOperator(id);

            calculateCombined();
            calculateBreakdown();
        } else {
            localStorage.setItem("chosenOps", JSON.stringify([]));
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
        localStorage.setItem('gameRegion', el.attr("value"));
        $(".dropdown-item.reg").removeClass("selected");
        el.addClass("selected");   
        changeUILanguage();
    }
                
    function langDropdown(el){
        localStorage.setItem('webLang', el.attr("value"));
        console.log(localStorage.getItem('webLang'))
        $(".dropdown-item.lang").removeClass("selected");
        el.addClass("selected");
        changeUILanguage();
    }

    
    function clickBtnClear(){
        $("#opname").val("");
        $('#operatorsResult').empty();
        $('#operatorsResult').hide();
        localStorage.removeItem('selectedOP');
        selectedOP = localStorage.getItem('selectedOP');
        // combined=[]
        $("#reqmats-container").empty();
        $("#tbody-materials").empty();
        $("#eliteReqMats").hide();
        $("#opClassImage").attr('src','');
            console.log(lang);
        $("#op-nametl").empty();
        $("#op-name").empty();
        $("#op-rarity").empty();
        $("#op-tags").empty();
        $("#opImage").attr('src','https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/chara/empty.png');
        $("#opHeader").attr('src','');
        $("#opBg").attr('src','');
        $("#opGlow").attr('src','');
        $("#opBanner").attr('src','');
        $("#detail").empty();
        $("#opID").val("");
        localStorage.setItem('chosenOps', JSON.stringify([]));
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
                    let image = `<img style="height:40px;padding:2px" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${result[i].img_name}.png">  `
                    // console.log(image)
                    if(el=="Browse"){
                        image = `<img style="height:70px;padding:2px" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${result[i].img_name}.png">  `
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
            var opdataFull
            // var opclass = query(db.classes,"type_cn",opdata.type);
            console.log(opdata);
            var opdata2 = query(db.chars,"name",opdata.name_cn,true,true);
            console.log(opdata2);
            $.each(opdata2,function(key,v){
                $("#opImage").attr('src','https://raw.githubusercontent.com/Aceship/Arknight-Images/main/portraits/'+key+'_1.png');
                opdataFull = opdata2[key]
                // $("#opGlow").attr('src','https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/chara/glow-'+(opdata2[key].rarity+1)+'.png');
                $("#opHeader").attr('src','https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/chara/header-'+(opdata2[key].rarity+1)+'.png');
                $("#opBg").attr('src','https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/chara/bg-'+(opdata2[key].rarity<=2? 1:opdata2[key].rarity+1 )+'.png');
                // $("#opBanner").attr('src','https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/chara/banner-'+(opdata2[key].rarity<=2? 1:opdata2[key].rarity+1 )+'.png');
                
                $("#opID").val(key);
                localStorage.setItem('selectedOP', key);
                return false
            });
            // console.log(opclass)
            // $("#opClassImage").attr('src','https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/black/icon_profession_'+opclass.type_en.toLowerCase()+'_large.png');
            // console.log(db.classes)
            
            var type = query(db.classes,"type_data",opdataFull.profession);
            console.log(type)
            $("#opClassImage").attr("src","https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/black/icon_profession_"+type.type_en.toLowerCase()+"_large.png")

            $("#op-nametl").html(opdata['name_'+lang]);
            $("#op-name").html(opdata['name_'+reg]);
            $("#detail").html("<a type=\"button\" class=\"btn btn-sm ak-btn ak-shadow ak-shadow-small my-1\" style=\"background:#444444DD\"data-toggle=\"tooltip\" data-placement=\"right\" href=\"./akhrchars.html?opname="+opdata.name_en.replace(/ /g,"_")+"\">Detail</button>")
            $("#add-op").html(`<a type="button" class="btn btn-sm ak-btn ak-shadow ak-shadow-small my-1" style="background:#444444DD" onclick="addCurrentOperator()" data-toggle="tooltip" data-placement="left">Add</a>`);
            var rarity = "";
            for (var i = 0; i < opdata.level; i++) {
                rarity = rarity + " ★";
            }
            $("#op-rarity").html(rarity);
            let positions = {'MELEE': '近战位', 'RANGED': '远程位'}
            let position = positions[opdataFull.position]
            let tags = [position, ...opdataFull.tagList]
            var tags_html = [];
            $.each(tags,function(_,v){
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
            
            html.push(CreateMaterial(v.id,v.count));
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

        $("#selectops-container").append(`<li><div style="display: block; padding:2px; z-index: 10000"
                                          op-id="${key}"
                                          onmouseover="reqmatsShow(this)"
                                          onmouseout="reqmatsHide(this)"><span> ${name} </span>
                                          <a type="button" class="btn btn-sm my-1 btn-danger"
                                          onclick="rmOperator(this)">X</div></li>`);

        localStorage.setItem("chosenOps", JSON.stringify(Object.keys(chosen_ops)));
    }

    // Walk through the DOM tree and execute "func" on each node
    function walkTree(el, func) {
        func(el);
        $(el).children().each((_, e) => walkTree(e, func));
    }

    function reqmatsShow(el) {
        let name = $(el).children("span").text();
        let key = $(el).attr("op-id");

        let level = key.slice(-1);
        let id = key.slice(0, -1);

        let char = db.chars[id];
        let gold = [{"id": "4001",
                     "count": db.dataconst["evolveGoldCost"][char.rarity][level - 1],
                     "type": "GOLD"}];

        if (gold[0].count > 0) {
            var required_mats = (typeof char.phases[level] === "undefined") ?
                                gold : gold.concat(char.phases[level].evolveCost);
        }

        $(el).parent().after(`<div id="floating-reqmats-container" style="position: absolute;">
                                  <div class="requiredmats-box"
                                       style="background-color: #555; border: solid black 2px; border-radius: 2px;">
                                      <div style="text-align: center; font-weight: bold; background-color: #222;">${name}</div>
                                      <div class="reqmats-container"; style="padding: 0 2px 0 10px;">${required_mats.map(mat => CreateMaterial(mat.id, mat.count)).join("")}</div>
                                  </div>
                                  <div id="floating-reqmats-arrow"></div>
                              </div>`);

        let self = $("#floating-reqmats-container");
        let width = self.width();
        let height = self.height();
        let position = $(el).position();

        // allow div to go off-screen and avoid frame flickering
        self.css("min-width", `${width}px`);

        /*  without rewriting top and left, frame position would be :
         *      - top:  $(el).position().top + $(el).height()
         *      - left: $(el).position().left */
        self.css("top", `${position.top - height - 10}px`);
        self.css("left", `${position.left + $(el).width()/2 - width/2}px`);

        walkTree("#floating-reqmats-container", (e) => $(e).css("z-index", 9001));
    }

    function reqmatsHide() {
        $("#floating-reqmats-container").remove();
    } 

    function addCurrentOperator() {
        let id = localStorage.getItem('selectedOP');
        let level = $("#eliteDropBtn").text()[6];

        let key = `${id}${level}`;
        if (key in chosen_ops) return;

        addOperator(key);

        calculateCombined();
    }

    function rmOperator(el) {
        delete chosen_ops[$(el).parent().attr("op-id")];

        // remove button -> div -> li
        $(el).parent().parent().remove();

        calculateCombined();

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
        console.log(combined)
        
        /** TODO: fix issue
         *  After sorting, complex materials, such as Polymerization Preparation
         *  or D32 Steel have their last 3 items of the 3rd column leak in the
         *  row under.
         *  Sorting would be great, else it can become quite messy at some point
         */
        combined.sort(function (a, b) {
            let itemdata1 = db.items[a.id];
            let itemdataTL1 = query(db.itemstl, "name_cn", itemdata1.name);
            let itemdata2 = db.items[b.id];
            let itemdataTL2 = query(db.itemstl, "name_cn", itemdata2.name);
            
            let item1Chip = (itemdata1.iconId.includes("MTL_ASC")?(itemdata1.iconId[itemdata1.iconId.length-1]-4)*-1:0)
            let item2Chip = (itemdata2.iconId.includes("MTL_ASC")?(itemdata2.iconId[itemdata2.iconId.length-1]-4)*-1:0)
            console.log(item1Chip)
            return  ((b.id === "4001") - (a.id === "4001")) * 1000 +  // put GOLD first
                    (item2Chip - item1Chip)*100 +
                    (itemdata2.rarity - itemdata1.rarity) * 10 +
                    itemdataTL1[`name_${lang}`].localeCompare(itemdataTL2[`name_${lang}`]);
        });

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
            
            html.push(CreateMaterial(mat.id,formated_count));
        }

        let need = Array.apply(null, Array(db["material"].length)).map(() => 0);
        let have = $.extend([], need);

        for (let mat of combined) {
            let name_cn = db.items[mat.id].name;
            let item = query(db.material, "name_cn", name_cn);

            need[item.id] = mat.count;
        }
        $("#akevolve").attr("href", `akevolve.html?n=${need.join("+")}&h=${have.join("+")}&o=1+2+3+4+5`);

        $("#comb-reqmats-container").html(html.join(""));
        calculateBreakdown()
    }

    function calculateBreakdown() {
        $("#tbody-materials").html("");

        let mats = $.isEmptyObject(combined) ? reqmats : combined;
        if (typeof mats === "undefined") return;

        for (let v of mats) {
            let itemdata = db.items[v.id];
            var itemdataTL = query(db.itemstl, "name_cn", itemdata.name);

            var tr = $(`<tr class='mat-row'></tr>`);
            var td = $(`<td class='mat-col1' style=""></td>`);
            var L1 = $(CreateMaterial(v.id,v.count));
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
                    let td = $(`<td class='mat-arrow' style=""></td>`);
                    td.append(`<div style="font-size:2em; font-weight: bold;"><i class="fas fa-angle-double-left"></i></div>`);
                    tr.append(td);
                    var td2 = $("<td class='mat-box'></td>");
                    for (let v of formula.costs) {
                        var row1 = $(`<div class="mat-row1"></div>`);
                        var col1 = $(`<div class="mat-col2"></div>`);
                        let itemdata = db.items[v.id];
                        let itemdataTL = query(db.itemstl, "name_cn", itemdata.name);

                        if(!itemdataTL.name_en) console.log(itemdata.name)
                        
                        let li = CreateMaterial(v.id,v.count * parentcount);

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
                            //     console.log(itemdata.iconId)
                            // console.log(check.iconId)
                                if (itemdata.rarity == check.rarity &&
                                    itemdata.iconId.search("MTL_ASC") != -1 &&
                                    check.iconId.search("MTL_ASC") != -1)
                                        skip = true;
                            }

                            if (!skip) {
                                var col2 = $("<div class='mat-arrow'></div>");
                                col2.append(`<div style="font-size:2em; font-weight: bold;"><i class="fas fa-angle-double-left"></i></div>`);
                                row1.append(col2)
                                var col3 = $(`<div class="mat-col3"></div>`);

                                for (let v2 of formula.costs) {
                                    let itemdata = db.items[v2.id];
                                    let itemdataTL = query(db.itemstl,"name_cn",itemdata.name);
                                    
                                    let li = CreateMaterial(v2.id,v2.count * parentcount2)

                                    col3.append(li);
                                }
                            }

                            row1.append(col3);
                        }

                        td2.append(row1);
                    }

                    tr.append(td2);
                }else{
                    tr.append(`<td colspan="100%" style='padding:0px'><div class='mat-row' style='height:140px'> </div></td>`);
                }
                $("#tbody-materials").append(tr);
            }
        }
    }

    function CreateMaterial(id,count){
        var itemdata = db.items[id];
        var itemdataTL = query(db.itemstl,"name_cn",itemdata.name);
        var material = 
        (`<div class="akmat-container" style="position:relative">
            <div class="item-name" title="${itemdata.name}">${(itemdataTL.name_en?itemdataTL.name_en:itemdata.name)}</div>
            <div class="item-image">
                <img id="item-image" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/items/${itemdata.iconId}.png">
            </div>
            <img class="item-rarity" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/material/bg/item-${RarityConvert(itemdata.rarity)+1}.png">
            <div class="item-amount">${count}x</div>
        </div>`)
        return material
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
    function RarityConvert(tier){
        return tier.split("_").length>1 ? parseInt(tier.split("_")[1])-1 : tier
    }

    function changeUILanguage(){
        reg = localStorage.getItem('gameRegion');
        lang = localStorage.getItem('webLang');

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