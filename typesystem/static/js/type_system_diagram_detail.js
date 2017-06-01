var $J1 = (function (module){
	var _p = module._p = module._p || {};

	_p.resetEntityTypeDtl = function(entId){
	    var dtlId = "dtl"+entId;
	    var dtlEle = _p.getElementFromId(dtlId);
	    var dtlDialogEle = dtlEle.closest(".ui-dialog");
	    if (dtlEle.length > 0){
            _p.focusOnObject(dtlDialogEle);
	    } else {
	        var title = "";
	        if (_p.loadedEntityTypesIdMap[entId].logical_value){
	            title+=_p.loadedEntityTypesIdMap[entId].logical_value + "-";
	        };
	        title+=_p.loadedEntityTypesIdMap[entId].label;

            $.get(Flask.url_for('typesystem.entity_type_detail', {project_id: _p.projectId}), null, function (template) {
                $('<div id="'+dtlId+'"></div>').html(template)
                .dialog({
                    autoOpen: true,
                    show: "fade",
                    modal: false,
                    width: 400,
                    title:title,
                    appendTo: _p.innerMapEle,
                    close: function( event, ui ) {
                        $(this).dialog('destroy').remove();
                    }
                });
            },'html');

	    };

	};

    function drawEntDtl(data){
        //var data = {"id":"7E092EBDF7244D3286C78E9912B99D8C00000344","entTyp":"A"};
        $.get("{{ url_for('typesystem.entity_type_detail') }}", null, function (template) {
            //var tmpl = $.templates(template);
            //var htmlString = tmpl.render(data);


            $('<div id="'+dtlId+'"></div>').html(htmlString)
            .dialog({
                    autoOpen: true,
                    show: "fade",
                    hide: "explode",
                    modal: false,
                    width: 700,
                    title: data.Lent.entNm
                    });
        },'html');
    };






	return module;
}($J1 || {}));