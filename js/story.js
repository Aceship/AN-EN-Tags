    $.holdReady(true);
    var db = {};
    var d0 = $.getJSON("json/ace/akstorylist.json",function(data){
            db["storylist"] = data;
        });
    $.when(d0).then(function(){
        $.holdReady(false);
    });

    var lang;
    var reg;
    var selectedStory;

    $(document).ready(function(){
        $('#to-tag').click(function(){      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });

        $(window).click(function() {
            $('#searchResult').html("");
            $('#searchResult').hide();
        });
        $('#searchResult').click(function(event){
            event.stopPropagation();
        });
        $('#opBrowseButton').click(function(event){
            event.stopPropagation();
        });
        $('#searchResult').click(function(event){
            event.stopPropagation();
        });
        $('#opname').bind("enterKey",function(e){
            // console.log()
            populateSearch($('#opname').val(),true)
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
            if(typeof vars.opname != "undefined"){
                // console.log("TEST1")
            }
        } else {
            console.log(localStorage.webLang);
            reg = localStorage.gameRegion;
            lang = localStorage.webLang;
        }

        // console.log("TEST")
        $('.reg[value='+reg+']').addClass('selected');
        $('.lang[value='+lang+']').addClass('selected');

        //getSkillDesc('skchr_amiya_2',0);
    });

    function clickBtnClear(){
        $("#story").hide();
        $("#elite-sidenav").html("");
        $("#tabs-opCG").html("");
        $("#elite-topnav").html("");
        $("#tabs-opData").html("");
        $("#op-taglist").html("");
        $("#opname").val("");
        $('#searchResult').html("");
        $('#searchResult').hide();
        localStorage.selectedOPDetails = "";
        history.pushState(null, '', window.location.pathname); 
    }

    function browseSearch(groups,value = "",value2 =""){
        $('#searchResult').html("");
        $('#searchResult').show();
        // console.log(groups)
        // console.log(value)
        $("#searchResult").css("max-width","400px");
        if(groups =="story"){
            // console.log(db.storylist[value][value2].content)
            db.storylist[value][value2].content.forEach(list => {
                // console.log(db.storylist[groups][list])
                // console.log(list)
                $("#searchResult").append(`<li class=" ak-shadow-small ak-c-black"style="background:#444;font-size:17px;padding:4px;text-align:center;width:100%;cursor: pointer;margin-bottom:2px" 
                onclick="SelectStory('${list}')">${list}</li>`);
            });
        }else{
            Object.keys(db.storylist[groups]).forEach(list => {
                // console.log(db.storylist[groups][list])
                $("#searchResult").append(`<li class=" ak-shadow-small ak-c-black"style="background:#444;font-size:17px;padding:4px;text-align:center;width:100%;cursor: pointer;margin-bottom:2px" 
                onclick="browseSearch('${db.storylist[groups][list].group}','${groups}','${db.storylist[groups][list].name}')">${db.storylist[groups][list].name}</li>`);
            });
        }
    }
    function populateSearch(el,isenter=false){
        // console.log(el)
        let inputs
        if(isenter)
            inputs = el
        else
            inputs = el.value
        if(($('#searchResult').css("display") == "block") && el=="Browse"){
            // console.log($('#searchResult').css("display") == "none" )
            $('#searchResult').hide();
            return;
        }
        if(el.value!=""||el=="Browse"||isenter){
            var result=[];
            $.each(db.storylist.story,function(_,story){
                var found = false;
                if(el=="Browse") found=true
                else{
                    var storyname = story.name.toUpperCase()    
                    // console.log(storyname)
                    var search = storyname.search(inputs.toUpperCase())
                    // console.log(search)
                    if(search !=-1){
                        found = true;
                    }
                }
                if(found){
                    var storyName = story.name
                    
                    result.push({name : storyName})
                }
            })
            if(result.length>0){
                if(isenter){
                    $('#searchResult').hide();
                    SelectStory(result[0].name)
                    return
                }
                $('#searchResult').html("");
                $('#searchResult').show();
                for(var i=0;i<result.length;i++){
                    // console.log(result[i])
                    $("#searchResult").css("max-width","320px");
                    $("#searchResult").append(`<li class=" ak-shadow-small ak-c-black"style="background:#444;font-size:17px;padding:4px;text-align:center;width:100%;cursor: pointer;margin-bottom:2px" onclick="SelectStory('${result[i].name}')">${result[i].name}</li>`);
                }
            } 
        } else {
            $('#searchResult').html("");
            $('#searchResult').hide();
        }
    }

    function SelectStory(storyname){
        $('#searchResult').hide();
        $('#story').html("")
        $('#story').show()
        let currstory = query(db.storylist.story,"name",storyname)

        for(i=1;i<=currstory.total;i++){
            let image=`<img src='./img/story/${currstory.folder}/${('0'+i).slice(-2)}.png'>`
            $('#story').append(`<div class="storyimagecontainer">${image}</div>`)
        }
        console.log(currstory)
    }
    function titledMaker (content,title,extraClass="",extraId="",extraStyle=""){
        let titledbutton = `
        <div style="padding-top:5px;display:inline-block">
        <div class=\"ak-btn-non btn-sm ak-shadow-small ak-btn ak-btn-bg btn-char  ${extraClass}\" style="text-align:left;min-width:80px;${extraStyle}" data-toggle=\"tooltip\" data-placement=\"top\" id="${extraId}">
        ${(title==""?"":`<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">${title}</a>`)}${content}</div>
        </div>`

        return titledbutton
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