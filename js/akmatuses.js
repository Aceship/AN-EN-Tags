$.holdReady(true);

/*===== Retrieve and set language =====*/
var lang;
var reg;
var Alllang={
                'en':{
                    "path":"en_US",
                    "char":"en",
                    "i":0
                },
                'cn':{
                    "path":"zh_CN",
                    "char":"cn",
                    "i":1
                },
                'jp':{
                    "path":"ja_JP",
                    "char":"en",
                    "i":2
                },
                'kr':{
                    "path":"ko_KR",
                    "char":"en",
                    "i":3
                }
            }

if(!localStorage.getItem('gameRegion') || !localStorage.getItem('webLang')){
    localStorage.setItem("gameRegion", 'cn');
    localStorage.setItem("webLang", 'en');
    reg = "cn";
    lang = "en";
} else {
    reg = localStorage.getItem('gameRegion');
    lang = localStorage.getItem('webLang');
}

$('.reg[value=' + reg + ']').addClass('selected');
$('.lang[value=' + lang + ']').addClass('selected');

/*===== Initialize the ★ option =====*/
function actualize_optStars() {
    optStars = []
    $('button[opt-group="1"].btn-primary').each(function() {
        optStars.push($(this).attr("opt-id"))
    });

    localStorage.setItem("optStars", JSON.stringify(optStars));
}

if (!localStorage.getItem('optStars')) {
    actualize_optStars();
} else {
    optStars = JSON.parse(localStorage.getItem('optStars'));
    $('button[opt-group="1"]').each(function() {
        if (!optStars.includes($(this).attr("opt-id"))) {
            $(this).removeClass('btn-primary').addClass('btn-secondary');
        }
    });
}

/*===== Initialize the level option =====*/
function actualize_optLevels() {
    optLevels = []
    $('button[opt-group="2"].btn-primary').each(function() {
        optLevels.push($(this).text());
    });

    localStorage.setItem("optLevels", JSON.stringify(optLevels));
}

if (!localStorage.getItem('optLevels')) {
    actualize_optLevels();
} else {
    optLevels = JSON.parse(localStorage.getItem('optLevels'));
    $('button[opt-group="2"]').each(function() {
        if (!optLevels.includes($(this).text())) {
            $(this).removeClass('btn-primary').addClass('btn-secondary');
        }
    });
}

/*===== Initialize the tags =====*/
function actualize_tags() {
    checkedTags = []
    $(".btn-tag").each(function () {
        if ($(this).hasClass("btn-secondary")) return;
        checkedTags.push($(this).attr("mat-id"));
    });

    localStorage.setItem("checkedTags", JSON.stringify(checkedTags));
}

if (!localStorage.getItem('checkedTags')) {
    actualize_tags();
} else {
    checkedTags = JSON.parse(localStorage.getItem('checkedTags'));
    $(".btn-tag").each(function() {
        if (checkedTags.includes($(this).attr("mat-id"))) {
            $(this).removeClass('btn-secondary').addClass('btn-primary');
        }
    });
}

/*===== Retrieve and store materials =====*/
var materials = {}
$(".btn-tag").each(function () {
    materials[$(this).attr("mat-id")] = {};
});

var d0=[,,,]
$.each(Alllang, function (Lang,val){
    d0[val["i"]] = $.getJSON("json/gamedata/"+val["path"]+"/gamedata/excel/item_table.json", function (data) {
        $.each(data.items, function (key, item) {
            if (key in materials) {
                materials[key][Lang] = item.name;
                materials[key]["iconId"] = item.iconId;
            }
        });
    });
})

console.log("materials",materials)
        
/*===== Put names into buttons =====*/
$.when(d0[0],d0[1],d0[2],d0[3]).then(function() {
    $(".btn-tag").each(function() {
        $(this).text(materials[$(this).attr("mat-id")][lang])
    });
});

/*===== Retrieve and store characters =====*/
var charsLib = [{"path":"en_US","Lang":"en"} ,{"path":"zh_CN","Lang":"cn"}];
var charsmat={'en':{},'cn':{}}
var charparse={}
var d1=[,]
var d2=[,]
var d3=[,]
var mat_total={'en':{},'cn':{}}

