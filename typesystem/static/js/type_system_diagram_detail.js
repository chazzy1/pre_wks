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



	return module;
}($J1 || {}));