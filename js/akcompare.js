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
    var d7 = $.getJSON("json/tl-item.json",function(data){
            db["itemstl"] = data;
        });
    var d8 = $.getJSON("json/excel/gamedata_const.json",function(data){
            db["dataconst"] = data;
        });
    var d9 = $.getJSON("json/excel/skin_table.json",function(data){
            db["skintable"] = data;
        });
    var d10 = $.getJSON("json/tl-gender.json",function(data){
            db["gender"] = data;
        });
    var d11 = $.getJSON("json/excel/skill_table.json",function(data){
            db["skills"] = data;
        });
    var d12 = $.getJSON("json/ace/tl-skills.json",function(data){
            db["skillsTL"] = data;
        });
    var d13 = $.getJSON("json/excel/range_table.json",function(data){
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
    var d18 = $.getJSON("json/excel/handbook_info_table.json",function(data){
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
    var selectedOP;
    var lefthand;
    var opdataFull = {};

    $(document).ready(function(){
        $('#to-tag').click(function(){      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });
        if(typeof localStorage.gameRegion === "undefined" || localStorage.gameRegion == ""|| localStorage.webLang == ""){
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
            console.log(localStorage.webLang);
            reg = localStorage.gameRegion;
            lang = localStorage.webLang;
        }
        $('.reg[value='+reg+']').addClass('selected');
        $('.lang[value='+lang+']').addClass('selected');
    });

    function clickBtnClear(){
    }

    function populateOperators(el,isenter = false){
        // console.log(el)
        let inputs
        if(isenter)
            inputs = el
        else
            inputs = el.value
        if(($('#operatorsResult').css("display") == "block") && el=="Browse"){
            // console.log($('#operatorsResult').css("display") == "none" )
            $('#operatorsResult').hide();
            return;
        }
        if(el.value != ""||el=="Browse"||isenter&&el){
            var result = [];
            $.each(db.chars2,function(_,char){
                var languages = ['cn','en','jp','kr'];
                var found = false;
                if(el=="Browse"){
                    found=true;
                }else{
                    for (var i = 0; i < languages.length; i++) {
                        var charname = eval('char.name_'+languages[i]).toUpperCase();
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
                    var name = eval('char.name_'+reg);
                    var unreadable = query(db.unreadNameTL,"name",char.name_en).name_en
                    // console.log(unreadable)
                    var nameTL = eval('char.name_'+lang);
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
                $('#operatorsResult').html("");
                $('#operatorsResult').show();
                for (var i = 0; i < result.length; i++) {
                    let image = `<img style="height:40px;padding:2px" src="./img/avatars/${result[i].img_name}_1.png">  `
                    // console.log(image)
                    if(el=="Browse"){
                        image = `<img style="height:70px;padding:2px" src="./img/avatars/${result[i].img_name}_1.png">  `
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
            // console.log( $("#operatorsResult")  )
            // $('#operatorsResult').show();
        } else {
            $('#operatorsResult').html("");
            $('#operatorsResult').hide();
        }
    }

    function selectOperator(opname){
        
        if(opname != ""){
            $("#chara-detail-container").show();
            console.log("SELECT OPERATOR");
            console.log(opname);   
            $("#opname").val("");
            $('#operatorsResult').html("");
            $('#operatorsResult').hide();
            var opdata = query(db.chars2,"name_cn",opname);
            var opclass = query(db.classes,"type_cn",opdata.type);
            var opdata2 = query(db.chars,"name",opdata.name_cn,true,true);
            
            //test
            // var charalist = []
            // $.each(db.chars,(key,chara) => {
            //     charalist.push(`${chara.appellation},${chara.displayLogo},${key.split("_")[1]},${key}_1`)
            // });
            // console.log(charalist.join("\n"))
            //
            var opKey =""
            $.each(opdata2,function(key,v){
                v['id'] = key;
                // console.log(v);
                opdataFull = v;
                opKey = key;
                localStorage.selectedOPDetails = key;
                return false
            });
            
            var curpath = window.location.pathname.split("?");
            history.pushState(null, '', curpath+'?opname='+opdataFull.appellation.replace(/ /g,"_")); 
            

            // use opdata to get the operator data based on tl-akhr.json
            // use opdataFull to get the operator data based on character_table.json

            
        }
    }

    function getEliteHTML(i, opdataFull){
        var container = $("<div class='tab-pane container "+(i!=0 ? 'fade' : 'active')+"' id='elite_"+i+"_tab'></div>");

        var stats = $("<div class='small-container ak-shadow clickthrough'>"
                        +   "<p class='large-text'>Base</p>"
                        +   "<span class='custom-span'>Stats</span>"
                        +   "<div class='topright maxlevel'>"
                        +       "<span class='custom-span maxleveltext'>Max Level</span>"
                        +       "<span class='custom-span leveltext'>"+opdataFull.phases[i].maxLevel+"</span>"
                        +       "<div class='ring'>"
                        +           "<div class='back ak-shadow'></div>"
                        +           "<div class='back-centre'></div>"
                        +       "</div>"
                        +   "</div>"
                        +"<button class='btn btn-default btn-collapsible notclickthrough' data-toggle='collapse' data-target='#elite"+i+"StatsCollapsible'><i class='fa fa-sort-down'></i></button>"
                        +"</div>");

        var statsCollapsible = $("<div id='elite"+i+"StatsCollapsible' class='collapse collapsible eliteStatsContainer ak-shadow collapse show'></div>");
        var eliteCost = GetEliteCost(i,opdataFull)
        var materialist = []
        
        if(eliteCost){
            eliteCost.forEach(materials => {
                materialist.push(CreateMaterial(materials.id,materials.count))
            });
            // console.log(materialist)
        }
        var materialHtml =''
        if(materialist.length>0){
            materialHtml=`
            <div style="text-align:center;background:#222">Elite Requirements</div>
            `+materialist.join("")
        }
        var keyframes = [];
        $.each(opdataFull.phases[i].attributesKeyFrames,function(j,v){
            keyframes[j] = v;
        });
        console.log(keyframes);
        var statsLevelSlider = $("<span style='font-size:1.2em;vertical-align:super;padding-left:10px;'>Level: </span><input type='range' value='1' min='1' max='"+keyframes[1].level+"' name='levelStats' id='elite"+i+"LevelSlider' oninput='changeEliteLevel(this,"+i+")' style='margin-top:20px;width:60%;' class='skillLevelInput'></input>");
        var statsLevelDisplay = $("<div class='form-group' style='display:inline-block;vertical-align:middle;'><input class='form-control' id='elite"+i+"LevelDisplay' onchange='changeEliteLevel(this,"+i+")' style='line-height:1.1' type='number' value='1' min='1' max='"+keyframes[1].level+"'></div>")
        var statsTable = $("<div id='elite"+i+"Stats'>"
                            +   "<table id='elite"+i+"StatsTable'>"
                            +       "<tr>"
                            +           "<td class='stats-l'>MaxHP :</td><td class='stats-r' id='elite"+i+"maxHp'></td>"
                            +           "<td class='stats-l'>Def :</td><td class='stats-r' id='elite"+i+"def'></td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>Atk :</td><td class='stats-r' id='elite"+i+"atk'></td>"
                            +           "<td class='stats-l'>MRes :</td><td class='stats-r' id='elite"+i+"magicResistance'></td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td colspan=2 rowspan=4>"+rangeMaker(opdataFull.phases[i].rangeId)+"</td>"
                            +           "<td class='stats-l'>Redeploy :</td><td class='stats-r' id='elite"+i+"respawnTime'> Sec</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>Cost :</td><td class='stats-r' id='elite"+i+"cost'></td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>Block :</td><td class='stats-r' id='elite"+i+"blockCnt'></td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>AtkTime :</td><td class='stats-r' id='elite"+i+"baseAttackTime'> Sec</td>"
                            +       "</tr>"
                            +       "<tr><td colspan=4 style='padding:10px 0px;'><td></tr>"
                            +       "<tr><td colspan=4>"
                            +       materialHtml
                            +       "</td></tr>"
                            +   "</table></div>");

        var navPills = $("<ul class='nav nav-pills'></ul>");
        var navTabs = $("<div class='tab-content'>");

        $.each(opdataFull.phases[i].attributesKeyFrames,function(j,v){
            var keyframe = opdataFull.phases[i].attributesKeyFrames[j];
            // console.log(keyframe)
            var navItems = $("<li class='nav-item'>"
                            +   "<a class='btn tabbing-btns horiz nav-link "+(j!=0 ? '' : 'active')+"' data-toggle='pill' href='#elite"+i+"Stats"+j+"'>lv "+keyframe.level+"</a>"
                            +"</li>");
            if(keyframe.data["respawnTime"] >= 100){
                var deploy = "Slow";
            } else if(keyframe.data["respawnTime"] < 100 && keyframe.data["respawnTime"] >= 30){
                var deploy = "Medium";
            } else {
                var deploy = "Fast";
            }
            var tabStats = $("<div class='tab-pane container "+(j!=0 ? 'fade' : 'active')+"' id='elite"+i+"Stats"+j+"'>"
                            +   "<table id='elite"+i+"Stats"+j+"Table'>"
                            +       "<tr>"
                            +           "<td class='stats-l'>MaxHP :</td><td class='stats-r'>"+keyframe.data["maxHp"]+"</td>"
                            +           "<td class='stats-l'>Def :</td><td class='stats-r'>"+keyframe.data["def"]+"</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>Atk :</td><td class='stats-r'>"+keyframe.data["atk"]+"</td>"
                            +           "<td class='stats-l'>MRes :</td><td class='stats-r'>"+keyframe.data["magicResistance"]+"</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td colspan=2 rowspan=4>"+rangeMaker(opdataFull.phases[i].rangeId)+"</td>"
                            +           "<td class='stats-l'>Redeploy :</td><td class='stats-r'>"+keyframe.data["respawnTime"]+" Sec</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>Cost :</td><td class='stats-r'>"+keyframe.data["cost"]+"</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>Block :</td><td class='stats-r'>"+keyframe.data["blockCnt"]+"</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>AtkTime :</td><td class='stats-r'>"+keyframe.data["baseAttackTime"]+" Sec</td>"
                            +       "</tr>"
                            // +       "<tr></tr>"
                            +       "<tr><td colspan=4>"
                            +       materialHtml
                            +       "</td></tr>"
                            +   "</table></div>");
            navPills.append(navItems);
            navTabs.append(tabStats);
        });
        statsCollapsible.append(statsLevelSlider);
        statsCollapsible.append(statsLevelDisplay);
        statsCollapsible.append(statsTable);
        //statsCollapsible.append(navPills);
        //statsCollapsible.append(navTabs);

        if(i > 0){

            var mats = $("<div class='small-container ak-shadow'>"
                        +   "<p>Elite "+i+"</p>"
                        +   "<span>Required materials</span>"
                        +   "<img class='topright' src='img/ui/elite/"+i+".png' width='100'>"
                        +   "<button class='btn btn-default btn-collapsible' data-toggle='collapse' data-target='#elite"+i+"MatsCollapsible'><i class='fa fa-sort-down'></i></button>"
                        +   "<div id='elite"+i+"MatsCollapsible' class='collapse collapsible'>"
                        +    materialist.join("")
                        +   "</div></div>");
        } else {
            var mats = $("");
        }
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

    function changeEliteLevel(el,elite_no){
        var value = $(el).val();
        $("#elite"+elite_no+"LevelDisplay").val(value);
        $("#elite"+elite_no+"LevelSlider").val(value);
        EliteStatsDisplay(value,elite_no);
    }

    function EliteStatsDisplay(level,elite_no){
        $("#elite"+elite_no+"maxHp").html(statsInterpolation('maxHp',level,elite_no));
        $("#elite"+elite_no+"def").html(statsInterpolation('def',level,elite_no));
        $("#elite"+elite_no+"atk").html(statsInterpolation('atk',level,elite_no));
        $("#elite"+elite_no+"magicResistance").html(statsInterpolation('magicResistance',level,elite_no));
        $("#elite"+elite_no+"respawnTime").html(statsInterpolation('respawnTime',level,elite_no)+" Sec");
        $("#elite"+elite_no+"cost").html(statsInterpolation('cost',level,elite_no));
        $("#elite"+elite_no+"blockCnt").html(statsInterpolation('blockCnt',level,elite_no));
        $("#elite"+elite_no+"baseAttackTime").html(statsInterpolation('baseAttackTime',level,elite_no)+" Sec");
    }

    function statsInterpolation(key,level,elite_no){
        var kf = [];
        $.each(opdataFull.phases[elite_no].attributesKeyFrames,function(j,v){
            kf[j] = v;
        });
        var pol = everpolate.linear([level],[kf[0].level,kf[1].level],[kf[0].data[key],kf[1].data[key]]);
        return Math.round(pol);
    }

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