// character_table.json
$.each(charsLib, function (i,val){
    d1[i] = $.getJSON("json/gamedata/"+val["path"]+"/gamedata/excel/character_table.json", function (data) {
        $.each(data, function (key, char) {
            // retrieve E1 and E2 costs
            i = 0
            $.each(char.phases, function (_, phase) {
                let elevel = "E" + i++;
                if (phase.evolveCost) {
                    $.each(phase.evolveCost, function(_, mat) {
                        if (!(mat.id in charsmat[val["Lang"]])) charsmat[val["Lang"]][mat.id] = [];
                        charsmat[val["Lang"]][mat.id].push({
                            "class": elevel,
                            "id": key,
                            "name": val["Lang"]=='en'?char.name:char.appellation,
                            "count": mat.count,
                            "char_level": char.rarity.length>1?Number(char.rarity.slice(-1)):char.rarity + 1
                        })
                        if(!(key in charparse)) {
                            charparse[key]={"name":val["Lang"]=='en'?char.name:char.appellation,
                                            "char_level":char.rarity.length>1?Number(char.rarity.slice(-1)):char.rarity + 1}}
                    });
                }
            });

            // retrieve skills costs
            $.each(char.allSkillLvlup, function (skill_level, level) {
                $.each(level.lvlUpCost, function (_, mat) {
                    if (!(mat.id in charsmat[val["Lang"]])) charsmat[val["Lang"]][mat.id] = [];
                    charsmat[val["Lang"]][mat.id].push({
                        "class": "Skill-up",
                        "id": key,
                        "name": val["Lang"]=='en'?char.name:char.appellation,
                        "count": mat.count,
                        "char_level": char.rarity.length>1?Number(char.rarity.slice(-1)):char.rarity + 1,
                        "skill_index": 0,
                        "skill_level": skill_level + 2
                    });
                });
            });

            /// Skill #
            s = 0;
            $.each(char.skills, function (skill_index, skill) {
                s += 1;
                /// Skill level
                l = 0;
                $.each(skill.levelUpCostCond, function (skill_level, level) {
                    l += 8;
                    $.each(level.levelUpCost, function (_, mat) {
                        if (!(mat.id in charsmat[val["Lang"]])) charsmat[val["Lang"]][mat.id] = [];
                        charsmat[val["Lang"]][mat.id].push({
                            "class": "Skill-up",
                            "id": key,
                            "name": val["Lang"]=='en'?char.name:char.appellation,
                            "count": mat.count,
                            "char_level": char.rarity.length>1?Number(char.rarity.slice(-1)):char.rarity + 1,
                            "skill_index": skill_index + 1,
                            "skill_level": skill_level + 8
                        });
                    });
                });
            });
        });
    });
})

// char_patch_table.json
$.each(charsLib, function (i,val){
    d2[i] = $.getJSON("json/gamedata/"+val["path"]+"/gamedata/excel/char_patch_table.json", function (data) {
        $.each(data.patchChars, function (key, char) {
            // retrieve E1 and E2 costs
            i = 0
            $.each(char.phases, function (_, phase) {
                let elevel = "E" + i++;
                if (phase.evolveCost) {
                    $.each(phase.evolveCost, function(_, mat) {
                        if (!(mat.id in charsmat[val["Lang"]])) charsmat[val["Lang"]][mat.id] = [];
                        charsmat[val["Lang"]][mat.id].push({
                            "class": elevel,
                            "id": key,
                            "name": val["Lang"]=='en'?char.name+" (Guard)":char.appellation+" (Guard)",
                            "count": mat.count,
                            "char_level": char.rarity.length>1?Number(char.rarity.slice(-1)):char.rarity + 1
                        })
                        if(!(key in charparse)) {
                        charparse[key]={"name":val["Lang"]=='en'?char.name+" (Guard)":char.appellation+" (Guard)",
                                        "char_level":char.rarity.length>1?Number(char.rarity.slice(-1)):char.rarity + 1}}
                    });
                }
            });

            // retrieve skills costs
            $.each(char.allSkillLvlup, function (skill_level, level) {
                $.each(level.lvlUpCost, function (_, mat) {
                    if (!(mat.id in charsmat[val["Lang"]])) charsmat[val["Lang"]][mat.id] = [];
                    charsmat[val["Lang"]][mat.id].push({
                        "class": "Skill-up",
                        "id": key,
                        "name": val["Lang"]=='en'?char.name+" (Guard)":char.appellation+" (Guard)",
                        "count": mat.count,
                        "char_level": char.rarity.length>1?Number(char.rarity.slice(-1)):char.rarity + 1,
                        "skill_index": 0,
                        "skill_level": skill_level + 2
                    });
                });
            });

            /// Skill #
            s = 0;
            $.each(char.skills, function (skill_index, skill) {
                s += 1;
                /// Skill level
                l = 0;
                $.each(skill.levelUpCostCond, function (skill_level, level) {
                    l += 8;
                    $.each(level.levelUpCost, function (_, mat) {
                        if (!(mat.id in charsmat[val["Lang"]])) charsmat[val["Lang"]][mat.id] = [];
                        charsmat[val["Lang"]][mat.id].push({
                            "class": "Skill-up",
                            "id": key,
                            "name": val["Lang"]=='en'?char.name+" (Guard)":char.appellation+" (Guard)",
                            "count": mat.count,
                            "char_level": char.rarity.length>1?Number(char.rarity.slice(-1)):char.rarity + 1,
                            "skill_index": skill_index + 1,
                            "skill_level": skill_level + 8
                        });
                    });
                });
            });
        });
    });
})

