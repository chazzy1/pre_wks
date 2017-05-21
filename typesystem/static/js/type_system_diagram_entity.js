var $J1 = (function (module){
	var _p = module._p = module._p || {};


    var diagramViewEle = $("#diagramView");


    _p.getOutgoingRelationCount = function(entId){
        var outgoingRelationMap = $J1._p.loadedEntitySrcRelationIdMap[entId];
        var outgoingRelationCount = 0;
        if (outgoingRelationMap) {
            outgoingRelationCount = outgoingRelationMap.relations.length;
        };
        return outgoingRelationCount;
    };

    _p.getIncomingRelationCount = function(entId){
        var incomingRelationMap = $J1._p.loadedEntityTgtRelationIdMap[entId];
        var incomingRelationCount = 0;
        if (incomingRelationMap) {
            incomingRelationCount = incomingRelationMap.relations.length;
        };
        return incomingRelationCount;
    };





    _p.selectEntity = function(ele){
        if (_p.SelectedEntity) {
            _p.unselectEntity(_p.SelectedEntity);
        }
        ele.addClass("thickBox");
        _p.SelectedEntity = ele;
    };

    _p.unselectEntity = function(ele){
        if (!ele) {
            return;
        };
        try{
            ele.removeClass("thickBox");
            //ele.entity("removeResizable");
            //_p.disableEntityAttrSort(ele);
            _p.SelectedEntity = null;
        } catch (err){

        }
    };




    _p.resetTypeSystemDiagram = function(){

        jsPlumb.setContainer(_p.innerMapEle);


        var Xoffset = 0;
        var Yoffset = 0;

        for (var k in _p.loadedEntityTypesLabelMap){
            var entityType = _p.loadedEntityTypesLabelMap[k];

            var diagramItem = _p.loadedTypeSystemDiagram[k];

            drawTypeSystem(entityType, diagramItem, Xoffset*120, Yoffset*120);


            if (!diagramItem) {
                Xoffset++;
                if (Xoffset>10){
                    Xoffset = 0;
                    Yoffset++;
                }
            };
        };


    };


    function drawTypeSystem(entityType, diagramItem, Xoffset, Yoffset){

        if (!diagramItem){
            diagramItem = {};
            diagramItem.x = Xoffset;
            diagramItem.y = Yoffset;
            //없으면 만들어둔다. 나중에 저장할때 모든 typeSystem에 대한 diagram항목이 만들어질것임.
            _p.loadedTypeSystemDiagram[entityType.label] = diagramItem;
        };
        var roles = [];
        for (var k in entityType.sireProp.roles){
            var roleId = entityType.sireProp.roles[k];
            var roleObject = {"id":roleId, "label":_p.loadedEntityTypesIdMap[roleId].label};
            roles.push(roleObject);
        };

        var entity = {
            "id":entityType.id,
            "label":entityType.label
        }

        $('<div></div>').entity(entity).entity("setShowOutgoing").entity("setShowIncoming").appendTo(_p.innerMapEle);

    };

    _p.showTypeSystemEntity = function(entId){
        var entEle = $("#"+entId);
        entEle.css("display","");
    };

    _p.hideTypeSystemEntity = function(entId){
        var entEle = $("#"+entId);
        entEle.css("display","None");
    };




	return module;
}($J1 || {}));