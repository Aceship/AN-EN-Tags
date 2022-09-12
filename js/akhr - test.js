        $.holdReady(true);
    
        var lang;
        var reg;

        var checkedTags = [];
        var checkedTagsTL = [];

        if(!localStorage.getItem('checkedTagsCache')){
            localStorage.removeItem("checkedTagsCache");
            localStorage.removeItem("checkedTagsTLCache");
        }
        var globalOptStars = [];
        var JsonDATA = [];
        var tags_aval = {};
        var all_chars = {};
        var avg_char_tag = 0;
        var data1, data2, data3;
        var d0 = $.getJSON("json/tl-akhr.json", function (data) {

                if(!localStorage.getItem('gameRegion') || !localStorage.getItem('webLang')){
                    localStorage.setItem("gameRegion", 'cn');
                    localStorage.setItem("webLang", 'en');
                    reg = "cn";
                    lang = "en";
                } else {
                    reg = localStorage.getItem('gameRegion');
                    lang = localStorage.getItem('webLang');
                }
                $('.reg[value='+reg+']').addClass('selected');
                $('.lang[value='+lang+']').addClass('selected');

                let tag_count = 0;
                let char_tag_sum = 0;
                // console.log(data);
                $.each(data, function (_, char) {
                    if (char.hidden) return;
                    char.tags.push(char.type);
                    if(reg == 'cn'){
                        char.tags.push(char.sex + "性干员");
                    } else {
                        char.tags.push(char.sex);
                    }
                    $.each(char.tags, function (_, tag) {
                        if (tag in tags_aval) {
                            tags_aval[tag].push({ 
                                'id': char.id,
                                "name_en": char.name_en, 
                                "name": char['name_'+reg],
                                "name_tl": char['name_'+lang],
                                "level": char.level, 
                                "type": char.type });
                        } else {
                            tags_aval[tag] = [{ 
                                'id': char.id,
                                "name_en": char.name_en, 
                                "name": char['name_'+reg], 
                                "name_tl": char['name_'+lang],
                                "level": char.level, 
                                "type": char.type }];
                                tag_count++;
                        }
                        char_tag_sum++;
                    });
                    all_chars[char.name_cn] = {
                        'id': char.id,
                        'name_cn': char.name_cn,
                        'name_en': char.name_en,
                        'name_jp': char.name_jp,
                        'name_kr': char.name_kr,
                        'level': char.level,
                        'tags': char.tags
                    };
                });
                //$.each(tags_aval, function (key, _) {
                //    $("#box-tags").append(
                //        "<button type=\"button\" class=\"btn btn-sm btn-secondary btn-tag my-1\">" + key + "</button>\n"
                //    );
                //    tag_count++;
                //});
                //console.log(avg_char_tag);
                avg_char_tag = char_tag_sum / tag_count;

                JsonDATA[0] = tags_aval;
                JsonDATA[1] = all_chars;
                JsonDATA[2] = avg_char_tag;
            });
        var d1 = $.getJSON("json/tl-tags.json", function (data){
                    data1 = data;
                });
        var d2 = $.getJSON("json/tl-type.json", function (data){
                    data2 = data;
                });
        var d3 = $.getJSON("json/tl-gender.json", function (data){
                    data3 = data;
                });
        $.when(d0,d1,d2,d3).then(function(){
            if(data1){
                if(data2){
                    JsonDATA[3] = data1;
                    JsonDATA[4] = data2;
                    JsonDATA[5] = data3;
                }
            }
            $.holdReady(false);
        });
        $(document).ready(function(){
            $.getScript("js/aknav.js", function(){
                $('#to-tag').click(function() {      // When arrow is clicked
                    $('body,html').animate({
                        scrollTop : 0                       // Scroll to top of body
                    }, 500);
                });

                $('.dropdown-trigger').dropdown();
                $('[data-toggle="tooltip"]').tooltip();


                if(!localStorage.getItem('showImage')){
                    localStorage.setItem("showImage", JSON.stringify(true));
                    localStorage.setItem("showName", JSON.stringify(true));
                    localStorage.setItem("size", 40);
                } else {
                    if(!JSON.parse(localStorage.getItem('showName'))){
                        $("#showName").toggleClass("btn-primary btn-secondary");
                    }
                    if(!JSON.parse(localStorage.getItem('showImage'))){
                        $("#showImage").toggleClass("btn-primary btn-secondary");
                    }
                    if(!JSON.parse(localStorage.getItem('showClass'))){
                        $("#showClass").toggleClass("btn-primary btn-secondary");
                    }
                }
                if(!localStorage.getItem('showClass'))
                    localStorage.setItem("showClass",JSON.stringify(false))

                if(!localStorage.getItem('gameRegion') || !localStorage.getItem('webLang')){
                    console.log("game region undefined");
                    localStorage.setItem("gameRegion", 'cn');
                    localStorage.setItem("webLang", 'en');
                    reg = "cn";
                    lang = "en";
                } else {
                    console.log(localStorage.getItem('webLang'));
                    reg = localStorage.getItem('gameRegion');
                    lang = localStorage.getItem('webLang');
                }
                $('.reg[value='+reg+']').addClass('selected');
                $('.lang[value='+lang+']').addClass('selected');
                if(localStorage.getItem('checkedTagsCache')){
                    var checkedTagsCache = JSON.parse(localStorage.getItem('checkedTagsCache'))
                    var checkedTagsTLCache = JSON.parse(localStorage.getItem('checkedTagsTLCache'))
                    if(checkedTagsCache.length != 0){
                        $.each(checkedTagsCache,function(i,v){
                            $('.button-tag').each(function(){
                                let cntext = $(this).attr('cn-text');
                                if(cntext && cntext == checkedTagsCache[i]){
                                    $(this).trigger('click');
                                }
                            })
                        });
                        calculate();
                    }
                }
                changeUILanguage();
                console.log("Show Name: ", JSON.parse(localStorage.getItem('showName')));
                console.log("Show Image: ", JSON.parse(localStorage.getItem('showImage')));
                console.log("Show Class: ", JSON.parse(localStorage.getItem('showClass')));

                $(".imagesizeselect").each(function(_,el){
                    let size = JSON.parse(localStorage.getItem('size'));
                    $("#selectedImageSize").text(size);
                    if($(el).attr("title") == size){
                        $("<span> <<</span>").appendTo(el);
                    } else {
                        $(el).text($(el).attr("title"));
                    }
                });

                $(document).on("click", ".btn-name", function () {
                    let showName = JSON.parse(localStorage.getItem('showName'))
                    showName = !showName
                    localStorage.setItem('showName',JSON.stringify(showName));
                    console.log("Show Name: ", showName);
                })
                $(document).on("click", ".btn-class", function () {
                    let showClass = JSON.parse(localStorage.getItem('showClass'))
                    showClass = !showClass
                    localStorage.setItem('showClass',JSON.stringify(showClass));
                    console.log("Show Class: ", showClass);
                })
                $(document).on("click", ".btn-image", function () {
                    let showImage = JSON.parse(localStorage.getItem('showImage'))
                    showImage = !showImage
                    localStorage.setItem('showImage',JSON.stringify(showImage));
                    console.log("Show Image: ", showImage);
                });
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
            changeUILanguage(true);
        }   


        

        //var global = this;


        function showChar(el){
            // let reg = $('.reg[value='+reg+']').attr("value");
            // let lang =$('.lang[value='+lang+']').attr("value");
            let all_chars = JsonDATA[1];
            let all_tags = JsonDATA[3];
            let all_types = JsonDATA[4];
            let all_genders = JsonDATA[5];
            let char_name = $(el).attr('data-original-title');
            //console.log(all_tags);
            //console.log(all_chars);
            console.log("char name: "+char_name);
            $(".tr-recommd").show();
            $(".tr-chartag").remove();
            if (localStorage.getItem('lastChar') != char_name) {
                $(".tr-recommd:not(:contains('" + $(el).text() + "'))").hide();
                let char = all_chars[char_name];
                let colors = { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" };
                //console.log(char)
                let tags_html = [];
                $.each(char.tags, function (_, tag) {
                    console.log(tag);
                    var found = false;
                    $.each(all_tags, function(_, alltag){
                        if(alltag.tag_cn == tag){
                            tagReg = alltag['tag_'+reg];
                            tagTL = alltag['tag_'+lang];
                            found = true;
                            return false;
                        }
                    });
                    if(!found){
                        $.each(all_types, function(_, alltypes){
                            if(alltypes.type_cn == tag){
                                tagReg = alltypes['type_'+reg]+(JSON.parse(localStorage.getItem('showClass'))?"干员":"");
                                tagTL = alltypes['type_'+lang];
                                found = true;
                                return false;
                            }
                        })
                        if(!found){
                            $.each(all_genders, function(_, allgenders){
                                console.log(allgenders);
                                if(allgenders.sex_cn+'性干员' == tag){
                                    tagReg = allgenders['sex_'+reg];
                                    tagTL = allgenders['sex_'+lang];
                                    if(reg=='cn'){
                                        tagReg = tagReg+'性干员';
                                    }
                                    if(lang=='cn'){
                                        tagTL = tagTL+'性干员';
                                    }
                                    found = true;
                                    return false;
                                }
                            })
                        }
                    }
                    if(found){
                        tags_html.push("<button type=\"button\" class=\"btn btn-sm ak-shadow-small ak-btn btn-secondary btn-char my-1\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+ tagReg +"\">" +
                        (tagReg == tagTL ? "" : '<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">'+tagReg+'</a>') +tagTL + "</button>\n")
                    }
                });
                console.log(reg)
                $("#tbody-recommend").append(
                    "<tr class=\"tr-chartag \"><td>#</td><td>" +
                    "<button type=\"button\" class=\"btn btn-sm ak-btn ak-shadow-small ak-rare-" + colors[char.level] +
                    " btn-char my-1\" data-toggle=\"tooltip\" data-placement=\"right\" title=\""+ char["name_"+reg] +"\" onclick=\"showChar(this)\">" + char["name_"+lang] + "</button>\n" +
                    "<a type=\"button\" class=\"btn btn-sm ak-btn ak-shadow-small my-1\" style=\"background:#444\"data-toggle=\"tooltip\" data-placement=\"right\" href=\"./akhrchars.html?opname="+char.name_en.replace(/ /g,"_")   +"\" \">Detail</button></td><td>" + tags_html.join("") +""
                    // "</td><td>#</td>" 
                    +"</tr>"
                );

                $('[data-toggle="tooltip"]').tooltip();
                localStorage.setItem('lastChar', char_name)
            }else{
                $(".tr-chartag").remove();
                localStorage.removeItem('lastChar')
                // setTimeout(function(){
                //     showChar(el);
                // }, 200);
            }
        }
        
        function clickBtnClear(){
            
            $('.btn-tag').removeClass('btn-primary').addClass('btn-secondary');
            $("#tbody-recommend").empty();
            $("#count-tag").empty()
            checkedTags = [];
            checkedTagsTL = [];
            localStorage.removeItem('checkedTagsCache');
            localStorage.removeItem('checkedTagsTLCache');
            localStorage.removeItem('lastChar');
        }

        function changeImageSize(el){
            localStorage.setItem('size', parseInt($(el).attr('title'));
            console.log("image size = "+JSON.parse(localStorage.getItem('size')));
            $("#selectedImageSize").text(JSON.parse(localStorage.getItem('size')));
            $(".imagesizeselect").each(function(){
                let size = JSON.parse(localStorage.getItem('size'));
                if($(this).attr("title") == size){
                    $("<span> <<</span>").appendTo(this);
                } else {
                    $(this).text($(this).attr("title"));
                }
            });
            refresh();
        }

        function clickBtnOpt(el){
            $(el).toggleClass("btn-primary btn-secondary");
            let checked = $(el).hasClass("btn-primary");
            if ($(el).attr("id") === "opt-all") {
                $(".btn-opt").removeClass("btn-primary btn-secondary").addClass(
                    checked ? "btn-primary" : "btn-secondary"
                );
            } else {
                if ($("#opt-all").hasClass("btn-primary")) {
                    $("#opt-all").toggleClass("btn-primary btn-secondary");
                } else {
                    let checkedCount = 0;
                    $(".btn-opt").each(function (_, __) {
                        if ($(el).attr("id") === "opt-all") return;
                        if ($(el).hasClass("btn-primary")) checkedCount++;
                    });
                    console.log("checked count:");
                    console.log(checkedCount);
                    if (checkedCount === 7) $("#opt-all").toggleClass("btn-primary btn-secondary");
                }
            }
            globalOptStars = [];
            $(".btn-opt").each(function (_, __) {
                if ($(this).attr("opt-id") === "all" || $(this).hasClass("btn-secondary")) return;
                globalOptStars.push($(this).attr("opt-id"));
            });
            
            console.log("opstars:")
            console.log(globalOptStars);

            refresh();
        }

        function clickBtnOpt2(el){
            $(el).toggleClass("btn-primary btn-secondary");
            localStorage.removeItem('lastChar')
            refresh();
        }
        function clickBtnOpt3(el){
            $(el).toggleClass("btn-primary btn-secondary");
            localStorage.removeItem('lastChar')
            changeUILanguage(el);
        }

        function clickBtnTag(el){
            let checked = $(el).hasClass("btn-primary");
            let tag = $(el).attr('cn-text');
            let tagTL = $(el).attr('data-original-title');
            if (checked) {
                checkedTags = checkedTags.filter(function (v, _, __) {
                    return v !== tag;
                });
                checkedTagsTL = checkedTagsTL.filter(function (v, _, __) {
                    return v !== tagTL;
                });
            } else {
                if (checkedTags.length >= 6) {
                    // alert("Only 6 tags max");

                    return;
                } else {
                    if(checkedTags.length != 0){
                        let found = 0;
                        $.each(checkedTags,function(_,v){
                            if(v == tag){
                                found = 1;
                            }
                        });
                        if(found == 0){
                            checkedTags.push(tag);
                            checkedTagsTL.push(tagTL);
                        }
                    } else {
                        checkedTags.push(tag);
                        checkedTagsTL.push(tagTL);
                    }
                }
            }
            $(el).toggleClass("btn-primary btn-secondary");
            localStorage.removeItem('lastChar');
             console.log(checkedTags);
             console.log(checkedTagsTL);
            localStorage.setItem('checkedTagsCache', JSON.stringify(checkedTags));
            localStorage.setItem('checkedTagsTLCache', JSON.stringify(checkedTagsTL));
            // console.log(tag)
            calculate();
        }


        function calculate(){
            console.log(checkedTags)
            console.log(JsonDATA)
            if(typeof checkedTags !== 'undefined'){
                //console.log(JsonDATA);
                let tags_aval = JsonDATA[0];
                let all_chars = JsonDATA[1];
                let avg_char_tag = JsonDATA[2];
                let len = checkedTags.length;
                let count = Math.pow(2, checkedTags.length);
                $("#count-tag").html(checkedTags.length>=1 ? checkedTags.length==6 ? "6 [MAX]": checkedTags.length: "")
                
                let combs = [];
                for (let i = 0; i < count; i++) {
                    let ts = [];
                    let tstl = [];
                    for (let j = 0, mask = 1; j < len; j++) {
                        if ((i & mask) !== 0) {
                            ts.push(checkedTags[j]);
                            tstl.push(checkedTagsTL[j]);
                            // console.log(checkedTags[j]);
                        }
                        mask = mask * 2;
                    }
                    combs.push({ "tags": ts, "tagsTL": tstl, "score": 0.0, "possible": [] });
                }
                // console.log(combs);
                $("#tbody-recommend").empty();
                $.each(combs, function (_, comb) {
                    let tags = comb.tags;
                    
                    // let anotag = tags.map(tagextra => {
                    //     let currtag = tagextra
                    //    if(JsonDATA[4].find(search=>search.type_cn==tagextra)){
                    //        console.log(tagextra)
                    //        currtag = tagextra+(JSON.parse(localStorage.getItem('showClass'))?"干员":"")
                    //    }
                    //    return currtag
                    // });

                    // tags = anotag
                    // console.log(anotag)
                    if (tags.length === 0 || tags.length > 3) return;
                    let chars = [...tags_aval[tags[0]]];
                    for (let i = 1; i < tags.length; i++) {
                        let reduced_chars = [];
                        $.each(chars, function (_, char) {
                            // console.log(tags_aval[tags[i]]);
                            // console.log(char);
                            $.each(tags_aval[tags[i]], function (_, tgch) {
                                if (char.name === tgch.name) {
                                    reduced_chars.push(char);
                                    return false;
                                }
                            });
                        });
                        chars = reduced_chars;
                    }

                    let optStars = globalOptStars;
                    if(optStars.length == 0 ){
                        $(".btn-opt").each(function (_, __) {
                            if ($(this).attr("opt-id") === "all" || $(this).hasClass("btn-secondary")) return;
                            optStars.push($(this).attr("opt-id"));
                        });
                    }

                    if (chars.length === 0) return;
                    if (!tags.includes("高级资深干员")) {
                        // console.log(tags.join(",") + " 不含(高级)资深干员");
                        let reduce6 = [];
                        $.each(chars, function (_, char) {
                            if (char.level !== 6) {
                                reduce6.push(char);
                            }
                        });
                        chars = reduce6;
                    }
                    let filtered_chars = [];
                    $.each(chars, function (_, char) {
                        //console.log(char.level);
                        if (optStars.includes(char.level.toString())) {
                            filtered_chars.push(char);
                        }
                    });
                    chars = filtered_chars;
                    comb.possible = chars;
                    if (chars.length === 0) return;
                    let s = 0;
                    $.each(chars, (_, char) => {
                        s += char.level;
                        // console.log(char)
                    });
                    s = s / chars.length;
                    comb.score = s - tags.length / 10 - chars.length / avg_char_tag;
                    //console.log("tags length = "+tags.length);
                    //console.log("chars length = "+chars.length);
                    console.log("avg char tag = "+avg_char_tag);
                    //console.log("score = "+comb.score);
                });
                combs.sort(function (a, b) {
                    return a.score > b.score ? -1 : (a.score < b.score ? 1 :
                        (a.tags.length > b.tags.length ? 1 : (a.tags.length < b.tags.length ? -1 : 0)));
                });
                let no = 1;
                console.log(combs)
                $.each(combs, function (_, comb) {
                    if (comb.possible.length === 0) return;
                    let chars = comb.possible;
                    let tags = comb.tags;
                    let tagsTL = comb.tagsTL
                    let anotag = tags.map(tagextra => {
                        let currtag = tagextra
                       if(JsonDATA[4].find(search=>search.type_cn==tagextra)){
                           
                           currtag = tagextra+(JSON.parse(localStorage.getItem('showClass'))?"干员":"")
                       }
                       return currtag
                    });
                    tags = anotag
                    let chars_html = [];
                    let colors = { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" };
                    comb.possible.sort(function (a, b) {
                        return a.level > b.level ? -1 : (a.level < b.level ? 1 : 0);
                    });
                    $.each(chars, function (_, char) {
                        let padding = JSON.parse(localStorage.getItem('showName')) && JSON.parse(localStorage.getItem('size')) <60? "padding-right: 8px" : "padding-right: 1px";
                        let style = JSON.parse(localStorage.getItem('showImage')) ? "style=\"padding: 1px 1px;" + padding + ";\" " : "";
                        let buttonstyle = JSON.parse(localStorage.getItem('size')) >25? "background-color: #AAA": "background-color: transparent";
                        chars_html.push("<button type=\"button\" class=\" ak-shadow-small ak-btn btn btn-sm ak-rare-" + colors[char.level] + " btn-char my-1\" data-toggle=\"tooltip\" data-placement=\"bottom\" onclick=\"showChar(this)\" " +style+"title=\""+ char.name +"\">");
                        if(JSON.parse(localStorage.getItem('showImage')))chars_html.push("<img style=\""+buttonstyle+"\"height=\""+JSON.parse(localStorage.getItem('size'))+"\" width=\""+JSON.parse(localStorage.getItem('size'))+"\" src=\"https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/"+ char.id +".png\">   " )
                        if(JSON.parse(localStorage.getItem('size'))>60)chars_html.push("<div>")
                        if(JSON.parse(localStorage.getItem('showName')))chars_html.push(char.name_tl)
                        if(JSON.parse(localStorage.getItem('size'))>60)chars_html.push("</div>")
                        chars_html.push("</button>\n")
                    });
                    let tags_html = [];
                    $.each(tags, function (_, tag) {
                        tags_html.push("<button type=\"button\" class=\"btn btn-sm ak-btn btn-secondary btn-char my-1\">" +
                            tag + "</button>\n")
                    });
                    let tagsTL_html = [];
                    $.each(tagsTL, function (i, tagTL) {
                        tagsTL_html.push("<button type=\"button\" class=\"btn btn-sm ak-btn btn-secondary btn-char my-1\" data-toggle=\"tooltip\" data-placement=\"right\" title=\""+ tags[i] +"\">" +
                        (tags[i] == tagTL ? "" : '<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-top:-15px">'+tags[i]+'</a>') +  tagTL + "</button>\n")
                    });
                    $("#tbody-recommend").append(
                        "<tr class=\"tr-recommd\"><td>" + no++ + "</td><td>" + tagsTL_html.join("") + "</td><td>" + chars_html.join("") +
                        "</td>"+""+"</tr>"
                    );
                    $('[data-toggle="tooltip"]').tooltip();
                });
            }
        }
        
        function titledMaker (content,title,extraClass="",extraId="",extraStyle=""){
            let titledbutton = `
            <div style="padding-top:5px;display:inline-block">
            <div class=\"ak-btn-non btn-sm ak-shadow-small ak-btn ak-btn-bg btn-char  ${extraClass}\" style="text-align:left;min-width:80px;${extraStyle}" data-toggle=\"tooltip\" data-placement=\"top\" id="${extraId}">
            ${(title==""?"":`<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">${title}</a>`)}${content}</div>
            </div>`
    
            return titledbutton
        }

        function changeUILanguage(calc=false){
            reg = localStorage.getItem('gameRegion');
            lang = localStorage.getItem('webLang');
            // showTooltip = false
            $('#display-reg').text(reg.toUpperCase())
            console.log(lang)
            switch (lang) {
                case "en":$('#display-lang').text("English");console.log('English');break;
                case "cn":$('#display-lang').html("Chinese");console.log('Chinese');break;
                case "jp":$('#display-lang').text("Japanese");console.log('Japanese');break;
            }
            
            localStorage.setItem("gameRegion", reg);
            localStorage.setItem("webLang", lang);
            let types = ["qualifications","position","affix"];
            for (let m = 0; m < types.length; m++) {
                $(".tags-"+types[m]).each(function(j,el){
                    getJSONdata("tags",function(data){
                        if(data.length != 0){
                            let k = 0;
                            for (var i = 0; i < data.length; i++) {
                                if(data[i].type == types[m]){
                                    //console.log("j="+j+" , k="+k);
                                    if(j==k){
                                        if(reg==lang){
                                            $(el).html(data[i]["tag_"+reg]);
                                            // $(el).attr("data-toggle", "tooltip");
                                        }else{
                                            $(el).html(titledMaker(data[i]["tag_"+reg],data[i]["tag_"+lang]));
                                        }
                                        
                                        $(el).attr("data-original-title", data[i]["tag_"+lang]);
                                    }
                                    k++;
                                }
                            }
                        }
                    });
                });
            }
            $(".tags-gender").each(function(i,el){
                getJSONdata("gender",function(data){
                    if(data.length != 0){
                        if(reg == 'cn'){
                            
                            if(reg==lang){
                                $(el).html(data[i]["sex_"+reg]+'性干员');
                            }else{
                                $(el).html(titledMaker(data[i]["sex_"+reg]+'性干员',data[i]["sex_"+lang]));
                            }
                        } else {
                            $(el).html(data[i]["sex_"+reg]);
                        }
                        $(el).attr("data-original-title", data[i]["sex_"+lang]);
                    }
                });
            });
            $(".tags-class").each(function(i,el){
                getJSONdata("type",function(data){
                    if(data.length != 0){
                        if(reg==lang){
                            $(el).html(data[i]["type_"+reg]+(JSON.parse(localStorage.getItem('showClass'))?"干员":""));
                            // $(el).attr("data-toggle", "tooltip");
                        }else{
                            $(el).html(titledMaker(data[i]["type_"+reg]+(JSON.parse(localStorage.getItem('showClass'))?"干员":""),data[i]["type_"+lang]));
                        }
                        $(el).attr("data-original-title", data[i]["type_"+lang]);
                    }
                });
            });
            getJSONdata("ui",function(data){
                if(data.length != 0){
                    $.each(data, function(i,text){
                        $("[translate-id="+text.id).html(text['ui_'+lang]);
                    });
                }
            });
            console.log("done");
            refresh(calc);
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

        function doubleclick(el){
            setTimeout(function(){
                $(el).click();
            }, 200);
            $(el).click();
        }

        function refresh(calc=true){
            if(!localStorage.getItem('gameRegion') || !localStorage.getItem('webLang')){
                localStorage.setItem("gameRegion", 'cn');
                localStorage.setItem("webLang", 'en');
                reg = "cn";
                lang = "en";
            } else {
                reg = localStorage.getItem('gameRegion');
                lang = localStorage.getItem('webLang');
            }
            $('.reg[value='+reg+']').addClass('selected');
            $('.lang[value='+lang+']').addClass('selected');
            tags_aval = {};
            var d0 = $.getJSON("json/tl-akhr.json", function (data) {
                let tag_count = 0;
                let char_tag_sum = 0;
                $.each(data, function (_, char) {
                    if (char.hidden) return;
                    char.tags.push(char.type);
                    if(reg == 'cn'){
                        char.tags.push(char.sex + "性干员");
                    } else {
                        char.tags.push(char.sex);
                    }
                    $.each(char.tags, function (_, tag) {
                        if (tag in tags_aval) {
                            tags_aval[tag].push({ 
                                'id': char.id,
                                "name_en": char.name_en, 
                                "name": char['name_'+reg],
                                "name_tl": char['name_'+lang],
                                "level": char.level, 
                                "type": char.type });
                        } else {
                            tags_aval[tag] = [{ 
                                'id': char.id,
                                "name_en": char.name_en, 
                                "name": char['name_'+reg], 
                                "name_tl": char['name_'+lang],
                                "level": char.level, 
                                "type": char.type }];
                                tag_count++;
                        }
                        char_tag_sum++;
                    });
                    all_chars[char.name_cn] = {
                        'id': char.id,
                        'name_cn': char.name_cn,
                        'name_en': char.name_en,
                        'name_jp': char.name_jp,
                        'name_kr': char.name_kr,
                        'level': char.level,
                        'tags': char.tags
                    };
                });
                //$.each(tags_aval, function (key, _) {
                //    $("#box-tags").append(
                //        "<button type=\"button\" class=\"btn btn-sm btn-secondary btn-tag my-1\">" + key + "</button>\n"
                //    );
                //    tag_count++;
                //});
                //console.log(avg_char_tag);
                avg_char_tag = char_tag_sum / tag_count;

                JsonDATA[0] = tags_aval;
                JsonDATA[1] = all_chars;
                JsonDATA[2] = avg_char_tag;
            });
            var d1 = $.getJSON("json/tl-tags.json", function (data){
                        data1 = data;
                    });
            var d2 = $.getJSON("json/tl-type.json", function (data){
                        data2 = data;
                    });
            var d3 = $.getJSON("json/tl-gender.json", function (data){
                        data3 = data;
                    });
            $.when(d0,d1,d2,d3).then(function(){
                if(data1){
                    if(data2){
                        JsonDATA[3] = data1;
                        JsonDATA[4] = data2;
                        JsonDATA[5] = data3;
                    }
                }
                if(calc){
                    calculate();
                }
            });
        }