// uniequip_table.json
$.when(d1[0],d1[1],d2[0],d2[1]).then(function () {
    console.log("charparse",charparse)
    $.each(charsLib, function (i,val){
        d3[i] = $.getJSON("json/gamedata/"+val["path"]+"/gamedata/excel/uniequip_table.json", function (data) {
            $.each(data.equipDict, function (_,mod) {
                if(mod.charEquipOrder>0){
                    for (i=0;i<3;i++){
                        for(j=0;j<mod.itemCost[String(i+1)].length;j++){
                            if(mod.itemCost[String(i+1)][j].type!="GOLD"){
                                //console.log(mod.itemCost[String(i+1)][j].id)
                                if(!(mod.itemCost[String(i+1)][j].id in charsmat[val["Lang"]])) charsmat[val["Lang"]][mod.itemCost[String(i+1)][j].id] = [];
                                charsmat[val["Lang"]][mod.itemCost[String(i+1)][j].id].push({
                                    "class": "Module",
                                    "id": mod.charId,
                                    "name": charparse[mod.charId]["name"],
                                    "count": mod.itemCost[String(i+1)][j].count,
                                    "mod_index": (mod.typeIcon).toLowerCase(),
                                    "mod_level": i+1,
                                    "char_level": charparse[mod.charId].char_level
                                })
                            }
                        }
                    }
                }
            })
        })
    })
    $.when(d3[0],d3[1]).then(function () {
        $.each(charsmat, function (Lang,mat){
            $.each(mat, function(matid,char){
                $.each(char, function(_,val){
                    if(!(matid in mat_total[Lang])) mat_total[Lang][matid]=0
                    mat_total[Lang][matid]+=val.count
                })
            })
        })
        mat_modal()
        console.log("mat_total",mat_total)
        actualize()
        $.holdReady(false)
        console.log('All Ready !!!')
    });
})

console.log("charsmat",charsmat)

$(document).ready(function() {
    $.getScript("js/aknav.js", function() {
        $('#to-tag').click(function() {      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });

        $('.dropdown-trigger').dropdown();
        $('[data-toggle="tooltip"]').tooltip();
    });

    /*===== Initialize the display options =====*/
    if (!localStorage.getItem('showInfo')) {
        localStorage.setItem("showInfo", JSON.stringify(true));
    } else if (!JSON.parse(localStorage.getItem('showImage'))) {
        $("#showInfo").toggleClass("btn-primary btn-secondary");
    }
    
    if (!localStorage.getItem('showImage')) {
        localStorage.setItem("showImage", JSON.stringify(true));
    } else if (!JSON.parse(localStorage.getItem('showImage'))) {
        $("#showImage").toggleClass("btn-primary btn-secondary");
    }

    if (!localStorage.getItem('size')) {
        localStorage.setItem("size", JSON.stringify(40));
    } else if (!JSON.parse(localStorage.getItem('showImage'))) {
        $("#showImage").toggleClass("btn-primary btn-secondary");
    }

    $(".imagesizeselect").each(function(_, el) {
        let size = JSON.parse(localStorage.getItem('size'));

        $("#selectedImageSize").html(JSON.parse(localStorage.getItem('size')));
        if ($(el).attr("title") == size) {
            $("<span> <<</span>").appendTo(el);
        } else {
            $(el).html($(el).attr("title"));
        }
    });
});

