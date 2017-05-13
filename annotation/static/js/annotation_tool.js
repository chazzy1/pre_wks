
var $J1 = (function (module){
	var _p = module._p = module._p || {};

    _p.projectId = null;

    _p.loadedEntityTypesIDMap={};
    _p.loadedDocument={};
    _p.loadedSireInfo={};
    _p.activeSelection=null;
    _p.sentencesIdMap = {};




    _p.init = function(projectId,documentId){

        console.log(projectId,documentId);
        _p.projectId = projectId

        data={};
        data.project_id=projectId;
        data.document_id=documentId;


        getEntityTypeList(data)
        .done(function(result){
            if (result.resultOK) {
                for (var k in result.list) {
                    var entityType = result.list[k];
                    _p.loadedEntityTypesIDMap[entityType.id] = entityType;
                };
            } else {
                alert(result.message);
            }

            resetEntityTypeList();
        });


        getDocument(data)
        .done(function(result){
            _p.loadedDocument = result.document;
            for (var k in _p.loadedDocument.sentences){
                var sentence = _p.loadedDocument.sentences[k];
                _p.sentencesIdMap[sentence.id] = sentence;
            };
            console.log(_p.loadedDocument);
            resetDocument();
        });

        getSireInfo(data)
        .done(function(result){
            _p.loadedSireInfo = result.sireInfo;
            resetMentionTypeClass();
        });

        setupUIEvent();

    };

    function setupUIEvent(){
        $("#document-holder").off("click","**");
        $("#document-holder").on("click","span",function(event){
            var ele = $(this);
            processDocumentClickEvent(ele,event);
        });

        $("#toolbar").off("click","**");
        $("#toolbar").on("click","div, button",function(event){
            var ele = $(this);
            processToolbarClickEvent(ele,event);
        });

        $("#rightSideBar").off("click","**");
        $("#rightSideBar").on("click","div",function(event){
            var ele = $(this);
            processRightSideBarClickEvent(ele,event);
        });


        $(document).bind("keydown",function(event){
            processKeyDownEvent(event);
        });

    };



    function getEntityTypeList(data){
        return $.ajax({
            url: Flask.url_for('annotator.get_entity_type_list', {project_id: data.project_id})
            ,type: 'POST'
            ,contentType: "application/json;charset=utf-8"
            ,dataType: 'json'
            ,data: JSON.stringify(data)
            ,beforeSend:function(){

            }
        })
    };

    function getDocument(data){
        return $.ajax({
            url: Flask.url_for('annotator.get_document', {project_id: data.project_id})
            ,type: 'POST'
            ,contentType: "application/json;charset=utf-8"
            ,dataType: 'json'
            ,data: JSON.stringify(data)
            ,beforeSend:function(){

            }
        })
    };

    function getSireInfo(data){
        return $.ajax({
            url: Flask.url_for('annotator.get_sire_info', {project_id: data.project_id})
            ,type: 'POST'
            ,contentType: "application/json;charset=utf-8"
            ,dataType: 'json'
            ,data: JSON.stringify(data)
            ,beforeSend:function(){

            }
        })
    };

    function saveAll(data){
        return $.ajax({
            url: Flask.url_for('annotator.save_all', {project_id: _p.projectId})
            ,type: 'POST'
            ,contentType: "application/json;charset=utf-8"
            ,dataType: 'json'
            ,data: JSON.stringify(data)
            ,beforeSend:function(){

            }
        })
    };

    function processDocumentClickEvent(ele,event){
        if (ele.hasClass("gtcToken")){
            event.stopPropagation();

            processTokenSelection(ele);

        }

    };


    function processToolbarClickEvent(ele,event){
        if (ele.is("#btnTest1")){
            var from = $("#selectionFrom").val();
            var to = $("#selectionTo").val();
            drawMentionTargetSelection('s0',from,to);
            event.stopPropagation();

        };
        if (ele.is("#btnSave")){
            event.stopPropagation();
            data={};
            data.project_id=_p.projectId;
            data.ground_truth_id=_p.loadedDocument.id;

            data.saveData = {};

            data.saveData.mentions = _p.loadedDocument.mentions;
            data.saveData.relations = _p.loadedDocument.relations;
            data.saveData.corefs = _p.loadedDocument.corefs;

            console.log(data)
            saveAll(data)
            .done(function(result){

            });

        };
    };

    function processRightSideBarClickEvent(ele,event){
        if (ele.hasClass("gtcEntityType")){
            event.stopPropagation();

            processEntityTypeAssignment(ele);

        }
    }

    function processKeyDownEvent(event){
        if (event.keyCode == 27) {
            if (_p.activeSelection) {
                clearMentionTargetSelection();
                _p.activeSelection = null;

            }

        }
    }

    function resetDocument(){
        $("#document-name").empty();
        $("#document-holder").empty();
        $("#document-name").html(_p.loadedDocument.name);

        for (var k in _p.loadedDocument.sentences) {
            sentence = _p.loadedDocument.sentences[k];
            drawSentence(sentence, k);
        }
    };

    function resetMentionTypeClass(){
        $("#list-mention-type").empty();
        for (var k in _p.loadedSireInfo.entityProp.mentionType) {
            mentionType = _p.loadedSireInfo.entityProp.mentionType[k];
            drawMentionType(mentionType);
        };
        $("#list-mention-class").empty();
        for (var k in _p.loadedSireInfo.entityProp.clazz) {
            mentionClass = _p.loadedSireInfo.entityProp.clazz[k];
            drawMentionClass(mentionClass);
        }

    };

    function drawMentionClass(item){
        var style = "background-color:" + item.backGroundColor + "; color:"+item.color;
        var item = $('<div><div class="itemIcon" style="'+style+'">'+item.hotkey+'</div><div class="itemLabel">'+item.name+'</div></div>')
        $("#list-mention-class").append(item);
    };

    function drawMentionType(item){
        var style = "background-color:" + item.backGroundColor + "; color:"+item.color;
        var item = $('<div><div class="itemIcon" style="'+style+'">'+item.hotkey+'</div><div class="itemLabel">'+item.name+'</div></div>')
        $("#list-mention-type").append(item);
    };

    function drawEntityTypeItem(item){
        var style = "background-color:" + item.sireProp.backGroundColor + "; color:"+item.sireProp.color;
        var item = $('<div id="'+item.id+'" class="gtcEntityType"><div class="itemIcon" style="'+style+'">'+item.sireProp.hotkey+'</div><div class="itemLabel">'+item.label+'</div></div>')
        $("#list-entity-type").append(item);
    };

    function drawSentence(sentence,index){
        var sentenceId = "gtcSentence-" + sentence.id;
        var sentenceEle = $('<div id="'+sentenceId+'" class="gtcSentence"></div>')
        var sentenceIndexEle = $('<div class="sentenceNumber">'+index+'</div>');
        sentenceEle.append(sentenceIndexEle);
        $("#document-holder").append(sentenceEle);
        for (var k=0; k<sentence.tokens.length; k++){
            var token = sentence.tokens[k];
            drawToken(sentenceEle,token);
            if (k+1 <= sentence.tokens.length) {
                drawBlank(sentenceEle,token,sentence.tokens[k+1]);
            }
        }
    };

    function drawToken(sentenceEle,token){
        var tokenId = "gtcToken-"+token.id;
        var tokenEle = $('<span id="'+tokenId+'" class="gtcToken" ></span>');
        var tokenTextEle = $('<span class="gtcTokenText">'+token.text+'</span>')

        var tokenSelectionEle = $('<span style="display:none" class="gtcTokenSelection"></span>')

        tokenEle.append(tokenTextEle);
        tokenEle.append(tokenSelectionEle);
        tokenEle.append("<wbr>");

        sentenceEle.append(tokenEle);

        tokenSelectionEle.css("width",tokenTextEle.outerWidth()+2);
        tokenSelectionEle.css("height",tokenTextEle.height()+1);
        tokenSelectionEle.css("left","-1px");
        tokenSelectionEle.css("top","-2px");
    };

    function drawBlank(sentenceEle,token,nextToken){

        if (nextToken && nextToken.begin - token.end) {
            var tokenId = "gtcToken-ws-b"+token.end;
            var tokenEle = $('<span id="'+tokenId+'" class="gtcToken" ></span>');
            var tokenTextEle = $('<span class="gtcTokenText"> </span>')
            var tokenSelectionEle = $('<span style="display:none" class="gtcTokenSelection"></span>')

            tokenEle.append(tokenTextEle);
            tokenEle.append(tokenSelectionEle);

            sentenceEle.append(tokenEle);

            tokenSelectionEle.css("width",tokenTextEle.outerWidth()+6);
            tokenSelectionEle.css("height",tokenTextEle.height()+1);
            tokenSelectionEle.css("left","-1px");
            tokenSelectionEle.css("top","-2px");
        }
    };

    function resetEntityTypeList(){
        $("#list-entity-type").empty();
        for (var id in _p.loadedEntityTypesIDMap){
            drawEntityTypeItem(_p.loadedEntityTypesIDMap[id]);
        };
    };

    function processEntityTypeAssignment(ele){
        ele = $(ele);
        if (_p.activeSelection){
            var entityTypeId = _p.getObjectId(ele);
            console.log(entityTypeId)
            console.log(_p.activeSelection)
            var mentionTypes = _p.loadedSireInfo.entityProp.mentionType;
            var mentions = _p.loadedDocument.mentions;
            var newMention = getBaseMentionObject();
            var mentionIndex = mentions.length;

            newMention.id = _p.activeSelection.sentenceId+"-"+"m"+mentionIndex;

            var entityType = _p.loadedEntityTypesIDMap[entityTypeId]
            var entityTypeLabel =entityType.label;

            newMention.type = entityTypeLabel;
            newMention.begin = _p.activeSelection.begin;
            newMention.end = _p.activeSelection.end;
            newMention.entityTypeId = entityTypeId;
            mentions.push(newMention);

            for (var k in _p.activeSelection.tokens){
                var tokenEle = _p.activeSelection.tokens[k];
                tokenEle.addClass("entityTypeAssigned");
                //tokenEle.addClass("entityTypeId-"+entityTypeId);
                tokenEle.attr("entityTypeId",entityTypeId);
                tokenEle.attr("mentionId",newMention.id);
                tokenEle.css("background-color",entityType.sireProp.backGroundColor);
                tokenEle.css("color",entityType.sireProp.color);
            };

            clearMentionTargetSelection();
            _p.activeSelection = null;






        }
    };




    function processTokenSelection(tokenEle){
        var tokenEleId = _p.getObjectId(tokenEle);
        //gtcToken-s0-t3

        var sentenceId = tokenEleId.split("-")[1];
        var tokenId = tokenEleId.split("-")[1]+"-"+tokenEleId.split("-")[2];
        var sentence = $.grep(_p.loadedDocument.sentences, function(e){ return e.id == sentenceId; })[0];

        if (sentence) {

            if (tokenEle.hasClass("entityTypeAssigned")){
                var entityTypeId = tokenEle.attr("entityTypeId");
                var mention = $.grep(_p.loadedDocument.mentions, function(e){ return e.entityTypeId == entityTypeId; })[0];
                clearMentionTargetSelection();
                drawMentionTargetSelection(sentenceId,mention.begin,mention.end);



            } else {

                var token = $.grep(sentence.tokens, function(e){ return e.id == tokenId; })[0];
                var mentionId = sentenceId + "-m0";
                if (_p.activeSelection && sentenceId == _p.activeSelection.sentenceId){

                    var minPoint = _p.activeSelection.begin;
                    var maxPoint = _p.activeSelection.end;

                    if (token.begin < minPoint ) {
                        minPoint = token.begin;
                    };

                    if (token.end > maxPoint ) {
                        maxPoint = token.end;
                    };
                    _p.activeSelection.begin = minPoint;
                    _p.activeSelection.end = maxPoint;



                    clearMentionTargetSelection();
                    drawMentionTargetSelection(sentenceId,minPoint,maxPoint);

                } else {
                    clearMentionTargetSelection();
                    _p.activeSelection= {"sentenceId":sentenceId, "id":mentionId, "begin":token.begin, "end":token.end, "tokens":{}};


                    drawMentionTargetSelection(sentenceId,token.begin,token.end);

                };
            }



        }

    };

    function clearMentionTargetSelection(){
        $("#document-holder").find(".gtcTokenSelection").each(function(index,ele){
            $(ele).removeClass("gtcTokenSelectionBegin");
            $(ele).removeClass("gtcTokenSelectionEnd");
            $(ele).css("display","none");
        });
    }




    function drawMentionTargetSelection(sentenceId,from,to){
        var sentence = _p.sentencesIdMap[sentenceId];

        for (var k in sentence.tokens){
            var token =  sentence.tokens[k];
            var tokenEle = $("#gtcToken-"+token.id);

            if (from >= token.begin && from <= token.end){
                var tokenTo = to;
                var endMark = true;
                if (tokenTo > token.end){
                    tokenTo = token.end;
                    endMark = false;
                };
                drawTokenSelection(tokenEle,from-token.begin,tokenTo-token.begin,true,endMark);
            } else if (from < token.begin && to > token.end) {
                //앞에 있는 공백까지 같이 막아줌.

                drawPreBlankSelection(tokenEle);

                drawTokenSelection(tokenEle,0,token.end-token.begin,false,false);
            } else if (from < token.begin && to >= token.begin && to <= token.end){
                var tokenFrom = from;
                var beginMark = true;
                tokenFrom = token.begin;
                //앞에 있는 공백까지 같이 막아줌.
                drawPreBlankSelection(tokenEle);
                drawTokenSelection(tokenEle,tokenFrom-token.begin,to-token.begin,false,true);
            }
        }

    }
    function drawPreBlankSelection(tokenEle){
        var blankEle = tokenEle.prev();
        var tokenEleId = _p.getObjectId(blankEle);
        if (_p.activeSelection) {
            _p.activeSelection.tokens[tokenEleId] = blankEle;
        }
        blankEle.find(".gtcTokenSelection").css("display","");
    }

    function drawTokenSelection(tokenEle,from, to, beginMark, endMark){
        var tokenEleId = _p.getObjectId(tokenEle);

        //선택된 토큰들을 한번에 칠해줄려고 이걸 하는데,
        //본 펑션이 나중에 이미 선택된 멘션을 클릭할때도 사용되므로, 그때는 아래의 작업을 안해야함. 그래서 체크한다.
        if (_p.activeSelection) {
            _p.activeSelection.tokens[tokenEleId] = tokenEle;
        };


        var range = document.createRange();
        var textToken = tokenEle.find(".gtcTokenText");
        var textNode = textToken[0].firstChild;
        range.setStart(textNode,from);
        range.setEnd(textNode,to);
        var rects = range.getClientRects()[0];
        var tokenSelectionEle = tokenEle.find(".gtcTokenSelection");

        tokenSelectionEle.css("display","");
        if (beginMark) {
            tokenSelectionEle.addClass("gtcTokenSelectionBegin");
        };
        if (endMark) {
            tokenSelectionEle.addClass("gtcTokenSelectionEnd");
        };

        var leftOffset = tokenEle.offset().left;

        tokenSelectionEle.css("left",rects.left-leftOffset);
        tokenSelectionEle.css("width",rects.width);


    };

    function getBaseMentionObject(){
        //entityTypeId 이거 내가 추가한 속성임.
        return {
            "id" : null,
            "properties" : {
              "SIRE_MENTION_ROLE" : "NONE",
              "SIRE_ENTITY_SUBTYPE" : "NONE",
              "SIRE_MENTION_TYPE" : "NONE",
              "SIRE_MENTION_CLASS" : "NONE"
            },
            "type" : null,
            "begin" : null,
            "end" : null,
            "inCoref" : false,
            "entityTypeId" : null
        }
    }

    _p.getObjectId = function(obj){
        if (!obj){
            return null;
        }
        if (obj instanceof $){
            return obj.attr("id");
        } else {
            return $(obj).attr("id");
        }
    };




	return module;
}($J1 || {}));