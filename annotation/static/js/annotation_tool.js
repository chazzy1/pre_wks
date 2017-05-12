
var $J1 = (function (module){
	var _p = module._p = module._p || {};


	//다른 모듈과 공유할 private 변수들
    _p.loadedEntityTypes={};
    _p.loadedDocument={};


	//본 모듈에서만 사용되는 변수들


    var UIEventEnum = {
            nothingSelected:0,
            objectContainerSelected:1,
            attrSelected:2,
            attrEditMode:3,
            relationContainerSelected:4,
            creatingRelationMode:5,
            creatingNIRelationMode:6,
            objectContainerMultiSelected:7,
            creatingSubtypeMode:8,
            embeding:9,
            unembeding:10,
            creatingArrayMode:11,
            creatingExArrayMode:12,
            creatingNodeMode:13,
            creatingEdgeMode:14
    };



    _p.init = function(projectId,documentId){

        console.log(projectId,documentId);

        data={};
        data.project_id=projectId;
        data.document_id=documentId;

        getEntityTypeList(data)
        .done(function(result){
            console.log(result)

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
            console.log(result)
            _p.loadedDocument = result.document;
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
        console.log(ele)

        if (ele.hasClass("wksToken")){
            console.log(ele.find(".wksTokenText").text())
            event.stopPropagation();

            selectToken(ele);

        }

    };


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
        var sentenceEle = $('<div id="'+sentenceId+'"></div>')
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

        var tokenSelectionEle = $('<span style="display:none"class="wksTokenSelection"></span>')

        tokenEle.append(tokenTextEle);
        tokenEle.append(tokenSelectionEle);
        tokenEle.append("<wbr>");

        sentenceEle.append(tokenEle);

        tokenSelectionEle.css("width",tokenTextEle.width()+2);
        tokenSelectionEle.css("height",tokenTextEle.height()+1);
        tokenSelectionEle.css("left","-1px");
        tokenSelectionEle.css("top","-2px");
    };

    function drawBlank(sentenceEle,token,nextToken){

        if (nextToken && nextToken.begin - token.end) {
            var tokenId = "wksToken-ws-b"+token.end;
            var tokenEle = $('<span id="'+tokenId+'" class="wksToken" ></span>');
            var tokenTextEle = $('<span class="wksTokenText"> </span>')
            tokenEle.append(tokenTextEle);

            sentenceEle.append(tokenEle);
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

    function selectToken(tokenEle){
        var tokenSelectionEle = tokenEle.find(".wksTokenSelection");
        tokenSelectionEle.css("display","")
        tokenSelectionEle.addClass("wksTokenSelectionBegin wksTokenSelectionEnd");


    }




	return module;
}($J1 || {}));