function regDropdown(el) {
    localStorage.setItem('gameRegion', el.attr("value"));
    $(".dropdown-item.reg").removeClass("selected");
    el.addClass("selected");
    changeUILanguage(true);
}

function langDropdown(el) {
    localStorage.setItem('webLang', el.attr("value"));
    console.log("language : " + localStorage.getItem('webLang'))
    $(".dropdown-item.lang").removeClass("selected");
    el.addClass("selected");
    changeUILanguage(true);
}

function clickBtnClear() {
    $('.btn-tag').removeClass('btn-primary').addClass('btn-secondary');
    $("#tbody-recommend").html("");

    checkedTags = [];
    localStorage.removeItem('checkedTags');
}

function clickBtnOpt(el) {
    $(el).toggleClass("btn-primary btn-secondary");
    let checked = $(el).hasClass("btn-primary");

    // check all opt buttons when checking ALL
    if ($(el).hasClass("opt-all")) {
        if (checked) {
            $('button[opt-group="' + $(el).attr("opt-group") + '"]').each(function(_, __) {
                $(this).removeClass("btn-primary btn-secondary").addClass("btn-primary");
            });
        }
        else{ // uncheck all if uncheck [ALL]
            $('button[opt-group="' + $(el).attr("opt-group") + '"]').each(function (_, __) {
                $(this).removeClass("btn-primary btn-secondary").addClass("btn-secondary");
            })
        }
    } else if (!checked) { // else unckeck ALL if a button is unchecked
        $('button[opt-group="' + $(el).attr("opt-group") + '"].opt-all').each(function (_, __) {
            $(this).removeClass("btn-primary btn-secondary").addClass("btn-secondary");
        });
    }
    
    actualize_optStars();
    actualize_optLevels();
    actualize();
}

function clickBtnOpt2(el) {
    $(el).toggleClass("btn-primary btn-secondary");
    localStorage.setItem('showInfo', JSON.stringify($(el).hasClass("btn-primary")));

    actualize();
}

function clickBtnOpt3(el) {
    $(el).toggleClass("btn-primary btn-secondary");
    localStorage.setItem('showImage', JSON.stringify($(el).hasClass("btn-primary")));

    actualize();
}

function changeImageSize(el) {
    localStorage.setItem('size', parseInt($(el).attr('title')));

    $("#selectedImageSize").html(JSON.parse(localStorage.getItem('size')));
    $(".imagesizeselect").each(function() {
        let size = JSON.parse(localStorage.getItem('size'));
        if($(this).attr("title") == size) {
            $("<span> <<</span>").appendTo(this);
        } else {
            $(this).html($(this).attr("title"));
        }
    });

    actualize();
}

function clickBtnTag(el) {
    $(el).toggleClass("btn-primary btn-secondary");

    actualize_tags();
    actualize();
}

function changeUILanguage() {
    reg = localStorage.getItem('gameRegion');
    lang = localStorage.getItem('webLang');

    console.log(lang)
    console.log(reg)
    $('#display-reg').text(reg.toUpperCase())
    switch (lang) {
        case "en": $('#display-lang').text("English");  console.log('English'); break;
        case "cn": $('#display-lang').html("Chinese");  console.log('Chinese'); break;
        case "jp": $('#display-lang').text("Japanese"); console.log('Japanese');break;
        case "kr": $('#display-lang').text("Korean");   console.log('Korean');break;
    }

    localStorage.setItem("gameRegion", reg);
    localStorage.setItem("webLang", lang);

    // rename tags given the language
    $(".btn-tag").each(function (_, btn) {
        $(btn).text(materials[$(btn).attr("mat-id")][reg]);
    });

    console.log("done");
    actualize();
}

