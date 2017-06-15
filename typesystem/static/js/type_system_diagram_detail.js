var $J1 = (function (module){
	var _p = module._p = module._p || {};

	_p.resetEntityTypeDtl = function(entId){
	    var isNewEntity = false;
	    if (!entId){
            entId = _p.getUUID();
            isNewEntity = true;
	    };
        var dtlId = "dtl"+entId;
	    var dtlEle = _p.getElementFromId(dtlId);
	    if (dtlEle.length > 0){
	        var dtlDialogEle = dtlEle.closest(".ui-dialog");
            _p.focusOnObject(dtlDialogEle);
	    } else {
	        var title = "";

	        if (isNewEntity) {
	            title = "New Entity Type";
	        } else {
                if (_p.loadedEntityTypesIdMap[entId].logical_value){
                    title+=_p.loadedEntityTypesIdMap[entId].logical_value + "-";
                };
                title+=_p.loadedEntityTypesIdMap[entId].label;
	        };

            $.get(Flask.url_for('typesystem.entity_type_detail', {project_id: _p.projectId}), null, function (template) {
                $('<div id="'+dtlId+'" entityTypeId="'+entId+'"></div>').html(template)
                .dialog({
                    autoOpen: true,
                    show: "fade",
                    modal: false,
                    width: 700,
                    height: 350,
                    title: title,
                    appendTo: _p.innerMapEle,
                    close: function( event, ui ) {
                        $(this).dialog('destroy').remove();
                    },
                    focus: function( event, ui ) {
                        var maxZ = _p.getMaxEntZ();
                        $(this).closest(".ui-dialog").css("z-index",maxZ+1);
                    },
                    open: function( event, ui ) {
                        var maxZ = _p.getMaxEntZ();
                        $(this).closest(".ui-dialog").css("z-index",maxZ+1);
                        if (isNewEntity) {
                            $(this).addClass("newEntity");
                        };
                        fillEntityTypeDtlContents($(this), $(this).attr("entityTypeId"));
                    }
                });
            },'html');

	    };

	};



    _p.processEntityPropertyApply = function(dtlEle){
        var entId = dtlEle.attr("entityTypeId");


        var entDtl = _p.loadedEntityTypesIdMap[entId];
        var isNewEntity = false;
        if (entDtl){


        } else {
            //new Entity
            entDtl = getBaseEntityTypeDtl();
            entDtl.id = entId;
            isNewEntity = true;
        };


        var entityPropertyLogicalNameEle = dtlEle.find(".entityPropertyLogicalName");
        var entityPropertyNameEle = dtlEle.find(".entityPropertyName");
        var entityPropertyDefEle = dtlEle.find(".entityPropertyDef");
        //loadedTypeSystemDiagram은 label을 키값으로 하기때문에...이 구조가 더 좋은지는 아직 불확실하기는 함.
        var oldLabel = entDtl.label;
        var newLabel = entityPropertyNameEle.val();

        if (entityPropertyLogicalNameEle.val()) {
            entDtl.logical_value = entityPropertyLogicalNameEle.val();
        };

        entDtl.label = newLabel;
        entDtl.definition = entityPropertyDefEle.val();


        if (isNewEntity){

            //_p.loadedTypeSystemDiagram[entDtl.label] = {x:100, y:100};
            _p.loadedEntityTypesLabelMap[entDtl.label] = entDtl;
            _p.loadedEntityTypesIdMap[entDtl.id] = entDtl;
        };


        if (!isNewEntity && oldLabel != newLabel){
            _p.loadedEntityTypesLabelMap[newLabel] = _p.loadedEntityTypesLabelMap[oldLabel];
            delete _p.loadedEntityTypesLabelMap[oldLabel];
            _p.loadedTypeSystemDiagram[newLabel] = _p.loadedTypeSystemDiagram[oldLabel];
            delete _p.loadedTypeSystemDiagram[oldLabel];
            //_p.loadedEntityTypesIdMap[entDtl.id] = _p.loadedEntityTypesLabelMap[oldLabel];
        };
        _p.innerMapEle.empty();
        _p.resetTypeSystemDiagram();
        _p.resetMiniMap();

    };


    function getBaseEntityTypeDtl(){
        var baseEntityType = {
            alchemyAPITypes:null,
            creationDate:null,
            id:null,
            label:null,
            modifiedDate:0,
            source:null,
            typeClass:null,
            typeCreateDate:null,
            typeDesc:null,
            typeProvenance:null,
            typeSuperType:null,
            typeSuperTypeId:null,
            typeType:null,
            typeUpdateDate:null,
            typeVersion:null
        };
        baseEntityType.sireProp = {
            roles : [],
            color : "black",
            mentionType : null,
            roleOnly : false,
            clazz : null,
            active : true,
            backGroundColor : "#574A00",
            hotkey : "-",
            subtypes : null
        };
        return baseEntityType;
    };



	function fillEntityTypeDtlContents(dtlEle, entId){
	    if (dtlEle.hasClass("newEntity")){

	    } else {
	        var entDtl = _p.loadedEntityTypesIdMap[entId];

	        var entityPropertyLogicalName = entDtl.logical_value;
	        var entityPropertyName = entDtl.label;
	        var entityPropertyDef = entDtl.definition;


	        var entityPropertyLogicalNameEle = dtlEle.find(".entityPropertyLogicalName");
	        var entityPropertyNameEle = dtlEle.find(".entityPropertyName");
	        var entityPropertyDefEle = dtlEle.find(".entityPropertyDef");


	        if (entityPropertyLogicalName) {
	            entityPropertyLogicalNameEle.val(entityPropertyLogicalName);
	        };
	        entityPropertyNameEle.val(entityPropertyName);
            if (entityPropertyDef) {
	            entityPropertyDefEle.val(entityPropertyDef);
	        };
	    };

	};




	_p.createRelationTypeDtl = function(sourceId, targetId){


        $.get(Flask.url_for('typesystem.relation_type_detail', {project_id: _p.projectId}), null, function (template) {
            $('<div sourceEntityTypeId="'+sourceId+'" targetEntityTypeId="'+targetId+'"></div>').html(template)
            .dialog({
                autoOpen: true,
                show: "fade",
                modal: false,
                width: 700,
                height: 350,
                title: "New Relation Type",
                appendTo: _p.innerMapEle,
                close: function( event, ui ) {
                    $(this).dialog('destroy').remove();
                },
                focus: function( event, ui ) {
                    var maxZ = _p.getMaxEntZ();
                    $(this).closest(".ui-dialog").css("z-index",maxZ+1);
                },
                open: function( event, ui ) {
                    var maxZ = _p.getMaxEntZ();
                    $(this).closest(".ui-dialog").css("z-index",maxZ+1);
                    fillRelationTypeDtlContents($(this), sourceId, targetId);
                }
            });
        },'html');



	};

    function getBaseRelationTypeDtl(){
        var baseRelationType = {
            creationDate:null,
            id:null,
            label:null,
            modifiedDate:0,
            source:0,
            srcEntType:null,
            tgtEntType:null,
            typeClass:null,
            typeCreateDate:null,
            typeDesc:null,
            typeProvenance:null,
            typeSuperType:null,
            typeType:null,
            typeUpdateDate:null,
            typeVersion:null
        };
        baseRelationType.sireProp = {
            active : true,
            backGroundColor : "#EFC100",
            clazz : null,
            color : "#000000",
            hotkey : null,
            modality : null,
            tense : null
        };
        return baseRelationType;
    };


	function fillRelationTypeDtlContents(dtlEle, sourceId, targetId){

        var sourceEntDtl = _p.loadedEntityTypesIdMap[sourceId];
        var targetEntDtl = _p.loadedEntityTypesIdMap[targetId];

        var relationPropertyLogicalNameEle = dtlEle.find(".relationPropertyLogicalName");
        var relationPropertyNameEle = dtlEle.find(".relationPropertyName");
        var relationPropertyDefEle = dtlEle.find(".relationPropertyDef");
        var relationPropertySourceEle = dtlEle.find(".relationPropertySource");
        var relationPropertyTargetEle = dtlEle.find(".relationPropertyTarget");

        relationPropertySourceEle.val(sourceEntDtl.label);
        relationPropertyTargetEle.val(targetEntDtl.label);

	};



    _p.processRelationPropertyApply = function(dtlEle){
        var sourceEntId = dtlEle.attr("sourceEntityTypeId");
        var targetEntId = dtlEle.attr("targetEntityTypeId");


        var relationPropertyNameEle = dtlEle.find(".relationPropertyName");
        var relDtl = _p.loadedRelationTypesLabelMap[relationPropertyNameEle.val()];
        var isNewRelation = false;

        if (relDtl){

        } else {
            //new Entity
            relDtl = getBaseRelationTypeDtl();


            relDtl.id = _p.getUUID();
            relDtl.srcEntType = sourceEntId;
            relDtl.tgtEntType = targetEntId;
            isNewRelation = true;
        };


        var relationPropertyLogicalNameEle = dtlEle.find(".relationPropertyLogicalName");
        var relationPropertyNameEle = dtlEle.find(".relationPropertyName");
        var relationPropertyDefEle = dtlEle.find(".relationPropertyDef");

        var oldLabel = relDtl.label;
        var newLabel = relationPropertyNameEle.val();

        if (relationPropertyLogicalNameEle.val()) {
            relDtl.logical_value = relationPropertyLogicalNameEle.val();
        };

        relDtl.label = newLabel;
        relDtl.definition = relationPropertyDefEle.val();


        if (isNewRelation){
            //_p.loadedTypeSystemDiagram[entDtl.label] = {x:100, y:100};
            _p.loadedRelationTypesIdMap[relDtl.id] = relDtl;
            _p.loadedRelationTypesLabelMap[relDtl.label] = relDtl;
        };

        if (!isNewRelation && oldLabel != newLabel){
            _p.loadedRelationTypesLabelMap[newLabel] = _p.loadedRelationTypesLabelMap[oldLabel];
            delete _p.loadedRelationTypesLabelMap[oldLabel];

        };

        _p.resetRelationMaps();

        _p.resetTypeSystemDiagram();

        var srcTgtRelationId = sourceEntId + "-" + targetEntId
        var srcTgtRelation = _p.loadedSrcTgtRelationMap[srcTgtRelationId];

        _p.drawRelation(srcTgtRelation);

    };






	return module;
}($J1 || {}));