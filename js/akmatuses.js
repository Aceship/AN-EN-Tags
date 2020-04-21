        $.holdReady(true);

        /*===== Retrieve and set language =====*/
        var lang;
        var reg;

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

        var d0 = $.getJSON("json/gamedata/en_US/gamedata/excel/item_table.json", function (data) {
            $.each(data.items, function (key, item) {
                if (key in materials) {
                    materials[key]["en"] = item.name;
                    materials[key]["iconId"] = item.iconId;
                }
            });
        });

        /*===== Put names into buttons =====*/
        $.when(d0).then(function() {
            $(".btn-tag").each(function() {
                $(this).text(materials[$(this).attr("mat-id")][lang])
            });
        });

        /*===== Retrieve and store characters =====*/
        var chars = { };
        var d1 = $.getJSON("json/gamedata/en_US/gamedata/excel/character_table.json", function (data) {
            $.each(data, function (key, char) {
                // retrieve E1 and E2 costs
                i = 0
                console.log(key)
                $.each(char.phases, function (_, phase) {
                    let elevel = "E" + i++;
                    if (phase.evolveCost) {
                        $.each(phase.evolveCost, function(_, mat) {
                            if (!(mat.id in chars)) chars[mat.id] = [];

                            chars[mat.id].push({
                                "class": elevel,
                                "id": key,
                                "name": char.name,
                                "count": mat.count,
                                "char_level": char.rarity + 1
                            });
                        });
                    }
                });

                // retrieve skills costs
                $.each(char.allSkillLvlup, function (skill_level, level) {
                    $.each(level.lvlUpCost, function (_, mat) {
                        if (!(mat.id in chars)) chars[mat.id] = [];
                        chars[mat.id].push({
                            "class": "Skill-up",
                            "id": key,
                            "name": char.name,
                            "count": mat.count,
                            "char_level": char.rarity + 1,
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
                            if (!(mat.id in chars)) chars[mat.id] = [];

                            chars[mat.id].push({
                                "class": "Skill-up",
                                "id": key,
                                "name": char.name,
                                "count": mat.count,
                                "char_level": char.rarity + 1,
                                "skill_index": skill_index + 1,
                                "skill_level": skill_level + 8
                            });
                        });
                    });
                });
            });
            
        });

        
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

        $.when(d0, d1).then(function () {
            if (checkedTags.length) {
                actualize();
            }
            $.holdReady(false)
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
            localStorage.setItem(size, parseInt($(el).attr('title')));

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
                case "kr": $('#display-lang').text("Korean");   console.log('Japanese');break;
            }

            localStorage.setItem("gameRegion", reg);
            localStorage.setItem("webLang", lang);

            // rename tags given the language
            $(".btn-tag").each(function (_, btn) {
                btn.text(materials[btn["mat-id"]][lang]);
            });

            console.log("done");
            actualize();
        }

        var total_materials = {};
        var inverse_levels = {"Skill-up": 2, "E1": 1, "E2": 0};
        var skill_levels = ["0", "1", "2", "3", "4", "5", "6", "7", "M-1", "M-2", "M-3"];
        function actualize() {
            $("#tbody-recommend").html("");

            chars_selection = {}
            $(".btn-primary.btn-tag").each(function(_, btn) {
                let mat_id = $(btn).attr("mat-id");
                chars_selection[mat_id] = $.map($.extend(true, {}, chars[mat_id]), val => [val]);
            });

            for (let key in chars_selection) {
                // filter by stars and levels
                chars_selection[key] = chars_selection[key].filter(char =>
                    optStars.includes(char["char_level"].toString()) && optLevels.includes(char["class"]));
                // sort by stars > levels > skill index (if any) > skill level (if any) > name
                chars_selection[key] = chars_selection[key].sort((a, b) =>
                    (b.char_level - a.char_level) * 1000 +
                    (inverse_levels[b.class] - inverse_levels[a.class]) * 250 +
                    ((('skill_level' in a) ? a.skill_level : 0) - (('skill_level' in b) ? b.skill_level : 0)) * 20 +
                    ((('skill_index' in a) ? a.skill_index : 0) - (('skill_index' in b) ? b.skill_index : 0)) * 5 +
                    b.name.localeCompare(a.name) + 1);
            }

            var showImage = JSON.parse(localStorage.getItem('showImage'))
            var showInfo = JSON.parse(localStorage.getItem('showInfo'))
            var size = JSON.parse(localStorage.getItem('size'))
            
            $.each(chars_selection, function (mat_id, chars) {
                let padding = showInfo && size < 60
                            ? "padding-right: 1px;"
                            : "padding-right: 1px;";
                let style = showImage
                          ? 'style="padding: 1px 1px; ' + padding + '" '
                          : "";
                let buttonstyle = size > 25
                                ? "background-color: #AAA"
                                : "background-color: transparent";

                let body = ['<tr class="tr-recommd"><td>', materials[mat_id][lang], "</td><td>"];

                total_materials[mat_id] = 0;
                console.log(chars)
                for (let char of chars) {
                    
                    total_materials[mat_id] += char.count;

                    body.push('<button type="button"' +
                              ' class="ak-shadow-small ak-btn btn btn-sm btn-char my-1 ak-rare-' + char.char_level + '"' +
                              ' data-toggle="tooltip" data-placement="bottom" onclick="charSwap(this)"' +
                              style + ' "title="' + char.name + '" mat-id="' + mat_id + '" mat-count=' + char.count + '>');

                    if (showImage) {
                        body.push('<img style="' + buttonstyle
                                + '" height="' + size
                                + '" width="' + size
                                + '" src="./img/avatars/' + char.id + '.png">');
                    }
                    
                    if(size > 60||!showImage) body.push("<div style='background:#222'>")
                    body.push(`<div style='background:#333;color:#aaa;
                    ${(size < 60)||!showImage?
                    `padding:${showImage?size/2-10+'px 2px;display:inline;':"2px 2px"} `:
                    `padding:2px 2px`}'>${char.name}</div>`)
                    if(showInfo) {
                        let info = `<div style='background:#222;border-radius:2px;margin:1px'>`;
                        if (char.class == "Skill-up") {
                            info += "";
                            var titleimg = skill_levels[char.skill_level]
                            if (char.skill >= 7) titleimg = char.skill_level;
                            // info += skill_levels[char.skill_level];
                            info += `<img src='img/ui/rank/${skill_levels[char.skill_level].toLocaleLowerCase()}.png' style='width:40px;height:40px'title='Skill ${titleimg}'>`;
                        } else {
                            if(char.class=="E1")info += "<img src='img/ui/elite/1-s.png'>";
                            else info += "<img src='img/ui/elite/2-s.png'>";
                            
                        }
                        info+="</div>"
                        body.push(info + `<div class="item-amount" style="font-weight: bold; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000;color:#ddd">${char.count}x</div>`);
                    }else{
                        let info = `<div style='background:#222;border-radius:2px;margin:1px;color:#aaa;padding:1px 5px;min-width:50px'>`;
                        if (char.class == "Skill-up") {
                            info += "Skill ";
                            var titleimg = skill_levels[char.skill_level]
                            if (char.skill >= 7) titleimg = char.skill_level;
                            info += skill_levels[char.skill_level];
                            // info += `<img src='img/ui/rank/${skill_levels[char.skill_level].toLocaleLowerCase()}.png' style='width:40px;height:40px'title='Skill ${titleimg}'>`;
                        } else {
                            if(char.class=="E1")info += "Elite 1";
                            else info += "Elite 2";
                        }
                        info+="</div>"
                        body.push(info + `<div class="item-amount" style="font-weight: bold; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000;color:#ddd">${char.count}x</div>`);
                    }
                    if(size > 60) body.push("</div>")
                
                    body.push("</button>\n")
                }

                body.push('<td><div class="internal-container" style="position: relative;width:100px;">' +
                            '<img class="item-rarity" width=100 height=100 style="top: 0; left: 0; z-index: 0;" src="img/material/bg/item-' + (mat_id % 10) + '.png">' +
                            '<img class="item-image" width=100 height=100 style="top:0; left: 0; padding: 10px; z-index: 1; position: absolute;object-fit: contain;" src="img/items/' + materials[mat_id].iconId + '.png">' +
                            '<div class="item-amount" style="font-weight: bold; bottom: 0; right: 0; padding: 0px 2px 0px 2px; border-radius: 5px; z-index: 2; background-color: #000000; position: absolute;" mat-id="' + mat_id + '">' + total_materials[mat_id] + "x</div>" +
                          "</div></td>");
                $("#tbody-recommend").append(body.join(""));
            });

            $('[data-toggle="tooltip"]').tooltip();
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