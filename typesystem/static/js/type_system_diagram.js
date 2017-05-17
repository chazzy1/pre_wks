var $J1 = (function (module){
	var _p = module._p = module._p || {};

    _p.projectId = null;

    _p.loadedEntityTypesLabelMap = {};
    _p.loadedRelationTypesIdMap = {};
    _p.loadedRelationPropLabelMap = {};

    var diagramViewEle = $("#diagramView");
    var innerMapEle = $("#innerMap");


    _p.init = function(projectId){
        console.log(projectId)
        var data = {"project_id":projectId};

        $.when(getEntityTypeList(data) , getRelationTypeList(data)).done(function (entityTypeList, relationTypeList){
            console.log(entityTypeList.length);
            console.log(relationTypeList.length);

            entityTypeList = entityTypeList[0];
            relationTypeList = relationTypeList[0]
            for (var k in entityTypeList.list) {
                var entityType = entityTypeList.list[k];
                _p.loadedEntityTypesLabelMap[entityType.label] = entityType;
            };
            for (var k in relationTypeList.list) {
                var relationType = relationTypeList.list[k];
                _p.loadedRelationTypesIdMap[relationType.id] = relationType;
                if (!_p.loadedRelationPropLabelMap[relationType.label]){
                    _p.loadedRelationPropLabelMap[relationType.label] = relationType
                }
            };

            resetTypeSystemDiagram();


        });

        resetDiagramUI();

    };


    function getRelationTypeList(data){
        return $.ajax({
            url: Flask.url_for('typesystem.get_relationship_type_list', {project_id: data.project_id})
            ,type: 'POST'
            ,contentType: "application/json;charset=utf-8"
            ,dataType: 'json'
            ,data: JSON.stringify(data)
            ,beforeSend:function(){

            }
        })
    };

    function getEntityTypeList(data){
        return $.ajax({
            url: Flask.url_for('typesystem.get_entity_type_list', {project_id: data.project_id})
            ,type: 'POST'
            ,contentType: "application/json;charset=utf-8"
            ,dataType: 'json'
            ,data: JSON.stringify(data)
            ,beforeSend:function(){

            }
        })
    };

    function resetDiagramUI(){
        innerMapEle.draggable();
    };

    function getEntityTypeBaseEle(){
        return $('<div class="entityTypeContainer"><div class="entityTypeTextContainer"></></div>');
    }

    function resetTypeSystemDiagram(){

        jsPlumb.setContainer(innerMapEle);




        var Xoffset = 0;
        var Yoffset = 0;
        for (var k in _p.loadedEntityTypesLabelMap){
            var entityType = _p.loadedEntityTypesLabelMap[k];
            drawTypeSystem(entityType,Xoffset*120, Yoffset*120);
            Xoffset++;
            if (Xoffset>10){
                Xoffset = 0;
                Yoffset++;
            }
        };


        var count = 0;
        for (var k in _p.loadedRelationTypesIdMap){

            count++;
            if (count>20) break;

            var relationType = _p.loadedRelationTypesIdMap[k];

            var parentEntityTypeEle = $("#"+relationType.srcEntType);
            var childEntityTypeEle = $("#"+relationType.tgtEntType);

            jsPlumb.connect({ source:parentEntityTypeEle,
                target:childEntityTypeEle,
                anchors:[ "Center","Center" ],
                paintStyle:{ strokeWidth:2, stroke:"rgb(131,8,135)" },
                endpoint:["Dot", { radius:1 }],
                connector:["Bezier" , {curviness:90}],
                overlays:[
                    ["Arrow" , { width:5, length:5, location:0.9 }]
                ]
            });
            //jsPlumb.draggable(_p.getObjectId(parentEntityTypeEle));
            //jsPlumb.draggable(_p.getObjectId(childEntityTypeEle));


        }


    };


    function drawTypeSystem(entityType, Xoffset,Yoffset){
        var entityTypeEle = getEntityTypeBaseEle();
        entityTypeEle.find(".entityTypeTextContainer").html(entityType.label);
        entityTypeEle.css("background-color",entityType.sireProp.backGroundColor);
        innerMapEle.append(entityTypeEle);

        entityTypeEle.attr("gtcEntityTypeLabel",entityType.label);
        entityTypeEle.attr("gtcEntityTypeId",entityType.id);

        entityTypeEle.css("left",Xoffset);
        entityTypeEle.css("top",Yoffset);

        //unique하다고 믿고...
        entityTypeEle.attr("id",entityType.id);

        entityTypeEle.draggable({
            drag:function(e){

                if ($(this).hasClass('jtk-endpoint-anchor')){
                    jsPlumb.revalidate(_p.getObjectId($(this)));
                };
            }


        });



        //entityTypeEle.resizable();
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