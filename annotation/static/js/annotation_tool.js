
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




    };

    function resetDocument(){
        $("#document-name").html(_p.loadedDocument.name);
        $("#document-holder").html(_p.loadedDocument.text);
    }

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
    }





	return module;
}($J1 || {}));