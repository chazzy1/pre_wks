
var $J1 = (function (module){
	var _p = module._p = module._p || {};

    _p.projectId = null;

    _p.loadedEntityTypesLabelMap={};
    _p.loadedGroundTruth={};
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
                    _p.loadedEntityTypesLabelMap[entityType.label] = entityType;
                };
            } else {
                alert(result.message);
            }

            _p.resetEntityTypeList();
        });


        getGroundTruth(data)
        .done(function(result){
            _p.loadedGroundTruth = result.document;
            for (var k in _p.loadedGroundTruth.sentences){
                var sentence = _p.loadedGroundTruth.sentences[k];
                _p.sentencesIdMap[sentence.id] = sentence;
            };
            console.log(_p.loadedGroundTruth);
            resetDocument();
            _p.resetMentionDisplay();
        });

        getSireInfo(data)
        .done(function(result){
            _p.loadedSireInfo = result.sireInfo;
            _p.resetMentionTypeClass();
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

        $("#leftSideBar").off("click","**");
        $("#leftSideBar").on("click","div",function(event){
            var ele = $(this);
            processLeftSideBarClickEvent(ele,event);
        });

        $(document).bind("keydown",function(event){
            processKeyDownEvent(event);
        });

    };

    function processMentionToolUIReset(){
        $("#relationToolRightSideBar").css("display","none");
        $("#mentionToolRightSideBar").css("display","");
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

    function getGroundTruth(data){
        return $.ajax({
            url: Flask.url_for('annotator.get_ground_truth', {project_id: data.project_id})
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

            _p.processTokenSelection(ele);

        }

    };


    function processToolbarClickEvent(ele,event){
        if (ele.is("#btnTest1")){
            var from = $("#selectionFrom").val();
            var to = $("#selectionTo").val();
            _p.drawMentionTargetSelection('s0',from,to);
            event.stopPropagation();

        };
        if (ele.is("#btnSave")){
            event.stopPropagation();
            data={};
            data.project_id=_p.projectId;
            data.ground_truth_id=_p.loadedGroundTruth.id;

            data.saveData = {};

            data.saveData.mentions = _p.loadedGroundTruth.mentions;
            data.saveData.relations = _p.loadedGroundTruth.relations;
            data.saveData.corefs = _p.loadedGroundTruth.corefs;

            console.log(data)
            saveAll(data)
            .done(function(result){

            });

        };
    };

    function processRightSideBarClickEvent(ele,event){
        if (ele.hasClass("gtcEntityType")){
            event.stopPropagation();

            _p.processEntityTypeAssignment(ele);

        }
    };

    function processLeftSideBarClickEvent(ele,event){
        if (ele.is("#btnMentionTool")){
            event.stopPropagation();
            processMentionToolUIReset();
        };
        if (ele.is("#btnRelationTool")){
            event.stopPropagation();
            _p.processRelationToolUIReset();
        };
        if (ele.is("#btnCoreferenceTool")){
            event.stopPropagation();

        };


    };

    function processKeyDownEvent(event){
        if (event.keyCode == 27) {
            if (_p.activeSelection) {
                _p.clearMentionTargetSelection();
                _p.activeSelection = null;

            }

        }
    };

    function resetDocument(){
        $("#document-name").empty();
        $("#document-holder").empty();
        $("#document-name").html(_p.loadedGroundTruth.name);

        for (var k in _p.loadedGroundTruth.sentences) {
            sentence = _p.loadedGroundTruth.sentences[k];
            _p.drawSentence(sentence, k);
        }
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