var total_materials = {};
var inverse_levels = {"Skill-up": 2, "E1": 1, "E2": 0,"Module":3};
var skill_levels = ["0", "1", "2", "3", "4", "5", "6", "7", "M-1", "M-2", "M-3",];
function actualize() {
    $("#tbody-recommend").html("");

    chars_selection = {}
    $(".btn-primary.btn-tag").each(function(_, btn) {
        let mat_id = $(btn).attr("mat-id");
        chars_selection[mat_id] = $.map($.extend(true, {}, charsmat[Alllang[reg]["char"]][mat_id]), val => [val]);
    });
    for (let key in chars_selection) {
        // filter by stars and levels
        chars_selection[key] = chars_selection[key].filter(char =>
            optStars.includes(char["char_level"].toString()) && optLevels.includes(char["class"]));
        // sort by stars > levels > skill index (if any) > skill level (if any) > name
        chars_selection[key] = chars_selection[key].sort((a, b) => { // Positive b then a while negative a then b

            let s1 = (b.char_level - a.char_level) * 50000 // compare rarity 6 > 1
            let s2 = (inverse_levels[b.class] - inverse_levels[a.class]) * 10000 // compare class Module > skill > E2 > E1
            let s3 = ('mod_index' in b && 'mod_index' in a)?a.name.localeCompare(b.name)* 2500:0 // compare name alphabatically when both module 
            let s4 = (('mod_index' in a) ? a.mod_index.slice(-1) : 'Z').localeCompare(('mod_index' in b) ? b.mod_index.slice(-1):"Z") * 1000 // compare get x > y > not module
            let s5 = ((('mod_level' in a) ? a.mod_level : 0) - (('mod_level' in b) ? b.mod_level : 0))* 250 // compare module lv 1 > 3 > not module
            let s6 = ((('skill_level' in a) ? a.skill_level : 0) - (('skill_level' in b) ? b.skill_level : 0)) * 20 // compare skill lv 1 > 10(M3)
            let s7 = ((('skill_index' in b) ? b.skill_index : 0) - (('skill_index' in a) ? a.skill_index : 0)) * 5 // compare skill index S1 > S3
            let s8 = a.name.localeCompare(b.name) // compare name alphabatically

            return s1+s2+s3+s4+s5+s6+s7+s8
        }); 
    } console.log(chars_selection)
    
    var showImage = JSON.parse(localStorage.getItem('showImage'))
    var showInfo = JSON.parse(localStorage.getItem('showInfo'))
    var size = JSON.parse(localStorage.getItem('size'))
    
    $.each(chars_selection, function (mat_id, chars) {
        let style = 'style="padding:2px;"';
        let buttonstyle = size > 25
                        ? "background-color: #AAA"
                        : "background-color: transparent";

        let body = ['<tr class="tr-recommd"><td>', materials[mat_id][lang], "</td><td>"];

        total_materials[mat_id] = 0;
        console.log(chars)
        for (let char of chars) {
            
            total_materials[mat_id] += char.count;

            body.push(  '<button type="button"' +
                        ' class="ak-shadow-small ak-btn btn btn-sm btn-char my-1 ak-rare-' + char.char_level + '"' +
                        ' data-toggle="tooltip" data-placement="bottom" onclick="charSwap(this)"' +
                        style + ' "title="' + char.name + '" mat-id="' + mat_id + '" mat-count=' + char.count + '>');

            if (showImage) {
                if (size < 60) {
                    body.push('<div style="display:flex;">');
                }
                body.push('<img style="' + buttonstyle
                        + '" height="' + size
                        + '" width="' + size
                        + '" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/' + char.id + '.png">');
            }

            body.push(`<div style='background:#333;color:#aaa;width:100%;
            ${(size < 60)||!showImage?
            `padding:${showImage?size/2-10+'px 7px 0px 7px;':"2px 2px"} `:
            `padding:2px 2px`}'>${char.name}</div>`)
            if (showImage && size < 60) {
                body.push('</div>');
            }
            if(showInfo) {
                let info = `<div style='background:#222;margin:2px 0px 2px 0px;width:100%;'>`;
                if (char.class == "Skill-up") {
                    var titleimg = char.skill_level?skill_levels[char.skill_level]:skill_levels[char.mod_level]
                    if (char.skill >= 7) titleimg = char.skill_level;
                    // info += skill_levels[char.skill_level];
                    if (char.skill_index > 0) {
                        info = `<div style='background-color:transparent;margin:2px 0px 2px 0px;display:flex;width:100%;'>`;
                        info += `<div style='color:#ffffff;font-size:24px;font-weight:bold;background:#000;width:50%;float:left;margin-right:1px;display:flex;justify-content:center;align-items:center;padding:0px 5px 0px 5px;'>S${char.skill_index}</div>`;
                        info += `<div style="background:#222; width:50%; float:right; display:flex; justify-content:center; margin-left:1px;padding:0px 5px 0px 5px;">`
                    }
                    info += `<img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/rank/${skill_levels[char.skill_level].toLocaleLowerCase()}.png' style='width:40px;height:40px'title='Skill ${titleimg}'>`;
                    if (char.skill_index > 0) {
                        info += "</div>";
                    }
                } else if (char.class == "Module") {
                    info = `<div style='background-color:transparent;margin:2px 0px 2px 0px;display:flex;width:100%;'>`;
                        info += `<div style='color:#ffffff;font-size:14px;font-weight:bold;background:#000;width:50%;float:left;margin-right:1px;display:flex;justify-content:center;align-items:center;padding:0px 5px 0px 5px;'>
                                    <img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/equip/type/${char.mod_index}.png' style='width:40px;height:40px'title='${char.mod_index.toUpperCase()}'>
                                </div>`
                        info += `<div style="background:#222; width:50%; float:right; display:flex; justify-content:center; margin-left:1px;padding:0px 5px 0px 5px;">`
                        info += `<img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/equip/stage/img_stg${char.mod_level}.png' style='width:40px;height:40px'title='Level ${char.mod_level}'></div>`;
                } else {
                    if(char.class=="E1")info += "<img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/1-s.png'>";
                    else info += "<img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/elite/2-s.png'>";
                }
                info+="</div>"
                //body.push(info + `<div class="item-amount" style="font-weight: bold; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000;color:#ddd">${char.mod_index?"["+char.mod_index.toUpperCase()+"] - ":""}${char.count}x</div>`);
                if(char.class=="Module"){
                    body.push(info + `  <div style='background-color:transparent;margin:2px 0px 0px 0px;display:flex;width:100%;'>
                                            <div class="mod-index" style="padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000;color:#ddd ;width:50%; float:left; display:flex; justify-content:center;align-items:center;margin-right:1px">${char.mod_index.toUpperCase()}</div>
                                            <div class="item-amount" style="font-weight: bold; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000;color:#ddd ;width:50%; float:right; display:flex; justify-content:center;align-items:center;margin-left:1px">${char.count}x</div>`);
                }else{
                    body.push(info + `<div class="item-amount" style="font-weight: bold; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000;color:#ddd">${char.mod_index?"["+char.mod_index.toUpperCase()+"] - ":""}${char.count}x</div>`);
                }
            }else{
                let info = `<div style='background:#222;margin:2px 0px 2px 0px;color:#aaa;padding:0px 5px 0px 5px;min-width:50px'>`;
                if (char.class == "Skill-up") {
                    if (char.skill_index == 0) {
                        info += "Skill Level ";
                    } else {
                        info += `Skill ${char.skill_index} `;
                    }
                    var titleimg = skill_levels[char.skill_level]
                    if (char.skill >= 7) titleimg = char.skill_level;
                    info += skill_levels[char.skill_level];
                    // info += `<img src='https://raw.githubusercontent.com/Aceship/Arknight-Images/main/ui/rank/${skill_levels[char.skill_level].toLocaleLowerCase()}.png' style='width:40px;height:40px'title='Skill ${titleimg}'>`;
                } else if (char.class == "Module"){
                    info += `Module ${char.mod_index.slice(-1).toUpperCase()} ${char.mod_level} `
                } else {
                    if(char.class=="E1")info += "Elite 1";
                    else info += "Elite 2";
                }
                info+="</div>"
                body.push(info + `<div class="item-amount" style="font-weight: bold; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000;color:#ddd">${char.count}x</div>`);
            }
        
            body.push("</button>\n")    
        }
        body.push(  '<td><div class="internal-container" style="position: relative;width:100px;">' +
                    '<img class="item-rarity" width=100 height=100 style="top: 0; left: 0; z-index: 0;" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/material/bg/item-' + (mat_id.includes("update_token_1")?'4':mat_id.includes("mod")?'5':String(mat_id % 10)) + '.png">' +
                    '<img class="item-image" width=100 height=100 style="top:0; left: 0; padding: 10px; z-index: 1; position: absolute;object-fit: contain;" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/items/' + materials[mat_id].iconId + '.png">' +
                    '<div class="item-amount" style="font-weight: bold; bottom: 0; right: 0; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000; position: absolute;" mat-id="' + mat_id + '">' + total_materials[mat_id] + "x</div>" +
                    "</div></td>");
        $("#tbody-recommend").append(body.join(""));
    });

    $('[data-toggle="tooltip"]').tooltip();
}

