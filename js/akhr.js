$('#to-tag').click(function() {      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });
        $(function () {
            $('.dropdown-trigger').dropdown();
            $('[data-toggle="tooltip"]').tooltip();


            if(localStorage.getItem('showImage') === null){
                localStorage.setItem("showImage", "true");
                localStorage.setItem("showName", "true");
                localStorage.setItem("size", 40);
            } else {
                if(localStorage.showName == 'false'){
                    $("#showName").toggleClass("btn-primary btn-secondary");
                }
                if(localStorage.showImage == 'false'){
                    $("#showImage").toggleClass("btn-primary btn-secondary");
                }
            }

            if(typeof localStorage.gameRegion === "undefined" || localStorage.gameRegion == ""|| localStorage.webLang == ""){
                console.log("game region undefined");
                localStorage.setItem("gameRegion", 'cn');
                localStorage.setItem("webLang", 'en');
                reg = "cn";
                lang = "en";
            } else {
                console.log(localStorage.gameRegion);
                reg = localStorage.gameRegion;
                lang = localStorage.webLang;
            }
            
            // init dropdown
            $('.reg[value='+reg+']').addClass('selected');
            $('.lang[value='+lang+']').addClass('selected');

            $(".dropdown-item.reg").on("click", function(){
                $(".dropdown-item.reg").removeClass("selected");
                $(this).addClass("selected");   
                changeUILanguage();
            });
                        
            $(".dropdown-item.lang").on("click", function(){
                $(".dropdown-item.lang").removeClass("selected");
                $(this).addClass("selected");
                changeUILanguage();
            });     

            changeUILanguage();

            console.log("Show Name: ");
            console.log(localStorage.showName);
            console.log("Show Image: ");
            console.log(localStorage.showImage);


            $(".imagesizeselect").each(function(_,el){
                let size = localStorage.size;
                $("#selectedImageSize").html(localStorage.size);
                if($(el).attr("title") == size){
                    $("<span> <<</span>").appendTo(el);
                } else {
                    $(el).html($(el).attr("title"));
                }
            });

            $(document).on("click", ".btn-name", function () {
                if(localStorage.getItem('showName') == 'false'){
                    localStorage.setItem('showName','true');
                } else {
                    localStorage.setItem('showName','false');
                }
                console.log("Show Name: ");
                console.log(localStorage.getItem('showName'));
            })
            $(document).on("click", ".btn-image", function () {
                if(localStorage.getItem('showImage') == 'false'){
                    localStorage.showImage = 'true';
                } else {
                    localStorage.showImage = 'false';
                }
                console.log("Show Image: ");
                console.log(localStorage.getItem('showImage'));
            });
        });

        //var global = this;

        var JsonDATA = [];
        
            
        var checkedTags = [];
        var checkedTagsTL = [];
        var globalOptStars = [];

        function showChar(el){
            let reg = $('.reg.selected').attr("value");
            let lang =$('.lang.selected').attr("value");
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
            if (localStorage.lastChar != char_name) {
                $(".tr-recommd:not(:contains('" + $(el).text() + "'))").hide();
                let char = all_chars[char_name];
                let colors = { 1: "dark", 2: "light", 3: "success", 4: "info", 5: "warning", 6: "danger" };
                //console.log(char)
                let tags_html = [];
                $.each(char.tags, function (_, tag) {
                    console.log(tag);
                    var found = false;
                    $.each(all_tags, function(_, alltag){
                        if(alltag.tag_cn == tag){
                            tagReg = eval('alltag.tag_'+reg);
                            tagTL = eval('alltag.tag_'+lang);
                            found = true;
                            return false;
                        }
                    });
                    if(!found){
                        $.each(all_types, function(_, alltypes){
                            if(alltypes.type_cn == tag){
                                tagReg = eval('alltypes.type_'+reg);
                                tagTL = eval('alltypes.type_'+lang);
                                found = true;
                                return false;
                            }
                        })
                        if(!found){
                            $.each(all_genders, function(_, allgenders){
                                console.log(allgenders);
                                if(allgenders.sex_cn+'性干员' == tag){
                                    tagReg = eval('allgenders.sex_'+reg);
                                    tagTL = eval('allgenders.sex_'+lang);
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
                
                $("#tbody-recommend").append(
                    "<tr class=\"tr-chartag \"><td>#</td><td>" +
                    "<button type=\"button\" class=\"btn btn-sm ak-btn ak-shadow-small btn-" + colors[char.level] +
                    " btn-char my-1\" data-toggle=\"tooltip\" data-placement=\"right\" title=\""+ eval("char.name_"+reg) +"\" onclick=\"showChar(this)\">" + eval("char.name_"+lang) + "</button>\n" +
                    "</td><td>" + tags_html.join("") +""
                    // "</td><td>#</td>" 
                    +"</tr>"
                );

                $('[data-toggle="tooltip"]').tooltip();
                localStorage.lastChar = char_name
            }else{
                $(".tr-chartag").remove();
                localStorage.lastChar = ""
                // setTimeout(function(){
                //     showChar(el);
                // }, 200);
            }
        }
        
        function clickBtnClear(){
            
            $('.btn-tag').removeClass('btn-primary').addClass('btn-secondary');
            $("#tbody-recommend").html("");
            $("#count-tag").html("")
            checkedTags = [];
            checkedTagsTL = [];
            localStorage.lastChar = ""
        }

        function changeImageSize(el){
            localStorage.size = parseInt($(el).attr('title'));
            console.log("image size = "+localStorage.size);
            $("#selectedImageSize").html(localStorage.size);
            $(".imagesizeselect").each(function(){
                let size = localStorage.size;
                if($(this).attr("title") == size){
                    $("<span> <<</span>").appendTo(this);
                } else {
                    $(this).html($(this).attr("title"));
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
            localStorage.lastChar = ""
            refresh();
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
                    checkedTags.push(tag);
                    checkedTagsTL.push(tagTL);
                }
            }
            $(el).toggleClass("btn-primary btn-secondary");
            localStorage.lastChar = ""
            // console.log(checkedTags);
            // console.log(checkedTagsTL);
            // console.log(tag)
            refresh();
        }

        function calculate(){
            
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
                $("#tbody-recommend").html("");
                
                $.each(combs, function (_, comb) {
                    let tags = comb.tags;
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
                    if (!tags.includes("资深干员") && !tags.includes("高级资深干员")) {
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
                $.each(combs, function (_, comb) {
                    if (comb.possible.length === 0) return;
                    let chars = comb.possible;
                    let tags = comb.tags;
                    let tagsTL = comb.tagsTL
                    let chars_html = [];
                    let colors = { 1: "dark", 2: "light", 3: "success", 4: "info", 5: "warning", 6: "danger" };
                    comb.possible.sort(function (a, b) {
                        return a.level > b.level ? -1 : (a.level < b.level ? 1 : 0);
                    });
                    $.each(chars, function (_, char) {
                        let padding = localStorage.showName=='true' && localStorage.size <60? "padding-right: 8px" : "padding-right: 1px";
                        let style = localStorage.showImage=='true' ? "style=\"padding: 1px 1px;" + padding + ";\" " : "";
                        let buttonstyle = localStorage.size >25? "background-color: #AAA": "background-color: transparent";
                        chars_html.push("<button type=\"button\" class=\" ak-shadow-small ak-btn btn btn-sm btn-" + colors[char.level] + " btn-char my-1\" data-toggle=\"tooltip\" data-placement=\"bottom\" onclick=\"showChar(this)\" " +style+"title=\""+ char.name +"\">");
                        if(localStorage.showImage == 'true')chars_html.push("<img style=\""+buttonstyle+"\"height=\""+localStorage.size+"\" width=\""+localStorage.size+"\" src=\"./img/chara/"+ char.name_en +".png\">   " )
                        if(localStorage.size>60)chars_html.push("<div>")
                        if(localStorage.showName == 'true')chars_html.push(char.name_tl)
                        if(localStorage.size>60)chars_html.push("</div>")
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

        function loadJson(){
            let tags_aval = {};
            let all_chars = {};
            let avg_char_tag = 0;
            let reg = $('.reg.selected').attr("value");
            let lang =$('.lang.selected').attr("value");
            $.getJSON("json/tl-akhr.json", function (data) {
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
                                "name_en": char.name_en, 
                                "name": eval('char.name_'+reg),
                                "name_tl": eval('char.name_'+lang),
                                "level": char.level, 
                                "type": char.type });
                        } else {
                            tags_aval[tag] = [{ 
                                "name_en": char.name_en, 
                                "name": eval('char.name_'+reg), 
                                "name_tl": eval('char.name_'+lang),
                                "level": char.level, 
                                "type": char.type }];
                        }
                        char_tag_sum++;
                    });
                    all_chars[char.name_cn] = { 'name_cn': char.name_cn, 'name_en': char.name_en, 'name_jp': char.name_jp, 'name_kr': char.name_kr, 'level': char.level, 'tags': char.tags };
                });
                //$.each(tags_aval, function (key, _) {
                //    $("#box-tags").append(
                //        "<button type=\"button\" class=\"btn btn-sm btn-secondary btn-tag my-1\">" + key + "</button>\n"
                //    );
                //    tag_count++;
                //});
                //console.log(avg_char_tag);
                tag_count = Object.keys(tags_aval).length;
                avg_char_tag = char_tag_sum / tag_count;

                JsonDATA[0] = tags_aval;
                JsonDATA[1] = all_chars;
                JsonDATA[2] = avg_char_tag;
            });
            var data1, data2, data3;
            $.when(
                $.getJSON("json/tl-tags.json", function (data){
                    data1 = data;
                }),
                $.getJSON("json/tl-type.json", function (data){
                    data2 = data;
                }),
                $.getJSON("json/tl-gender.json", function (data){
                    data3 = data;
                })
            ).then(function(){
                if(data1){
                    if(data2){
                        JsonDATA[3] = data1;
                        JsonDATA[4] = data2;
                        JsonDATA[5] = data3;
                    }
                }
            });
            
        }

        function changeUILanguage(){
            let reg = $('.reg.selected').attr("value");
            let lang =$('.lang.selected').attr("value");
            $('#display-reg').text(reg.toUpperCase())
            
            switch (lang) {
                case "en":$('#display-lang').text("English");break;
                case "cn":$('#display-lang').text("Chinese");break;
                case "jp":$('#display-lang').text("Japanese");break;

            }
            console.log($('#display-reg'))
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
                                        $(el).html(eval("data[i].tag_"+reg));
                                        $(el).attr("data-original-title", eval("data[i].tag_"+lang));
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
                            $(el).html(eval("data[i].sex_"+reg)+'性干员');
                        } else {
                            $(el).html(eval("data[i].sex_"+reg));
                        }
                        $(el).attr("data-original-title", eval("data[i].sex_"+lang));
                    }
                });
            });
            $(".tags-class").each(function(i,el){
                getJSONdata("type",function(data){
                    console.log(data);
                    if(data.length != 0){
                        $(el).html(eval("data[i].type_"+reg));
                        $(el).attr("data-original-title", eval("data[i].type_"+lang));
                    }
                });
            });
            getJSONdata("ui",function(data){
                if(data.length != 0){
                    $.each(data, function(i,text){
                        $("[translate-id="+text.id).html(eval('text.ui_'+lang));
                    });
                }
            });
            console.log("done");
            checkedTags = [];
            checkedTagsTL = [];
            //refresh();
            $(".btn-tag.btn-primary").each(function(_,el){
                doubleclick(el);
            });
        }

        function getJSONdata(type, callback){
            var x = 0;
            var req = $.getJSON("json/tl-"+type+".json");
            req.done(function(response){
                console.log("type: "+type+" done");
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

        function refresh(){
            setTimeout(function(){
                setTimeout(function(){
                    calculate();
                }, 200);
                calculate();
            }, 200);
            loadJson();
        }