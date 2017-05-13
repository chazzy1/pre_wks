
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
        var relationLabel = {};
        for (var id in _p.loadedRelationTypesIdMap){
            var relation = _p.loadedRelationTypesIdMap[id];
            //relation 은 중복되서 여러개 들어있으므로...
            if (!relationLabel[relation.label]){
                drawRelationTypeItem(relation);
                relationLabel[relation.label] = 1;
            }
        };
    };

    function activateRelationToolDocumentUI(){
        $("#document-holder").find(".gtcSentence").each(function(index,ele){
            var ele = $(ele);
            _p.relationAreaPaddingMap[_p.getObjectId(ele)] = {};
            addRelationAreaPadding(ele);

        });

    };



    function addRelationAreaPadding(sentenceEle){
        var lastTop = null;
        var paddingCount = 0;
        sentenceEle.find(".gtcToken").each(function(index,ele){
            ele = $(ele);
            if (ele.hasClass("entityTypeAssigned")){
                if (!lastTop || (Math.abs(ele.position().top - lastTop) > 20) ){
                    lastTop = ele.position().top;
                    ele.append('<span class="gtcTokenRelationMargin"></span>');

                    _p.relationAreaPaddingMap[_p.getObjectId(sentenceEle)][paddingCount] = ele;

                    paddingCount++;


                }

            }

        });
    }

    function drawRelationTypeItem(item){
        var style = "border-color:" + item.sireProp.backGroundColor + "; color:"+item.sireProp.color;
        var hotkey = item.sireProp.hotkey;
        if (!hotkey) {
            hotkey = "-";
        };
        var item = $('<div gtcRelationLabel="'+item.label+'" id="'+item.id+'" class="gtcRelationType"><div class="itemRelationIcon" style="'+style+'">'+hotkey+'</div><div class="itemLabel">'+item.label+'</div></div>');
        $("#list-relation-type").append(item);
    };

	return module;
}($J1 || {}));