function mat_modal(){
    var modalhtml=[]
    var LangLib=['en','cn']
    var matLib=Object.keys(materials).sort()

    console.log(matLib)

    // Tier 5-1
    for(var Tier = 5;Tier > 0;Tier--){
        modalhtml.push(`<tr class="tr-matusage"><td>Tier ${Tier}</td>`)
        LangLib.forEach(Lang => {
            modalhtml.push('<td>')
            matLib.forEach(id => {
                if(id.slice(-1)==Tier && id.length==5){
                        modalhtml.push('<div class="internal-container" style="position: relative;width:100px;display: inline-block;">' +
                                    '<img class="item-rarity" width=100 height=100 style="top: 0; left: 0; z-index: 0;" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/material/bg/item-' + (id.includes("update_token_1")?'4':id.includes("mod")?'5':String(id % 10)) + '.png">' +
                                    '<img class="item-image" width=100 height=100 style="top:0; left: 0; padding: 10px; z-index: 1; position: absolute;object-fit: contain;" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/items/' + materials[id].iconId + `.png" title="${materials[id][Lang]}">` +
                                    '<div class="item-amount" style="font-weight: bold; bottom: 0; right: 0; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000; position: absolute;" mat-id="' + id + '">' + mat_total[Lang][id] + 'x</div>' +
                                    '</div>')
                }
            })
            modalhtml.push('</td>')
        })
        modalhtml.push('</tr>')
    }

    // Skill Book
    modalhtml.push(`<tr class="tr-matusage"><td>Skill Book</td>`)
    LangLib.forEach(Lang => {
        modalhtml.push('<td>')
        matLib.forEach(id => {
            if(id.length==4){
                    modalhtml.push('<div class="internal-container" style="position: relative;width:100px;display: inline-block;">' +
                                '<img class="item-rarity" width=100 height=100 style="top: 0; left: 0; z-index: 0;" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/material/bg/item-' + (id.includes("update_token_1")?'4':id.includes("mod")?'5':String(id % 10)) + '.png">' +
                                '<img class="item-image" width=100 height=100 style="top:0; left: 0; padding: 10px; z-index: 1; position: absolute;object-fit: contain;" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/items/' + materials[id].iconId + `.png" title="${materials[id][Lang]}">` +
                                '<div class="item-amount" style="font-weight: bold; bottom: 0; right: 0; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000; position: absolute;" mat-id="' + id + '">' + mat_total[Lang][id] + 'x</div>' +
                                '</div>')
            }
        })
        modalhtml.push('</td>')
    })
    modalhtml.push('</tr>')
    // Module
    modalhtml.push(`<tr class="tr-matusage"><td>Module Material</td>`)
    LangLib.forEach(Lang => {
        modalhtml.push('<td>')
        matLib.slice(-3,).forEach(id => {
                    modalhtml.push('<div class="internal-container" style="position: relative;width:100px;display: inline-block;">' +
                                '<img class="item-rarity" width=100 height=100 style="top: 0; left: 0; z-index: 0;" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/material/bg/item-' + (id.includes("update_token_1")?'4':id.includes("mod")?'5':String(id % 10)) + '.png">' +
                                '<img class="item-image" width=100 height=100 style="top:0; left: 0; padding: 10px; z-index: 1; position: absolute;object-fit: contain;" src="https://raw.githubusercontent.com/Aceship/Arknight-Images/main/items/' + materials[id].iconId + `.png" title="${materials[id][Lang]}">` +
                                '<div class="item-amount" style="font-weight: bold; bottom: 0; right: 0; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000; position: absolute;" mat-id="' + id + '">' + mat_total[Lang][id] + 'x</div>' +
                                '</div>')
        })
        modalhtml.push('</td>')
    })
    modalhtml.push('</tr>')

    $("#tbody-matuasge").append(modalhtml.join(""))
}

function charSwap(el) {
    let mat_id = $(el).attr("mat-id");
    let removed = $(el).hasClass("removed-char");
    if (removed) {
        total_materials[mat_id] += parseInt($(el).attr("mat-count"), 10);
        $(el).removeClass("removed-char");
        $(el).css("opacity", "1");
    } else {
        total_materials[mat_id] -= parseInt($(el).attr("mat-count"), 10);
        $(el).addClass("removed-char");
        $(el).css("opacity", "0.5");
    }

    $('div[mat-id="' + mat_id + '"].item-amount').text(total_materials[mat_id] + "x");
}

function doubleclick(el) {
    setTimeout(function(){
        $(el).click();
    }, 200);
    $(el).click();
}