    $.holdReady(true);
    
    const jsonList = {

        //CN
        chars           :"./json/gamedata/zh_CN/gamedata/excel/character_table.json",
        charword        :"./json/gamedata/zh_CN/gamedata/excel/charword_table.json",
        build           :"./json/gamedata/zh_CN/gamedata/excel/building_data.json",
        handbookInfo    :"./json/gamedata/zh_CN/gamedata/excel/handbook_info_table.json",
        range           :"./json/gamedata/zh_CN/gamedata/excel/range_table.json",
        skills          :"./json/gamedata/zh_CN/gamedata/excel/skill_table.json",
        skintable       :"./json/gamedata/zh_CN/gamedata/excel/skin_table.json",
        dataconst       :"./json/gamedata/zh_CN/gamedata/excel/gamedata_const.json",
        item_table      :"./json/gamedata/zh_CN/gamedata/excel/item_table.json",


        //EN
        charsEN         :"./json/gamedata/en_US/gamedata/excel/character_table.json",
        handbookInfoEN  :"./json/gamedata/en_US/gamedata/excel/handbook_info_table.json",
        charwordEN      :"./json/gamedata/en_US/gamedata/excel/charword_table.json",
        skillsEN        :"./json/gamedata/en_US/gamedata/excel/skill_table.json",
        item_tableEN    :"./json/gamedata/en_US/gamedata/excel/item_table.json",


        //Utilities
        attacktype      :"./json/tl-attacktype.json",
        animlist        :"./json/ace/animlist.json",
        effect          :"./json/tl-effect.json",
        subclass        :"./json/subclass.json",

        //TL
        voicelineTL     :"./json/tl-voiceline.json",
        campdata        :"./json/tl-campdata.json",
        charastoryTL    :"./json/tl-charastory.json",
        storytextTL     :"./json/tl-storytext.json",
        vaTL            :"./json/tl-va.json",
        potentialTL     :"./json/tl-potential.json",
        unreadNameTL    :"./json/tl-unreadablename.json",
        itemstl         :"./json/tl-item.json",
        tags            :"./json/tl-tags.json",
        classes         :"./json/tl-type.json",
        chars2          :"./json/tl-akhr.json",
        gender          :"./json/tl-gender.json",
        // names           :"./json/tl-char.json",
        ktags           :"./json/tl-tags-key.json",

        //jet TL
        riic            :"./json/ace/riic.json",
        talentsTL       :"./json/ace/tl-talents.json",
        skillsTL        :"./json/ace/tl-skills.json"
        
    };
    
    var db = {}
    LoadAllJsonObjects(jsonList).then(function(result) {
        db = result
        $.holdReady(false);
    });

    var lang;
    var reg;
    var selectedOP;
    var lefthand;
    var opdataFull = {};
    var curpath;
    var opapp;
    var classfilter;
    var sort;
    var skeletonType = "skel"
    var chibitype = 'character'
    var charName = 'char_180_amgoat';
    var chibipers = 'front'
    var chibiName = 'char_180_amgoat'
    var folder = `./spineassets/${chibitype}/${charName}/${chibipers}/`
    var spinewidget 

    var currskin 
    var spinewidgettoken
    var animIndex = 0;
    var animations
    var tokenname 
    var tokenanimations
    var animationqueue
    var defaultAnimationName = "Default";
    var loadchibi = false;
    // var chibiscaleweb = 0
    // var chibiscaleweblist = [[0.5,-775],[0.6,-800],[0.7,-825],[0.8,-850],[0.9,-875],[1,-900]]
    var chibiscale = [0.5,0]
    var chibiperscurr = 0
    var chibiperslist = ["front","back","build"]
    var bgnum =0
    var bgmax = 5
    var scrollcheck = 0
    var savenum = 0

    var canvasNum = 0
    var canvasSize = [[1800,1800],[1200,800],[800,800],[600,600],[500,500]]
    var wid = 1800
    var hei = 1800

    $(document).ready(function(){
        $('#to-tag').click(function(){      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });
        $(window).scroll(function(){
            var sticky = $('#ak-bottom-allnav'),
                scroll = $(window).scrollTop();
                isScrollUp = scroll<scrollcheck
            // console.log(scroll)
            scrollcheck = scroll

            if(loadchibi){
                if (scroll >= 500) {
                    sticky.removeClass('fixedNav');
                    sticky.removeClass('fixedNav1');
                    sticky.addClass('fixedNav2')
                }
                else if(scroll>=400&&!isScrollUp){
                    sticky.addClass('fixedNav');
                    sticky.removeClass('fixedNav2');
                } else if(scroll>=400&&isScrollUp){
                    sticky.addClass('fixedNav1');
                    sticky.removeClass('fixedNav2');
                }else{
                    sticky.removeClass('fixedNav');
                    sticky.removeClass('fixedNav1');
                    sticky.removeClass('fixedNav2');
                }
            }
        });

        dragElement2(document.getElementById("charazoom"),document.getElementById("charazoom"))

        // Add listener to class tabs
        // Add listener to class tabs
        $("#classlist .nav-item").children().each(function(i){
            $(this).click(function(){
                selOpClass($(this).attr("data-opclass"));
            })
        });
        $("#all-op").each(function(i){
            $(this).click(function(){
                selOpClass($(this).attr("data-opclass"));
            })
        });

        $("#spine-frame-tokenheader").contextmenu(function(){
            $('#spine-frame-token').toggleClass('spine-frame-token-above')
            return false;
        })

        $(window).click(function() {
            $('#operatorsResult').empty();
            $('#operatorsResult').hide();
        });

        $("#Chibi-Show").click(function(){
            // console.log($("#spine-widget"))
            var isvisible = $("#spine-frame").is(":visible")
            $("#spine-frame").fadeToggle(100);
            
            
            if(!loadchibi){
                loadchibi=true
                if(bgnum==0&&$("#spine-bg").is(":hidden")){
                    bgnum=1
                    $('#spine-bg').attr("src","./img/ui/spine/bg"+bgnum+".png");
                    $('#spine-bg').fadeIn('fast');
                }
                if(!spinewidget){
                    LoadAnimation()
                }
                if(!spinewidgettoken){
                    if(opdataFull.tokenKey){
                        LoadAnimationToken()
                    }
                }
            }

            if(spinewidget){
                if(isvisible){
                    spinewidget.pause()
                    loadchibi=false
                    $('#spine-bg').fadeOut('fast')
                }
                else {
                    spinewidget.play()
                    loadchibi=true
                    
                    if($("#spine-bg").is(":hidden")){
                        if (bgnum==0) bgnum=1
                        $('#spine-bg').attr("src","./img/ui/spine/bg"+bgnum+".png");
                        $('#spine-bg').fadeIn('fast');
                    }
                }
            }
            
            if(spinewidgettoken){
                if(isvisible){
                    spinewidgettoken.pause()
                    $("#spine-frame-token").fadeOut(100);
                }
                else {
                    spinewidgettoken.play()
                    $("#spine-frame-token").fadeIn(100);
                    
                }
            }
            var sticky = $('#ak-bottom-allnav')
            console.log(scrollcheck)
            if(scrollcheck>=500 && sticky.hasClass("fixedNav2")){
                sticky.addClass('fixedNav1')
                sticky.removeClass('fixedNav2');

                window.setTimeout(function(){
                    sticky.removeClass('fixedNav1')
                },100);
            }
        });
        dragElement(document.getElementById("spine-frame"));
        dragElement(document.getElementById("spine-frame-token"));
        $("#Chibi-Bg").click(function(){
            bgnum++
            if(bgnum>bgmax)bgnum=0
            else if(bgnum<0)bgnum=bgmax

            if(bgnum==0) $('#spine-bg').fadeOut('fast')
            else {
                
                // $('#spine-bg').fadeIn()
                $('#spine-bg').fadeOut('fast', function () {
                    $('#spine-bg').attr("src","./img/ui/spine/bg"+bgnum+".png");
                    $('#spine-bg').fadeIn('fast');
                });
                console.log( $('#spine-bg').attr("src") )
            
            }

            
        });
        $("#Chibi-Perspective").click(function(){
            chibiperscurr++
            if(chibiperscurr>=chibiperslist.length)chibiperscurr=0
            else if(chibiperscurr<0)chibiperscurr=chibiperslist.length-1

            console.log(chibiperscurr)
            console.log(chibiperslist[chibiperscurr])
            ChangeSkin(currskin,chibiperslist[chibiperscurr])
            
        });
        $("#Chibi-Show-menu").click(function(){
            $('#Chibi-menu').toggleClass("chibi-menu-closed")
            
        });
        $("#Chibi-frameSize").click(function(){
            // $('#Chibi-menu').toggleClass("chibi-menu-closed")
            canvasNum++

            
            if(canvasNum>=canvasSize.length)canvasNum=0
            else if(canvasNum<0)canvasNum=canvasSize.length

            wid = canvasSize[canvasNum][0]
            hei = canvasSize[canvasNum][1]
            if(spinewidget){
                LoadAnimation()
            }
            if(spinewidgettoken){
                if(opdataFull.tokenKey){
                    LoadAnimationToken()
                }
            }
        });

        $("#Chibi-Scale").click(function(){
            
            // chibiscaleweb++

            
            // if(chibiscaleweb>=chibiscaleweblist.length)chibiscaleweb=0
            // else if(chibiscaleweb<0)chibiscaleweb=chibiscaleweblist.length
            // console.log(chibiscaleweb)
            // console.log(chibiscaleweblist)

            
            // var currscale = chibiscaleweblist[chibiscaleweb]
            // console.log(currscale)
            $('#chibizoomslider').val(0)
            ZoomChibi(0)
            // $('#chibizoomslider').click();
            // $("#spine-widget").css("transform",`scale(0.5)`)
            // $("#spine-widget").css("top",`-775px`)
            // $("#spine-widget-token").css("transform",`scale(0.5)`)
            // $("#spine-widget-token").css("top",`-775px`)
            

            
        });

        $('#Chibi-download').click(function(event){
            // var canvas = spinewidget.canvas
            
            var checkdiv = $("#spine-widget").children()[0]
            // console.log($("#spine-widget").children())
            // console.log(canvas)
            // console.log(checkdiv)
            var img = checkdiv.toDataURL("image/png");
            // $('#Chibi-download').attr("href",img)
            // $('#Chibi-download').attr("download","a.png")
            // console.log(img)
            // $("#spine-widget-2").html('<img src="'+img+'"/>');
            console.log(currskin)
            var link = document.createElement("a");
            link.download = `${currskin}-${savenum}.png`;
            savenum++
            link.href = img;
            link.click();
            
            // CreateAnimation(spinewidget,["Skill_2_Begin",["Skill_2_Loop",20],"Skill_2_Loop_End"],false,false,true)
            // console.log(spinewidget)
            // var dataURL = $("#spine-widget")[0].toDataURL('image/png');
            // var w = window.open('about:blank', 'image from canvas');
            // w.document.write("<img src='" + img + "' alt='from canvas'/>");

        });

        $('#operatorsResult').click(function(event){
            event.stopPropagation();
        });
        $('#opBrowseButton').click(function(event){
            $("#opchoosemodal").modal('show');
        });
        $('#opBrowseButton2').click(function(event){
            event.stopPropagation();
        });
        $('#opname').click(function(event){
            event.stopPropagation();
        });
        $(".fa-sort-amount-up").click(event => event.stopPropagation());
        $(".fa-sort-amount-down").click(event => event.stopPropagation());
        $('#lefthandtoggle').click(function(event){
            if(lefthand=="true")
                lefthand = "false"
            else 
                lefthand = "true"
            localStorage.setItem("lefthand",lefthand)
            // console.log(lefthand)
            location.reload()
        })
        if(typeof localStorage.lefthand ==="undefined"){
            localStorage.setItem("leftHand","false")
            lefthand = "false"

        }else{
            lefthand = localStorage.lefthand
        }
        if(lefthand=="true")
        $('#lefthandtoggle').css("background-color","#0077AA")
        else 
        $('#lefthandtoggle').css("background-color","#222")

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
        
        if(typeof localStorage.gameRegion === "undefined" || localStorage.gameRegion == ""|| localStorage.webLang == ""){
            console.log("game region undefined");
            localStorage.setItem("gameRegion", 'cn');
            localStorage.setItem("webLang", 'en');
            reg = "cn";
            lang = "en";

            var vars = getUrlVars();
            if(vars.has("opname")){
                // console.log("TEST1")
            }
        } else {
            console.log(localStorage.webLang);
            reg = "cn";
            lang = "en";
        }
        if(typeof localStorage.selectedOPDetails === "undefined" || localStorage.selectedOPDetails == ""){
            console.log("selected OP undefined");
            var vars = getUrlVars();
            console.log(vars)
            if(vars.has("opname")){
                vars.set("opname", decodeURIComponent(vars.get("opname").replace("_"," ")));
                console.log(vars.get("opname"));
                var char = query(db.chars,"appellation",vars.get("opname"),true,true);
                console.log(char)
                var opname;
                $.each(char,function(key,v){
                    opname = v.name;
                });
                selectOperator(opname);
            } else {
                localStorage.setItem("selectedOP","");
            }
        } else {
            console.log("selected OP defined");
            var vars = getUrlVars();
            // curpath.forEach(element => {
                
            // });
            if(vars.has("opname")){
                var char = {};
                var opname = decodeURIComponent(vars.get("opname"));
                console.log(opname)
                var unreadable = query(db.unreadNameTL,"name_en",opname.replace(/_/g," "))
                console.log(unreadable)
                var correctname = (unreadable?unreadable.name:opname.replace(/_/g," "))
                console.log(correctname)
                char = query(db.chars,"appellation",correctname,true,true);
                var opname;
                $.each(char,function(key,v){
                    opname = v.name;
                    var unreadable = query(db.unreadNameTL,"name",v.appellation)
                    var correctname = (unreadable?unreadable.name_en.replace(/ /g,"_"):v.appellation.replace(/ /g,"_"))
                    opapp = correctname
                })
                
            } else {
                selectedOP = localStorage.selectedOPDetails;
                var opname = db.chars[selectedOP].name;
            }
            
            selectOperator(opname);
           
            if(vars.has("story")){
                $('#opstory').modal('show')
            }else if(vars.has("voice")){
                GetAudio(opdataFull)
                $('#opaudio').modal('show')
            }
        
        }
        if (window.history && window.history.pushState) {
            $(window).on('popstate', function() {
                var vars = getUrlVars()
                console.log(opapp)
                console.log(vars)
                var historyopname = vars.get("opname")
                if(historyopname!=opapp){
                    var unreadable = query(db.unreadNameTL,"name_en",historyopname.replace(/_/g," "))
                    var correctname = (unreadable?unreadable.name:historyopname.replace(/_/g," "))
                    console.log(correctname)
                    var char = query(db.chars,"appellation",correctname,true,true);
                    // console.log()
                    selectOperator(char[Object.keys(char)].name)
                }
                if(vars.has("story")){
                    $('#opstory').modal('show')
                    $('#opaudio').modal('hide')
                }else if(vars.has("voice")){
                    $('#opaudio').modal('show')
                    $('#opstory').modal('hide')
                }else{
                    $('#opstory').modal('hide')
                    $('#opaudio').modal('hide')
                }
            //   alert('Back button was pressed.');
            });
        
        }

        $('#opstory').on('shown.bs.modal', function(){
            var url = new URL(window.location.href);
            url.searchParams.set('story', 0);
            history.pushState(null, '', url);
        });
        $('#opstory').on('hidden.bs.modal', function(){
            var url = new URL(window.location.href);
            url.searchParams.delete('story');
            history.pushState(null, '', url);
        });
        $('#opaudio').on('shown.bs.modal', function(){
            var url = new URL(window.location.href);
            url.searchParams.set('voice', 0);
            history.pushState(null, '', url);
        });
        $('#opaudio').on('hidden.bs.modal', function(){
            var url = new URL(window.location.href);
            url.searchParams.delete('voice');
            history.pushState(null, '', url);
        });

        // console.log("TEST")
        $('.reg[value='+reg+']').addClass('selected');
        $('.lang[value='+lang+']').addClass('selected');

        //getSkillDesc('skchr_amiya_2',0);
        window.onhashchange = function() {
            console.log(window.location.pathname)
        }

        $(".op-gender").each((_, btn) => $(btn).text(db.gender[$(btn).attr("data-id")][`sex_${lang}`]));
        $(".op-tag").each((_, btn) => $(btn).text(db.ktags[$(btn).attr("data-id")][lang]));
    });

    $.getScript("js/arrive.min.js", function(){
        $(document).arrive("#regionDropdown", function(){
            $("#navitemRegion").addClass('ak-disable2');
            $("#navitemLanguage").addClass('ak-disable2');
        });
    });

   
    function clickBtnClear(){
        $("#chara-detail-container").hide();
        $("#elite-sidenav").empty();
        $("#tabs-opCG").empty();
        $("#elite-topnav").empty();
        $("#tabs-opData").empty();
        $("#op-taglist").empty();
        $("#opname").val("");
        $('#operatorsResult').empty();
        $('#operatorsResult').hide();
        localStorage.selectedOPDetails = "";
        history.pushState(null, '', window.location.pathname); 
    }

    function selOpClass(cname){
        $("#selectedopclass").empty();
        
        var result 
        if(cname!=""){
            result= query(db.chars,"profession",cname,false,true);
        }else{
            result= ObjectToArray(db.chars)
            
        }
        // console.log(result.length);


        //add extra filter later
        result = result.filter(search=>{
            var searchOb = search[Object.keys(search)[0]]

            switch(searchOb.profession){
                case "TOKEN" :
                case "TRAP" : return false
            }
            return true
        })

        //add extra sort later
        result = result.sort((ak,bk)=>{
            var a = ak[Object.keys(ak)[0]]
            var b = bk[Object.keys(bk)[0]]
            // console.log(ak)
            if(a.rarity<b.rarity) return 1
            if(a.rarity>b.rarity) return -1
            if(a.appellation>b.appellation)return 1
            if(a.appellation<b.appellation)return -1
        })
        var listtype = "Grid"
        var showtype = "a"
    
        for (var i = 0; i < result.length; i++) {
            var html;
            // console.log(result[i])
            $.each(result[i],function(key,val){ // key = char_230_savage, val = data (obj)
                // console.log(key)
                var type = query(db.classes,"type_data",val.profession);
                var classlogo = type?type.type_en.toLowerCase():""
                var camplogo = val.displayLogo
                switch (listtype) {
                    
                    case "List":
                                html =
                                `<li class='selectop-list ak-shadow' onclick='selectOperator("${val.name}")'>
                                <img src='img/avatars/${key}.png'>
                                <div class='name ak-font-novecento'>${getENname(val.name)}</div>
                                <div class='rarity op-rarity-${val.rarity+1}'> 
                                    ${(`<i class='fa fa-star'></i>`).repeat(val.rarity+1)}
                                </div></li>
                                `
                        break;

                    case "Grid":
                                html =
                                `<li class='selectop-grid ak-shadow' onclick='selectOperator("${val.name}")'>
                                <img src='img/avatars/${key}.png'>
                                <div class='name ak-font-novecento ak-center'>${getENname(val.name)}</div>
                                <div class='ak-rare-${val.rarity+1}'></div>
                                ${cname==""&&classlogo?`<div class='ak-showclass'><img src='img/classes/class_${classlogo}.png'></div>`:""}
                                ${showtype&&camplogo?`<div class='ak-showfaction'><img src='img/factions/${camplogo.toLowerCase()}.png' title='${db.campdata[camplogo]}' ></div>`:""}
                                <div class='grid-box op-rarity-${val.rarity+1}'> 
                                </div></li>
                                `

                        break;

                    default:
                        break;
                }
            });
            $("#selectedopclass").append(html);
        }
    }

    function getENname (CNname){
        var result;
        var found = false;
        $.each(db.chars2,function(key,val){
            if(val.name_cn.toLowerCase() == CNname.toLowerCase()){
                found = true;
                result = val.name_en;
            }
        });
        if(found){
            return result;
        } else {
            return false;
        }
    }

    

    // function populateOperators(el,isenter = false){
    //     let inputs
    //     if(isenter)
    //         inputs = el
    //     else
    //         inputs = el.value

    //     $.each(db.chars,function(_,char){
    //         var unreadable = query(db.unreadNameTL,"name",char.appellation)
    //         console.log(char.appellation)
    //         console.log(unreadable)
    //     })
        
    // }
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
                    $('#operatorsResult').hide();
                    selectOperator(result[0].name_cn)
                    return
                }
                $('#operatorsResult').empty();
                $('#operatorsResult').show();
                for (var i = 0; i < result.length; i++) {

                    //test for audio
                    // var opdata = query(db.chars2,"name_cn",result[i].name);
                    // var opdata2 = query(db.chars,"name",opdata.name_cn,true,true);
                    // // console.log(opdata2)
                    // $.each(opdata2,function(key,v){
                    //     v['id'] = key;
                    //     // console.log(v);
                    //     opdataFull = v;
                    //     opKey = key;
                    //     return false
                    // });
                    // AudioText(opdataFull)

                    let image = `<img style="height:40px;padding:2px" src="./img/avatars/${result[i].img_name}.png">  `
                    // console.log(image)
                    if(el=="Browse"){
                        image = `<img class='opres-img' src="./img/avatars/${result[i].img_name}.png">  `
                        $("#operatorsResult").css("text-align","center");
                        $("#operatorsResult").removeClass("opresult-list");
                        $("#operatorsResult").addClass("opresult-grid");
                        $("#operatorsResult").append(
                                "<li class=\"col-2 col-sm-1 ak-shadow-small ak-rare-"+result[i].rarity+"\"style=\"display:inline-block;cursor: pointer;width:75px;margin:2px;margin-bottom:2px;padding:1px;border-radius:2px\" onclick=\"selectOperator('"+result[i].name_cn+"')\">"
                                +"<div style=\"white-space: nowrap;padding:0px;text-align:center;margin:0 \">"+image+"</div>"
                                +"<div style=\"white-space: nowrap;padding:0px;text-align:center;margin:0 \">"+`${result[i].name_readable?`[${result[i].name_readable}]`:""}`+result[i].nameTL+"</div>"
                                +"</li>");
                    }else{
                        $("#operatorsResult").removeClass("opresult-grid");
                        $("#operatorsResult").addClass("opresult-list");
                        $("#operatorsResult").css("text-align","left");
                        $("#operatorsResult").append(`<li class=" ak-shadow-small ak-rare-${result[i].rarity}"style="width:100%;cursor: pointer;margin-bottom:2px" onclick="selectOperator('${result[i].name_cn}')">${image} ${result[i].name_readable?`[${result[i].name_readable}]`:""} ${result[i].nameTL} (${result[i].name})</li>`);
                    }
                }
            }
            // console.log( $("#operatorsResult")  )
            // $('#operatorsResult').show();
        } else {
            $('#operatorsResult').empty();
            $('#operatorsResult').hide();
        }
    }

    function collapse(el) {
        $(el).toggleClass("collapsible-closed collapsible-open");
        $(el).children("div").toggleClass("fa-angle-down fa-angle-up");

        let target = $(`#${$(el).attr("target")}`);
        let size = target[0].scrollHeight;
        let delay = 200 / size;

        if ($(el).hasClass("collapsible-open")) {
            for (i = 0; i < size; i++) setTimeout((i) => target.css("max-height", `${i}px`), delay * i, i);
        } else {
            for (i = 0; i < size; i++) setTimeout((i) => target.css("max-height",`${size - i}px`), delay * i, i);
        }
    }

    function getSubclassHtml(btn) {
        function subclassHtml(data_id, data_name) {
            return `<div class="btn btn-secondary btn-sm my-1 op-subclass filter-btn-s" onclick="toggleBtn(this)" section="subclass" data-id="${data_id}">${data_name}</div>`
        }

        switch ($(btn).attr("data-id"))
        {
            case "CASTER":      // CASTER (ST, AOE)
                return `${subclassHtml("CASTER-ST", "ST Caster")}${subclassHtml("CASTER-AOE", "AoE Caster")}`;
            case "WARRIOR":     // GUARD (ST, AOE, RANGED)
                return `${subclassHtml("GUARD-ST", "ST Guard")}${subclassHtml("GUARD-AOE", "AoE Guard")}${subclassHtml("GUARD-RANGED", "Ranged Guard")}`;
            case "MEDIC":       // MEDIC (ST, AOE)
                return `${subclassHtml("MEDIC-ST", "ST Medic")}${subclassHtml("MEDIC-AOE", "AoE Medic")}`;
            case "SNIPER":      // SNIPER (ST, AOE)
                return `${subclassHtml("SNIPER-ST", "ST Sniper")}${subclassHtml("SNIPER-AOE", "AoE Sniper")}`;
            case "SPECIAL":     // SPECIALIST (PUSH, PULL, QUICK-REDEPLOY, SPIKE)
                return `${subclassHtml("SPECIAL-REDEPLOY", "Fast-Redeploy")}${subclassHtml("SPECIAL-PUSH", "Push Specialist")}${subclassHtml("SPECIAL-PULL", "Pull Specialist")}${subclassHtml("SPECIAL-SPIKES", "Spikes Specialist")}`;
            case "SUPPORT":     // SUPPORTER (SLOW, SUMMON, DEBUFF, BUFF)
                return `${subclassHtml("SUPPORT-SLOW", "Slow")}${subclassHtml("SUPPORT-SUMMON", "Summoner")}${subclassHtml("SUPPORT-DEBUFF", "Debuffer")}${subclassHtml("SUPPORT-BUFF", "Buffer")}`;
            case "TANK":        // DEFENDER (NORMAL, HEALING)
                return `${subclassHtml("DEFENDER-NORMAL", "Defender")}${subclassHtml("DEFENDER-HEALING", "Healing Defender")}`;
            case "PIONEER":     // VANGUARD (DP ON TIME, DP ON KILL, NO DP)
                return `${subclassHtml("VANGUARD-DP-KILL", "DP on kill")}${subclassHtml("VANGUARD-DP-TIME", "DP on time")}${subclassHtml("VANGUARD-NO-DP", "No DP")}`;
        }
    }

    function actualizeSubclass() {
        $("#subclass-container").html($(".op-class.btn-primary").map((_, btn) => getSubclassHtml(btn)).get().join(""));
    }

    function toggleExclusive(el) {
        $(el).toggleClass("filter-exclusive filter-nonexclusive");
        clearFilter($(`#clear-filter-${$(el).attr("id").slice(12)}`).attr("clear-data"));
        if ($(el).attr("id") == "filter-name-class") actualizeSubclass();

        actualizeFilter();
    }

    function toggleBtn(el) {
        let section = $(el).attr("section");
        let exclusive = section && $(el).hasClass("btn-secondary") && $(`#filter-name-${section}`).hasClass("filter-exclusive");

        if (exclusive) $(`.op-${section}`).removeClass("btn-primary").addClass("btn-secondary");
        $(el).toggleClass("btn-secondary btn-primary");
        if ($(el).hasClass("op-class")) actualizeSubclass();

        actualizeFilter();
    }

    function clearFilter(cls) {
        $(cls).removeClass("btn-primary").addClass("btn-secondary");
        if (cls.includes(".op-class")) actualizeSubclass();

        actualizeFilter();
    }

    function switchState(el) {
        $(el).toggleClass("btn-disabled btn-enabled");

        actualizeFilter();
    }

    function invertSort(el) {
        $(el).toggleClass("fa-sort-amount-down fa-sort-amount-up");

        actualizeFilter();
    }

    function resetSorting() {
        $("#sort-atk").removeClass("btn-enabled").addClass("btn-disabled");
        $("#sort-def").removeClass("btn-enabled").addClass("btn-disabled");
        $("#sort-hp").removeClass("btn-enabled").addClass("btn-disabled");
        $("#sort-dp").removeClass("btn-enabled").addClass("btn-disabled");
        $("#sort-block").removeClass("btn-enabled").addClass("btn-disabled");
        $("#sort-rarity").removeClass("btn-disabled").addClass("btn-enabled");

        $("#order-atk").removeClass("fa-sort-amount-up").addClass("fa-sort-amount-down");
        $("#order-def").removeClass("fa-sort-amount-up").addClass("fa-sort-amount-down");
        $("#order-hp").removeClass("fa-sort-amount-up").addClass("fa-sort-amount-down");
        $("#order-dp").removeClass("fa-sort-amount-up").addClass("fa-sort-amount-down");
        $("#order-block").removeClass("fa-sort-amount-up").addClass("fa-sort-amount-down");
        $("#order-rarity").removeClass("fa-sort-amount-up").addClass("fa-sort-amount-down");

        actualizeFilter();
    }

    function sortFilter(val_a, val_b, stat_class) {
        if ($(`#sort-${stat_class}`).hasClass("btn-disabled")) return 0;

        return $(`#order-${stat_class}`).hasClass("fa-sort-amount-down") ? val_b - val_a : val_a - val_b;
    }

    // can't use array methods without discarding id and id isn't stored right inside char *sigh*
    function getId(char) {
        return char.phases[0].characterPrefabKey;
    }

    function getStat(char, stat_class) {
        return char.phases.slice(-1)[0].attributesKeyFrames[0].data[stat_class];
    }

    function getTags(char) {
        return char.tagList.concat(char.position == "MELEE" || char.position == "ALL" ? ["近战位"] : [],    // Melee
                                   char.position == "RANGED" || char.position == "ALL" ? ["远程位"] : [],   // Ranged
                                   char.rarity == 1 ? ["新手"] : [],                                        // Starter
                                   char.rarity == 0 ? ["支援机械"] : []);                                    // Robot
    }

    function getSubclass(char) {
        let tags = getTags(char);


        //Handpicked subclass check 
        let sub = db.subclass[char.profession]
        
        if(sub){
            var subclasses = []
            $.each(sub,function(key,v){
                if(char.appellation==v)subclasses.push(key)
            })
            if(subclasses.length>0)return subclasses
        }


        //Automatic subclass check
        /* NOTE: would like to add "sp generator", but there is not really any class
                 it belongs to and filtering it without hardcoding seems very tricky */

        switch (char.profession)
        {
            case "CASTER":      // CASTER (ST, AOE)
                return tags.includes("群攻") ? "CASTER-AOE" : "CASTER-ST";
            case "WARRIOR":     // GUARD (ST, AOE, RANGED)
                return tags.includes("群攻") ? "GUARD-AOE" :
                       char.phases.slice(-1)[0].rangeId.split("").filter(c => c > 1).length ? "GUARD-RANGED" :
                       "GUARD-ST";
            case "MEDIC":       // MEDIC (ST, AOE)
                /*  NOTE: eh, don't really like this hack. Half hardcoded and doesn't even
                 *        take Silence S2 and Gavial S2 into consideration */
                return char.description == "同时恢复三个友方单位的生命" ? "MEDIC-AOE" : "MEDIC-ST";
            case "SNIPER":      // SNIPER (ST, AOE)
                return tags.includes("群攻") ? "SNIPER-AOE" : "SNIPER-ST";
            case "SPECIAL":     // SPECIALIST (PUSH, PULL, FAST-REDEPLOY, SPIKE)
                return tags.includes("快速复活") ? "SPECIAL-REDEPLOY" :
                       // same dirty hack as above
                       char.description == "同时攻击阻挡的<@ba.kw>所有敌人</>\\n可以放置于远程位" ? "SPECIAL-PUSH" : 
                       char.description == "技能可以使敌人产生<@ba.kw>位移</>\\n可以放置于远程位" ? "SPECIAL-PULL" :
                       "SPECIAL-SPIKES";
            case "SUPPORT":     // SUPPORTER (SLOW, SUMMON, DEBUFF, BUFF)
                return tags.includes("减速") ? "SUPPORT-SLOW" :
                       tags.includes("召唤") ? "SUPPORT-SUMMON" :
                       tags.includes("削弱") ? "SUPPORT-DEBUFF" :
                       "SUPPORT-BUFF";
            case "TANK":        // DEFENDER (NORMAL, HEALING)
                return tags.includes("治疗") ? "DEFENDER-HEALING" : "DEFENDER-NORMAL";
            case "PIONEER":     // VANGUARD (DP ON TIME, DP ON KILL, NO DP)
                return char.trait && char.trait.candidates.filter(trait =>
                        trait.blackboard.filter(data =>
                            data.key == "cost").length).length ? "VANGUARD-DP-KILL" :   // DP on kill is a trait
                       char.skills.filter(skill =>
                            db.skills[skill.skillId].levels.filter(level =>
                                level.blackboard.filter(data =>
                                    data.key == "cost").length).length).length ? "VANGUARD-DP-TIME" : // DP on time is a skill
                       "VANGUARD-NO-DP";
        }
    }

    function actualizeFilter() {
        $("#selectedopclass").html("");

        let op_class = $(".op-class.btn-primary").map((_, btn) => $(btn).attr("data-id")).get();
        let op_subclass = $(".op-subclass.btn-primary").map((_, btn) => $(btn).attr("data-id")).get();
        let op_gender = $(".op-gender.btn-primary").map((_, btn) => db.gender[$(btn).attr("data-id")]["sex_cn"]).get();
        let op_tag = $(".op-tag.btn-primary").map((_, btn) => db.ktags[$(btn).attr("data-id")]["cn"]).get();
        let op_faction = $(".op-faction.btn-primary").map((_, btn) => $(btn).attr("data-id")).get();
        let op_skill = $(".op-skill.btn-primary").map((_, btn) => parseInt($(btn).attr("data-id"))).get();

        let exclusive_class = $("#filter-name-class").hasClass("filter-exclusive");
        let exclusive_subclass = $("#filter-name-subclass").hasClass("filter-exclusive");
        let exclusive_gender = $("#filter-name-gender").hasClass("filter-exclusive");
        let exclusive_tag = $("#filter-name-tag").hasClass("filter-exclusive");
        let exclusive_faction = $("#filter-name-faction").hasClass("filter-exclusive");
        let exclusive_skill = $("#filter-name-skill").hasClass("filter-exclusive");

        if (op_class.length == 0 &&
            op_subclass.length == 0 &&
            op_gender.length == 0 &&
            op_tag.length == 0 &&
            op_faction.length == 0 &&
            op_skill.length == 0) return;

        // EXTRACTION
        let ops = Object.values(db.chars).filter(char => char.profession != "TOKEN" && char.profession != "TRAP");

        // FILTERING
        if (op_class.length) ops = exclusive_class ? ops.filter(char => op_class[0] == char.profession)
                                                   : ops.filter(char => op_class.includes(char.profession));
        if (op_subclass.length) ops = ops.filter(char => {
            //add support for multiple subclass per operator 

            var checksubclass = getSubclass(char)
            if(Array.isArray(checksubclass)){
                console.log(op_subclass)
                console.log(checksubclass)
                var exist = false
                $.each(op_subclass,function(key,v){
                    if(checksubclass.includes(v)) exist = true
                })
                return exist
            }else{
                return op_subclass.includes(checksubclass)
            }
        });
        // using query in a lambda is really awful. "sex" should be in chars, not chars2
        if (op_gender.length) ops = exclusive_gender ? ops.filter(char => op_gender[0] == query(db.chars2, "name_cn", char.name).sex)
                                                     : ops.filter(char => op_gender.includes(query(db.chars2, "name_cn", char.name).sex));
        if (op_tag.length) ops = exclusive_tag ? ops.filter(char => getTags(char).filter(tag => op_tag.includes(tag)).length == op_tag.length)
                                               : ops.filter(char => getTags(char).filter(tag => op_tag.includes(tag)).length > 0);
        if (op_faction.length) ops = exclusive_faction ? ops.filter(char => op_faction[0] == char.displayLogo.toUpperCase())
                                                       : ops.filter(char => op_faction.includes(char.displayLogo.toUpperCase()));
        if (op_skill.length) ops = exclusive_skill ? ops.filter(char =>
                                                        char.skills.filter(skill =>
                                                            db.skills[skill.skillId].levels.filter(sp =>
                                                                op_skill[0] == sp.spData.spType).length).length)
                                                   : ops.filter(char =>
                                                        char.skills.filter(skill =>
                                                            db.skills[skill.skillId].levels.filter(sp =>
                                                                op_skill.includes(sp.spData.spType)).length).length);

        // SORTING
        ops = ops.sort((a, b) => sortFilter(getStat(a, "atk"), getStat(b, "atk"), "atk")    * 100000 * 10000 * 1000 + // def is never more than 1 000
                                 sortFilter(getStat(a, "def"), getStat(b, "def"), "def")    * 100000 * 10000 +        // maxHp is never more than 10 000
                                 sortFilter(getStat(a, "maxHp"), getStat(b, "maxHp"), "hp") * 100000 +                // dp cost is never more than 100
                                 sortFilter(getStat(a, "cost"), getStat(b, "cost"), "dp")   * 1000 +
                                 sortFilter(getStat(a, "blockCnt"), getStat(b, "blockCnt"), "block")   * 100 +
                                 sortFilter(a.rarity, b.rarity, "rarity") * 10 +
                                //  (db.names[getId(a)][lang].localeCompare(db.names[getId(b)][lang]))
                                 (b.appellation>a.appellation?-1 :+1)
                                 );

        // CONSTRUCTION
        $("#selectedopclass").html(ops.map(char =>
            `<li class="selectop-grid ak-shadow" onclick="selectOperator('${char.name}')">
                <img src="img/avatars/${getId(char)}.png">
                <div class="name ak-font-novecento ak-center">${char.appellation}</div>
                <div class='ak-rare-${char.rarity + 1}'></div>
                <div class="ak-showfaction"><img src="img/factions/${char.displayLogo.toLowerCase()}.png" title="${db.campdata[char.displayLogo]}"></div>
                <div class="grid-box op-rarity-${char.rarity + 1}"></div>
            </li>`).join(" "));
    }

    function openOPZOOMmodal(){
        $('#opzoom').modal();
        $('#charazoom').css("margin","auto")
        $('#charazoom').css("margin-left","0px")
        $('#charazoom').css("width","100%")
        $('#charazoom').css("height","85vh")
        $('#charazoom').css("max-width","100%")
        $('#charazoom').css("max-height","100%")
        $('#charazoomslider').val(100);
        $('#charazoominput').val(100)
        var image = $('#tabs-opCG').children('.active').children('img').attr('src');
        ChangeZoomChara('',image);
    }
    function ChangeZoomChara(skinName, src=''){
        
        

        if(skinName != ''){
            $("#charazoom").attr("src","img/characters/"+skinName+".png");
        } else {
            $("#charazoom").attr("src",src);
        }
        $('#charazoom').modal('handleUpdate')
    }
    function selectOperator(opname,from='Selecting Operator From Browse'){
        $("#opchoosemodal").modal('hide');
        if(opname != ""){
            $("#chara-detail-container").show();
            console.log("SELECT OPERATOR");
            console.log(opname);   
            $("#opname").val("");
            $('#operatorsResult').empty();
            $('#operatorsResult').hide();
            var opdata = query(db.chars2,"name_cn",opname);
            var opclass = query(db.classes,"type_cn",opdata.type);
            var opdata2 = query(db.chars,"name",opdata.name_cn,true,true);

            var opcode = Object.keys(opdata2)[0]

            var opKey =""
            $.each(opdata2,function(key,v){
                v['id'] = key;
                // console.log(v);
                opdataFull = v;
                opKey = key;
                localStorage.selectedOPDetails = key;
                return false
            });

            console.log(opdataFull.appellation)
            gtag('event', 'Selecting Operator', {
                'event_category' : 'Operator Details',
                'event_label' : opdataFull.appellation ,
                'value' : from
            });              
            
            //test
            // var charalist = []
            // $.each(db.chars,(key,chara) => {
            //     charalist.push(`${chara.appellation},${chara.displayLogo},${key.split("_")[1]},${key}_1`)
            // });
            // console.log(charalist.join("\n"))
            //
            

            tokenname = opdataFull.tokenKey
            currskin =opcode


            var url = new URL(window.location.href)
            var unreadable = query(db.unreadNameTL,"name",opdataFull.appellation)
            var correctname = (unreadable?unreadable.name_en.replace(/ /g,"_"):opdataFull.appellation.replace(/ /g,"_"))
            opapp = correctname
            if(url.searchParams.get("opname")===correctname){
                
            }else{
                url.searchParams.set("opname", correctname);
                history.pushState(null, '', url); 
            }

            // use opdata to get the operator data based on tl-akhr.json
            // use opdataFull to get the operator data based on character_table.json

            // Get operator elite skins
            var skinList = db.skintable.buildinEvolveMap[opdataFull.id];
            var extraSkin = []
            Object.keys(db.skintable.charSkins).forEach(element => {
                // console.log(element)
                // console.log()
                if(element.startsWith(opdataFull.id)){
                    if(db.skintable.charSkins[element].displaySkin.skinName){
                        extraSkin.push(db.skintable.charSkins[element])
                    }
                    
                }
            });
            // console.log(extraSkin)
            // console.log(skinList);
            $("#op-faction").attr("src","img/factions/"+opdataFull.displayLogo.toLowerCase()+".png");

            var tabbtn = [];
            var tabbtn2 = [];
            var tabcontent = [];
            var tabcontent2 = [];
            var zoombtn = [];
            
            $("#elite-sidenav").empty();
            $("#tabs-opCG").empty();
            $("#elite-topnav").empty();
            $("#tabs-opData").empty();
            $("#op-taglist").empty();

            charName = opcode;
            chibiName = opcode
            console.log(chibipers)
            if(chibipers=='build') chibiName= "build_"+chibiName
            console.log(chibiName)
            folder = `./spineassets/${chibitype}/${charName}/${chibipers}/`
            // if(spinewidget)

            
            if(loadchibi){
                LoadAnimation()
                LoadAnimationToken()
                // $("#spine-frame").fadeIn(10)
            }
            else $("#spine-frame").hide()
            

            for (var i = 0; i < opdataFull.phases.length; i++) {
                var l = opdataFull.phases.length;
                if(i == 0){
                    if(l == 1){
                        tabbtn[l] = $("<li class='nav-item'><button class='btn tabbing-btns active'>"
                            + "<img src='img/ui/elite/0-s.png' data-toggle='pill' href='#opCG_0_tab'></button></li>");
                        tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link active' data-toggle='pill' onclick='UpdateElite(0)' href='#elite_0_tab'>Non-Elite</a></li>");
                    } else {
                        tabbtn[l] = $(`<li class='nav-item'><button class='btn tabbing-btns tabbing-btns-bottom active' data-toggle='pill' href='#opCG_${i}_tab' onClick='ChangeSkin("${opcode}")'>`
                                            + "<img src='img/ui/elite/0-s.png'></button></li>");
                        tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link active' data-toggle='pill' onclick='UpdateElite("+i+")'href='#elite_"+i+"_tab'>Non-Elite</a></li>");
                    }
                } else if( i == l-1 ){
                    tabbtn[0] = $(`<li class='nav-item'><button class='btn tabbing-btns tabbing-btns-top' data-toggle='pill' href='#opCG_${i}_tab' onClick='ChangeSkin("${opcode}")'>`
                                            + "<img src='img/ui/elite/"+i+"-s.png'></button></li>");
                    tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link' data-toggle='pill' onclick='UpdateElite("+i+")' href='#elite_"+i+"_tab'>Elite "+i+"</a></li>");
                } else {
                    tabbtn[l-i] = $(`<li class='nav-item'><button class='btn tabbing-btns tabbing-btns-middle' data-toggle='pill' href='#opCG_${i}_tab' onClick='ChangeSkin("${opcode}")'>`
                                            + "<img src='img/ui/elite/"+i+"-s.png'></button></li>");
                    tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link' data-toggle='pill' onclick='UpdateElite("+i+")' href='#elite_"+i+"_tab'>Elite "+i+"</a></li>");
                }
                
                var skindata;
                if(!(skinList[i] in db.skintable.charSkins)){
                    skindata = db.skintable.charSkins[skinList[i-1]];
                } else {
                    skindata = db.skintable.charSkins[skinList[i]];
                }
                zoombtn.push($(`<button class="btn ak-c-black btn-dark" style="margin:2px;padding:2px; height: 50px; width: 50px;" onclick="ChangeZoomChara('${skindata.portraitId}')"><img src='img/ui/elite/${i}-s.png'></button>`))
                if(i == 0){
                    $("#charazoom").attr("src","img/characters/"+skindata.portraitId+".png");
                    $('#charazoom').modal('handleUpdate')
                    
                    tabcontent.push($("<div class='tab-pane container active' id='opCG_0_tab'>"
                        +"<img class='chara-image' src='img/characters/"+skindata.portraitId+".png'>"
                        +"</div>"));
                } else {
                    tabcontent.push($("<div class='tab-pane container' id='opCG_"+i+"_tab'>"
                        +"<img class='chara-image' src='img/characters/"+skindata.portraitId+".png'>"
                        +"</div>"));
                }
                
                var elitehtml = getEliteHTML(i,opdataFull);
                tabcontent2.push(elitehtml);
            }


            if(extraSkin.length>0){
                let dropdowntab = []
                
                for(var i=0;i<extraSkin.length;i++){
                    zoombtn.push($(`<button class="btn ak-c-black btn-dark" style="margin:2px;padding:2px; height: 50px; width: 50px;" onclick="ChangeZoomChara('${encodeURIComponent(extraSkin[i].portraitId)}')">
                    <img style="max-width:40px;max-height:40px;" src='img/skingroups/${encodeURIComponent(extraSkin[i].displaySkin.skinGroupId)}.png'>
                    </button>`))

                    tabcontent.push($(`
                    <div class='tab-pane container' id='opCG_S${i}_tab'>
                    <img class='chara-image' src='img/characters/${encodeURIComponent(extraSkin[i].portraitId)}.png'>
                    </div>
                    `))

                    
                    dropdowntab.push(`<li class='nav-item' ${i==0?`style="margin-top:5px"`:""}><a class="btn tabbing-btns" data-toggle='pill' href='#opCG_S${i}_tab' onClick='ChangeSkin("${extraSkin[i].portraitId.replace("#","_")}")'> 
                    <div style="display:inline-block;height:100%;vertical-align:middle;"></div>
                    <img class='skinimage' style="max-width: 40px;max-height: 40px;margin-left:-5px;" src='img/skingroups/${encodeURIComponent(extraSkin[i].displaySkin.skinGroupId)}.png'>
                    </a></li>`)
                }
                
                tabbtn.push(`
         
                    ${dropdowntab.join("")}
                    
                `)
                
            }
            tabbtn.push($(`<button type="button" class="btn tabbing-btns tabbing-btns-top ak-btn" style="width:50px;height:50px;margin-top:10px;" onclick="openOPZOOMmodal()"><span style="font-size: 1.5em" class="fa fa-search-plus"></span></button>`))
            tabbtn.push($(`<button type="button" class="btn tabbing-btns tabbing-btns-middle ak-btn" style="width:50px;height:50px" data-toggle="modal" data-target="#opstory">
            <div>
                <img class='audioprofilebutton' src="./img/ui/story/profile.png" style="max-width:40px;max-height:40px">
                <div class="btn-story-header" style="border-radius:0px">Profile</div>
            </div>
            </button>`))

            tabbtn.push($(`<button type="button" class="btn tabbing-btns tabbing-btns-bottom ak-btn" style="width:50px;height:50px" data-toggle="modal" data-target="#opaudio" >
            <div>
                <img class='audioprofilebutton' src="./img/ui/story/audio.png" style="max-width:40px;max-height:40px" onclick="GetAudio(opdataFull)">
                <div class="btn-story-header">Audio</div>
            </div>
            </button>`))

            $("#charazoom-button").html(zoombtn)
            $("#elite-sidenav").html(tabbtn);
            $("#tabs-opCG").html(tabcontent);
            $("#elite-topnav").html(tabbtn2);
            $("#tabs-opData").html(tabcontent2);

            for (var i = 0; i < opdataFull.phases.length; i++) {
                EliteStatsDisplay(1,i);
            }

            var unreadable = query(db.unreadNameTL,"name",opdata.name_en).name_en
            // $("#op-nameTL").html(opdata['name_'+lang]);
            // $("#op-nameREG").html("["+opdata['name_'+reg]+"]");

            $("#op-nameTL").html(opdataFull.appellation);
            $("#op-nameREG").html("["+opdataFull.name+"]");

            $("#op-displaynum").html(`${opdataFull.displayNumber} | ${opdataFull.id.split("_")[1]} | ${opdataFull.id.split("_")[2]}`)
            if(unreadable){
                $("#op-nameRead").html(`[ ${unreadable} ]`);
            }else{
                $("#op-nameRead").empty()
            }
            var gender = query(db.gender,"sex_cn",opdata.sex);
            
            $("#op-gender").html(titledMaker(gender['sex_'+lang],`Gender`))
            var position = query(db.tags,"tag_cn",opdataFull.position);
            $("#op-position").html(titledMaker(position['tag_'+lang],`Position`))

            

            var type = query(db.classes,"type_data",opdataFull.profession);
            $("#op-classImage").attr("src","img/classes/black/icon_profession_"+type['type_'+lang].toLowerCase()+"_large.png")
            $("#op-className").html(type['type_'+lang])
            var attackType = getSpeciality(opdataFull.description,opdataFull)
            
            $("#op-atktype").html(attackType)
            $("#op-rarity").empty();
            $("#op-rarity").attr("class","op-rarity-"+(opdataFull.rarity+1))
            
            $("#op-trust").html(GetTrust(opdataFull))

            var potentials = GetPotential(opdataFull)
            var potentialist = []
            potentialist.push(`<div style="height:4px"></div>`)
            for(i=0;i<potentials.length;i++){
                potentialist.push(`<div style="font-size:13px;padding:1px;margin-left:-6px;color:#DDD;vertical-align:bottom"><img src="./img/ui/potential/${i+2}.png" style="margin-top:-4px;width:20px;background:#222;border-radius:25%;padding:2px"> ${potentials[i]}</div>`)
            }
            // console.log(potentials)
            $("#op-talentlist").html(GetTalent(opKey,opdataFull))
            if(potentials.length>0){
                $("#op-potentialist").html(titledMaker(potentialist.join(""),"Potentials"))
            }else{
                $("#op-potentialist").empty()
            }
            for (var i = 0; i < (opdataFull.rarity+1); i++) {
                $("#op-rarity").append("<i class='fa fa-star'></i>");
            }
            var tags_html = [];
            $.each(opdataFull.tagList,function(_,v){
                var tag = query(db.tags,"tag_cn",v);
                if(tag){
                    var tagReg = tag['tag_'+reg];
                    var tagTL = tag['tag_'+lang];
                    tags_html.push("<li style=\"list-style-type:none; padding-bottom: 10px;\"><button readonly type=\"button\" class=\"btn btn-sm ak-shadow-small ak-btn btn-secondary btn-char my-1\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+ tagReg +"\">" +
                            (tagReg == tagTL ? "" : '<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">'+tagReg+'</a>') +tagTL + "</button></li>");
                }
            });
            var newtags = `<div style='margin-top: 12px;margin-bottom:0px'>${tags_html.join("")}</div>`
            // $("#op-potentialist").html(titledMaker(potentialist.join(""),"Potentials"))
            $("#op-taglist").append(titledMaker(newtags,"Tags","","","padding-bottom:-40px"));


            var charaRiic = GetRiic(opdata2)
            // console.log(charaRiic)
            
            $("#op-riic").html(charaRiic)
            $('#op-riicdetail').hide();
            //Story

            GetStory(opdataFull)
            $('#opaudiocontent').empty()
            $('#opaudiotranslator').empty()
            $('#opaudioproofreader').empty()
            ///////////////////////////////////////////////// SKILLS SECTION //////////////////////////////////////////////////

            $("#skill-tabs").empty();
            $("#skill-contents").empty();
            $.each(opdataFull.skills,function(i,v){
                var maxSkillLevel = opdataFull.skills[i].levelUpCostCond.length;
                var skillId = opdataFull.skills[i].skillId;
                var skillData = db.skills[skillId];
                var skillname
                var tables = "";
                var grid = ""
                //console.log(skillData)
                // var materialList2 = []
                $.each(skillData.levels,function(i2,v2){
                    // console.log(v2['spData'].spCost);
                    var currSkill = skillData.levels[i2]
                    skillname = db.skillsTL[skillId]?db.skillsTL[skillId].name:currSkill.name;
                    // if (db.skillsEN[skillId]&&db.skillsEN[skillId].levels[i2])skillname = db.skillsEN[skillId].levels[i2].name
                    var skilldesc = getSkillDesc(skillId,i2);
                    var skillMat = GetSkillCost(i2,i,opdataFull)
                    var force
                    var materialist = []
                    skillMat.forEach(mat => {
                        materialist.push(CreateMaterial(mat.id,mat.count))
                    });
                    var materialHtml =``
                    if(i2>=7){
                        var time = opdataFull.skills[i].levelUpCostCond[i2-7].lvlUpTime
                        var condLeveling = opdataFull.skills[i].levelUpCostCond[i2-7].unlockCond
                        var condUnlocking = opdataFull.skills[i].unlockCond
                        var phase = Math.max(condLeveling.phase,condUnlocking.phase)
                        var level = Math.max(condLeveling.level,condUnlocking.level)
                        materialHtml = `
                        <div style="text-align:center;background:#222">${(i2==0?"Unlock":"Rank Up")} Requirements</div>
                        <div style="margin-top:15px">
                        ${titledMaker((phase>0?"Elite "+phase+" ":"")+(level>0?"Level "+level:""),"Level Required")}
                        ${titledMaker(time/60/60+" Hour","Time Required")}
                        </div>
                        `+(materialist.length>0?materialist.join(""):"")
                    }else{
                        var condLeveling = (opdataFull.allSkillLvlup[i2-1]?opdataFull.allSkillLvlup[i2-1].unlockCond:{phase:0,level:0})
                        var condUnlocking = opdataFull.skills[i].unlockCond
                        var phase = Math.max(condLeveling.phase,condUnlocking.phase)
                        var level = Math.max(condLeveling.level,condUnlocking.level)
                        materialHtml = `
                        <div style="text-align:center;background:#222">${(i2==0?"Unlock":"Rank Up")} Requirements</div>
                        <div style="margin-top:15px">
                        ${titledMaker((phase>0?"Elite "+phase+" ":"")+(level>0?"Level "+level:""),"Level Required")}
                        </div>
                        `+(materialist.length>0?materialist.join(""):"")
                    }
                    
                    if(v2.rangeId)grid = rangeMaker(v2.rangeId)
                    
                    var spType = (v2.spData.spType)
                    // console.log(spType)
                    var spTypeHtml = ""
                    switch (spType){
                        case 1:spTypeHtml = "Per second";break;
                        case 2:spTypeHtml = "Attacking Enemy";break;
                        case 4:spTypeHtml = "Getting Hit";break;
                        case 8:spTypeHtml = "Always On";break;
                        default:spTypeHtml = spType;break;
                    }
                    var spDuration= (v2.duration==0?"Instant Attack":v2.duration==-1?"Infinite":v2.duration + " Seconds")
                    var spDurationName = (v2.duration==0?"":"Duration")
                    var skilldetails =[]
                    // console.log(skillname)
                    // console.log(skillData.levels[i2])
                    skillData.levels[i2].blackboard.forEach(skillinfo => {
                        // console.log(skillinfo)
                        var skilljson = {}
                        skilljson.name = db.effect[skillinfo.key]?db.effect[skillinfo.key]:skillinfo.key
                        skilljson.key = skillinfo.key
                        skilljson.value = skillinfo.value

                        skilldetails.push(skilljson)
                        if(skillinfo.key=="force") force= skillinfo.value
                        if(v2.duration==-1){
                            if(skillinfo.key =="duration"){
                                spDuration = skillinfo.value;
                                spDurationName = "Target Effect Duration"
                            }
                        }
                        if(skillinfo.key=="ability_range_forward_extend"){
                            grid = rangeMaker(opdataFull.phases[0].rangeId,true,skillinfo.value)
                        }
                    });
                    // console.log(skilldetails)
                    switch (force) {
                        case 0: force = "Small [0]";break;
                        case 1: force = "Medium [1]";break;
                        case 2: force = "Large [2]";break;
                        case 3: force = "Huge [3]";break;
                    }
                    // console.log(currSkill)
                    var skillType = ""
                    switch(currSkill.skillType){
                        case 0 : skillType = "Passive" ;break;
                        case 1 : skillType = "Manual Trigger" ;break;
                        case 2 : skillType = "Auto Trigger" ;break;
                    }
                    var skillType = titledMaker(skillType,"Skill Activation")
                    var spTypeHtml = (currSkill.skillType==0?"":titledMaker(spTypeHtml,"SP Charge Type",`spType-${spType}`))
                    // console.log(materialList2)
                    // console.log(parseInt(v2.duration)>0)
                    //skilltype 
                    //0 = on deploy
                    //1 = manual 
                    //2 = auto
                    tables +=`<table id='skill${i}level${i2}stats' class='${lefthand=="true"?"left-hand":""} skillstats ${(i2!=0 ? '' : 'active')}'>
                             <tr >
                                <td colspan='${grid?5:4}'>${spTypeHtml}${skillType}${titledMaker(spDuration,spDurationName)}</td>
                            </tr>
                            <tr style="height:10px"></tr>
                            <tr>
                                <td colspan='${grid?3:2}' class='skilldesc'>${skilldesc}</td>
                            </tr>
                            <tr style="height:10px"></tr>
                            `       

                    var detailtable = []
                    if(skilldetails.length>0){
                        var skillhtmldetail = ""
                        
                        skilldetails.forEach(currdetails => {
                            
                            skillhtmldetail+=`
                            <div style="background:#444;margin:4px;padding:2px;padding-top:8px;background:#444;border-radius:2px;color: #999999">
                                    ${titledMaker2(currdetails.name,currdetails.key)}  ${currdetails.value}
                            </div>`
                        });
                        detailtable = `<button id='skilldetailtitle' class='btn btn-sm btn-block ak-btn' onclick='SlideToggler("skilldetailcontent")'style="color:#fff;text-align:center;background:#222;padding:2px">Skill Details <i class="fas fa-caret-down"></i></button> 
                            <div id='skilldetailcontent' class="ak-shadow skilldetailcontent" style="display:none;margin-bottom:8px;padding-top:10px;padding:2px;background:#666">    
                                ${skillhtmldetail}
                            </div>
                        </div>`
                    }else{
                        detailtable=""
                    }
                    
                    // if
                    if(grid){
                        tables +=            "<tr>"
                                +               "<td rowspan=2 id='skill"+i+"lv"+i2+"grid'>"+(grid?grid:"")+"</td>"
                                +                `<td>${titledMaker(v2['spData'].spCost,"SP Cost")}</td>`
                                +            "</tr>"
                                +             "<tr>"
                                +                   `<td>${titledMaker(v2['spData'].initSp,"Initial SP")}</td>`
                                +               "</tr>"
                                +             "<tr><td>"+(force!=undefined?`${titledMaker(force,"Force Level")}`: "")+"</td></tr>"
                                +               `${detailtable==""?"":`<tr><td colspan=3>${detailtable}</td></tr>`}`
                                +               "<tr><td colspan=3>"+ materialHtml + "</td><tr>"
                                +        "</table>";   
                    } else {
                        tables +=           "<tr style=\"height:10px\"></tr>"
                                +            "<tr>"
                                +                `<td>${titledMaker(v2['spData'].spCost,"SP Cost")}${titledMaker(v2['spData'].initSp,"Initial SP")}</td>`
                                +            "</tr>"
                                +             (force!=undefined?`<tr><td>${titledMaker(force,"Force Level")}</td></tr>`: "")
                                +               `${detailtable==""?"":`<tr><td colspan=4>${detailtable}</td></tr>`}`
                                + "<tr><td colspan=4>"+ materialHtml + "</td><tr>"
                                +        "</table>";
                    }
                })

                if(skillData.iconId == null){
                    var skillIcon = skillId;
                } else {
                    var skillIcon = skillData.iconId;
                }
                // console.log(opdataFull.skills[i])
                var skilltoken = opdataFull.skills[i].overrideTokenKey
                if(skilltoken== null) skilltoken = opdataFull.tokenKey
                //
                
                
                var tabItem = $("<li class='nav-item'>"
                                +    `<button class='btn tabbing-btns horiz-small nav-link ${(i!=0 ? '' : 'active')}' data-toggle='pill' onclick='ChangeSkillAnim(${i},${opdataFull.skills.length},"${skilltoken}")' href='#skill${i}'><p>Skill ${i+1}</p></button>`
                                +"</li>");
                // var tabContents = $("<div class='tab-pane container clickthrough "+(i!=0 ? '' : 'active')+"' id='skill"+i+"'>"
                //                         +    "<div class='small-container ak-shadow' style='margin-top: 50px;'>"
                //                         +        "<p class='large-text'>Skill "+(i+1)+"</p>"
                //                         +        "<span class='custom-span skillname'>"+skillname+"</span>"
                //                         +        "<div class='topright'>"
                //                         +            "<div style='padding: 15px;'>"
                //                         +                "<img class='ak-shadow skill-image' id='skill"+i+"image' src='img/skills/skill_icon_"+skillIcon+".png' style='width: 100%;'>"
                //                         +            "</div>"
                //                         +        "</div>"
                //                         +        "<button class='btn btn-default btn-collapsible notclickthrough' data-toggle='collapse' data-target='#skill"+i+"StatsCollapsible'><i class='fa fa-sort-down'></i></button>"
                //                         +    "</div>"
                //                         +    "<div id='skill"+i+"StatsCollapsible' class='collapse collapsible notclickthrough ak-shadow collapse show' >"
                //                         +       `<input type='range' value='1' min='1' max=${skillData.levels.length} name='skillLevel' id='skill${i}Level' oninput='changeSkillLevel(this,${i})'style="margin-top:20px;" class='${lefthand=="true"?"lefthandskillLevelInput":""} skillLevelInput'>`
                //                         +        `<div class='${lefthand=="true"?"lefthandskillleveldisplaycontainer":""} skillleveldisplaycontainer'><span class="custom-span ak-btn btn btn-sm ak-c-black" id='skill${i}LevelDisplay'>${SkillRankDisplay(1)}</span></div>`
                //                         // +        `<div style="position:absolute"style="bottom:0px;right:0px">Level</div>`
                //                         +        tables
                //                         +    "</div>"
                //                         +"</div>");
                var tabContents = $(`
                <div class='tab-pane container clickthrough ${i!=0 ? '' : 'active'}' id='skill${i}'>
                    <div class='small-container ak-shadow' style='margin-top: 50px;'>
                        <p class='large-text'>Skill ${i+1}</p>
                        <span class='custom-span skillname'>${skillname}</span>
                            <div class='topright'>
                                <div style='padding: 15px;'>
                                    <img class='ak-shadow skill-image' id='skill${i}image' src='img/skills/skill_icon_${skillIcon}.png' style='width: 100%;'>
                                </div>
                            </div>
                        <button class='btn btn-default btn-collapsible notclickthrough' data-toggle='collapse' data-target='#skil${i}StatsCollapsible'><i class='fa fa-sort-down'></i></button>
                    </div>
                    <div id='skill${i}StatsCollapsible' class='collapse collapsible notclickthrough ak-shadow collapse show' >
                        <input type='range' value='1' min='1' max=${skillData.levels.length} name='skillLevel' id='skill${i}Level' oninput='changeSkillLevel(this,${i})'style="margin-top:20px;" class='${lefthand=="true"?"lefthandskillLevelInput":""} skillLevelInput'>
                            <div class='${lefthand=="true"?"lefthandskillleveldisplaycontainer":""} skillleveldisplaycontainer'><span class="custom-span ak-btn btn btn-sm ak-c-black" id='skill${i}LevelDisplay'>${SkillRankDisplay(1)}</span></div>
                        ${tables}
                    </div>
                <div>

                `)
                $("#skill-tabs").append(tabItem);
                $("#skill-contents").append(tabContents);
                // $("#skill-contents").append("WAAAAAAAAAAAAAAAAAAAAAI");
            });
        }
    }

    function getEliteHTML(i, opdataFull){
        var container = $("<div class='tab-pane container "+(i!=0 ? '' : 'active')+"' id='elite_"+i+"_tab'></div>");

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
            <div style="text-align:center">${materialist.join("")}</div>`
        }
        var keyframes = [];
        $.each(opdataFull.phases[i].attributesKeyFrames,function(j,v){
            keyframes[j] = v;
        });
        // console.log(keyframes);
        // var statsLevelHeader = $(`<span class='stat-level-header ${lefthand=="true"?"lefthand-stat-level-header":"righthand-stat-level-header"} ' style=''>Level</span>`)
        // var statsLevelSlider = $(`<input type='range' value='1' min='1' max='${keyframes[1].level}' name='levelStats' id='elite${i}LevelSlider' oninput='changeEliteLevel(this,${i},${keyframes[1].level})' style='margin-top:20px;width:60%;' class='statlevelInput ${lefthand=="true"?"lefthand-statlevelInput":"righthand-statlevelInput"}'></input>`);
        // var statsLevelDisplay = $(`<div class='form-group stat-input ${lefthand=="true"?"lefthand-stat-input":"righthand-stat-input"}' style='display:inline-block;vertical-align:middle;'><input class='form-control' id='elite${i}LevelDisplay' onchange='changeEliteLevel(this,${i},${keyframes[1].level})' style='line-height:1.1' type='number' value='1' min='1' max='${keyframes[1].level}'></div>`)
        
        var statsLevelAll = $(`
        <div style='text-align:center'>
        <span class='stat-level-header ${lefthand=="true"?"lefthand-stat-level-header":"righthand-stat-level-header"} ' style=''>Level</span>
        <input type='range' value='1' min='1' max='${keyframes[1].level}' name='levelStats' id='elite${i}LevelSlider' oninput='changeEliteLevel(this,${i},${keyframes[1].level})' style='margin-top:20px;width:60%;' class='statlevelInput ${lefthand=="true"?"lefthand-statlevelInput":"righthand-statlevelInput"}'></input>
        <div class='form-group stat-input ${lefthand=="true"?"lefthand-stat-input":"righthand-stat-input"}' style='display:inline-block;vertical-align:middle;'><input class='form-control' id='elite${i}LevelDisplay' onchange='changeEliteLevel(this,${i},${keyframes[1].level})' style='line-height:1.1' type='number' value='1' min='1' max='${keyframes[1].level}'></div>
        </div>
        `)
        
        var statsTable = $(`
        <div id='elite${i}Stats' class='${lefthand=="true"?"left-hand":"right-hand"} statlevelcontainer'>
            <table id='elite${i}StatsTable'>
                <tr><td>

                    <div class='stats'><div class='stats-l'>Maximum HP</div><div class='stats-r' id='elite${i}maxHp'></div></div>
                    <div class='stats'><div class='stats-l'>Redeploy Time</div><div class='stats-r' id='elite${i}respawnTime'></div></div>
                    
                    <div class='stats'><div class='stats-l'>Attack Power</div><div class='stats-r' id='elite${i}atk'></div></div>
                    <div class='stats'><div class='stats-l'>Cost</div><div class='stats-r' id='elite${i}cost'></div></div>
                    
                    <div class='stats'><div class='stats-l'>Defense</div><div class='stats-r' id='elite${i}def'></div></div>
                    <div class='stats'><div class='stats-l'>Block</div><div class='stats-r' id='elite${i}blockCnt'></div></div>

                    <div class='stats'><div class='stats-l'>Magic Resistance</div><div class='stats-r' id='elite${i}magicResistance'></div></div>
                    <div class='stats'><div class='stats-l'>Attack Time</div><div class='stats-r' id='elite${i}baseAttackTime'></div></div>
                </tr><td>
                </table>
                ${rangeMaker(opdataFull.phases[i].rangeId)}
                <div style="margin:12px">
                ${materialHtml}
                </div>
                </div>
        `);
        
        statsCollapsible.append(statsLevelAll);
        statsCollapsible.append(statsTable);

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
    function LinkCheck(url)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        return http.status!=404;
    }
    // function AudioText(opdataFull,lang="en"){
    //     var curraudiolist = []
    //     var puretextlist =[]
    //     Object.keys(db.charword).forEach(element => {
    //         if(db.charword[element]){
    //             var curraudio = db.charword[element]
                
    //             if(curraudio.charId&&curraudio.charId == opdataFull.id){
    //                 curraudiolist.push(curraudio)
    //                 puretextlist.push(`${curraudio.charId},${opdataFull.appellation},${curraudio.voiceTitle},${db.storytextTL[curraudio.voiceTitle]?db.storytextTL[curraudio.voiceTitle]:""},"${curraudio.voiceText}"`)
    //             }
    //         }
    //     });
    //     // console.log(curraudiolist)
    //     console.log(puretextlist.join("\n"))
    // }translator
    function GetAudio (opdataFull,lang="en"){
        // console.log(opdataFull)
        
        var curraudiolist = []
        var puretextlist =[]
        var isEN = false
        var currTL = db.voicelineTL[opdataFull.id]
        console.log(currTL)
        Object.keys(db.charword).forEach(element => {
            var curraudio= db.charword[element]
            // if(db.charwordEN[element]){
            //     var curraudio = db.charwordEN[element]
            //     console.log("waaaaaaaaaaaaaaaaaaaaaa")
            //     currTL = undefined
            //     isEN = true
            // }
            // else if(db.charword[element]){
            //     var curraudio = db.charword[element]
                
            // }
            if(curraudio){
                
                if(curraudio.charId&&curraudio.charId == opdataFull.id){
                    if(db.charwordEN[element]){
                        curraudio = db.charwordEN[element]
                        currTL = undefined
                        isEN = true
                    }
                    curraudiolist.push(curraudio)
                    // console.log(curraudio)
                    puretextlist.push(`${curraudio.charId},${opdataFull.appellation},${curraudio.voiceTitle},${db.storytextTL[curraudio.voiceTitle]?db.storytextTL[curraudio.voiceTitle]:""},"${curraudio.voiceText}"`)
                }
            }
        });
        // console.log(curraudiolist)
        // console.log(puretextlist.join("\n"))
        $('#opaudiocontent').empty()
        $('#opaudiotranslator').empty()
        $('#opaudioproofreader').empty()
        curraudiolist.forEach(element => {
            var curraudio  =`<audio preload="metadata" controls style="margin-top:5px"> <source src="./etc/voice/${element.voiceAsset}.mp3" type="audio/mp3">Your browser does not support the audio tag.</audio> `
            // if(LinkCheck(`./etc/voice/${element.voiceAsset}.mp3`)){
            //     curraudio= '<audio controls> <source src="./etc/voice/${element.voiceAsset}.mp3" type="audio/mpeg">Your browser does not support the audio tag.</audio> '
            // }
            var voiceTL = element.voiceText
            if(currTL)voiceTL= currTL.voiceline[element.voiceTitle][lang]?currTL.voiceline[element.voiceTitle][lang]: element.voiceText
            // console.log(element.voiceTitle)
            // console.log(currTL)
            // console.log(currTL.voiceline[element.voiceTitle])
            // console.log(voiceTL)
            var currhtml = $(`
            <table class="story-table">
            <th>${db.storytextTL[element.voiceTitle]?db.storytextTL[element.voiceTitle]:element.voiceTitle}</th>
            <tr><td style="text-align:center;background:#1a1a1a">${curraudio} <a href="./etc/voice/${element.voiceAsset}.mp3"  target="_blank">
            <i class='fa fa-download' style='font-size:30px;vertical-align:top;padding-top:17px'></i></a>
            <div id="audio-displaynum" style="position: absolute;font-weight: 700;font-size:10px;margin-top:-50px;color:#999;background:#222;padding:0px;padding-left:2px;padding-right:2px;right:18px">${element.voiceAsset.split("_").slice(-1)[0] }</div>
            </td></tr>
            <tr><td style="height:10px"></td></tr>
            <tr><td>${voiceTL}</td></tr>
            <tr><td style="height:10px"></td></tr>
            </table>
            
            `)
            $('#opaudiocontent').append($(currhtml))
        });
        
        if(currTL){
            if(currTL.translator){
                $('#opaudiotranslator').html(`<div class="btn-infoleft">Voiceline Translation</div><div class="btn-inforight">${currTL.translator}</div>`)
            }else $('#opaudiotranslator').html()
            if(currTL.proofreader){
                $('#opaudioproofreader').html(`<div class="btn-infoleft">Voiceline Proofreader</div><div class="btn-inforight">${currTL.proofreader}</div>`)
            }else $('#opaudioproofreader').html()
        }
        if(isEN){
            $('#opaudiotranslator').html(`<div class="btn-infoleft">Voiceline Translation</div><div class="btn-inforight">Official EN Arknight</div>`)
        }
    }
    function GetStory (opdataFull){
        // console.log(opdataFull)
        let currStory = db.handbookInfo.handbookDict[opdataFull.id]
        var isEN 
        if(db.handbookInfoEN.handbookDict[opdataFull.id]){
            currStory = db.handbookInfoEN.handbookDict[opdataFull.id]
            isEN = true
        }
        // console.log(currStory)
        // console.log(currStory.drawName)
        // console.log(db.vaTL[currStory.infoName]?db.vaTL[currStory.infoName]:currStory.infoName)
        let illustrator = currStory.drawName
        let voiceActor = db.vaTL[currStory.infoName]?db.vaTL[currStory.infoName]:currStory.infoName
        $('#info-illustrator').html(`<div class="btn-infoleft ak-shadow"><i class="fas fa-pencil-alt" title="Illustrator"></i></div><div class="btn-inforight"><a href="https://www.google.com/search?q=illustrator+${illustrator}"  target="_blank">${illustrator}</a></div>`)
        $('#info-voiceactor').html(`<div class="btn-infoleft ak-shadow"><i class="fas fa-microphone-alt" title="Voice Actor"></i></div><div class="btn-inforight"><a href="https://www.google.com/search?q=Voice+Actor+${voiceActor}"  target="_blank">${voiceActor}</a></div>`)
        let puretext = []
        let textTL = []
        let islong =false
        puretext.push(opdataFull.appellation)
        puretext.push("")

        //check potential and recruit
        // opdataFull.text

        var recruitcheck = db.charsEN[opdataFull.id]
        if(!recruitcheck) recruitcheck = opdataFull
        textTL.push(`<div class="col-12 ${(islong?"":"col-sm-6")} top-buffer">
                        <table class="story-table"><th colspan=2>Recruitment Contract</th>
                        <tr>
                            <td>${recruitcheck.itemDesc}</td>
                        </tr>
                        <tr>
                            <td>${recruitcheck.itemUsage}</td>
                        </tr></table>
                        </div>`)
        //check potential token
        var tokencheck = db.item_tableEN.items[opdataFull.potentialItemId]
        if(!tokencheck) tokencheck = db.item_table.items[opdataFull.potentialItemId]
        console.log(tokencheck)

        textTL.push(`<div class="col-12 ${(islong?"":"col-sm-6")} top-buffer">
                        <table class="story-table"><th colspan=2>Token</th>
                        <tr>
                            <td>${tokencheck.description}</td>
                        </tr>
                        <tr>
                            <td>${tokencheck.usage}</td>
                        </tr>
                        </table>
                        </div>`)
        //
        if(currStory.storyTextAudio){
            currStory.storyTextAudio.forEach(storySection => {
                puretext.push(`---------${storySection.storyTitle}-----------`)
                puretext.push(storySection.stories[0].storyText)
                puretext.push("")
                switch(storySection.storyTitle){
                    case "Basic Info":
                    case "基础档案":
                        var basicInfo = storySection.stories[0].storyText.split("\n")
                        var basicInfoTL = []
                        var webTL = []
                        var titlebefore = ""
                        // if(basicInfo.length>20)islong = true;
                        // console.log(basicInfo.length)
                        basicInfo.forEach((info,n) => {
                            var check = isEN? /(\[)(.*)(\])(.*)/ : /(【)(.*)(】)(.*)/
                            var infoTitle = check.exec(info)
                            if(infoTitle){
                                var title = db.storytextTL[infoTitle[2]]?db.storytextTL[infoTitle[2]]:infoTitle[2]
                                
                                var content = infoTitle[4]
                                // console.log(infoTitle)
                                switch (infoTitle[2]) {
                                    case "代号": content = opdataFull.appellation;break;
                                    case "性别":
                                    console.log(content)
                                    content= db.storytextTL[content.trim()]
                                    if (!content) content = infoTitle[4].trim()
                                    $("#op-gender").html(titledMaker(content,`Gender`))
                                    ;break;
                                    case "表演经验":
                                    case "出厂时间":
                                    case "战斗经验": content= db.storytextTL[content.trim()]
                                    // console.log(infoTitle)
                                    // console.log("WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")
                                    // console.log(content)
                                    if (!content){
                                        var splitnum = infoTitle[4].trim().split("")
                                        var num = 0
                                        var count = 0
                                        var end = ""
                                        // console.log(splitnum)
                                        splitnum.forEach(eachnum => {
                                            // console.log(eachnum)
                                            // console.log(typeof parseInt(eachnum))
                                            // console.log(parseInt(eachnum))
                                            if(typeof db.storytextTL[eachnum] == "number" ){
                                                console.log(db.storytextTL[eachnum])
                                                if(db.storytextTL[eachnum]==10 && count==1){
                                                    num = num*10
                                                }else{
                                                    num += db.storytextTL[eachnum]
                                                }
                                            }
                                            else if(typeof parseInt(eachnum)  == "number" && !isNaN(parseInt(eachnum))){
                                                num += parseInt(eachnum)
                                            }
                                            else{
                                                end = db.storytextTL[eachnum]
                                            }
                                            // console.log(num)
                                            count++
                                        });
                                        
                                        if(num% 1 != 0){
                                            if(num<1){
                                                num = "Half a"
                                            }else{
                                                num = Math.floor(num) +" and a half"
                                            }
                                        }
                                        content = `${num} ${end}`
                                    }
                                    ;break;

                                    case "出厂日":
                                    case "生日":content = db.storytextTL[content.trim()]?db.storytextTL[content.trim()]:BirthdayText(content);break;
                                    case "矿石病感染情况": 
                                    
                                    if(db.charastoryTL[opdataFull.id]&&db.charastoryTL[opdataFull.id]["originiumInfection"]&&content){
                                        
                                        content = db.charastoryTL[opdataFull.id]["originiumInfection"]
                                    }else if(content){
                                        var datasplit = content.split("，")
                                        // console.log(datasplit)
                                        var arraycontent = []
                                        datasplit.forEach(originiumdesc => {
                                            arraycontent.push(db.storytextTL[originiumdesc]?db.storytextTL[originiumdesc]:originiumdesc)
                                        });
                                        content = arraycontent.join(", ")
                                    }else {
                                        
                                        content = db.storytextTL[content.trim()]?db.storytextTL[content.trim()]:content.replace("约","Approximately ");
                                    }
                                    
                                    ;break;
                                    default: 
                                    // console.log("WEEI" +titlebefore)
                                    
                                        content = db.storytextTL[content.trim()]?db.storytextTL[content.trim()]:content.replace("约","Approximately ");
                                }
                                // console.log(title)
                                titlebefore = title
                                basicInfoTL.push(`[${title}] ${content}`)
                                if(content==""){
                                webTL.push(`<tr><td colspan="2" style="border-top: 1px solid #555;">${title}</td></tr>`)
                                }else
                                webTL.push(`<tr><td>${title}</td><td>${content}</td></tr>`)
                            }else{
                                // console.log(info.split("，"))
                                if(titlebefore =="Originium Infection"&& db.charastoryTL[opdataFull.id] && db.charastoryTL[opdataFull.id]["originiumInfection"]){
                                    content = db.charastoryTL[opdataFull.id]["originiumInfection"]
                                    titlebefore=""
                                    webTL.push(`<tr><td colspan=2>${content}</td> </tr>`)
                                }else {
                                    var datasplit = info.split("，")
                                    var content = []
                                    datasplit.forEach(originiumdesc => {
                                        content.push(db.storytextTL[originiumdesc]?db.storytextTL[originiumdesc]:originiumdesc)
                                    });
                                    
                                    webTL.push(`<tr><td colspan=2>${content.join(", ")}</td> </tr>`)
                                }
                                // else{
                                //     basicInfoTL.push(info)
                                //     webTL.push(`<tr><td colspan=2>${info}</td> </tr>`)
                                // }
                            }
                        });
                        textTL.push(`<div class="col-12 ${(islong?"":"col-sm-6")} top-buffer">
                        <table class="story-table"><th colspan=2>Basic File</th>${webTL.join("")}</table>
                        </div>`)
                        // textTL.push(basicInfoTL.join("</br>"))
                        // console.log(basicInfoTL.join("\n"))
                    ;break;
                case "Physical Exam" :
                case "Performance Review":
                case "综合性能检测结果" :
                case "综合体检测试" :
                    var basicInfo = storySection.stories[0].storyText.split("\n")
                    var basicInfoTL = []
                    var webTL = []
                    basicInfo.forEach(info => {
                        var check = isEN?/(\[)(.*)(\])(.*)/:/(【)(.*)(】)(.*)/
                        var infoTitle = check.exec(info)
                        if(infoTitle){
                            var title = db.storytextTL[infoTitle[2]]?db.storytextTL[infoTitle[2]]:infoTitle[2]
                            var content = infoTitle[4]
                            switch (infoTitle[2]) {
                                case "代号": content = opdataFull.appellation;break;
                                default: content = db.storytextTL[content.trim()]?db.storytextTL[content.trim()]:content;
                            }
                            basicInfoTL.push(`[${title}] ${content}`)
                            webTL.push(`<tr><td>${title}</td> <td>${content}</td></tr>`)
                        }
                    })
                    // textTL.push(`<h2>Comprehensive test</h2>${basicInfoTL.join("</br>")}`)
                    textTL.push(`<div class="col-12 ${(islong?"":"col-sm-6")} top-buffer">
                    <table class="story-table">
                    <th colspan=2>${db.storytextTL[storySection.storyTitle]?db.storytextTL[storySection.storyTitle]:storySection.storyTitle}</th>
                    ${webTL.join("")}</table>
                    </div>`)
                    // console.log(basicInfoTL.join("\n"))
                    ;break;
                default:
                    var currstory 
                    // console.log(storySection.storyTitle)
                    // console.log(db.charastoryTL[opdataFull.id])
                    if(db.charastoryTL[opdataFull.id]&&db.charastoryTL[opdataFull.id][storySection.storyTitle]) 
                        currStory = db.charastoryTL[opdataFull.id][storySection.storyTitle].split("\n").join("</br>")
                    else 
                        currStory = (storySection.stories[0].storyText.replace(/■/g,"■ ")).split("\n").join("</br>")
                    // console.log(currstory)
                    textTL.push(`
                    <div class="col-12 top-buffer">
                    <table class="story-table">
                    <th colspan=2>${db.storytextTL[storySection.storyTitle]?db.storytextTL[storySection.storyTitle]:storySection.storyTitle}</th>
                    <tr><td>${currStory}</td></tr></table>
                    </div>`)
                    // textTL.push(`<h2>${storySection.storyTitle}</h2>`) 
                    // textTL.push(`</br>`) 
                    // textTL.push()
                    // console.log(`---------${storySection.storyTitle}-----------`)
                    // console.log(storySection.stories[0].storyText)
                    
                }
            });
        }
        if(db.charastoryTL[opdataFull.id]&&db.charastoryTL[opdataFull.id]["credit"]) $("#opstorycredits").html(`<div class="btn-infoleft">Trust Translation</div><div class="btn-inforight">${db.charastoryTL[opdataFull.id]["credit"]}</div>`)
        else $("#opstorycredits").html(``)

        if(isEN){
            $('#opstorycredits').html(`<div class="btn-infoleft">Trust Translation</div><div class="btn-inforight">Official EN Arknight</div>`)
        }
        $("#opstorycontent").html(`<div class="row">${textTL.join("")}</div>`)
        // console.log(textTL)
        //console.log(puretext.join("\n"))
    }

    function UpdateElite(elite){
        // console.log("waaaaaaaaaaaaaaaaaaa")
        // opdataFull.skills.forEach(i => {
            // console.log(elite)
        $.each(opdataFull.skills,function(i,v){
            // console.log(i)
            var skillId = opdataFull.skills[i].skillId;
            var skillData = db.skills[skillId];
            $.each(skillData.levels,function(i2,v2){
                skillData.levels[i2].blackboard.forEach(skillinfo => {
                    if(skillinfo.key=="ability_range_forward_extend"){
                        grid = $(`#skill${i}lv${i2}grid`).html(rangeMaker(opdataFull.phases[elite].rangeId,true,skillinfo.value))
                    }
                });
            })
        });
    }

    function BirthdayText(date) {
        console.log(date)
        var check = date.split("月")
        if(check[1]){
            var check2 = check[1].split("日")
            var check = `${check[0]}/${check2[0]}`
            var date = check.split("/")
            // console.log(date)
            if (date.length >=2)
            {
                // console.log(date[1])
                const currmonth = date[0]
                const currday = date[1]
                const monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
                ];
                // console.log(`${monthNames[currmonth-1]} ${currday}`)
                // console.log(monthNames[currmonth-1])
                if (monthNames[currmonth-1] == undefined){
                    return date
                }
                return  monthNames[currmonth-1] + " " + currday
            }
        }else return date

    }

    function GetPotential(opdataFull){
        var potentials = opdataFull.potentialRanks
        var potentialsTL = []
        // console.log(potentials)
        var potRegex = /(.*?)([-]|[+])(\d*)(.*)|(.*)/
        potentials.forEach(element => {
            let regexDesc = potRegex.exec(element.description)
            // console.log(regexDesc)
            let currDesc = (regexDesc[1]?regexDesc[1]:regexDesc[5])
            let tlDesc = query(db.potentialTL,"skill_cn",currDesc).skill_en
            tlDesc = tlDesc?tlDesc:currDesc
            if(regexDesc[1]){
                tlDesc += " "+regexDesc[2] + regexDesc[3]
            }
            // console.log(tlDesc)
            potentialsTL.push(tlDesc)
        });
        return potentialsTL
    }

    function GetRiic(opdata2){
        var charaRiic = db.build.chars[Object.keys(opdata2)[0]]
        var riicList = []
        var everybuff = []

        charaRiic.buffChar.forEach(eachbuffchar => {
            everybuff.push(eachbuffchar.buffData)
            eachbuffchar.buffData.forEach(eachbuffdata => {
                var checkphase = riicList.find(search=>search.phase==eachbuffdata.cond.phase&&search.level == eachbuffdata.cond.level)
                if(!checkphase){
                    riicList.push({phase:eachbuffdata.cond.phase,level:eachbuffdata.cond.level,list:[]})
                }
            });
        });

        
        // console.log(everybuff)
        riicList.forEach(eachcat =>{
            // checkphase.list.push(eachbuffdata.buffId)
            
            everybuff.forEach(eachbuff => {
                var sortedbuff = eachbuff.sort((a,b)=>{
                    if(a.cond.phase<b.cond.phase) return 1
                    if(a.cond.phase>b.cond.phase) return -1
                    if(a.cond.level<b.cond.level) return 1
                    if(a.cond.level>b.cond.level) return -1
                    return 0
                })
                for(i=0;i<sortedbuff.length;i++){
                    if(eachcat.phase>=sortedbuff[i].cond.phase&&eachcat.level >= sortedbuff[i].cond.level){
                        eachcat.list.push(sortedbuff[i].buffId)
                        break;
                    }
                }
                // if(eachcat.phase>=eachbuff.cond.phase&&eachcat.level >= eachbuff.cond.level){
                //     eachcat.list.push(eachbuff.buffId)
                // }
                // console.log(sortedbuff)
            });
        })

        var htmlcomb = []
        
        riicList.forEach(eachcat => {
            var eachtab = []
            eachcat.list.forEach(eachbuff => {
                var currbuff = db.build.buffs[eachbuff]
                var tlbuff = db.riic[eachbuff]

                var currname = tlbuff?tlbuff.name:currbuff.buffName
                var currdesc = tlbuff?tlbuff.desc:currbuff.description
                eachtab.push(`
                    <div style="display:inline-block;background:#444;padding:2px;padding-top:2px;background:#444;border-radius:2px;">
                        <img src="./img/ui/infrastructure/skill/${currbuff.skillIcon}.png" style="" onclick="ShowRiicDetail('${currname.replace(/\'/g,"\\\'").replace(/\"/g,"\\\'")}','${currdesc.replace(/\'/g,"\\\'").replace(/\"/g,"\\\'")}','./img/ui/infrastructure/skill/${currbuff.skillIcon}.png')" title="${currname.replace(/\"/g,"\'")}\n\n${currdesc.replace(/\"/g,"\'")}">
                    </div>`)
                    // console.log(`onclick="ShowRiicDetail('${currname}','${currdesc}','./img/ui/infrastructure/skill/${currbuff.skillIcon}.png')"`)
            });
            
            var imagereq = []
                if(eachcat.level >0)
                imagereq.push(`Lv.${eachcat.level}`)
                if(eachcat.phase>0)
                imagereq.push(`<img src="./img/ui/elite/${eachcat.phase}.png" style="width:20px;margin-top:-5px" title="Elite ${eachcat.phase}">`)
            var currinfo = `<div style="color:#999;background:#222;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px">${imagereq.join("")}</div>`
            htmlcomb.push(`
            <div style="display:inline-block;background:#444;margin:4px;padding:2px;padding-top:2px;background:#444;border-radius:2px;text-align:center">${currinfo}${eachtab.join("")}</div>
            `)

            // htmlcomb.push()
        });
        var combinehtml =`
        <div style="color:#fff;text-align:center;background:#333;padding-bottom:0px">RIIC Skills</div>
            <div class="ak-shadow" style="margin-bottom:8px;padding-top:10px;padding:2px;background:#666;text-align:center">
                ${htmlcomb.join("")}
            <div id="op-riicdetail" class="ak-shadow" style="background:#444;margin:4px;padding:2px;padding-top:2px;background:#444;border-radius:2px;text-align:left">
                <div style="display:inline-block;width:40px;vertical-align:top;margin:3px;margin-right:0px">
                    <img id="op-riicdetail-img" src="" style="" title="$"></img>
                </div>
                <div style="display:inline-block;width:260px">
                    <div id="op-riicdetail-name" style="color:#222;font-size:13px;background:#999;display:inline-block;padding:2px;border-radius:2px"></div>
                    <div id="op-riicdetail-desc" style="font-size:11px;"></div>
                </div>
            </div>
            </div>
            
        </div>
        `

        
        // console.log(htmlcomb.join(""))
        return combinehtml
        
    }

    function ShowRiicDetail(title,desc,img){
        if($("#op-riicdetail").is(":visible")&&$("#op-riicdetail-name").html()==title){
            $("#op-riicdetail").slideUp(200)
        }else{
            $("#op-riicdetail").slideDown(200)
            $("#op-riicdetail-img").attr("src",img)
            $("#op-riicdetail-name").text(title)
            $("#op-riicdetail-desc").text(desc)
        }
    }
    function GetTalent(id,opdataFull){
        var combTalents = []
        // console.log(opdataFull.talents)
        for(i=0;i<opdataFull.talents.length;i++){
            var currTalent = opdataFull.talents[i]
            // if(!db.talentsTL[id])break;
            var currTalentTL = db.talentsTL[id]?db.talentsTL[id][i]:undefined
            var talentGroup = []
            for(j=0;j<currTalent.candidates.length;j++){
                var currCandidate = currTalent.candidates[j] 
                var currCandidateTL = currTalentTL?currTalentTL[j]:undefined
                talentGroup.push({talent:currCandidate,talentTL:currCandidateTL})
                // console.log(currCandidate)
            }
            combTalents.push(talentGroup)
        }
        return TalentParse(combTalents)
    }

    function TalentParse(combTalents){
        // console.log(combTalents)
        var talent = []
        combTalents.forEach(combcandidate => {
            let talentlist = []
            combcandidate.forEach(eachtalent => {
                var imagereq = []
                if(eachtalent.talent.unlockCondition.level >0)
                imagereq.push(`Lv.${eachtalent.talent.unlockCondition.level}`)
                if(eachtalent.talent.unlockCondition.phase >0)
                imagereq.push(`<img src="./img/ui/elite/${eachtalent.talent.unlockCondition.phase}.png" style="width:20px;margin-top:-5px" title="Elite ${eachtalent.talent.unlockCondition.phase}">`)
                if(eachtalent.talent.requiredPotentialRank >0)
                imagereq.push(`<img src="./img/ui/potential/${eachtalent.talent.requiredPotentialRank+1}.png" style="width:20px" title="Potential ${eachtalent.talent.requiredPotentialRank+1}">`)

                var currTalentName = eachtalent.talentTL?eachtalent.talentTL.name:eachtalent.talent.name
                var currTalentDesc = eachtalent.talentTL?eachtalent.talentTL.desc:eachtalent.talent.description
                // console.log(eachtalent.talent.name)
                var isTalentRange =  eachtalent.talent.name=="新人教官"?undefined:eachtalent.talent.rangeId
                var info = `<div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px">${imagereq.join("")}</div>`
                talentlist.push(`
                <div style="background:#444;margin:4px;padding:2px;padding-top:2px;background:#444;border-radius:2px;">
                <div style="vertical-align:top;${isTalentRange?`width:71%;display:inline-block;padding-right:0px;margin-right:-6px;height:100%`:""}">
                    <div style="color:#222;font-size:13px;background:#999;display:inline-block;padding:2px;border-radius:2px">${currTalentName} ${info}</div>
                    <div style="font-size:11px;">${currTalentDesc}</div>
                </div>
                    ${isTalentRange?`<div style="display:inline-block;width:28%;padding:0px;margin:auto;padding-top:4px">${rangeMaker(eachtalent.talent.rangeId,false)}</div>`:""}
                </div>
                `)
            });
            talent.push(`
                <div class="ak-shadow" style="margin-bottom:8px;padding-top:10px;padding:2px;background:#666">
                    ${talentlist.join("")}
                </div>`)
        });
        return `
        
            <div style="padding-top:10px">
            <div style="color:#fff;text-align:center;background:#333;padding-bottom:0px">Talent</div> 
                ${talent.join("")}
            </div>`
    }
    // ${titledMaker(,eachtalent.talentTL.name,"","","font-size:10px;background:#444;color:#ddd")}
    function GetSkillCost(i2,i, opdataFull){
        let reqmats=[]
        if(i2!=0&&i2<7){
            // console.log(opdataFull.allSkillLvlup[i2])
            reqmats = opdataFull.allSkillLvlup[i2-1].lvlUpCost
        
        }else if(i2>=7){
            // console.log(opdataFull.skills[i])
            reqmats = opdataFull.skills[i].levelUpCostCond[i2-7].levelUpCost
        }
        return reqmats
    }
    function GetEliteCost(i,opdataFull){
        if(i>0){
            // console.log(opdataFull)
            let reqmats = [];
            // console.log(db.dataconst["evolveGoldCost"][opdataFull.rarity])
            // console.log(i)
            if(reqmats){
                if(opdataFull.phases[i]){
                    // console.log(curChara.rarity+1)
                    // console.log(db.dataconst["evolveGoldCost"][curChara.rarity][num-1])
                    reqmats=([{"count":(db.dataconst["evolveGoldCost"][opdataFull.rarity][i-1]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                , "id" :4001
                                ,"type":"GOLD" }])
                }
            }
            reqmats = opdataFull.phases[i] ? reqmats.concat(opdataFull.phases[i].evolveCost) : undefined;
            // console.log(reqmats)
            return reqmats
        }else{
            return undefined
        }
    }
    function CreateMaterial(id,count){
        var itemdata = db.item_table.items[id];
        var itemdataTL = query(db.itemstl,"name_cn",itemdata.name);
        var material = 
        (`<div class="akmat-container" style="position:relative">
            <div class="item-name" title="${itemdata.name}">${(itemdataTL.name_en?itemdataTL.name_en:itemdata.name)}</div>
            <div class="item-image">
                <img id="item-image" src="img/items/${itemdata.iconId}.png">
            </div>
            <img class="item-rarity" src="img/material/bg/item-${itemdata.rarity+1}.png">
            <div class="item-amount">${count}x</div>
        </div>`)
        return material
    }
    function getSpeciality(description,opdataFull){

        //gonna need to split on "," and "\n" and repeat it
        let descriptions = description.split(/[，(\\n)]/)
        let splitdesc = []
        // console.log("=====================")
        // console.log(descriptions)
        descriptions.forEach(element => {
            if(element){
                let muhRegex = /<@ba\.kw>(.*?)<\/>/g
                let currSpeciality = muhRegex.exec(element)
                // console.log(currSpeciality)
                let filterDesc
                if(currSpeciality){
                    splitdesc.push([element.replace(currSpeciality[0],""),currSpeciality[1]])
                }else{
                    splitdesc.push([element])
                }
            }
        });
        // console.log(splitdesc)
        // console.log("===========================")
        
        return SpecialityHtml(splitdesc,opdataFull)
    }
    function GetTrust(opdataFull){
        // console.log()
        let mintrust = opdataFull.favorKeyFrames[0].data
        let maxtrust = opdataFull.favorKeyFrames[1].data
        let differences = {}
        // console.log(mintrust)
        Object.keys(mintrust).forEach(key => {
            // console.log(key)
            if(mintrust[key]!=maxtrust[key])
            differences[key]=maxtrust[key]-mintrust[key]
        });
        // console.log(differences)

        return TrustParse(differences)
    }
    function TrustParse(differences) {
        let readable = []
        Object.keys(differences).forEach(key => {
            let currInfo
            switch (key){
                case "maxHp": currInfo="Maximum HP" ;break;
                case "atk": currInfo="Attack" ;break;
                case "def": currInfo="Defense" ;break;
                case "magicResistance": currInfo="Magic Resist" ;break;
                case "cost": currInfo="Cost" ;break;
                case "blockCnt": currInfo="Block Count" ;break;
                case "moveSpeed": currInfo="Move Speed" ;break;
                case "attackSpeed": currInfo="Attack Speed" ;break;
                case "baseAttackTime": currInfo="Attack time" ;break;
                case "respawnTime": currInfo="Redeploy time" ;break;
                case "hpRecoveryPerSec": currInfo="HP recovery" ;break;
                case "spRecoveryPerSec": currInfo="SP recovery" ;break;
                default: currInfo = key ; break;
            }

            readable.push(`${currInfo} +${differences[key]}`)
        });
        return titledMaker(readable.join("</br>"),"Trust extra status","","","color:#ddd;min-width:120px")
    }
    function SpecialityHtml(splitdesc,opdataFull){
        let splitdescTL = []
        let color = ""
        let trait = opdataFull.trait
        // console.log(trait)
        let isReplaced = false
        splitdesc.forEach(element => {
            if(element.length>1){
                let typetl = db.attacktype.find(search=>search.type_cn==element.join(""))
                // if(!typetl) typetl = db.attacktype.find(search=>search.type_cn==element[1])
                if(typetl&&!color) color = typetl.type_color?typetl.type_color:undefined

                // console.log(element)
                // console.log(trait)
                let muhRegex = /(.*){(.*?)}(.*)/g
                let currTLconv = muhRegex.exec(typetl?typetl.type_en:element.join(""))
                // console.log(currTLconv)
                if(currTLconv){
                    console.log(currTLconv)
                    var textreplace = 'Value'
                    if(trait && trait.candidates.length>1){
                        textreplace =  `<div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px">(value)</div>`
                    }else if (trait && trait.candidates.length==1) {
                        textreplace = trait.candidates[0].blackboard[0].value
                        if(currTLconv[2].includes("%")){
                            textreplace= textreplace*100 +("%")
                        }
                        isReplaced = true
                    }
                    // console.log(textreplace)
                }
                let currTLconvfinal = currTLconv?currTLconv[1] + textreplace + currTLconv[3]:typetl?typetl.type_en:element.join("")
                // console.log(currTLconvfinal)
                splitdescTL.push(currTLconvfinal)
            }else{
                var typetl = db.attacktype.find(search=>{
                    if(search.type_detail=="common")
                    return search.type_cn==element[0]
                })
                if(!typetl){
                    typetl = db.attacktype.find(search=>search.type_cn==element.join(""))
                }
                // console.log(element.join(""))

                // console.log(typetl)
                
                if(typetl&&!color) color = typetl.type_color?typetl.type_color:undefined
                splitdescTL.push(typetl?typetl.type_en:element[0])
            }
        });
        if(trait&&!(isReplaced)){
            trait.candidates.forEach(element => {
                var imagereq = []
                    if(element.unlockCondition.level >0)
                    imagereq.push(`Lv.${element.unlockCondition.level}`)
                    if(element.unlockCondition.phase >0)
                    imagereq.push(`<img src="./img/ui/elite/${element.unlockCondition.phase}.png" style="width:20px;margin-top:-5px" title="Elite ${element.unlockCondition.phase}">`)
    
                // console.log(s)
                var each = []
                element.blackboard.forEach(eachbb => {
                    each.push(`${eachbb.key} : ${eachbb.value}`)
                });
                var info = `<div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px;margin-right:3px;margin-bottom:2px;margin-top:2px">${each.join("</br>")}</div>
                <div style="color:#999;background:#222;display:inline-block;padding:1px;padding-left:3px;padding-right:3px;border-radius:2px">${imagereq.join("")}</div>`
                splitdescTL.push(info)
            });
        }
        // console.log(splitdescTL)
        // console.log(color)

        return titledMaker(splitdescTL.join("</br>"),"Traits",`ak-trait-${color}`,"","white-space:initial;")
        // splitdescTL
    }

    function titledMaker (content,title,extraClass="",extraId="",extraStyle=""){
        let titledbutton = `
        <div style="padding-top:5px;display:inline-block">
        <div class=\"ak-btn-non btn-sm ak-shadow-small ak-btn ak-btn-bg btn-char  ${extraClass}\" style="text-align:left;min-width:80px;${extraStyle}" data-toggle=\"tooltip\" data-placement=\"top\" id="${extraId}">
        ${(title==""?"":`<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">${title}</a>`)}${content}</div>
        </div>`

        return titledbutton
    }
    function titledMaker2 (content,title,extraClass="",extraId="",extraStyle=""){
        let titledbutton = `
        <div style="padding-top:0px;display:inline-block">
        <div class=\"${extraClass}\" style="color:#222;font-size:13px;background:#999;display:inline-block;padding:2px;border-radius:2px;${extraStyle}" data-toggle=\"tooltip\" data-placement=\"top\" id="${extraId}">
         ${(title==""?"":`<a class="ak-subtitle" style="color:#999;background:#222;display:inline-block;border-radius:0px;padding:0px 3px;margin-left:-4px;margin-top:-12px"> ${title} </a>`)} ${content}</div>
        </div>`

        return titledbutton
    }
    function rangeMaker(rangeId,withText=true,extend=0){
        var rangeData ={}
        var rangeDataOrigin = Object.assign({},db.range[rangeId])

        // extend =0
        if(rangeDataOrigin){
            let minRow = 0
            let minCol = 0
            let maxRow = 0
            let maxCol = 0
            let table = []
            let grids = []
            // console.log(rangeDataOrigin.grids)
            if(rangeDataOrigin){
                if(extend>0){
                    
                }
                rangeData = Object.assign({},rangeDataOrigin)
                rangeData.grids = []
                rangeDataOrigin.grids.forEach(element => {
                    maxRow = Math.max(maxRow,element.row)
                    maxCol = Math.max(maxCol,element.col)
                    minRow = Math.min(minRow,element.row)
                    minCol = Math.min(minCol,element.col)

                    // console.log(element)
                    // if(extend>0&&element.col>0){
                        
                    //  }
                     if(element.col>0&&extend>0){
                        rangeData.grids.push({row:element.row,col:element.col+parseFloat(extend)})
                     }else{
                        rangeData.grids.push({row:element.row,col:element.col})
                     }
                    
                });
                if(extend>0){
                    maxCol +=extend
                }
                if(extend>0){
                   for(i=minRow;i<=maxRow;i++){
                        for(j=1;j<=extend;j++){
                            // console.log(`${i} : ${j}`)
                            rangeData.grids.push({row:i,col:j,special:true})
                            
                        }
                   }
                }
                extend = 0
            }
            // console.log(rangeData.grids)
            table.push(`<div class="rangeTableContainer"><table class='rangeTable' style="table-layout: fixed;border-spacing:0 15px;padding:4px; border-collapse:separate; border-spacing:2px;width:${(maxCol+minCol+1)*17}px;">`)
            
            for(r=0;r+minRow<maxRow+1;r++){
                table.push(`<tr style="height:17px">`)
                // if(extend>0&&r>1){
                //     extend--
                //     r=1
                // }
                // console.log(r+minRow)
                for(c=0;c+minCol<maxCol+1;c++){
                    table.push(`<td style=";width:17px`)
                    if(r+minRow==0&&c+minCol==0){
                        table.push(";background:#DDD")
                    }else{
                        rangeData.grids.forEach(element => {
                            if(element.row==r+minRow&&element.col==c+minCol){
                                if(element.special){
                                    table.push(";border: 2px solid #00FF6688;")
                                }else{
                                    table.push(";border: 2px solid #DDDDDD88;")
                                }
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

    function changeEliteLevel(el,elite_no,max){
        var value = $(el).val();
        $("#elite"+elite_no+"LevelDisplay").val(value);
        $("#elite"+elite_no+"LevelSlider").val(value);
        EliteStatsDisplay(Math.min(value,max),elite_no);
    }

    function EliteStatsDisplay(level,elite_no){
        $("#elite"+elite_no+"maxHp").html(statsInterpolation('maxHp',level,elite_no));
        $("#elite"+elite_no+"def").html(statsInterpolation('def',level,elite_no));
        $("#elite"+elite_no+"atk").html(statsInterpolation('atk',level,elite_no));
        $("#elite"+elite_no+"magicResistance").html(statsInterpolation('magicResistance',level,elite_no));
        $("#elite"+elite_no+"respawnTime").html(statsInterpolation('respawnTime',level,elite_no)+`<div style='display:inline;font-size:10px'> Sec</div>`);
        $("#elite"+elite_no+"cost").html(statsInterpolation('cost',level,elite_no));
        $("#elite"+elite_no+"blockCnt").html(statsInterpolation('blockCnt',level,elite_no));
        $("#elite"+elite_no+"baseAttackTime").html(statsInterpolation('baseAttackTime',level,elite_no,false)+`<div style='display:inline;font-size:10px'> Sec</div>`);
    }

    function statsInterpolation(key,level,elite_no,isround=true){
        var kf = [];
        $.each(opdataFull.phases[elite_no].attributesKeyFrames,function(j,v){
            kf[j] = v;
        });
        // console.log([kf[0].level,kf[1].level])
        // console.log([kf[0].data[key],kf[1].data[key]])
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

    function changeSkillLevel(el,skill_no){
        var value = $(el).val();
        $("#skill"+skill_no+"StatsCollapsible").children("table").removeClass("active");
        $("#skill"+skill_no+"level"+(value-1)+"stats").addClass("active");
        $("#skill"+skill_no+"LevelDisplay").html(SkillRankDisplay(value));
    }

    function SkillRankDisplay(skill_no){
        let img = "./img/ui/rank/"
        let html =""
        if(skill_no>0&&skill_no<7){
            img += skill_no+".png"
            html = `<img src="${img}" style="width:40px">`
        }else if(skill_no>=7){
            let imgM = img +"m-"+ (skill_no-7)+".png"
            img += "7.png"
             
            html = `<img src="${img}" style="width:40px"><div class="akrankmastery"><img src="${imgM}" style="width:40px"></div>`
        }
        return html
    }
      
    function getSkillDesc(skillId,level){
        var skill = db.skills[skillId].levels[level];
        var skillTL = db.skillsTL[skillId];
        var desc = skillTL?skillTL.desc[level]:skill.description;
        // if(db.skillsEN[skillId] && db.skillsEN[skillId].levels[level]) desc = db.skillsEN[skillId].levels[level].description
        //console.log(`Skill|${skillId}|${skill.name} `);
        //console.log(skill.blackboard)
        // console.log()
        
        // console.log(skillTL);
        if(!skillTL){
            let split = desc.split("<@ba.vup>")
            console.log(split)
            let skillall =""
            // console.log(split.length)
            for(i=0;i<split.length;i++){
                if(i==0){
                    skillall+= split[i]
                }
                else{
                    var currsplit = "<@ba.vup>"+split[i]
                    // console.log(currsplit)
                    let muhRegex = /<@ba\.vup>(.*?)<\/>/g
                    let desc2 = muhRegex.exec(currsplit)[1]
                    // let desc2 = desc.replace(/<@ba\.vup>/g,"<a>")
                    // console.log(i)
                    console.log(desc2)
                    // desc2 = desc2.replace(/({)(.*?)(\:.*?)(})/,"")
                    let muhRegex2 = /({)(.*?)(\:.*?)(})/
                    let desc3 = muhRegex2.exec(desc2)
                    if(!desc3){
                        let descextra = 
                        skillall += currsplit.replace(/<@ba\.vup>(.*?)<\/>/,desc2).replace(/\\n/g,"</br>")
                    }
                    
                    if(desc3){
                        desc3[2] = `{${desc3[2]}}`
                        desc3[3] = desc3[3].replace(":",":.")
                        let desc4 = []
                        
                        for(j=1;j<desc3.length;j++){
                            desc4.push(desc3[j])
                        }
                        // console.log(desc4)
                        skillall += currsplit.replace(/<@ba\.vup>(.*?)<\/>/,desc4.join("")).replace(/\\n/g,"</br>")
                        console.log(currsplit.replace(/<@ba\.vup>(.*?)<\/>/,desc4.join("")).replace(/\\n/g,"</br>"))
                    }
                }
                
            }
            // let muhRegex = /<@ba\.vup>(.*?)<\/>/g
            // let desc2 = muhRegex.exec(desc)[1]
            // // let desc2 = desc.replace(/<@ba\.vup>/g,"<a>")
            // // console.log(desc2)
            // // desc2 = desc2.replace(/({)(.*?)(\:.*?)(})/,"")
            // let muhRegex2 = /({)(.*?)(\:.*?)(})/
            // let desc3 = muhRegex2.exec(desc2)
            
            // if(desc3){
            //     desc3[2] = `{${desc3[2]}}`
            //     desc3[3] = desc3[3].replace(":",":.")
            //     let desc4 = []
            //     // console.log(desc3)
            //     for(i=1;i<desc3.length;i++){
            //         desc4.push(desc3[i])
            //     }
            //     // console.log(desc4)
            //     desc = desc.replace(/<@ba\.vup>(.*?)<\/>/,desc4.join("")).replace(/\\n/g,"</br>")
                
            // }
            desc = skillall
        }

        // if(skillTL){
        if(desc){
            var matches = desc.match(/(\{\{(.*?)\}:.0(.)\}|\{(.*?)\})/gm);
            // console.log(matches)
            $.each(matches,function(i,v){
                var submatches = v.match(/(?:(?!\{).(?!:))+/gm);
                
                if(!submatches[1]){
                    submatches = v.match(/(?:(?!\{).(?!$))+/gm);
                }
                // console.log(submatches)
                var value;
                for (var i = 0; i < skill.blackboard.length; i++) {
                    // console.log(skill.blackboard)
                    if(skill.blackboard[i].key == submatches[0]){
                        value = skill.blackboard[i].value;
                        if(skill.prefabId == "skchr_angel_3"&&skill.blackboard[i].key =='base_attack_time'){
                            value = skill.blackboard[i].value*2;
                            console.log("DOUBLE!!")
                        }
                        // console.log(value)
                    }
                }
                if(value){
                    if(typeof submatches[1] != "undefined"){
                        // console.log(submatches[1])
                        if(submatches[1].includes("%")){
                            value = Math.round((value * 100)) + "%";
                        }
                    }
                    desc = desc.replace(v,`<div class="stat-important">${value}</div>`);
                }
            });
        }
        // }else{

        // }
        // console.log(desc);
        return desc;
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

    function ChangeSkillAnim(skillnum,skillmax,token){
        // console.log(skillnum)
        // console.log(token)
        // console.log(skillmax)
        console.log(token)
        tokenname = token
        if(spinewidgettoken&&token&&spinewidgettoken.loaded){
            
            LoadAnimationToken(token)
        }else if(spinewidget&&spinewidget.loaded){

            var animskill = db.animlist[opdataFull.id]
            console.log(skillnum)
            if(animskill && animskill.skills[skillnum]){
                $("#spine-text").text(`Skill ${skillnum+1}`)
                CreateAnimation(spinewidget,animskill.skills[skillnum],true)
            }
            else{
                var animlist = Object.keys(spinewidget.customanimation).filter(search=>search.includes("Skill"))

                animlist=animlist.sort((a,b)=>{
                    if(a<b)return 1
                    if(a>b)return -1
                    return 0
                })
                
                if(animlist&&animlist.length>0){
                    // console.log(animlist)
                    // console.log(skillmax-skillnum-1)
                    
                    if(animlist[skillmax-skillnum-1]){
                        $("#spine-text").text(`Skill ${skillnum+1}`)
                        // console.log()
                        CreateAnimation(spinewidget,spinewidget.customanimation[animlist[skillmax-skillnum-1]],true)
                    }
                }
            }

        }
    }

    function LoadAnimation(){
        // console.log(spinewidget)
        $("#loading-spine").text("Loading...")
        if(spinewidget){
            spinewidget.pause()
            spinewidget = undefined
        }
        // else{
        //     if(loadchibi)$("#spine-frame").fadeIn(100);
        // }
        $("#spine-widget").remove()
        $("#spine-frame").append(`<div id="spine-widget" class="top-layer" style="position:absolute;width: ${wid}px; height: ${hei}px;top:${-hei/2+150 +chibiscale[1]}px;left:-${wid/2-150}px;pointer-events: none;z-index: 20;transform: scale(${chibiscale[0]});"></div>`)
        if (chibiName != null && defaultAnimationName != null) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', folder + chibiName + "." +skeletonType, true);
            xhr.responseType = 'arraybuffer';
            var array;
            $("#spine-widget").hide()
            var defaultskin ='default'
            
            $("#loading-spine").fadeIn(200)
            console.log(chibiName)
            xhr.onloadend = function (e) {
                if (xhr.status != 404) {
                    buffer = xhr.response;
                    array = new Uint8Array(buffer);
                    // console.log(array);
                    skelBin = new SkeletonBinary();
                    var jsonskel
                    if(array.length==0){
                        $("#loading-spine").text("Load Failed")
                    }
                    if (skeletonType== "skel"){
                        skelBin.data = array
                        skelBin.initJson()
                        jsonskel = JSON.stringify(skelBin.json)
                        var parsedskeljson = JSON.parse(jsonskel)
                        console.log(JSON.parse(jsonskel))
                        if(!Object.keys(parsedskeljson.animations).find(search=>search==defaultAnimationName)){
                            defaultAnimationName = Object.keys(parsedskeljson.animations)[0]
                        }
                        if(!Object.keys(parsedskeljson.skins).find(search=>search==defaultskin)){
                            defaultskin = Object.keys(parsedskeljson.skins)[0]
                        }
                    }else if (skeletonType== "json"){
                        jsonskel = JSON.parse(new TextDecoder("utf-8").decode(array))
                        var parsedskeljson = jsonskel
                        console.log(JSON.parse(jsonskel))
                        if(!Object.keys(parsedskeljson.animations).find(search=>search==defaultAnimationName)){
                            defaultAnimationName = Object.keys(parsedskeljson.animations)[0]
                        }
                        if(!Object.keys(parsedskeljson.skins).find(search=>search==defaultskin)){
                            defaultskin = Object.keys(parsedskeljson.skins)[0]
                        }
                    }
                    
                    
                    
                    // var test = new TextDecoder("utf-8").decode(array);
                    // console.log(JSON.parse(test))
                    // console.log(JSON.stringify(skelBin.json, null, "\t"));
                    var spineX = parseFloat($("#spine-widget").width())/2
                    var spineY = parseFloat($("#spine-widget").height())/2 -200

                    // console.log(spineX)
                    // console.log(spineY)
                    new spine.SpineWidget("spine-widget", {
                        jsonContent: jsonskel,
                        atlas: folder + chibiName + ".atlas",
                        animation: defaultAnimationName,
                        backgroundColor: "#00000000",
                        // debug: true,
                        // imagesPath: chibiName + ".png", 
                        premultipliedAlpha: true,
                        fitToCanvas : false,
                        loop:true,
                        // x:900,
                        // y:650,
                        x:spineX,
                        y:spineY,
                        //0.5 for normal i guess
                        scale:1,
                        success: function (widget) {
                            
                            animIndex=0
                            spinewidget = widget
                            $("#spine-text").text(widget.skeleton.data.animations[0].name)
                            $("#loading-spine").fadeOut(200)
                            animations = widget.skeleton.data.animations;
                            // console.log(animations)
                            // console.log(widget)
                            $("#spine-widget").show()
                            if(animations.find(search=>search.name=="Start")){
                                CreateAnimation(spinewidget,["Start","Idle"])
                                $("#spine-text").text("Idle")
                            }else if(animations.find(search=>search.name=="Relax")){
                                CreateAnimation(spinewidget,"Relax")
                                $("#spine-text").text("Relax")
                            }

                            // CreateAnimation(["Skill_Begin",["Skill_Loop",5],"Skill_End","Idle"],true)
                            // CreateAnimation(["Skill_2_Begin",["Skill_2_Loop",5],"Skill_2_Loop_End","Idle"],true)

                            widget.customanimation = CheckAnimationSet(animations)
                            // console.log(widget)


                            //ange skill 2
                            // CreateAnimation(["Skill1_Begin",["Skill1_Loop",15],"Skill1_End",["Idle_Charge",2]],true)

                            //ange skill 3 (is weird)
                            // CreateAnimation(["Skill2_Begin",["Skill2_Loop",15],"Skill2_End",["Idle_Charge",2]],true)

                            // Normal skill loop with begin and idle i guess (nian skill 2)
                            // CreateAnimation(["Skill_2_Begin",["Skill_2_Loop",5],"Skill_2_Idle"],true,true)


                            // console.log(widget.state)
                            // console.log(widget.state.trackEntry)
                            $("#spine-toolbar-next").onclick = function () {
                                widget.state.clearTracks()
                                if(animationqueue!=undefined)clearInterval(animationqueue)
                                animIndex++;
                                // console.log(animations)
                                if (animIndex >= animations.length) animIndex = 0;
                                widget.setAnimation(animations[animIndex].name)
                                $("#spine-text").text(animations[animIndex].name)
                            }
                        }
                    })
                }else{
                    $("#loading-spine").text("Load Failed")
                    // $("#spine-frame").fadeOut()
                }
            };
            xhr.send()
        }
    }


    function LoadAnimationToken(tokenkey=opdataFull.tokenKey){
        // console.log(spinewidgettoken)
        // console.log(opdataFull)
        // var tokenName =
        var tokenname = tokenkey
        var tokenfolder = `./spineassets/token/${opdataFull.id}/${tokenkey}`
        console.log(tokenfolder)
        // $("#loading-spine").text("Loading...")
        if(spinewidgettoken){
            // spinewidget.loadWidgets()
            // spinewidget.loadTexture()
            spinewidgettoken.pause()
            spinewidgettoken = undefined
            // console.log(loadchibi)
            // if(loadchibi)$("#spine-frame").fadeIn(100);
        }
        // else{
        //     if(loadchibi)$("#spine-frame-token").fadeIn(100);
        // }

        $("#spine-widget-token").remove()
        $("#spine-frame-token").append(`<div id="spine-widget-token" class="top-layer" style="position:absolute;width: ${wid}px; height: ${hei}px;top:${-hei/2+100 +chibiscale[1]}px;left:-${wid/2-150}px;pointer-events: none;z-index: 20;transform: scale(${chibiscale[0]});"></div>`)
            
        if (chibiName != null && defaultAnimationName != null) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', tokenfolder +"."+skeletonType, true);
            xhr.responseType = 'arraybuffer';
            var array;
            $("#spine-widget-token").hide()
            var defaultskin ='default'
            
            // $("#loading-spine").fadeIn(200)
            // console.log(chibiName)
            xhr.onloadend = function (e) {
                if (xhr.status != 404) {
                    buffer = xhr.response;
                    array = new Uint8Array(buffer);
                    // console.log(array);
                    skelBin = new SkeletonBinary();
                    var jsonskel
                    if(array.length==0){
                        // $("#loading-spine").text("Load Failed")
                    }
                    if (skeletonType== "skel"){
                        skelBin.data = array
                        skelBin.initJson()
                        jsonskel = JSON.stringify(skelBin.json)
                        var parsedskeljson = JSON.parse(jsonskel)
                        console.log(JSON.parse(jsonskel))
                        if(!Object.keys(parsedskeljson.animations).find(search=>search==defaultAnimationName)){
                            defaultAnimationName = Object.keys(parsedskeljson.animations)[0]
                        }
                        if(!Object.keys(parsedskeljson.skins).find(search=>search==defaultskin)){
                            defaultskin = Object.keys(parsedskeljson.skins)[0]
                        }
                    }else if (skeletonType== "json"){
                        jsonskel = JSON.parse(new TextDecoder("utf-8").decode(array))
                        var parsedskeljson = jsonskel
                        console.log(JSON.parse(jsonskel))
                        if(!Object.keys(parsedskeljson.animations).find(search=>search==defaultAnimationName)){
                            defaultAnimationName = Object.keys(parsedskeljson.animations)[0]
                        }
                        if(!Object.keys(parsedskeljson.skins).find(search=>search==defaultskin)){
                            defaultskin = Object.keys(parsedskeljson.skins)[0]
                        }
                    }
                    
                    
                    var spineX = parseFloat($("#spine-widget-token").width())/2
                    var spineY = parseFloat($("#spine-widget-token").height())/2 -300
                    // var test = new TextDecoder("utf-8").decode(array);
                    console.log($("#spine-widget-token").width())
                    console.log(spineX)
                    // console.log(JSON.parse(test))
                    // console.log(JSON.stringify(skelBin.json, null, "\t"));
                    new spine.SpineWidget("spine-widget-token", {
                        jsonContent: jsonskel,
                        atlas: tokenfolder + ".atlas",
                        animation: defaultAnimationName,
                        backgroundColor: "#00000000",
                        // debug: true,
                        // imagesPath: chibiName + ".png", 
                        premultipliedAlpha: true,
                        fitToCanvas : false,
                        loop:true,
                        x:spineX,
                        y:spineY,
                        //0.5 for normal i guess
                        scale:1,
                        success: function (widget) {
                            
                            // animIndex=0
                            spinewidgettoken = widget
                            // $("#spine-text").text(widget.skeleton.data.animations[0].name)
                            // $("#loading-spine").fadeOut(200)
                            tokenanimations = widget.skeleton.data.animations;
                            // console.log(animations)
                            // console.log(widget)
                            $("#spine-widget-token").show()
                            if(tokenanimations.find(search=>search.name=="Start")){
                                CreateAnimation(spinewidgettoken,["Start","Idle"])
                                // $("#spine-text").text("Idle")
                            }else if(tokenanimations.find(search=>search.name=="Relax")){
                                CreateAnimation(spinewidgettoken,"Relax")
                                // $("#spine-text").text("Relax")
                            }else if(tokenanimations.find(search=>search.name=="Idle")){
                                CreateAnimation(spinewidgettoken,"Idle")
                                // $("#spine-text").text("Relax")
                            }

                            widget.customanimation = CheckAnimationSet(tokenanimations)
                            console.log(widget)
                        }
                    })
                }else{
                }
            };
            xhr.send()
        }
    }
    function ChangeAnimation2(widget,widgettext,num){
        if(widget=="token") widget=spinewidgettoken
        else widget=spinewidget

        var curranimation = Object.keys(widget.customanimation)
        widget.state.clearTracks()
        if(animationqueue!=undefined)clearInterval(animationqueue)
        animIndex += num;
        // console.log(animIndex)
        // console.log(curranimation)
        
        if (animIndex >= curranimation.length) animIndex = 0;
        else if (animIndex < 0) animIndex = curranimation.length-1;
        // spinewidget.state.setDefaultMix(0.1);
        // spinewidget.config.scale = 2
        // console.log(widget)
        // console.log(animIndex)
        // widget.setAnimation(curranimation[animIndex].name)
        // console.log(widget.customanimation[Object.keys(widget.customanimation)[animIndex]])

        CreateAnimation(widget,widget.customanimation[Object.keys(widget.customanimation)[animIndex]],true)
        // console.log(widgettext)
        $(widgettext).text(Object.keys(widget.customanimation)[animIndex])
    }

    function ChangeAnimation(widget,widgettext,num){
        if(widget=="token") widget=spinewidgettoken
        else widget=spinewidget

        var curranimation = widget.skeleton.data.animations
        widget.state.clearTracks()
        if(animationqueue!=undefined)clearInterval(animationqueue)
        animIndex += num;
        // console.log(animIndex)
        // console.log(curranimation)
        
        if (animIndex >= curranimation.length) animIndex = 0;
        else if (animIndex < 0) animIndex = curranimation.length-1;
        // spinewidget.state.setDefaultMix(0.1);
        // spinewidget.config.scale = 2
        // console.log(widget)
        // console.log(animIndex)
        // widget.setAnimation(curranimation[animIndex].name)
        // console.log(widget.customanimation[Object.keys(widget.customanimation)[animIndex]])
        // console.log(curranimation[index])
        CreateAnimation(widget,curranimation[animIndex].name)
        // widget.setAnimation(curranimation[animIndex].name)
        // console.log(widgettext)
        $(widgettext).text(curranimation[animIndex].name)
    }

    function ChangeSkin(name="",pers=""){
        currskin = name
        var skinname = currskin.split(opdataFull.id)[1]?name.split(opdataFull.id)[1]:""
        console.log(opdataFull.id)
        console.log(skinname)
        if(spinewidgettoken){
            console.log("      waaa "+tokenname)
            LoadAnimationToken(tokenname+skinname)
        }
        if(name!="")chibiName=name
        if(pers!="")chibipers=pers
        if(chibipers=='build') {chibiName.includes("build")?chibiName=chibiName:chibiName= "build_"+chibiName}
        else chibiName.includes("build")?chibiName=chibiName.split("_").slice(1).join("_"):chibiName=chibiName
        folder = `./spineassets/${chibitype}/${charName}/${chibipers}/`
        if(spinewidget)LoadAnimation()

        
    }


    function PlayPause(widget){
        if(widget=="token") widget=spinewidgettoken
        else widget=spinewidget
        if(widget.isPlaying()){
            console.log("Playing")
            widget.pause()
        }else{
            console.log("Paused")
            widget.play()
        }
    }

    function Mirror(el){
        var currcss 
        // if($(el).hasClass("MirrorDiv")){
        //     curcss = $(el).css('transform')
        //     var changex = curcss.split(",")
        //     $(el).css('transform','scaleX("1")')
        //     console.log(changex)
        // }
        // else {
        //     curcss = $(el).css('transform')
        //     $(el).css('transform','scaleX("-1")')
        //     console.log(curcss)
        // }
        currcss = $(el).css('transform')
        var regexcheck = /matrix\((.*)\)/g
        var changex = regexcheck.exec(currcss)[1]
        var changex1 = changex.split(",")
        changex1[0] = changex1[0]*-1
        $(el).css('transform','matrix('+changex1.join(",")+')')
        console.log(changex)
        $(el).toggleClass("MirrorDiv") 
        
        
    }

    

    function CreateAnimation(chibiwidget,animArray,endloop = false,skipStart = false,isendstop=false){
        // console.log(animArray)
        
        // console.log(Array.isArray(animArray))
        // console.log(animArray.length>1)
        // console.log(Array.isArray(animArray[0]))
        
        if((Array.isArray(animArray)&&animArray.length>1)){
            // console.log("ayyyyyy")
            var delay = 0
            var animNum = 0
            if(animationqueue!=undefined)clearInterval(animationqueue)
            var curranimplay = Array.isArray(animArray[0])?animArray[0][0]:animArray[0]
            if(chibiwidget.loaded)chibiwidget.setAnimation(curranimplay)
            chibiwidget.state.clearTracks()
            var curranimations = chibiwidget.skeleton.data.animations
            animArray.forEach(element => {
                var curranim = element
                var animTimes = 1
                var isloop = animNum==animArray.length-1
                
                if(Array.isArray(element)){
                    curranim = element[0]
                    animTimes = element[1]
                    isloop = true
                }
                if(animNum==0)chibiwidget.state.setAnimation(0,curranim,Array.isArray(animArray[0])&&animArray[0].length>1?true:false)
                else if(animNum==animArray.length-1) chibiwidget.state.addAnimation(animNum,curranim,!isendstop,delay)
                else chibiwidget.state.addAnimation(animNum,curranim,isloop,delay)
                delay +=curranimations[GetAnimationIndex(curranimations,curranim)].duration*animTimes
                animNum++
                // console.log(element)
            });
            if(endloop){
                if(skipStart)animArray.shift()

                console.log(animArray)
                animationqueue = setInterval(function(){
                    var delay = 0
                    var animNum = 0
                    var curranimplay = Array.isArray(animArray[0])?animArray[0][0]:animArray[0]
                    if(chibiwidget.loaded)chibiwidget.setAnimation(curranimplay)
                    chibiwidget.state.clearTracks()
                    animArray.forEach(element => {
                        var curranim = element
                        var animTimes = 1
                        var isloop = animNum==animArray.length-1
                        if(Array.isArray(element)){
                            curranim = element[0]
                            animTimes = element[1]
                            isloop = true
                        }
                        if(animNum==0)chibiwidget.state.setAnimation(0,curranim,Array.isArray(animArray[0])&&animArray[0].length>1?true:false)
                        
                        else chibiwidget.state.addAnimation(animNum,curranim,isloop,delay)
                        delay +=curranimations[GetAnimationIndex(curranimations,curranim)].duration*animTimes
                        animNum++
                        console.log(element)
                    });
                },delay*1000-20)
            }
        }else{
            // chibiwidget.state.setAnimation(animArray)
            // console.log("WEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
            
            if(animationqueue!=undefined)clearInterval(animationqueue)
            // console.log(animArray)

            var curranimplay = Array.isArray(animArray[0])?animArray[0][0]:animArray
            if(chibiwidget.loaded)chibiwidget.setAnimation(curranimplay)
            chibiwidget.state.clearTracks()
            
            chibiwidget.state.setAnimation(0,curranimplay,!isendstop)
        }
    }

    function CheckChibi(){
        console.log(spinewidget)
    }
    
    function CheckAnimationSet(anim){
        // console.log(anim)
        var curranimlist = {}
        if(anim.find(search=>search.name=="Interact")){
            //Build Mode
            // console.log("Is Build")

        }else if(anim.find(search=>search.name=="Idle")){
            //Battle Mode
            // console.log("Is Battle")
            anim.forEach(curranim => {
                var numberregx = /(\d)/
                var currsplit = curranim.name.split("_")[0]
                
                if(currsplit)
                var splitnum = numberregx.exec(curranim.name)
                if(splitnum){
                    var nameregex = /(.*)(?=\d)/g
                    var checkname = nameregex.exec(currsplit)
                    // console.log(checkname[0])
                    if(checkname)currsplit = checkname[0]
                    // console.log(checkname[0])
                    splitnum=splitnum[0]
                }
                else if (!splitnum) splitnum=""

                if(!curranimlist[`${currsplit}${splitnum}`]){
                    curranimlist[`${currsplit}${splitnum}`] = []
                }
                if(!curranim.name.includes("Down")){
                    curranimlist[`${currsplit}${splitnum}`].push(curranim.name)
                }
                
            });
            Object.keys(curranimlist).forEach(keys => {
                curranimlist[keys]= curranimlist[keys].sort((a,b)=>{
                    var sortarray = [
                        "Pre",
                        "Begin",
                        "Start",
                        "Idle",
                        "",
                        "Loop",
                        "End",
                        "Die"
                    ]
                    var anum = 0
                    var bnum = 0
                    for(i=0;i<sortarray.length;i++){
                        // console.log(sortarray[i])
                        if(sortarray[i]==""){
                            var isAfree = true
                            var isBfree = true
                            for(j=0;j<sortarray.length;j++){
                                if(sortarray[j]!=""){
                                    if(a.includes(sortarray[j]))isAfree=false
                                    if(b.includes(sortarray[j]))isBfree=false
                                }
                            }
                            if (isAfree) anum += 4
                            if (isBfree) bnum += 4
                        }else{
                            if(a.includes(sortarray[i]))anum+=i+1
                            if(b.includes(sortarray[i]))bnum+=i+1
                        }
                    }
                    return anum - bnum
                    
                })
                // curranimlist[keys].forEach(element => {
                //     if(curranimlist[keys].length>=2&&(element.includes("Loop")||element.includes("Idle"))){
                //         console.log(element)
                //         element = [element,5]
                //     }
                // });
                if(curranimlist[keys].find(search=>search.includes("End"))){
                    if(anim.find(search=>search.name.includes("Idle_Charge"))) curranimlist[keys].push("Idle_Charge")
                    else curranimlist[keys].push("Idle")
                }
                if(curranimlist[keys].find(search=>search.includes("Die"))){
                    if(anim.find(search=>search.name.includes("Start"))) curranimlist[keys].push("Start")
                }
                for(i=0;i<curranimlist[keys].length;i++){
                    var filterarray = [
                        "Pre",
                        "Begin",
                        "Start",
                        "Idle",
                        "Loop",
                        "End",
                        "Die"
                    ]
                    var iscomp = true
                    if (curranimlist[keys].length>=2&&(curranimlist[keys][i].includes("Loop")||curranimlist[keys][i].includes("Idle"))&&!curranimlist[keys][i].includes("End")) iscomp = false
                    else{
                        iscomp = false
                        filterarray.forEach(element => {
                            if(curranimlist[keys][i].includes(element)) iscomp = true
                        });
                    }
                    if(!iscomp){
                        // console.log(curranimlist[keys][i])
                        var currvariable = anim.find(search=> search.name == curranimlist[keys][i])
                        // console.log(currvariable)
                        // console.log("Got "+ Math.round(8/currvariable.duration))
                        if(curranimlist[keys][i].includes("Idle")){
                            if(Math.round(3/currvariable.duration)>3)curranimlist[keys][i] = [curranimlist[keys][i],Math.round(3/currvariable.duration)]
                        }else if(currvariable.duration!=0){
                            curranimlist[keys][i] = [curranimlist[keys][i],Math.round(8/currvariable.duration)]
                        }
                        
                    }
                }
            });

            
        }
        console.log(curranimlist)
        return curranimlist
    }

    function GetAnimationIndex(anim,name){
        
        return anim.map(function(e) { return e.name; }).indexOf(name)
    }

    function SlideToggler(el){

            $(`.${el}`).slideToggle(100)
            console.log("WEEEI")
    }

    function ZoomChibi(el){

        if (el==0) el = {value:0}
        var minscale = 0.5
        var maxscale = 2
        var mintop = 0
        var maxtop =-400

        // top:${-hei/2+150}px;left:-${wid/2-150}px
        // var zoomvalue = `${el.value}`
        var currscale = minscale + (maxscale*parseFloat(el.value)/100)
        var currtop = ((maxtop-mintop)*parseFloat(el.value)/100)
        // var currtop2 = mintop+((maxtop-mintop/2)*parseFloat(el.value)/100)

        // console.log(currtop)
        chibiscale=[currscale,currtop]
        $("#spine-widget").css("transform",`scale(${currscale})`)
        $("#spine-widget").css("top",`${(-hei/2+150)+currtop}px`)
        $("#spine-widget-token").css("transform",`scale(${currscale})`)
        $("#spine-widget-token").css("top",`${-hei/2+100 +currtop}px`)
    }
    function Zoomchara(el){
        var widthbefore = $('#charazoom').width()
        var heightbefore = $('#charazoom').height()

        $('#charazoominput').val(el.value)
        $('#charazoomslider').val(el.value)
        $('#charazoom').css("max-width",`unset`)
        $('#charazoom').css("max-height",`unset`)
        var zoomvalue = `${el.value}%`
        $('#charazoom').css("width",zoomvalue)
        $('#charazoom').css("height",zoomvalue)
        var widthafter = $('#charazoom').width()
        var heightafter = $('#charazoom').height()
        // console.log(`${widthbefore} => ${widthafter}`)
        var zoommargintop = parseFloat($('#charazoom').css("margin-top").split('px')[0])
        var zoommarginleft = parseFloat($('#charazoom').css("margin-left").split('px')[0])
        console.log(zoommargintop)

        console.log(`${zoommargintop +(heightbefore/2-heightafter/2)}px`)
        console.log(`${zoommarginleft +(widthbefore/2-widthafter/2)}px`)
        $('#charazoom').css("margin-top",`${zoommargintop +(heightbefore/2-heightafter/2)}px`)
        $('#charazoom').css("margin-left",`${zoommarginleft +(widthbefore/2-widthafter/2)}px`)
        console.log(zoomvalue)
    }

    function ObjectToArray(db){
        var result = [];
        var found = true;
        $.each(db,function(key2,v){
            console.log(v)
            var obj = {};
            obj[key2] = v; 
            result.push(obj);
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
            case "kr": $("#display-lang").text("Korean"); break;
        }
        
        getJSONdata("ui",function(data){
            if(data.length != 0){
                $.each(data, function(i,text){
                    $("[translate-id="+text.id).html(text['ui_'+lang]);
                });
            }
        });

        $(".op-tag").each((_, btn) => $(btn).text(db.ktags[$(btn).attr("data-id")][lang]));
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
        return new URL(window.location.href).searchParams;
    }

    

    function dragElement(elmnt,elmnt2 =elmnt.id+ "header") {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt2)) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt2).onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    function dragElement2(elmnt,elmnt2 =elmnt.id+ "header") {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt2)) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt2).onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style["margin-top"] = (elmnt.offsetTop - pos2) + "px";
            elmnt.style["margin-left"] = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
    function LoadAllJsonObjects(obj) {
        var result = {}
        
        var promises = Object.entries(obj).map(function(url){
            return $.getJSON(url[1]).then(function(res){
                result[url[0]]=res
            })
        })
    
        return Promise.all(promises).then(function(){
            return result
        })
    }