function SkeletonBinary(){};

SkeletonBinary.prototype = {
    data : null,
    scale : 1,
    json : {},
    nextNum : 0,
    chars : null,
    readByte : function(){
        return this.nextNum < this.data.length ? this.data[this.nextNum++] : null;
    },
    readBoolean : function(){
        return this.readByte() != 0;
    },
    readShort : function(){
        return (this.readByte() << 8) | this.readByte();
    },
    readInt : function(optimizePositive){
        if(typeof optimizePositive === 'undefined'){
            return (this.readByte() << 24) | (this.readByte() << 16) | (this.readByte() << 8) | this.readByte();
        }
        var b = this.readByte();
        var result = b & 0x7f;
        if ((b & 0x80) != 0){
            b = this.readByte();
            result |= (b & 0x7F) << 7;
            if ((b & 0x80) != 0){
                b = this.readByte();
                result |= (b & 0x7F) << 14;
                if ((b & 0x80) != 0){
                    b = this.readByte();
                    result |= (b & 0x7F) << 21;
                    if ((b & 0x80) != 0){
                        b = this.readByte();
                        result |= (b & 0x7F) << 28;
                    }
                }
            }
        }
        return optimizePositive ? result : ((result >> 1) ^ -(result & 1));
    },
    bytes2Float32 : function(bytes){
        var sign = (bytes & 0x80000000) ? -1 : 1;
        var exponent = ((bytes >> 23) & 0xFF) - 127;
        var significand = (bytes & ~(-1 << 23));

        if (exponent == 128)
            return sign * ((significand) ? Number.NaN : Number.POSITIVE_INFINITY);

        if (exponent == -127) {
            if (significand == 0) return sign * 0.0;
            exponent = -126;
            significand /= (1 << 22);
        } else significand = (significand | (1 << 23)) / (1 << 23);

        return sign * significand * Math.pow(2, exponent);
    },
    readFloat : function(){
        return this.bytes2Float32((this.readByte()<<24) + (this.readByte()<<16) + (this.readByte()<<8) + (this.readByte()<<0));
    },
    readVertices : function(vertexCount){
        var verticesLength = vertexCount << 1;
        if(!this.readBoolean()){
            return this.readFloatArray(verticesLength, this.scale);
        }

        var vertices = new Array();
        for(var i = 0; i < vertexCount; i++){
            var boneCount = this.readInt(true);
            vertices.push(boneCount);
            for(var j = 0; j < boneCount; j++){
                vertices.push(this.readInt(true));
                vertices.push(this.readFloat() * this.scale);
                vertices.push(this.readFloat() * this.scale);
                vertices.push(this.readFloat());
            }
        }
        return vertices;
    },
    readFloatArray : function(n, scale){
        var array = new Array(n);
        if(scale == 1){
            for(var i = 0; i < n; i++){
                array[i] = this.readFloat();
            }
        }else{
            for(var i = 0; i < n; i++){
                array[i] = this.readFloat() * scale;
            }
        }
        return array;
    },
    readShortArray : function(){
        var n = this.readInt(true);
        var array = new Array(n);
        for(var i = 0; i < n; i++){
            array[i] = this.readShort();
        }
        return array;
    },
    readIntArray : function(){
        var n = this.readInt(true);
        var array = new Array(n);
        for(var i = 0; i < n; i++)
            array[i] = this.readInt(true);
        return array;
    },
    readHex : function(){
        var hex = this.readByte().toString(16);
        return hex.length == 2 ? hex : '0' + hex;
    },
    readColor : function(){
        return this.readHex() + this.readHex() + this.readHex() + this.readHex();
    },
    readString(){
        var charCount = this.readInt(this, true);
        switch(charCount){
        case 0:
            return null;
        case 1:
            return "";
        }
        charCount--;
        this.chars = "";
        var b = 0;
        for(var i = 0; i < charCount;){
            b = this.readByte();
            switch (b >> 4){
            case 12:
            case 13:
                this.chars += String.fromCharCode((b & 0x1F) << 6 | this.readByte() & 0x3F);
                i += 2;
                break;
            case 14:
                this.chars += String.fromCharCode((b & 0x0F) << 12 | (this.readByte() & 0x3F) << 6 | this.readByte() & 0x3F);
                i += 3;
                break;
            default:
                this.chars += String.fromCharCode(b);
                i++;
            }
        }
        return this.chars;
    },
    initJson : function(){
        this.json.skeleton = {};
        var skeleton = this.json.skeleton;
        skeleton.hash = this.readString();
        if(skeleton.hash.length == 0)
            skeleton.hash = null;
        skeleton.spine = this.readString();
        if(skeleton.spine.length == 0)
            skeleton.spine = null;
        skeleton.width = this.readFloat();
        skeleton.height = this.readFloat();
        var nonessential = this.readBoolean();
        if(nonessential){
            skeleton.fps = this.readFloat();
            skeleton.images = this.readString();
            if(skeleton.images.length == 0)
                skeleton.images = null;
        }

        //console.assert(skeleton.spine.startsWith("3.6"), "This parser supports only 3.6.x file format");

        //Bones.
        this.json.bones = new Array(this.readInt(true));
        var bones = this.json.bones;
        for(var i = 0; i < bones.length; i++){
            var boneData = {};
            boneData.name = this.readString();
            boneData.parent = null;
            if(i != 0){
                var parentIndex = this.readInt(true);
                boneData.parent = bones[parentIndex].name;
            }
            boneData.rotation = this.readFloat();
            boneData.x = this.readFloat() * this.scale;
            boneData.y = this.readFloat() * this.scale;
            boneData.scaleX = this.readFloat();
            boneData.scaleY = this.readFloat();
            boneData.shearX = this.readFloat();
            boneData.shearY = this.readFloat();
            boneData.length = this.readFloat() * this.scale;
            boneData.transform = TransformMode[this.readInt(true)];
            if(nonessential){
                boneData.color = this.readColor();
            }
            bones[i] = boneData;
        }

        // Slots.
        this.json.slots = new Array(this.readInt(true));
        var slots = this.json.slots;
        for(var i = 0; i < slots.length; i++){
            var slotData = {};
            slotData.name = this.readString();
            var boneData = this.json.bones[this.readInt(true)];
            slotData.bone = boneData.name;
            slotData.color = this.readColor();
            //3.6 feature
            //slotData.dark = this.readColor(); 
            slotData.attachment = this.readString();
            slotData.blend = BlendMode[this.readInt(true)];
            slots[i] = slotData;
        }

        // IK constraints.
        this.json.ik = new Array(this.readInt(true));
        var ik = this.json.ik;
        for(var i = 0; i < ik.length; i++){
            var ikConstraints = {};
            ikConstraints.name = this.readString();
            ikConstraints.order = this.readInt(true)
            ikConstraints.bones = new Array(this.readInt(true));
            for(var j = 0; j < ikConstraints.bones.length; j++){
                ikConstraints.bones[j] = this.json.bones[this.readInt(true)].name;
            }
            ikConstraints.target = this.json.bones[this.readInt(true)].name;
            ikConstraints.mix = this.readFloat();
            ikConstraints.bendPositive = this.readByte() != 255; // 1 = true, -1 (255) = false
            ik[i] = ikConstraints;
        }

        // Transform constraints.
        this.json.transform = new Array(this.readInt(true));
        var transform = this.json.transform;
        for(var i = 0; i < transform.length; i++){
            var transformConst = {};
            transformConst.name = this.readString();
            transformConst.order = this.readInt(true);
            var bones =  new Array(this.readInt(true));
            for(var ii = 0, nn = bones.length; ii < nn; ii++){
                bones[ii] = this.json.bones[this.readInt(true)].name;
            }
            transformConst.bones = bones;
            transformConst.target = this.json.bones[this.readInt(true)].name;
            transformConst.rotation = this.readFloat();
            /*3.6 feature
            transformConst.local = this.readBoolean();
            transformConst.relative = this.readBoolean();
			transformConst.offsetRotation = this.readFloat();
            */
            transformConst.x = this.readFloat() * this.scale;
            transformConst.y = this.readFloat() * this.scale;
            transformConst.scaleX = this.readFloat();
            transformConst.scaleY = this.readFloat();
            transformConst.shearY = this.readFloat();
            transformConst.rotateMix = this.readFloat();
            transformConst.translateMix = this.readFloat();
            transformConst.scaleMix= this.readFloat();
            transformConst.shearMix = this.readFloat();
            transform[i] = transformConst;
        }

        // Path constraints.
        this.json.path = new Array(this.readInt(true));
        var path = this.json.path;
        for(var i = 0; i < path.length; i++){
            var pathConst = {}
            pathConst.name = this.readString();
            pathConst.order = this.readInt(true);
            pathConst.bones = new Array(this.readInt(true))
            for(var ii = 0, nn = pathConst.bones.length; ii < nn; ii++){
                pathConst.bones[ii] = this.json.bones[this.readInt(true)].name;
            }
            pathConst.target = this.json.slots[this.readInt(true)].name;
            pathConst.positionMode = PositionMode[this.readInt(true)];
            pathConst.spacingMode = SpacingMode[this.readInt(true)];
            pathConst.rotateMode = RotateMode[this.readInt(true)];
            pathConst.rotation = this.readFloat();
            pathConst.position = this.readFloat();
            if(pathConst.positionMode == "fixed"){
                pathConst.position *= this.scale;
            }
            pathConst.spacing = this.readFloat();
            if(pathConst.spacingMode == "length" || pathConst.spacingMode == "fixed"){
                pathConst.spacing *= this.scale;
            }
            pathConst.rotateMix = this.readFloat();
            pathConst.translateMix = this.readFloat();
            path[i] = pathConst;
        }

        // Default skin.
        this.json.skins = {};
        this.json.skinsName = new Array();
        var skins = this.json.skins;
        var defaultSkin = this.readSkin("default", nonessential);
        if(defaultSkin != null){
            skins["default"] = defaultSkin;
            this.json.skinsName.push("default");
        }

        // Skin.
        for(var i = 0, n = this.readInt(true); i < n; i++){
            var skinName = this.readString();
            var skin = this.readSkin(skinName, nonessential);
            skins[skinName] = skin;
            this.json.skinsName.push(skinName);
        }

        // Events.
        this.json.events = {};
        this.json.eventsName = [];
		var events = this.json.events;
        for(var i = 0, n = this.readInt(true); i < n; i++){
            var eventName = this.readString();
            var eventFix = {};
            eventFix["int"] = this.readInt(false);
            eventFix["float"] = this.readFloat();
            eventFix["string"] = this.readString();
            events[eventName] = eventFix;
            this.json.eventsName[i] = eventName;
        }

        // Animations.
        this.json.animations = {};
        var animations = this.json.animations;
        for(var i = 0, n = this.readInt(true); i < n; i++){
            var animationName = this.readString();
            var animation = this.readAnimation(animationName);
            animations[animationName] = animation;
        }

    },
    readSkin(skinName, nonessential){
        var slotCount = this.readInt(true);
        if(slotCount == 0)
            return null;
        var skin = {};
        for(var i = 0; i < slotCount; i++){
            var slotIndex = this.readInt(true);
            var slot = {};
            for(var j = 0, n = this.readInt(true); j < n; j++){
                var name = this.readString();
                var attachment = this.readAttachment(name, nonessential);
                if(attachment != null){
                    slot[name] = attachment;
                }
            }
            skin[this.json.slots[slotIndex].name] = slot;
        }
        return skin;
    },
    readAttachment(attachmentName, nonessential){
        var scale = this.scale;
        var name = this.readString();
        if(name == null)
            name = attachmentName;
        switch(AttachmentType[this.readByte()]){
        case "region":
            var path = this.readString();
            if(path == null)
                path = name;
            var region = {};
            region.type = "region";
            region.name = name;
            region.path = path.trim(); // HACK: trim path name for some SD
            region.rotation = this.readFloat();
            region.x = this.readFloat() * scale;
            region.y = this.readFloat() * scale;
            region.scaleX = this.readFloat();
            region.scaleY = this.readFloat();
            region.width = this.readFloat() * scale;
            region.height = this.readFloat() * scale;
            region.color = this.readColor();
            return region;
        case "boundingbox":
            var box = {};
            box.type = "boundingbox";
            box.name = name;
            var vertexCount = this.readInt(true);
            box.vertexCount = vertexCount;
            box.vertices = this.readVertices(vertexCount);
            if(this.nonessential){
                box.color = this.readColor();
            }
            return box;
        case "mesh":
            var path = this.readString();
            if(path == null)
                path = name;
            var mesh = {};
            mesh.type = "mesh";
            mesh.name = name;
            mesh.path = path;
            mesh.color = this.readColor();
            var vertexCount = this.readInt(true);
            mesh.uvs = this.readFloatArray(vertexCount << 1, 1);
            mesh.triangles = this.readShortArray();
            mesh.vertices = this.readVertices(vertexCount);
            mesh.hull = this.readInt(true) << 1;
            if(nonessential){
                mesh.edges = this.readShortArray();
                mesh.width = this.readFloat() * scale;
                mesh.height = this.readFloat() * scale;
            }
            return mesh;
        case "linkedmesh":
            var path = this.readString();
            if(path == null)
                path = name;
            var linkedmesh = {};
            linkedmesh.type = "linkedmesh";
            linkedmesh.name = name;
            linkedmesh.path = path;
            linkedmesh.color = this.readColor();
            linkedmesh.skin = this.readString();
            linkedmesh.parent = this.readString();
            linkedmesh.deform = this.readBoolean();
            if(nonessential){
                linkedmesh.width = this.readFloat() * scale;
                linkedmesh.height = this.readFloat() * scale;
            }
            return linkedmesh;
        case "path":
            var path = {};
            path.type = "path";
            path.name = name;
            path.closed = this.readBoolean();
            path.constantSpeed = this.readBoolean();
            var vertexCount = this.readInt(true);
            path.vertexCount = vertexCount;
            path.vertices = this.readVertices(vertexCount);
            var lengths = new Array(vertexCount / 3);
            for(var i = 0; i < lengths.length; i++){
                lengths[i] = this.readFloat() * scale;
            }
            path.lengths = lengths;
            if(nonessential){
                path.color = this.readColor();
            }
            return path;
			/* 3.6 feature
        case "point":
            var point = {};
            point.type = "point";
            point.name = name;
            point.rotation = this.readFloat();
            point.x = this.readFloat() * scale;
            point.y = this.readFloat() * scale;
            if(nonessential){
                path.color = this.readColor();
            }
            return point;
        case "clipping":
            var clipping = {};
            clipping.type = "clipping";
            clipping.name = name;
            clipping.end = this.readInt(true);
            var vertexCount = this.readInt(true);
            clipping.vertexCount = vertexCount;
            clipping.vertices = this.readVertices(vertexCount);
            if(nonessential){
                clipping.color = this.readColor();
            }
            return clipping;
			*/
        }
        return null;
    },
    readCurve(frameIndex, timeline){
        switch(this.readByte()){
        case 0: //CURVE_LINEAR
            timeline[frameIndex].curve = "linear";
            break;
        case 1: //CURVE_STEPPED
            timeline[frameIndex].curve = "stepped";
            break;
        case 2: //CURVE_BEZIER
            var cx1 = this.readFloat();
            var cy1 = this.readFloat();
            var cx2 = this.readFloat();
            var cy2 = this.readFloat();
            timeline[frameIndex].curve = [cx1, cy1, cx2, cy2];
        }
    },
    readAnimation(name){
        var animation = {};
        var scale = this.scale;
        var duration = 0;

        // Slot timelines.
        var slots = {};
        for(var i = 0, n = this.readInt(true); i < n; i++){
            var slotIndex = this.readInt(true);
            var slotMap = {};
            var timeCount = this.readInt(true);
            for(var ii = 0; ii < timeCount; ii++){
                var timelineType = this.readByte();
                var frameCount = this.readInt(true);
                switch(timelineType){
                    case 0: //SLOT_ATTACHMENT
                    var timeline = new Array(frameCount);
                    for(var frameIndex = 0; frameIndex < frameCount; frameIndex++){
                        var time = this.readFloat();
                        var attachmentName = this.readString();
                        timeline[frameIndex] = {};
                        timeline[frameIndex].time = time;
                        timeline[frameIndex].name = attachmentName;
                    }
                    slotMap.attachment = timeline;
                    duration = Math.max(duration, timeline[frameCount - 1].time);
                    break;
                case 1: //SLOT_COLOR
                    var timeline = new Array(frameCount);
                    for(var frameIndex = 0; frameIndex < frameCount; frameIndex++){
                        var time = this.readFloat();
                        var color = this.readColor();
                        timeline[frameIndex] = {};
                        timeline[frameIndex].time = time;
                        timeline[frameIndex].color = color;
                        if(frameIndex < frameCount - 1){
                            var str = this.readCurve(frameIndex, timeline);
                        }
                    }
                    slotMap.color = timeline;
                    duration = Math.max(duration, timeline[frameCount - 1].time);
                    break;
					/* 3.6 feature
                case 2: //SLOT_TWO_COLOR
                    var timeline = new Array(frameCount);
                    for(var frameIndex = 0; frameIndex < frameCount; frameIndex++){
                        var time = this.readFloat();
                        var light = this.readColor();
                        var dark = this.readColor();
                        timeline[frameIndex] = {};
                        timeline[frameIndex].time = time;
                        timeline[frameIndex].light = light;
                        timeline[frameIndex].dark = dark;
                        if(frameIndex < frameCount - 1){
                            var str = this.readCurve(frameIndex, timeline);
                        }
                    }
                    slotMap.twoColor = timeline;
                    duration = Math.max(duration, timeline[frameCount - 1].time);
                    break;
					*/
                }
            }
            slots[this.json.slots[slotIndex].name] = slotMap;
        }
        animation.slots = slots;

        // Bone timelines.
        var bones = {};
        for(var i = 0, n = this.readInt(true); i < n; i++){
            var boneIndex = this.readInt(true);
            var boneMap = {};
            for(var ii = 0, nn = this.readInt(true); ii < nn; ii++){
                var timelineType = this.readByte();
                var frameCount = this.readInt(true);
                switch(timelineType){
                case 0: //BONE_ROTATE
                    var timeline = new Array(frameCount);
                    for(var frameIndex = 0; frameIndex < frameCount; frameIndex++){
                        var time = this.readFloat();
                        var angle = this.readFloat();
                        timeline[frameIndex] = {};
                        timeline[frameIndex].time = time;
                        timeline[frameIndex].angle = angle;
                        if(frameIndex < frameCount - 1){
                            this.readCurve(frameIndex, timeline);
                        }
                    }
                    boneMap.rotate = timeline;
                    duration = Math.max(duration, timeline[frameCount - 1].time);
                    break;
                case 1: //BONE_TRANSLATE
                case 2: //BONE_SCALE
                case 3: //BONE_SHEAR
                    var timeline = new Array(frameCount);
                    var timelineScale = 1;
                    if(timelineType == 1){ //BONE_TRANSLATE
                        timelineScale = scale;
                    }
                    for(var frameIndex = 0; frameIndex < frameCount; frameIndex++){
                        var tltime = this.readFloat();
                        var tlx = this.readFloat();
                        var tly = this.readFloat();
                        timeline[frameIndex] = {};
                        timeline[frameIndex].time = tltime;
                        timeline[frameIndex].x = tlx * timelineScale;
                        timeline[frameIndex].y = tly * timelineScale;
                        if(frameIndex < frameCount - 1){
                            this.readCurve(frameIndex, timeline);
                        }
                    }
                    if(timelineType == 1){
                        boneMap.translate = timeline;
                    }else if(timelineType == 2){
                        boneMap.scale = timeline;
                    }else{
                        boneMap.shear = timeline;
                    }
                    duration = Math.max(duration, timeline[frameCount - 1].time);
                    break;
                }
            }
            bones[this.json.bones[boneIndex].name] = boneMap;
        }
        animation.bones = bones;

        // IK timelines.
        var ik = {};
        for(var i = 0, n = this.readInt(true); i < n; i++){
            var ikIndex = this.readInt(true);
            var frameCount = this.readInt(true);
            var timeline = new Array(frameCount);
            for(var frameIndex = 0; frameIndex < frameCount; frameIndex++){
                var time = this.readFloat();
                var mix = this.readFloat();
                var bendPositive = this.readByte() != 255; // 1 = true, -1 (255) = false;
                timeline[frameIndex] = {};
                timeline[frameIndex].time = time;
                timeline[frameIndex].mix = mix;
                timeline[frameIndex].bendPositive = bendPositive;
                if(frameIndex < frameCount - 1){
                    this.readCurve(frameIndex, timeline);
                }
            }
            ik[this.json.ik[ikIndex].name] = timeline;
            duration = Math.max(duration, timeline[frameCount - 1].time);
        }
        animation.ik = ik;

        // Transform timelines.
        var transform = {};
        for(var i = 0, n = this.readInt(true); i < n; i++){
            var transformIndex = this.readInt(true);
            var frameCount = this.readInt(true);
            var timeline = new Array(frameCount);
            for(var frameIndex = 0; frameIndex < frameCount; frameIndex++){
                timeline[frameIndex] = {};
                timeline[frameIndex].time = this.readFloat();
                timeline[frameIndex].rotateMix = this.readFloat();
                timeline[frameIndex].translateMix = this.readFloat();
                timeline[frameIndex].scaleMix = this.readFloat();
                timeline[frameIndex].shearMix = this.readFloat();
                if(frameIndex < frameCount - 1){
                    this.readCurve(frameIndex, timeline);
                }
            }
            transform[this.json.transform[transformIndex].name] = timeline;
            duration = Math.max(duration, timeline[frameCount - 1].time);
        }
        animation.transform = transform;

        // Path timelines.
        var paths = {}
        for(var i = 0, n = this.readInt(true); i < n; i++){
            var pathIndex = this.readInt(true);
            var pathConst = this.json.path[pathIndex];
            var pathMap ={};
            for(var ii = 0, nn = this.readInt(true); ii < nn; ii++){
                var timelineType = this.readByte();
                var frameCount = this.readInt(true);
                switch(timelineType){
                case 0: //PATH_POSITION
                case 1: //PATH_SPACING
                    var timeline = new Array(frameCount);
                    var timelineScale = 1;
                    if(timelineType == 1){ //PATH_SPACING
                        if(pathConst.spacingMode == "length" || pathConst.spacingMode == "fixed"){
                            timelineScale = this.scale;
                        }
                    }else{ //PATH_POSITION
                        if(pathConst.positionMode == "fixed"){
                            timelineScale = this.scale;
                        }
                    }
                    for(var frameIndex = 0; frameIndex < frameCount; frameIndex++){
                        var time = this.readFloat();
                        var f = this.readFloat();
                        timeline[frameIndex] = {}
                        timeline[frameIndex].time = time;
                        if(timelineType == 0){
                            timeline[frameIndex].position = f * timelineScale;
                        }else{
                            timeline[frameIndex].spacing = f * timelineScale;
                        }
                        if(frameIndex < frameCount - 1)
                            this.readCurve(frameIndex, timeline);
                    }
                    if(timelineType == 0){
                        pathMap.position = timeline;
                    }else{
                        pathMap.spacing = timeline;
                    }
                    duration = Math.max(duration, timeline[frameCount - 1].time);
                    break;
                case 2: //PATH_MIX
                    var timeline = new Array(frameCount);
                    for(var frameIndex = 0; frameIndex < frameCount; frameIndex++){
                        var time = this.readFloat();
                        var rotateMix = this.readFloat();
                        var translateMix = this.readFloat();
                        timeline[frameIndex] = {}
                        timeline[frameIndex].time = time;
                        timeline[frameIndex].rotateMix = rotateMix;
                        timeline[frameIndex].translateMix = translateMix;
                        if(frameIndex < frameCount - 1)
                            this.readCurve(frameIndex, timeline);
                    }
                    pathMap.mix = timeline;
                    duration = Math.max(duration, timeline[frameCount - 1].time);
                    break;
                }
            }
            paths[this.json.path[pathIndex].name] = pathMap;
        }
        animation.paths = paths;

        // Deform timelines.
        var deform = {};
        for(var i = 0, n = this.readInt(true); i < n; i++){
            var skinIndex = this.readInt(true);
            var skinName = this.json.skinsName[skinIndex];
            var skin = {};
            for(var ii = 0, nn = this.readInt(true); ii < nn; ii++){
                var slotIndex = this.readInt(true);
                var slotAtt = this.json.slots[slotIndex];
                var slot = {}
                for(var iii = 0, nnn = this.readInt(true); iii < nnn; iii++){
                    var meshName = this.readString();
                    var frameCount = this.readInt(true);
                    var timeline = new Array(frameCount);
                    for (var frameIndex = 0; frameIndex < frameCount; frameIndex++){
                        var time = this.readFloat();
                        var end = this.readInt(true);
                        timeline[frameIndex] = {};
                        timeline[frameIndex].time = time;
                        if(end != 0){
                            var vertices = new Array(end);
                            var start = this.readInt(true);
                            if (this.scale == 1){
                                for (var v = 0; v < end; v++){
                                    vertices[v] = this.readFloat();
                                }
                            }else{
                                for (var v = 0; v < end; v++){
                                    vertices[v] = this.readFloat() * this.scale;
                                }
                            }
                            timeline[frameIndex].offset = start;
                            timeline[frameIndex].vertices = vertices;
                        }
                        if(frameIndex < frameCount - 1)
                            this.readCurve(frameIndex, timeline);
                    }
                    slot[meshName] = timeline;
                    duration = Math.max(duration, timeline[frameCount - 1].time);
                }
                skin[slotAtt.name] = slot;
            }
            deform[skinName] = skin;
        }
        animation.deform = deform;

        // Draw order timeline.
        var drawOrderCount = this.readInt(true);
        if(drawOrderCount > 0){
            var drawOrders = new Array(drawOrderCount);
            // var timeline = new Array(drawOrderCount);
            // var slotCount = this.json.slots.length;
            for(var i = 0; i < drawOrderCount; i++){
                var drawOrderMap = {};
                var time = this.readFloat();
                var offsetCount = this.readInt(true);
                // var drawOrder = new Array(slotCount);
                // for(var ii = slotCount - 1; ii >= 0; ii--){
                //     drawOrder[ii] = -1;
                // }
                // var unchanged = new Array(slotCount - offsetCount);
                // var originalIndex = 0, unchangedIndex = 0;
                var offsets = new Array(offsetCount);
                for(var ii = 0; ii < offsetCount; ii++){
                    var offsetMap = {};
                    var slotIndex = this.readInt(true);
                    offsetMap.slot = this.json.slots[slotIndex].name;
                    // while (originalIndex != slotIndex)
                    //     unchanged[unchangedIndex++] = originalIndex++;
                    var dooffset = this.readInt(true);
                    offsetMap.offset = dooffset;
                    // drawOrder[originalIndex + dooffset] = originalIndex++;
                    offsets[ii] = offsetMap;
                }
                drawOrderMap.offsets = offsets;

                // while(originalIndex < slotCount)
                //     unchanged[unchangedIndex++] = originalIndex++;
                // for (var ii = slotCount - 1; ii >= 0; ii--){
                //     if (drawOrder[ii] == -1)
                //         drawOrder[ii] = unchanged[--unchangedIndex];
                // }
                // var tltime = this.readFloat();
                drawOrderMap.time = time;
                drawOrders[i] = drawOrderMap;
            }
            duration = Math.max(duration, drawOrders[drawOrderCount - 1].time);
            animation.drawOrder = drawOrders;
        }

        // Event timeline.
        var eventCount = this.readInt(true);
        if(eventCount > 0){
            var events = new Array(eventCount);
            for(var i = 0; i < eventCount; i++){
                var time = this.readFloat();
                var name = this.json.eventsName[this.readInt(true)];
                var eventData = this.json.events[name];
                var e = {};
                e.name = name;
                e.int = this.readInt(false);
                e.float = this.readFloat();
                e.string = this.readBoolean() ? this.readString() : "";
                e.time = time;
                events[i] = e;
            }
            duration = Math.max(duration, events[eventCount - 1].time);
            animation.events = events;
        }
        return animation;
    }
}

var BlendMode = ["normal", "additive", "multiply", "screen"];

var AttachmentType = ["region", "boundingbox", "mesh", "linkedmesh", "path", "point", "clipping"];

var TransformMode = ["normal", "onlyTranslation", "noRotationOrReflection", "noScale", "noScaleOrReflection"];

var PositionMode = ["fixed", "percent"];

var SpacingMode = ["length", "fixed", "percent"];

var RotateMode = ["tangent", "chain", "chainScale"];