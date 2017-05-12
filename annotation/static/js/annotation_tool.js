
var $J1 = (function (module){
	var _p = module._p = module._p || {};


    _p.loadedEntityTypes={};
    _p.loadedDocument={};
    _p.loadedMentions={};
    _p.activeSelection=null;



    _p.init = function(projectId,documentId){

        console.log(projectId,documentId);

        data={};
        data.project_id=projectId;
        data.document_id=documentId;

        getEntityTypeList(data)
        .done(function(result){
            if (result.resultOK) {
                for (var k in result.list) {
                    var entityType = result.list[k];
                    _p.loadedEntityTypes[entityType.id] = entityType;
                };

            } else {
                alert(result.message);
            }

            resetEntityTypeList();
        });


        getDocument(data)
        .done(function(result){
            _p.loadedDocument = result.document;
            console.log(_p.loadedDocument);
            resetDocument();
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



    function processDocumentClickEvent(ele,event){
        if (ele.hasClass("wksToken")){
            event.stopPropagation();

            processTokenSelection(ele);

        }

    };


    function processToolbarClickEvent(ele,event){

        if (ele.is("#btnTest1")){


            var from = $("#selectionFrom").val();
            var to = $("#selectionTo").val();

            drawMentionTargetSelection('s0',from,to);

        }
    };

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

    function drawSentence(sentence,index){
        var sentenceId = "wksSentence-" + sentence.id;
        var sentenceEle = $('<div id="'+sentenceId+'" class="wksSentence"></div>')
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
        var tokenId = "wksToken-"+token.id;
        var tokenEle = $('<span id="'+tokenId+'" class="wksToken" ></span>');
        var tokenTextEle = $('<span class="wksTokenText">'+token.text+'</span>')

        var tokenSelectionEle = $('<span style="display:none" class="wksTokenSelection"></span>')

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
            var tokenId = "wksToken-ws-b"+token.end;
            var tokenEle = $('<span id="'+tokenId+'" class="wksToken" ></span>');
            var tokenTextEle = $('<span class="wksTokenText"> </span>')
            var tokenSelectionEle = $('<span style="display:none" class="wksTokenSelection"></span>')

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
        for (var id in _p.loadedEntityTypes){
            drawEntityTypeItem(_p.loadedEntityTypes[id]);
        };
    };


    function drawEntityTypeItem(item){
        var style = "background-color:" + item.sireProp.backGroundColor + "; color:"+item.sireProp.color;

        var item = $('<div id="'+item.id+'"><div class="itemIcon" style="'+style+'">'+item.sireProp.hotkey+'</div><div class="itemLabel">'+item.label+'</div></div>')

        $("#list-entity-type").append(item);
    };

    function processTokenSelection(tokenEle){
        var tokenEleId = _p.getObjectId(tokenEle);
        //wksToken-s0-t3

        var sentenceId = tokenEleId.split("-")[1];
        var tokenId = tokenEleId.split("-")[1]+"-"+tokenEleId.split("-")[2];
        var sentence = $.grep(_p.loadedDocument.sentences, function(e){ return e.id == sentenceId; })[0];

        if (sentence) {
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
                _p.activeSelection= {"sentenceId":sentenceId, "id":mentionId, "begin":token.begin, "end":token.end};

                drawMentionTargetSelection(sentenceId,token.begin,token.end);

            };

        }















    };

    function clearMentionTargetSelection(){
        $("#document-holder").find(".wksTokenSelection").each(function(index,ele){
            $(ele).removeClass("wksTokenSelectionBegin");
            $(ele).removeClass("wksTokenSelectionEnd");
            $(ele).css("display","none");
        });
    }




    function drawMentionTargetSelection(sentenceId,from,to){

        var sentencesIdMap = {};
        for (var k in _p.loadedDocument.sentences){
            var sentence = _p.loadedDocument.sentences[k];
            sentencesIdMap[sentence.id] = sentence;
        };

        var sentence = sentencesIdMap[sentenceId];

        for (var k in sentence.tokens){
            var token =  sentence.tokens[k];
            var tokenEle = $("#wksToken-"+token.id);
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
        tokenEle.prev().find(".wksTokenSelection").css("display","");
    }

    function drawTokenSelection(tokenEle,from, to, beginMark, endMark){

        var range = document.createRange();
        var textToken = tokenEle.find(".wksTokenText");
        var textNode = textToken[0].firstChild;
        range.setStart(textNode,from);
        range.setEnd(textNode,to);
        var rects = range.getClientRects()[0];

        var tokenSelectionEle = tokenEle.find(".wksTokenSelection");

        tokenSelectionEle.css("display","");
        if (beginMark) {
            tokenSelectionEle.addClass("wksTokenSelectionBegin");
        };
        if (endMark) {
            tokenSelectionEle.addClass("wksTokenSelectionEnd");
        };

        var leftOffset = tokenEle.offset().left;

        tokenSelectionEle.css("left",rects.left-leftOffset);
        tokenSelectionEle.css("width",rects.width);


    };

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