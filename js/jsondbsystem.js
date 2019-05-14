        
        /*//input example// 
            jsonFiles = [{
                'dir':'json/excel/building_data.json',      //the json file that you want to get
                'objname':'manufactFormulas',               //take only data inside this key from the json, 
                                                              empty out ('') if you want to return the whole
                                                              data from the json file
                'alias':'json_formulas'                     //obj key name will be returned as this
            }]
        */
        function loadJSON(jsonFiles){ 
            var db = {};
            var tasks = [];
            $.each(jsonFiles, function(i,v){
                var obj = {};
                var task = $.getJSON(v.dir,function(data){
                    if(v.objname != ""){
                        obj = eval('data.'+v.objname);
                    } else {
                        obj = data;
                    }
                });
                tasks.push(task);
                db[v.alias] = obj;
            });
            $.when.apply(0,tasks
            ).then(function(){
                console.log(db);
                return db;
            });
        }