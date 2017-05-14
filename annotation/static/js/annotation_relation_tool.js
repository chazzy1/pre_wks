
var $J1 = (function (module){
	var _p = module._p = module._p || {};

	_p.relationAreaPaddingMap = {};

    _p.relationToolModeEnum = {
        nothingSelected:0,
        parentSelected:1,
        childSelected:2,
        relationLabelSelected:3
    };

    _p.currentRelationToolMode = _p.relationToolModeEnum.nothingSelected;


    _p.processRelationToolUIReset = function(){
        $("#relationToolRightSideBar").css("display","");
        $("#mentionToolRightSideBar").css("display","none");
        activateRelationToolDocumentUI();
        _p.currentRelationToolMode = _p.relationToolModeEnum.nothingSelected;

    };

    _p.resetRelationTypeList = function(list){
        $("#list-relation-type").empty();
        if (!list) {
            list = _p.loadedRelationPropLabelMap;
        };

        var labelMap = {};

        for (var id in list){
            var relation = list[id];
            if (relation.label in labelMap){

            } else {
                drawRelationTypeItem(relation);
                labelMap[relation.label] = 1;
            }


        };

    };

    function activateRelationToolDocumentUI(){
        _p.currentToolMode = _p.toolModeEnum.relationTool;
        _p.clearRelationDrawingArea();
        $("#document-holder").find(".gtcSentence").each(function(index,ele){
            var ele = $(ele);
            _p.relationAreaPaddingMap[_p.getObjectId(ele)] = {};
            resetRelationDrawingArea(ele);
        });


        //여기서, 읽어온 relation 을 그려주는 작업을 해야한다.
        _p.resetRelationDisplay();

        _p.clearMentionTargetSelection();
        _p.activeSelection = null;
    };

    _p.clearRelationDrawingArea = function(){
        $("#document-holder").find(".tokenEntityTypeMarker").each(function(index,ele){
            ele = $(ele);
            ele.remove();

        });
        $("#document-holder").find(".relationLabel").remove();
        $("#document-holder").find(".relationTarget").each(function(index,ele){
            ele = $(ele);
            ele.removeClass("relationTarget");

        });
        jsPlumb.deleteEveryConnection();
    }



    function resetRelationDrawingArea(sentenceEle){
        var lastTop = null;
        var paddingCount = 0;
        var lastMentionId = null;
        sentenceEle.find(".gtcToken").each(function(index,ele){
            ele = $(ele);
            if (ele.hasClass("entityTypeAssigned")){
                //line break가 있다면 padding 을 추가해야하는지 조사한다.
                if (!lastTop || (Math.abs(ele.position().top - lastTop) > 20) ){
                    lastTop = ele.position().top;
                    addRelationAreaPadding(sentenceEle,ele,paddingCount);
                    paddingCount++;
                };

                //색깔 등을 지움.
                ele.css("background-color","");
                ele.css("color","");

                var mentionId = ele.attr("mentionId");
                if (mentionId != lastMentionId){
                    addTokenEntityTypeMarker(sentenceEle,ele);
                    lastMentionId = mentionId;
                }
            }

        });
    };

    function addTokenEntityTypeMarker(sentenceEle,tokenEle){
        var entityTypeLabel = tokenEle.attr("entityTypeLabel");
        var entityType = _p.loadedEntityTypesLabelMap[entityTypeLabel];

        if (_p.currentTypeSystemMode == "L" && entityType.logical_value) {
            entityTypeLabel = entityType.logical_value;
        };

        var tokenEntityTypeMarker = $('<div class="tokenEntityTypeMarker">'+entityTypeLabel+'</div>');
        tokenEntityTypeMarker.css("background-color",entityType.sireProp.backGroundColor);
        tokenEntityTypeMarker.css("color",entityType.sireProp.color);
        tokenEntityTypeMarker.css("border-color",entityType.sireProp.backGroundColor);
        sentenceEle.append(tokenEntityTypeMarker);
        tokenEntityTypeMarker.css("left",tokenEle.position().left);
        tokenEntityTypeMarker.css("top",tokenEle.position().top-30);
        tokenEntityTypeMarker.css("width",tokenEle.width());

        tokenEntityTypeMarker.attr("mentionId",tokenEle.attr("mentionId"));
        tokenEntityTypeMarker.attr("entityTypeLabel",tokenEle.attr("entityTypeLabel"));

    }

    function addRelationAreaPadding(sentenceEle,tokenEle,paddingAreaId){
        tokenEle.append('<span class="gtcTokenRelationMargin"></span>');
        _p.relationAreaPaddingMap[_p.getObjectId(sentenceEle)][paddingAreaId] = tokenEle;
    };


    function drawRelationTypeItem(item){
        var style = "border-color:" + item.sireProp.backGroundColor + "; color:"+item.sireProp.color;
        var hotkey = item.sireProp.hotkey;
        if (!hotkey) {
            hotkey = "-";
        };

        var label = item.label;
        if (_p.currentTypeSystemMode == "L" && item.logical_value) {
            label = item.logical_value;
        };


        var item = $('<div gtcRelationLabel="'+item.label+'" id="'+item.id+'" class="gtcRelationType"><div class="itemRelationIcon" style="'+style+'">'+hotkey+'</div><div class="itemLabel">'+label+'</div></div>');
        $("#list-relation-type").append(item);
    };



    _p.resetRelationDisplay = function(){


        var relations = _p.loadedGroundTruth.relations;
        var relationLabelStackCount = 1;
        var lastMarkerTop = null;
        for (var k in relations){
            var relation = relations[k];
            var parentMarkerId = relation.args[0];
            var childMarkerId = relation.args[1]

            var parentMarkerEle = $($('div[mentionId="'+parentMarkerId+'"]')[0]);

            var childMarkerEle = $($('div[mentionId="'+childMarkerId+'"]')[0]);
            var sentenceEle = $(parentMarkerEle.closest(".gtcSentence"));
            var relationType = _p.loadedRelationPropLabelMap[relation.type];


            var label = relation.type;
            if (_p.currentTypeSystemMode == "L" && relationType.logical_value) {
                label = relationType.logical_value;
            };


            var relationLabelEle = $('<div class="relationLabel">'+label+'</div>');

            relationLabelEle.css("border-color",relationType.sireProp.backGroundColor);

            sentenceEle.append(relationLabelEle);

            //표시들이 중첩안되게 간격을 벌려준다.
            var labelTopOffset = 50;
            if (Math.abs(lastMarkerTop - parentMarkerEle.position().top) < 20){
                //같은 줄인걸로 판정.
                labelTopOffset = labelTopOffset + (relationLabelStackCount * 30) ;
                relationLabelStackCount ++;
            } else {
                //다른줄이 시작됐다면.
                relationLabelStackCount = 1;
            };
            lastMarkerTop = parentMarkerEle.position().top;

            relationLabelEle.css("top",parentMarkerEle.position().top - labelTopOffset);

            var parentLeft = parentMarkerEle.position().left;
            var childLeft = childMarkerEle.position().left;
            var left =  (parentLeft < childLeft) ? parentLeft : childLeft;

            relationLabelEle.css("left",Math.abs(parentLeft - childLeft)/2 + left );

            var lableInDirection = null;
            var lableOutDirection = null;
            if (parentLeft <childLeft) {
                lableInDirection = "Left";
                lableOutDirection = "Right";
            } else {
                lableInDirection = "Right";
                lableOutDirection = "Left";
            }

            jsPlumb.setContainer($("body"));



            jsPlumb.connect({ source:parentMarkerEle,
                target:relationLabelEle,
                anchors:[ "Top",lableInDirection ],
                paintStyle:{ strokeWidth:1, stroke:"rgb(131,8,135)" },
                endpoint:["Dot", { radius:1 }],
                connector:["Flowchart" , {cornerRadius:10}]
            });


            jsPlumb.connect({ source:relationLabelEle,
                target:childMarkerEle,
                anchors:[ lableOutDirection,"Top" ],
                paintStyle:{ strokeWidth:1, stroke:"rgb(131,8,135)" },
                endpoint:["Dot", { radius:1 }],
                connector:["Flowchart" , {cornerRadius:10}]
            });





        }
    };



    _p.processTokenEntityTypeMarkerSelection = function(markerEle){
        console.log(markerEle);
        var entityTypeLabel = markerEle.attr("entityTypeLabel");
        console.log(entityTypeLabel);
        var parentEntityType = _p.loadedEntityTypesLabelMap[entityTypeLabel];
        var parentRelations = $.map(_p.loadedRelationTypesIdMap, function(e){
            if (e.srcEntType == parentEntityType.id) {
                return e;
            }
        });
        console.log(parentRelations)
        _p.resetRelationTypeList(parentRelations);

        var childEntityTypeIdMap = {};

        for (var k in parentRelations){
            var relationType = parentRelations[k];
            if (!(relationType.tgtEntType in childEntityTypeIdMap)){
                childEntityTypeIdMap[relationType.tgtEntType] = 1;

            }
        };

        console.log(childEntityTypeIdMap);



        //일단 전부 불투명하게 해둔다.
        $("#document-holder").find(".tokenEntityTypeMarker , .relationLabel").each(function(index,ele){
            var ele = $(ele);
            ele.css("opacity","0.2");
        });

        $("#relationLineDrawingArea").find(".jsSimpleConnect").each(function(index,ele){
            var ele = $(ele);
            ele.css("opacity","0.2");
        });


        $(".tokenEntityTypeMarker").each(function(index,childMarkerEle){
            var childMarkerEle = $(childMarkerEle);
            var entityTypeLabel = childMarkerEle.attr("entityTypeLabel");
            var childEntityType = _p.loadedEntityTypesLabelMap[entityTypeLabel];
            if (childEntityType.id in childEntityTypeIdMap){
                if (!childMarkerEle.is(markerEle)){
                    childMarkerEle.css("opacity","1");
                    childMarkerEle.addClass("relationTarget");

                }



            } else {
                childMarkerEle.css("opacity","0.2");
            }

        });


    _p.processSelectRelation = function(relationInfo){

        var parentEntityTypeLabel = relationInfo.parent.attr("entityTypeLabel");
        var childEntityTypeLabel = relationInfo.child.attr("entityTypeLabel");

        var parentEntityTypeId = _p.loadedEntityTypesLabelMap[parentEntityTypeLabel].id;
        var childEntityTypeId = _p.loadedEntityTypesLabelMap[childEntityTypeLabel].id;


        var validRelations = $.map(_p.loadedRelationTypesIdMap, function(e){
            if (e.srcEntType == parentEntityTypeId && e.tgtEntType == childEntityTypeId) {
                return e;
            }
        });

        _p.resetRelationTypeList(validRelations);

    }

    _p.processRelationCreation = function(relationInfo,selectedRelationTypeEle){
        var parentMentionId = relationInfo.parent.attr("mentionId");
        var childMentionId = relationInfo.child.attr("mentionId");
        var relationLabel = selectedRelationTypeEle.attr("gtcRelationLabel");

        var sentenceEle = $(relationInfo.parent.closest(".gtcSentence"));
        var sentenceId = sentenceEle.attr("sentenceId");
        var newRelationId = getNextRelationId();
        var newRelation = {
            "id" : sentenceId+"-r"+getNextRelationId(),
            "properties" : { },
            "type" : relationLabel,
            "args" : [ parentMentionId, childMentionId ]
        };


        var previousRelations = $.map(_p.loadedGroundTruth.relations, function(e){
            if (e.type == relationLabel && e.args[0] == parentMentionId && e.args[1] == childMentionId) {
                return e;
            }
        });
        if (previousRelations.length < 1){
            _p.loadedGroundTruth.relations.push(newRelation);
        };



    }

    function getNextRelationId(){
        var relations = _p.loadedGroundTruth.relations;
        var maxId = 0;
        for (var k in relations){
            var relation = relations[k];
            var id = relation.id.split("-")[1].replace("r","");
            id = id *1;
            if (id > maxId) {
                maxId = id;
            }
        }
        return maxId + 1;
    };


    };

	return module;
}($J1 || {}));