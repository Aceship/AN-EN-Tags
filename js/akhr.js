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
        var JsonDATA = {};

    function init() {
        var tags_aval = {};
        var all_chars = {};
        var avg_char_tag = 0;
        var data1, data2, data3;
        var d0 = $.getJSON("json/tl-akhr.json", function (data) {

            if(!localStorage.getItem('gameRegion') || !localStorage.getItem('webLang')){
                localStorage.setItem("gameRegion", 'cn');
                localStorage.setItem("webLang", 'en');
            }

            reg = localStorage.getItem('gameRegion');
            lang = localStorage.getItem('webLang');

            $('.reg[value='+reg+']').addClass('selected');
            $('.lang[value='+lang+']').addClass('selected');
                let tag_count = 0;
                let char_tag_sum = 0;
                // console.log(data);
                $.each(data, function (_, char) {
                    if (char.hidden) return;
                    if (char.globalHidden&&reg !="cn") return
                    char.tags.push(char.type);
                    if(reg == 'cn'){
                        char.tags.push(char.sex + "性干员");
                    } else {
                        char.tags.push(char.sex);
                    }
                    char.tags = Array.from(new Set(char.tags));
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

                JsonDATA.tags_aval = tags_aval;
                JsonDATA.all_chars = all_chars;
                JsonDATA.avg_char_tag = avg_char_tag;
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
        return $.when(d0,d1,d2,d3).then(function(){
            if(data1){
                if(data2){
                    JsonDATA.tagsTL = data1;
                    JsonDATA.typesTL = data2;
                    JsonDATA.gendersTL = data3;
                }
            }
        });
    }

        init().then(function() {
            $.holdReady(false);
        })
        $(document).ready(function(){
            $.getScript("js/aknav.js", function(){
                $('#to-tag').click(function() {      // When arrow is clicked
                    $('body,html').animate({
                        scrollTop : 0                       // Scroll to top of body
                    }, 500);
                });

                $('.dropdown-trigger').dropdown();
                $('[data-toggle="tooltip"]').tooltip({
                    trigger: "hover"
                });


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
                if(!localStorage.getItem('showClass'))localStorage.setItem("showClass",JSON.stringify(false))

                if(!localStorage.getItem('gameRegion') || !localStorage.getItem('webLang')){
                    console.log("game region undefined");
                    localStorage.setItem("gameRegion", 'cn');
                    localStorage.setItem("webLang", 'en');
                    reg = "cn";
                    lang = "en";
                } else {
                    console.log("language : "+localStorage.getItem('webLang'));
                    console.log("Region : "+localStorage.getItem('gameRegion'));
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
                        // calculate();
                    }
                }
                
                console.log("Show Name: ", JSON.parse(localStorage.getItem('showName')));
                console.log("Show Image: ", JSON.parse(localStorage.getItem('showImage')));
                console.log("Show Class: ", JSON.parse(localStorage.getItem('showClass')));
                
                var size = JSON.parse(localStorage.getItem('size'));
                updateImageSizeDropdownList(size);

                $(document).on("click", ".btn-name", function () {
                    var showName = !JSON.parse(localStorage.getItem('showName'))
                    localStorage.setItem('showName',JSON.stringify(showName));
                    console.log("Show Name: ", showName);
                })
                $(document).on("click", ".btn-class", function () {
                    var showClass = !JSON.parse(localStorage.getItem('showClass'))
                    localStorage.setItem('showClass',JSON.stringify(showClass));
                    console.log("Show Class: ", showClass);
                })
                $(document).on("click", ".btn-image:not(.disabled)", function () {
                    var showImage = !JSON.parse(localStorage.getItem('showImage'))
                    localStorage.setItem('showImage',JSON.stringify(showImage));
                    console.log("Show Image: ", showImage);
                });
                changeUILanguage(true);
            });
        });

        $('#fastInput').click(function(event){
            event.stopPropagation();
        });
        
        $('#fastInput').keyup(function(e) {
            if (e.keyCode == 13) $('#fastInput').trigger("enterKey");
            if (e.keyCode == 27) clickBtnClear()
        });

        $('#fastInput').bind("enterKey",function(e){

            CheckTag($('#fastInput'),true)
         });
        function regDropdown(el){
            localStorage.setItem('gameRegion', el.attr("value"));
            $(".dropdown-item.reg").removeClass("selected");
            el.addClass("selected");   
            changeUILanguage(true);
        }
                    
        function langDropdown(el){
            localStorage.setItem('webLang', el.attr("value"));
            console.log("language : "+localStorage.getItem('webLang') )
            $(".dropdown-item.lang").removeClass("selected");
            el.addClass("selected");
            changeUILanguage(true);
        }   


        

        //var global = this;


        function showChar(el){
            // let reg = $('.reg[value='+reg+']').attr("value");
            // let lang =$('.lang[value='+lang+']').attr("value");
            let all_chars = JsonDATA.all_chars;
            let all_tags = JsonDATA.tagsTL;
            let all_types = JsonDATA.typesTL;
            let all_genders = JsonDATA.gendersTL;
            let char_name = $(el).attr('data-original-title');

            // console.log(JsonDATA.all_chars)
            
            if(reg!="cn"){
                Object.keys(all_chars).forEach(currkey => {
                    if(all_chars[currkey]["name_"+reg]==char_name){
                        char_name=all_chars[currkey]["name_cn"]
                    }
                });
            }


            
            console.log(all_tags);
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
                        var showClass = JSON.parse(localStorage.getItem('showClass'))
                        $.each(all_types, function(_, alltypes){
                            if(alltypes.type_cn == tag){
                                tagReg = alltypes['type_'+reg]+(showClass&&reg=="cn"?"干员":"");
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
                        let subtitle = '';
                        if (tagReg !== tagTL) {
                            subtitle = $('<a>', {
                                'class': "ak-subtitle2",
                                'style': "font-size:11px;margin-left:-9px;margin-bottom:-15px",
                                'text': tagReg
                            });
                        }
                        let button = $("<button>", {
                            'type': "button",
                            'class': "btn btn-sm ak-shadow-small ak-btn btn-secondary btn-char my-1",
                            'data-toggle': "tooltip",
                            'data-placement': "top",
                            'title': tagReg
                        }).append([
                            subtitle,
                            tagTL
                        ])
                        tags_html.push(button, ' ');
                    }
                });
                console.log("Region : "+reg)
                $("#tbody-recommend").append(
                    $('<tr>', {
                        'class': 'tr-chartag'
                    }).append([
                        $("<td>", {
                            'text': '#'
                        }),
                        $('<td>').append([
                            $("<button>", {
                                'type': "button",
                                'class': "btn btn-sm ak-btn ak-shadow-small ak-rare-" + colors[char.level] + " btn-char my-1",
                                'data-toggle': "tooltip",
                                'data-placement': "right",
                                'title': char["name_"+reg],
                                'text': char["name_"+lang]
                            }).on('click', function () {
                                showChar(this);
                            }),
                            ' ',
                            $("<a>", {
                                'type': "button",
                                'class': "btn btn-sm ak-btn ak-shadow-small my-1",
                                'style': "background:#444",
                                'data-toggle': "tooltip",
                                'data-placement': "right",
                                'href': "./akhrchars.html?opname="+char.name_en.replace(/ /g,"_"),
                                'text': 'Detail'
                            })
                        ]),
                        $('<td>').append(tags_html)
                    ])
                );

                $('[data-toggle="tooltip"]').tooltip({
                    trigger: "hover"
                });
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

        function updateImageSizeDropdownList(size) {
            size = parseInt(size);
            $("#selectedImageSize").text(size);
            $(".imagesizeselect").each(function() {
                var itemSize = parseInt($(this).attr("title"));
                if(itemSize === size) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            });
            localStorage.setItem('size', JSON.stringify(size));
        }

        function changeImageSize(el){
            let size = $(el).attr('title');
            updateImageSizeDropdownList(size);
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
                    // console.log("checked count:", checkedCount);
                    let checkedCount = $(".btn-opt.btn-primary:not(#opt-all)").length;
                    if (checkedCount === 6) $("#opt-all").toggleClass("btn-primary btn-secondary");
                }
            }
            globalOptStars = [];
            $(".btn-opt.btn-primary:not(#opt-id)").each(function (_, __) {
                globalOptStars.push($(this).attr("opt-id"));
            });
            
            // console.log("opstars:", globalOptStars);

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
            let tagEN 
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

            if($(el).hasClass("btn-primary")){
                let all_tags = JsonDATA.tagsTL.concat(JsonDATA.typesTL);
                var currtags = all_tags.find(search=>{
                    var checktags = search.type_cn?search.type_cn:search.tag_cn
                    if(checktags==tag) return true
                })
                currtags = currtags?currtags.type_en?currtags.type_en:currtags.tag_en:undefined
                // console.log(currtags)   
                if(currtags){
                    gtag('event', 'Selecting Tags (Crude)', {
                        'event_category' : 'Recruitment Calculator',
                        'event_label' : currtags 
                    });  
                    if(checkedTags.length==5){
                        // console.log("5 Combinations !")  
                        var combination = []
                        checkedTags.forEach(element => {
                            var currtags = all_tags.find(search=>{
                                var checktags = search.type_cn?search.type_cn:search.tag_cn
                                if(checktags==element   ) return true
                            })
                            currtags = currtags?currtags.type_en?currtags.type_en:currtags.tag_en:undefined
                            combination.push(currtags)
                        });
                        // console.log(combination)
                        combination = combination.sort((a,b)=>{
                            if(a>b) return 1
                            else if (a<b) return -1
                            else return 0
                        })
                        // console.log(combination.join(",") )
                        gtag('event', 'Tags Combinations (Crude)', {
                            'event_category' : 'Recruitment Calculator',
                            'event_label' : combination.join(",") 
                        });  

                    }
                } 
            }
            localStorage.removeItem('lastChar')
            localStorage.setItem('checkedTagsCache', JSON.stringify(checkedTags));
            localStorage.setItem('checkedTagsTLCache', JSON.stringify(checkedTagsTL));
            calculate();
        }


        function calculate(){
            // console.log(checkedTags)
            // console.log(JsonDATA)
            if(typeof checkedTags !== 'undefined'){
                //console.log(JsonDATA);
                let tags_aval = JsonDATA.tags_aval;
                let all_chars = JsonDATA.all_chars;
                let avg_char_tag = JsonDATA.avg_char_tag;
                let all_tags = JsonDATA.tagsTL.concat(JsonDATA.typesTL);
                let len = checkedTags.length;
                let count = Math.pow(2, checkedTags.length);
                $("#count-tag").html(checkedTags.length>=1 ? checkedTags.length==6 ? "6 [MAX]": checkedTags.length: "")
                
                // console.log(all_chars)
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
                    combs.push({ "tags": ts,"tagsSource":[], "tagsTL": tstl, "score": 0.0, "possible": [] });
                }
                // console.log(combs);
                $("#tbody-recommend").empty();
                $.each(combs, function (_, comb) {
                    let tags = comb.tags;
                    
                    // let anotag = tags.map(tagextra => {
                    //     let currtag = tagextra
                    //    if(JsonDATA.typesTL.find(search=>search.type_cn==tagextra)){
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
                        $(".btn-opt.btn-primary:not(#opt-id)").each(function (_, __) {
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
                    // console.log(chars)
                    let filtered_chars = [];
                    $.each(chars, function (_, char) {
                        //console.log(char.level);
                        if (optStars.includes(char.level.toString())) {
                            filtered_chars.push(char);
                        }
                    });
                    // console.log(filtered_chars)
                    chars = filtered_chars;
                    comb.possible = chars;
                    if (chars.length === 0) return;
                    let minRarity = 6;
                    $.each(chars, (_, char) => {
                        minRarity = Math.min(char.level, minRarity);
                        // console.log(char)
                    });
                    let minRarityCount = $.grep(chars, (char, _) => char.level === minRarity).length;
                    comb.score = minRarity*1000 - minRarityCount*10 - tags.length;
                    //console.log("tags length = "+tags.length);
                    //console.log("chars length = "+chars.length);
                    // console.log("avg char tag = "+avg_char_tag);
                    //console.log("score = "+comb.score);
                });
                combs.sort(function (a, b) {
                    return a.score !== b.score
                        ? b.score - a.score
                        : a.possible.length - b.possible.length;
                });
                let no = 1;
                // console.log(combs)
                var showName = JSON.parse(localStorage.getItem('showName'))
                var showClass = JSON.parse(localStorage.getItem('showClass'))
                var showImage = JSON.parse(localStorage.getItem('showImage'))
                var size = JSON.parse(localStorage.getItem('size'))
                $.each(combs, function (_, comb) {
                    if (comb.possible.length === 0) return;
                    let chars = comb.possible;
                    let tags = comb.tags;
                    let tagsTL = comb.tagsTL
                    let anotag = tags.map(tagextra => {
                        let currtag = tagextra
                       if(JsonDATA.typesTL.find(search=>search.type_cn==tagextra)){
                           
                           currtag = tagextra+(showClass?"干员":"")
                       }
                       return currtag
                    });
                    tags = anotag
                    let chars_html = [];
                    let colors = { 1: "1", 2: "2", 3: "3", 4: "4", 5: "5", 6: "6" };
                    comb.possible.sort(function (a, b) {
                        return b.level - a.level;
                    });
                    $.each(chars, function (_, char) {
                        let padding = showName && size <60? "padding-right: 8px" : "padding-right: 1px";
                        let style = showImage ? "padding: 1px 1px;" + padding + ";" : "";
                        let buttonstyle = size > 25? "background-color: #AAA": "background-color: transparent";
                        let img = '';
                        let name = '';
                        if (showImage) {
                            img = $("<img>", {
                                'style': buttonstyle,
                                'height': size,
                                'width': size,
                                'src': "https://raw.githubusercontent.com/Aceship/Arknight-Images/main/avatars/" + char.id + ".png"
                            });
                        }
                        if (showName) {
                            if (size > 60) {
                                name = $('<div>', {
                                    'text': char.name_tl
                                });
                            } else {
                                name = char.name_tl;
                            }
                        }
                        let button = $("<button>", {
                            'type': "button",
                            'class': "ak-shadow-small ak-btn btn btn-sm ak-rare-" + colors[char.level] + " btn-char my-1",
                            'data-toggle': "tooltip",
                            'data-placement': "bottom",
                            'style': style,
                            'title': char.name
                        }).on('click', function() {
                            showChar(this);
                        }).append([
                            img,
                            name
                        ]);
                        chars_html.push(button, ' ');
                    });
                    let tags_html = [];
                    // console.log(tags)
                    // console.log(tagsTL)
                    // console.log(all_tags)
                    
                    $.each(tags, function (_, tag) {
                        let button = $("<button>", {
                            'type': "button",
                            'class': "btn btn-sm ak-btn btn-secondary btn-char my-1",
                            'text': tag
                        });
                        tags_html.push(button);
                    });
                    let tagsTL_html = [];
                    $.each(tagsTL, function (i, tagTL) {
                        // console.log(tags[i])
                        var currtags = all_tags.find(search=>{
                            var checkcurr
                            if(showClass&&search.type_cn+"干员"==tags[i]) checkcurr= true
                            else if(!showClass&&search.type_cn==tags[i]) checkcurr= true
                            else checkcurr = search.tag_cn==tags[i]
                            return checkcurr
                        })
                        // console.log(currtags)
                        var currtagtrailreg = reg=="cn"?"干员":reg=="jp"?"タイプ":""
                        var currtagtraillang = lang=="cn"?"干员":lang=="jp"?"タイプ":""
                        var currtag = currtags["type_"+reg]?showClass?currtags["type_"+reg]+currtagtrailreg:currtags["type_"+reg]
                        :currtags["tag_"+reg]
                        var currtagtl = currtags["type_"+lang]?showClass?currtags["type_"+lang]+currtagtraillang:currtags["type_"+lang]
                        :currtags["tag_"+lang];
                        let subtitle = '';
                        if (currtag !== currtagtl) {
                            subtitle = $('<a>', {
                                'class': "ak-subtitle2",
                                'style': "font-size:11px;margin-left:-9px;margin-top:-15px",
                                'text': currtag
                            });
                        }
                        let button = $("<button>", {
                            'type': "button",
                            'class': "btn btn-sm ak-btn btn-secondary btn-char my-1",
                            'data-toggle': "tooltip",
                            'data-placement': "right",
                            'title': tags[i]
                        }).append([
                            subtitle,
                            currtagtl
                        ]);
                        tagsTL_html.push(button, ' ');
                    });
                    $("#tbody-recommend").append(
                        $("<tr>", {class: "tr-recommd" }).append([
                            $("<td>").append(no++),
                            $("<td>").append(tagsTL_html),
                            $("<td>").append(chars_html)
                        ])
                    );
                });
                $('[data-toggle="tooltip"]').tooltip({
                    trigger: "hover"
                });
            }
        }

        function CheckTag(el,isenter = false){
            // console.log($(el).val())
            console.log(isenter)
            
            var currsearch = $(el).val()

            console.log(currsearch)
            if(currsearch){
                let all_tags = JsonDATA.tagsTL.concat(JsonDATA.typesTL);
                var allsearch = all_tags.reduce((acc, element) => {
                    Object.entries(element).forEach(([k,v]) => {
                        if(/(type|tag)_(cn|en|kr|jp)/.test(k) && v.toLowerCase().includes(currsearch.toLowerCase())){
                            if (!acc.some(search=>search[1]==element)) {
                                acc.push([v, element]);
                            }
                        }
                    });
                    return acc;
                }, []);
                if(isenter){
                    if (allsearch.length > 0) {
                        let firstTag = allsearch[0][1];
                        console.log(firstTag)
                        var currtag = firstTag['tag_'+lang]?firstTag['tag_'+lang]:firstTag['type_'+lang]
                        console.log(`button[data-original-title='${currtag}']`)
                        console.log($(`button[data-original-title='${currtag}']`))
                        clickBtnTag($(`button[data-original-title='${currtag}']`)[0])
                        $('#fastInput').val("")
                    }
                }else{
                    console.log(allsearch)
                }
                
                
            }
        }
        

        function changeUILanguage(calc=false){
            reg = localStorage.getItem('gameRegion');
            lang = localStorage.getItem('webLang');
            
            console.log(lang)
            console.log(reg)
            $('#display-reg').text(reg.toUpperCase())
            switch (lang) {
                case "en":$('#display-lang').text("English");console.log('English');break;
                case "cn":$('#display-lang').html("Chinese");console.log('Chinese');break;
                case "jp":$('#display-lang').text("Japanese");console.log('Japanese');break;
                case "kr":$('#display-lang').text("Korean");console.log('Japanese');break;
            }
            
            localStorage.setItem("gameRegion", reg);
            localStorage.setItem("webLang", lang);
            let types = ["qualifications","position","affix"];
            for (let m = 0; m < types.length; m++) {
                $(".tags-"+types[m]).each(function(j,el){
                    let data = JsonDATA.tagsTL
                        if(data.length != 0){
                            let k = 0;
                            for (var i = 0; i < data.length; i++) {
                                if(data[i].type == types[m]){
                                    //console.log("j="+j+" , k="+k);
                                    if(j==k){
                                        $(el).html(data[i]["tag_"+reg]);
                                        $(el).attr("data-original-title", data[i]["tag_"+lang]);
                                    }
                                    k++;
                                }
                            }
                        }
                });
            }
            $(".tags-gender").each(function(i,el){
                let data = JsonDATA.gendersTL
                    if(data.length != 0){
                        if(reg == 'cn'){
                            $(el).html(data[i]["sex_"+reg]+'性干员');
                        } else {
                            $(el).html(data[i]["sex_"+reg]);
                        }
                        $(el).attr("data-original-title", data[i]["sex_"+lang]);
                    }
            });
            var showClass = JSON.parse(localStorage.getItem('showClass'))
            $(".tags-class").each(function(i,el){
                let data = JsonDATA.typesTL
                    if(data.length != 0){
                        $(el).attr("data-original-title", data[i]["type_"+lang]);
                    }
                    $(el).html(data[i]["type_"+reg]+(showClass?reg=='cn'?'干员':reg=='jp'?"タイプ":"":""));
            });
            getJSONdata("ui",function(data){
                if(data.length != 0){
                    $.each(data, function(i,text){
                        // console.log(text)
                        $('[translate-id="'+text.id+'"]').html(text['ui_'+lang]);
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
            init().then(function() {
                if(calc){
                    calculate();
                    
                }
            });
        }
