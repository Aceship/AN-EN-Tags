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
    var d7 = $.getJSON("json/tl-item.json",function(data){
            db["itemstl"] = data;
        });
    var d8 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/gamedata_const.json",function(data){
            db["dataconst"] = data;
        });
    var d9 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/skin_table.json",function(data){
            db["skintable"] = data;
        });
    var d10 = $.getJSON("json/tl-gender.json",function(data){
            db["gender"] = data;
        });
    var d11 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/skill_table.json",function(data){
            db["skills"] = data;
        });
    var d12 = $.getJSON("json/ace/tl-skills.json",function(data){
            db["skillsTL"] = data;
        });
    var d13 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/range_table.json",function(data){
            db["range"] = data;
        });
    var d14 = $.getJSON("json/tl-attacktype.json",function(data){
            db["attacktype"] = data;
        });
    var d15 = $.getJSON("json/tl-unreadablename.json",function(data){
            db["unreadNameTL"] = data;
        });
    var d16 = $.getJSON("json/tl-potential.json",function(data){
            db["potentialTL"] = data;
        });
    var d17 = $.getJSON("json/ace/tl-talents.json",function(data){
            db["talentsTL"] = data;
        });
    var d18 = $.getJSON("json/gamedata/zh_CN/gamedata/excel/handbook_info_table.json",function(data){
            db["handbookInfo"] = data;
        });
    var d19 = $.getJSON("json/tl-va.json",function(data){
        db["vaTL"] = data;
    });
    var d20 = $.getJSON("json/tl-storytext.json",function(data){
        db["storytextTL"] = data;
    });
    var d21 = $.getJSON("json/tl-charastory.json",function(data){
        db["charastoryTL"] = data;
    });    
    $.when(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12,d13,d14,d15,d16,d17,d18,d19,d20,d21).then(function(){
        $.holdReady(false);
    });

    var lang;
    var reg;
    var slotnum;
    var selectedOP;
    var lefthand;
    var opdataFull = {};

    $(document).ready(function(){
        $('#to-tag').click(function(){      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });
        if(!localStorage.getItem('gameRegion') || !localStorage.getItem('webLang')){
            console.log("game region undefined");
            localStorage.setItem("gameRegion", 'cn');
            localStorage.setItem("webLang", 'en');
            reg = "cn";
            lang = "en";

            var vars = getUrlVars();
            if(typeof vars.opname != "undefined"){
                // console.log("TEST1")
            }
        } else {
            console.log(localStorage.getItem('webLang'));
            reg = localStorage.getItem('gameRegion');
            lang = localStorage.getItem('webLang');
        }
        $('.reg[value='+reg+']').addClass('selected');
        $('.lang[value='+lang+']').addClass('selected');

        if(!localStorage.getItem('slotNum')){
            console.log("slot num undefined");
            localStorage.setItem("slotNum", JSON.stringify(2));
            slotnum = 3;
        } else {
            slotnum = JSON.parse(localStorage.getItem('slotNum'));
        }
        $("#slotCount").val(slotnum)

        populateSlots();
        var selectedOpnames = {};
        if(!localStorage.getItem('selectedOpnames')){
            localStorage.setItem('selectedOpnames', JSON.stringify(selectedOpnames));
        } else {
            selectedOpnames = JSON.parse(localStorage.getItem('selectedOpnames'));
            $.each(selectedOpnames,function(k,v){
                selectOperator(v,k);
            });
        }

        $('.operatorsResult').click(function(event){
            event.stopPropagation();
        });
        $('.opname').click(function(event){
            event.stopPropagation();
        });

        $('.dropdown-trigger').dropdown();
        $('[data-toggle="tooltip"]').tooltip();

        $('.opname').bind("enterKey",function(e){
            // console.log()
            let slot = $(this).attr('charaslot');
            populateOperators($(this).val(),slot,true)
        });
        $('.opname').keyup(function(e){
            if(e.keyCode == 13)
            {
                $(this).trigger("enterKey");
            }
        });
        var containerWidth = (401 * slotnum)+1;
        $("#slotscontainer").css('min-width',containerWidth);
        $("#eliteSyncSwitch").btnSwitch({
            Theme:'Light',
            ToggleState:true,
            OnCallback: function(val) {
                if(!localStorage.getItem('syncElites')){
                    localStorage.setItem("syncElites", JSON.stringify(true));
                } else {
                    localStorage.setItem("syncElites", JSON.stringify(true));
                }
                syncEliteTab();
            },
            OffCallback: function (val) {
                if(!localStorage.getItem('syncElites')){
                    localStorage.setItem("syncElites", JSON.stringify(false));
                } else {
                    localStorage.setItem("syncElites", JSON.stringify(false));
                }
            }
        });
        if(!localStorage.getItem('syncElites')){
            localStorage.setItem("syncElites", JSON.stringify(true));
        }
    });

    $.getScript("js/arrive.min.js", function(){
        $(document).arrive("#regionDropdown", function(){
            $("#navitemRegion").addClass('ak-disable2');
            $("#navitemLanguage").addClass('ak-disable2');
        });
    });

    function clickBtnClear(){
        $("#slotscontainer").empty();
        populateSlots();
        let selectedOPDetailsObj = {};
        let selectedOpnames = {};
        localStorage.setItem('selectedOPDetailsObj', JSON.stringify(selectedOPDetailsObj));
        localStorage.setItem('selectedOpnames', JSON.stringify(selectedOpnames));
    }

    function changeSlotNum(){
        var oldslotnum = slotnum;
        slotnum = $("#slotCount").val();
        localStorage.setItem('slotNum', JSON.stringify(slotnum));
        if(oldslotnum > slotnum){
            for (var i = slotnum; i < oldslotnum; i++) {
                let selectedOPDetailsObj = {};
                let selectedOpnames = {};
                selectedOPDetailsObj = JSON.parse(localStorage.getItem('selectedOPDetailsObj'));
                selectedOpnames = JSON.parse(localStorage.getItem('selectedOpnames'));
                delete selectedOPDetailsObj[i];
                delete selectedOpnames[i];
                localStorage.setItem('selectedOPDetailsObj', JSON.stringify(selectedOPDetailsObj));
                localStorage.setItem('selectedOpnames', JSON.stringify(selectedOpnames));
            }
        }
        $('#slotscontainer').html('');
        populateSlots();
        var selectedOpnames = {};
        if(!localStorage.getItem('selectedOpnames')){
            localStorage.setItem('selectedOpnames', JSON.stringify(selectedOpnames));
        } else {
            selectedOpnames = JSON.parse(localStorage.getItem('selectedOpnames'));
            $.each(selectedOpnames,function(k,v){
                selectOperator(v,k);
            });
        }
        var containerWidth = (401 * slotnum)+1;
        $("#slotscontainer").css('min-width',containerWidth);
    }

    function syncEliteTab(selectedElite=-1){
        var SE = selectedElite;
        console.log("selectedElite: "+SE)
        console.log('syncElites: '+localStorage.getItem('syncElites'))
        if($("#slot0-op-nametl").html() != "" && JSON.parse(localStorage.getItem('syncElites'))){
            if(selectedElite==-1){
                for (var i = 1; i <= 3; i++) {
                    if($("#slot0-elite-topnav > li:nth-child("+i+") > a").hasClass('active')){
                        SE = i-1;
                    }
                }
            }
            for (var i = 0; i < slotnum; i++) {
                $("#slot"+i+"-elite-topnav > li").each(function(){
                    $(this).children().removeClass('active');
                });
                var LIlength = $("#slot"+i+"-elite-topnav > li").length;
                console.log(SE+1)
                if( LIlength < SE+1 ){
                    $("#slot"+i+"-elite-topnav > li:nth-child("+LIlength+") > a").addClass('active');
                } else {
                    $("#slot"+i+"-elite-topnav > li:nth-child("+(SE+1)+") > a").addClass('active');
                }

                $("#slot"+i+"-tabs-opData > div").each(function(){
                    $(this).removeClass('active');
                    $(this).removeClass('show');
                });
                var divLength = $("#slot"+i+"-tabs-opData > div").length;
                if( divLength < SE+1 ){
                    $("#slot"+i+"-tabs-opData > div:nth-child("+divLength+")").addClass('active');
                    $("#slot"+i+"-tabs-opData > div:nth-child("+divLength+")").addClass('show');
                } else {
                    $("#slot"+i+"-tabs-opData > div:nth-child("+(SE+1)+")").addClass('active');
                    $("#slot"+i+"-tabs-opData > div:nth-child("+(SE+1)+")").addClass('show');
                }
            }
        }
    }

    function populateSlots(){
        for (var i = 0; i < slotnum; i++) {
            var html = $(`
            <div class='charaSlot-container container' id='charaSlot${i}'>
                <input readonly type="text" name="slot${i}-opID" id="slot${i}-opID" style="display: none;">
                <div class='row' style='padding:0px'>
                    <input style='margin-left: 10px;margin-top:5px' type='text' autocomplete='off' class='form-control col-8' name='slot${i}-opname' id='slot${i}-opname' onkeyup='populateOperators(this,${i})' placeholder='Type in operator name . .'>
                    <div class='btn btn-sm ak-btn ak-rare-bg browse-btn' onclick="populateOperators('Browse',${i})" type='button'>Browse</div>
                </div>
                <div style='position: relative;'><ul class='ak-c-black ak-elite-browse' id='slot${i}-operatorsResult' style='display:none; position: absolute; z-index: 10; list-style-type: none; padding: 5px;color:#222'><li style='cursor: pointer'></li></ul></div>
                <div class='col-12 op-statcard ak-c-black ak-rare-bg ak-shadow' style=' margin-top: 10px; background-color: #4f4f4f; margin-bottom: 10px; border-radius: 3px;padding: 0px;min-height:350px;'>
                    <div class='row'>
                        <div class='col-6 col-sm-6 ' style='padding:13px 20px;'>
                            <div style='position: relative;display: block; margin: 0 auto; width: 150px;z-index: 0;min-height:280px;margin:auto;background: #55555511'>
                                <div class='ak-shadow' style='display:flex;align-items:flex-end;;min-height:280px'>
                                    <img style ='position:relative;z-index:1;' src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/chara/empty.png' width='150' id='slot${i}-opImage'>
                                    <img  style ='position:absolute;left: 0px; top: 0px;z-index:0' src='' width='150' id='slot${i}-opHeader'>
                                    <img  style ='position:absolute;left: 0px; bottom: 0px;z-index:0' src='' width='150' id='slot${i}-opBg'>
                                    <img  style ='position:absolute;left: 0px; bottom: 40px;z-index:2' src='' width='150' id='slot${i}-opGlow'>
                                    <img  style ='position:absolute;left: -2px; bottom:-5px;z-index:3' src='' width='152' id='slot${i}-opBanner'>
                                    <div style='position: absolute;z-index:5;bottom:0px;right:2px' id='slot${i}-detail'></div>
                                    <p id='slot${i}-op-rarity' class='op-rarity'></p>
                                </div> 
                                <img class='ak-shadow-small' style='display: block; z-index:3;position: absolute; left: 4px; top: 4px; margin: 0 auto; width: 35px;' src='' id='slot${i}-opClassImage'>
                                
                            </div>
                            
                        </div>
                        <div class='col-6 col-sm-6' style='padding: 5px;'>
                            <b><p id='slot${i}-op-nametl' class='ak-font-novecento' style='font-size: 1.6em;margin-bottom:0px;'></p></b>
                            <p id='slot${i}-op-name'></p>
                            <div id='slot${i}-op-tags'></div>
                        </div>
                    </div>
                </div>
                <div class="col-12 op-statcard ak-c-black ak-rare-bg" style=" margin-top: 10px; margin-bottom: 10px; border-radius: 3px;padding: 0px; min-height: 350px;position: relative; background-color: #363636;">
                    <ul class="nav nav-pills" id="slot${i}-elite-topnav" style="position: absolute; top: -30px;">
                        
                    </ul>
                    <div class='tab-content' id="slot${i}-tabs-opData">
                        
                    </div>
                </div>
            </div>`);
            $('#slotscontainer').append(html);
        }
    }

    function populateOperators(el,slot,isenter = false){
        // console.log(el)
        let inputs
        if(isenter)
            inputs = el
        else
            inputs = el.value
        if(($('#slot'+slot+'-operatorsResult').css("display") == "block") && el=="Browse"){
            // console.log($('#operatorsResult').css("display") == "none" )
            $('#slot'+slot+'-operatorsResult').hide();
            return;
        }
        if(el.value != ""||el=="Browse"||isenter&&el){
            var result = [];
            $.each(db.chars2,function(_,char){
                var languages = ['cn','en','jp','kr'];
                var found = false;
                $('#slot'+slot+'-operatorsResult').css('min-width','364px');
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
                    var unreadable = query(db.unreadNameTL,"name",char.name_en).name_en
                    // console.log(unreadable)
                    var nameTL = char['name_'+lang];
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
                    $('#slot'+slot+'-operatorsResult').hide();
                    selectOperator(result[0].name_cn)
                    return
                }
                $('#slot'+slot+'-operatorsResult').empty();
                $('#slot'+slot+'-operatorsResult').show();
                for (var i = 0; i < result.length; i++) {
                    let image = `<img style="height:40px;padding:2px" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${result[i].img_name}_1.png">  `
                    // console.log(image)
                    if(el=="Browse"){
                        image = `<img style="height:70px;padding:2px" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/${result[i].img_name}_1.png">  `
                        $("#slot"+slot+"-operatorsResult").css("max-width","100vw");
                        $("#slot"+slot+"-operatorsResult").append(
                                "<li class=\"col-2 col-sm-1 ak-shadow-small ak-rare-"+result[i].rarity+"\"style=\"display:inline-block;cursor: pointer;width:85px;min-width:85px;margin:2px;margin-bottom:2px;padding:1px;border-radius:2px\" onclick=\"selectOperator('"+result[i].name_cn+"',"+slot+")\">"
                                +"<div style=\"white-space: nowrap;padding:0px;text-align:center;margin:0 \">"+image+"</div>"
                                +"<div style=\"white-space: nowrap;padding:0px;text-align:center;margin:0 \">"+`${result[i].name_readable?`[${result[i].name_readable}]`:""}`+result[i].nameTL+"</div>"
                                +"</li>");
                    }else{
                        $("#slot"+slot+"-operatorsResult").css("max-width","290px");
                        $("#slot"+slot+"-operatorsResult").append(`<li class=" ak-shadow-small ak-rare-${result[i].rarity}"style="width:100%;cursor: pointer;margin-bottom:2px" onclick="selectOperator('`+result[i].name_cn+`',${slot})">${image} ${result[i].name_readable?`[${result[i].name_readable}]`:""} ${result[i].nameTL} (${result[i].name})</li>`);
                    }
                }
            }
            // console.log( $("#operatorsResult")  )
            // $('#operatorsResult').show();
        } else {
            $('#slot'+slot+'-operatorsResult').empty();
            $('#slot'+slot+'-operatorsResult').hide();
        }
    }

    function selectOperator(opname,slot){
        
        if(opname != ""){
            console.log("SELECT OPERATOR");
            console.log(opname);   
            $("#slot"+slot+"-opname").val("");
            $('#slot'+slot+'-operatorsResult').empty();
            $('#slot'+slot+'-operatorsResult').hide();
            var opdata = query(db.chars2,"name_cn",opname);
            
            var opdata2 = query(db.chars,"name",opdata.name_cn,true,true);
            
            //test
            // var charalist = []
            // $.each(db.chars,(key,chara) => {
            //     charalist.push(`${chara.appellation},${chara.displayLogo},${key.split("_")[1]},${key}_1`)
            // });
            // console.log(charalist.join("\n"))
            //
            var opKey ="";
            console.log(opdata2);
            $.each(opdata2,function(key,v){
                v['id'] = key;
                // console.log(v);
                opdataFull[slot] = v;
                opKey = key;
                $("#slot"+slot+"-opImage").attr('src','img/portraits/'+key+'_1.png');
                $("#slot"+slot+"-opHeader").attr('src','https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/chara/header-'+(opdata2[key].rarity+1)+'.png');
                $("#slot"+slot+"-opBg").attr('src','https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/chara/bg-'+(opdata2[key].rarity<=2? 1:opdata2[key].rarity+1 )+'.png');
                $("#slot"+slot+"-opID").val(key);
                var opclass = query(db.classes,"type_data",opdata2[key].profession);
                console.log(opclass)
                $("#slot"+slot+"-opClassImage").attr('src','https://raw.githubusercontent.com/Aceship/Arknight-Images/main/classes/black/icon_profession_'+opclass.type_en.toLowerCase()+'_large.png');
                let selectedOPDetailsObj = {};
                let selectedOpnames = {};
                if(!localStorage.getItem("selectedOPDetailsObj") || !localStorage.getItem('selectedOpnames')){
                    localStorage.setItem("selectedOPDetailsObj", JSON.stringify(selectedOPDetailsObj));
                    localStorage.setItem("selectedOpnames", JSON.stringify(selectedOpnames));
                } else {
                    try {
                        selectedOPDetailsObj = JSON.parse(localStorage.getItem('selectedOPDetailsObj'))
                    } catch (e) {
                        localStorage.setItem('selectedOPDetailsObj', JSON.stringify(selectedOPDetailsObj));
                    }
                    selectedOPDetailsObj = JSON.parse(localStorage.getItem('selectedOPDetailsObj'))

                    try {
                        selectedOpnames = JSON.parse(localStorage.getItem('selectedOpnames'))
                    } catch (e) {
                        localStorage.setItem('selectedOpnames', JSON.stringify(selectedOpnames));
                    }
                    selectedOpnames = JSON.parse(localStorage.getItem('selectedOpnames'))
                }
                selectedOPDetailsObj[slot] = key;
                localStorage.setItem('selectedOPDetailsObj', JSON.stringify(selectedOPDetailsObj));
                selectedOpnames[slot] = opname;
                localStorage.setItem('selectedOpnames', JSON.stringify(selectedOpnames));
                console.log(localStorage.getItem('selectedOPDetailsObj'));
                console.log(localStorage.getItem('selectedOpnames'));
                return false
            });
            console.log(opdata2)
           
            console.log(lang);
            $("#slot"+slot+"-op-nametl").html(opdata['name_'+lang]);
            $("#slot"+slot+"-op-name").html(opdata['name_'+reg]);
            $("#slot"+slot+"-detail").html("<a type=\"button\" class=\"btn btn-sm ak-btn ak-shadow ak-shadow-small my-1\" style=\"background:#444444DD\"data-toggle=\"tooltip\" data-placement=\"right\" href=\"./akhrchars.html?opname="+opdata.name_en.replace(/ /g,"_")   +"\" \">Detail</button>")
            var rarity = "";
            for (var i = 0; i < opdata.level; i++) {
                rarity = rarity + "<i class='fa fa-star'></i>";
            }
            $("#slot"+slot+"-op-rarity").html(rarity);
            $("#slot"+slot+"-op-rarity").attr('class','op-rarity');
            $("#slot"+slot+"-op-rarity").addClass('op-rarity-'+opdata.level);
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
            $("#slot"+slot+"-op-tags").html(tags_html.join(""));
            

            // use opdata to get the operator data based on tl-akhr.json
            // use opdataFull to get the operator data based on character_table.json

            var tabbtn2 = [];
            var tabcontent2 = [];
            $("#slot"+slot+"-elite-topnav").empty();
            for (var i = 0; i < opdataFull[slot].phases.length; i++) {
                var l = opdataFull[slot].phases.length;
                if(i == 0){
                    if(l == 1){
                        tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link active' data-toggle='pill' href='#slot"+slot+"-elite_0_tab' onclick='syncEliteTab(0)'>Non-Elite</a></li>");
                    } else {
                        tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link active' data-toggle='pill' href='#slot"+slot+"-elite_"+i+"_tab' onclick='syncEliteTab("+i+")'>Non-Elite</a></li>");
                    }
                } else if( i == l-1 ){
                    tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link' data-toggle='pill' href='#slot"+slot+"-elite_"+i+"_tab' onclick='syncEliteTab("+i+")'>Elite "+i+"</a></li>");
                } else {
                    tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link' data-toggle='pill' href='#slot"+slot+"-elite_"+i+"_tab' onclick='syncEliteTab("+i+")'>Elite "+i+"</a></li>");
                }
                var elitehtml = getEliteHTML(i,opdataFull,slot);
                tabcontent2.push(elitehtml);
            }
            $("#slot"+slot+"-tabs-opData").html(tabcontent2);
            $("#slot"+slot+"-elite-topnav").html(tabbtn2);
            for (var i = 0; i < opdataFull[slot].phases.length; i++) {
                EliteStatsDisplay(1,i,slot);
            }
        }
    }

    function getEliteHTML(i, opdataFull, slot){
        var container = $("<div class='tab-pane container "+(i!=0 ? '' : 'active')+"' id='slot"+slot+"-elite_"+i+"_tab' style='padding:unset;'></div>");

        var stats = $("<div class='small-container ak-shadow clickthrough'>"
                        +   "<p class='large-text'>Base</p>"
                        +   "<span class='custom-span'>Stats</span>"
                        +   "<div class='topright maxlevel'>"
                        +       "<span class='custom-span maxleveltext'>Max Level</span>"
                        +       "<span class='custom-span leveltext'>"+opdataFull[slot].phases[i].maxLevel+"</span>"
                        +       "<div class='ring'>"
                        +           "<div class='back ak-shadow'></div>"
                        +           "<div class='back-centre'></div>"
                        +       "</div>"
                        +   "</div>"
                        +"<button class='btn btn-default btn-collapsible' data-toggle='collapse' data-target='#slot"+slot+"-elite"+i+"StatsCollapsible'></button>"
                        +"</div>");

        var statsCollapsible = $("<div id='slot"+slot+"-elite"+i+"StatsCollapsible' class='collapse collapsible eliteStatsContainer ak-shadow collapse show'></div>");

        var keyframes = [];
        $.each(opdataFull[slot].phases[i].attributesKeyFrames,function(j,v){
            keyframes[j] = v;
        });
        console.log(keyframes);
        var statsLevelAll = $(`
        <div style='text-align:center'>
        <span class='stat-level-header ${lefthand=="true"?"lefthand-stat-level-header":"righthand-stat-level-header"} ' style=''>Level</span>
        <input type='range' value='1' min='1' max='${keyframes[1].level}' name='levelStats' id='elite${i}LevelSlider' oninput='changeEliteLevel(this,${i},${keyframes[1].level},${slot})' style='margin-top:20px;width:60%;' class='statlevelInput ${lefthand=="true"?"lefthand-statlevelInput":"righthand-statlevelInput"}'></input>
        <div class='form-group stat-input ${lefthand=="true"?"lefthand-stat-input":"righthand-stat-input"}' style='display:inline-block;vertical-align:middle;'><input class='form-control' id='slot${slot}-elite${i}LevelDisplay' onchange='changeEliteLevel(this,${i},${keyframes[1].level},${slot})' style='line-height:1.1' type='number' value='1' min='1' max='${keyframes[1].level}'></div>
        </div>
        `)

        var statsTable = $(`
        <div id='slot${slot}-elite${i}Stats' class='${lefthand=="true"?"left-hand":"right-hand"} statlevelcontainer'>
            <table id='slot${slot}-elite${i}StatsTable'>
                <tr><td>

                    <div class='stats'><div class='stats-l'>Maximum HP</div><div class='stats-r' id='slot${slot}-elite${i}maxHp'></div></div>
                    <div class='stats'><div class='stats-l'>Redeploy Time</div><div class='stats-r' id='slot${slot}-elite${i}respawnTime'></div></div>
                    
                    <div class='stats'><div class='stats-l'>Attack Power</div><div class='stats-r' id='slot${slot}-elite${i}atk'></div></div>
                    <div class='stats'><div class='stats-l'>Cost</div><div class='stats-r' id='slot${slot}-elite${i}cost'></div></div>
                    
                    <div class='stats'><div class='stats-l'>Defense</div><div class='stats-r' id='slot${slot}-elite${i}def'></div></div>
                    <div class='stats'><div class='stats-l'>Block</div><div class='stats-r' id='slot${slot}-elite${i}blockCnt'></div></div>

                    <div class='stats'><div class='stats-l'>Magic Resistance</div><div class='stats-r' id='slot${slot}-elite${i}magicResistance'></div></div>
                    <div class='stats'><div class='stats-l'>Attack Time</div><div class='stats-r' id='slot${slot}-elite${i}baseAttackTime'></div></div>
                </tr><td>
                </table>
                ${rangeMaker(opdataFull[slot].phases[i].rangeId)}
                </div>
        `);
        
        statsCollapsible.append(statsLevelAll);
        statsCollapsible.append(statsTable);
        container.append(stats);
        container.append(statsCollapsible);
        // container.append(mats);
        return container;
    }

    function rangeMaker(rangeId,withText=true){
        let rangeData = db.range[rangeId]
        if(rangeData){
            let minRow = 0
            let minCol = 0
            let maxRow = 0
            let maxCol = 0
            let table = []
            let grids = []
            // console.log(rangeData.grids)
            if(rangeData){
                rangeData.grids.forEach(element => {
                    maxRow = Math.max(maxRow,element.row)
                    maxCol = Math.max(maxCol,element.col)
                    minRow = Math.min(minRow,element.row)
                    minCol = Math.min(minCol,element.col)
                });
            }
            table.push(`<div class="rangeTableContainer"><table class='rangeTable' style="table-layout: fixed;border-spacing:0 15px;padding:4px; border-collapse:separate; border-spacing:2px;width:${(maxCol+minCol+1)*17}px;">`)
            
            for(r=0;r+minRow<maxRow+1;r++){
                table.push(`<tr style="height:17px">`)
                // console.log(r+minRow)
                for(c=0;c+minCol<maxCol+1;c++){
                    table.push(`<td style=";width:17px`)
                    if(r+minRow==0&&c+minCol==0){
                        table.push(";background:#DDD")
                    }else{
                        rangeData.grids.forEach(element => {
                            if(element.row==r+minRow&&element.col==c+minCol){
                                table.push(";border: 2px solid #DDDDDD88;")
                            }
                        });
                    }
                    
                    table.push(`"></td>`)
                }
            }
            table.push(`</table>`);
            table.push(`${withText?`<div><span style="all:inherit;">Range</span></div>`:""}</div>`);
            return table.join("")
        }else{
            return undefined
        }
    }

    function changeEliteLevel(el,elite_no,max,slot){
        var value = $(el).val();
        $("#slot"+slot+"-elite"+elite_no+"LevelDisplay").val(value);
        $("#slot"+slot+"-elite"+elite_no+"LevelSlider").val(value);
        EliteStatsDisplay(Math.min(value,max),elite_no,slot);
    }

    function EliteStatsDisplay(level,elite_no,slot){
        $("#slot"+slot+"-elite"+elite_no+"maxHp").html(statsInterpolation('maxHp',level,elite_no,slot));
        $("#slot"+slot+"-elite"+elite_no+"def").html(statsInterpolation('def',level,elite_no,slot));
        $("#slot"+slot+"-elite"+elite_no+"atk").html(statsInterpolation('atk',level,elite_no,slot));
        $("#slot"+slot+"-elite"+elite_no+"magicResistance").html(statsInterpolation('magicResistance',level,elite_no,slot));
        $("#slot"+slot+"-elite"+elite_no+"respawnTime").html(statsInterpolation('respawnTime',level,elite_no,slot)+`<div style='display:inline;font-size:10px'> Sec</div>`);
        $("#slot"+slot+"-elite"+elite_no+"cost").html(statsInterpolation('cost',level,elite_no,slot));
        //console.log(opdataFull[slot].phases[elite_no].attributesKeyFrames[0]);
        //$("#slot"+slot+"-elite"+elite_no+"blockCnt").html(opdataFull[slot].phases[elite_no].attributesKeyFrames[0].data['blockCnt']);
        $("#slot"+slot+"-elite"+elite_no+"blockCnt").html(statsInterpolation('blockCnt',level,elite_no,slot));
        $("#slot"+slot+"-elite"+elite_no+"baseAttackTime").html(statsInterpolation('baseAttackTime',level,elite_no,slot,false)+`<div style='display:inline;font-size:10px'> Sec</div>`);
    }

    function statsInterpolation(key,level,elite_no,slot,isround=true){
        var kf = [];
        $.each(opdataFull[slot].phases[elite_no].attributesKeyFrames,function(j,v){
            kf[j] = v;
        });
        console.log([kf[0].level,kf[1].level])
        console.log([kf[0].data[key],kf[1].data[key]])
        if(kf[0].data[key] == kf[1].data[key]){
        return kf[0].data[key]
        }else {
            var pol = everpolate.linear([level],[kf[0].level,kf[1].level],[kf[0].data[key],kf[1].data[key]]);
            if(isround)
            return Math.round(pol);
                else
            return parseFloat(Math.round(pol*100))/100;
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

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }