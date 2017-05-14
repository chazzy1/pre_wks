
var $J1 = (function (module){
	var _p = module._p = module._p || {};

	_p.relationAreaPaddingMap = {};


    _p.processRelationToolUIReset = function(){
        $("#relationToolRightSideBar").css("display","");
        $("#mentionToolRightSideBar").css("display","none");
        activateRelationToolDocumentUI();
    };

    _p.resetRelationTypeList = function(){
        $("#list-relation-type").empty();
        for (var id in _p.loadedRelationPropLabelMap){
            var relation = _p.loadedRelationPropLabelMap[id];
            drawRelationTypeItem(relation);
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

        jqSimpleConnect.removeAll();
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

    }

    function addRelationAreaPadding(sentenceEle,tokenEle,paddingAreaId){
        tokenEle.append('<span class="gtcTokenRelationMargin"></span>');
        _p.relationAreaPaddingMap[_p.getObjectId(sentenceEle)][paddingAreaId] = tokenEle;
    };


    function drawRelationTypeItem(item){
        var style = "border-color:" + item.backGroundColor + "; color:"+item.color;
        var hotkey = item.hotkey;
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
            var relationProp = _p.loadedRelationPropLabelMap[relation.type];


            var label = relation.type;
            if (_p.currentTypeSystemMode == "L" && relationProp.logical_value) {
                label = relationProp.logical_value;
            };


            var relationLabelEle = $('<div class="relationLabel">'+label+'</div>');

            relationLabelEle.css("border-color",relationProp.backGroundColor);

            sentenceEle.append(relationLabelEle);

            //표시들이 중첩안되게 간격을 벌려준다.
            var labelTopOffset = 30;
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


            jqSimpleConnect.connect(parentMarkerEle, relationLabelEle, {radius: 2,roundedCorners: true,anchorA: 'vertical',anchorB: 'horizontal'});
            jqSimpleConnect.connect(relationLabelEle, childMarkerEle, {radius: 2,roundedCorners: true,anchorA: 'horizontal',anchorB: 'vertical'});



        };
    };



    _p.processTokenEntityTypeMarkerSelection = function(markerEle){
        console.log(markerEle)


    };

	return module;
}($J1 || {}));