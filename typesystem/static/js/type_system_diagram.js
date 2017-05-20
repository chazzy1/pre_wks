var $J1 = (function (module){
	var _p = module._p = module._p || {};

    _p.projectId = null;

    _p.loadedEntityTypesLabelMap = {};
    _p.loadedEntityTypesIdMap = {};
    _p.loadedRelationTypesIdMap = {};
    _p.loadedRelationPropLabelMap = {};
    _p.loadedTypeSystemDiagram = {};
    _p.viewType="L";

    var diagramViewEle = $("#diagramView");
    var innerMapEle = $("#innerMap");


    _p.init = function(projectId){
        console.log(projectId);
        _p.projectId = projectId;
        var data = {"project_id":projectId};

        $.when(getEntityTypeList(data) , getRelationTypeList(data), getTypeSystemDiagram(data))
        .done(function (entityTypeList, relationTypeList, typeSystemDiagram){

            entityTypeList = entityTypeList[0];
            relationTypeList = relationTypeList[0]
            typeSystemDiagram = typeSystemDiagram[0]



            for (var k in entityTypeList.list) {
                var entityType = entityTypeList.list[k];
                _p.loadedEntityTypesLabelMap[entityType.label] = entityType;
                _p.loadedEntityTypesIdMap[entityType.id] = entityType;
            };
            for (var k in relationTypeList.list) {
                var relationType = relationTypeList.list[k];
                _p.loadedRelationTypesIdMap[relationType.id] = relationType;
                if (!_p.loadedRelationPropLabelMap[relationType.label]){
                    _p.loadedRelationPropLabelMap[relationType.label] = relationType
                }
            };

            if (typeSystemDiagram.result){
                _p.loadedTypeSystemDiagram = typeSystemDiagram.result;
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

    function getTypeSystemDiagram(data){
        return $.ajax({
            url: Flask.url_for('typesystem.get_type_system_diagram', {project_id: data.project_id})
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

        $("#tab-content-type-system-diagram").off("click","**");
        $("#tab-content-type-system-diagram").on("click","div,button",function(event){
            var ele = $(this);
            processDiagramClickEvent(ele,event);
        });
    };

    function processDiagramClickEvent(ele,event){
        if (ele.is("#btnMaximizeView")){
            maximizeDiagramView();
            event.stopPropagation();
        };

        if (ele.is("#btnNormalView")){
            setNormalDiagramView();
            event.stopPropagation();
        };
        if (ele.is("#btnTSDSave")){
            saveTSD();
            event.stopPropagation();
        };



    };

    function saveTSD(){
        var saveData = {};

        saveData.typeSystemDiagram = _p.loadedTypeSystemDiagram;

        saveAll(saveData)
        .done(function(result){

        });
    };

    function saveAll(data){
        return $.ajax({
            url: Flask.url_for('typesystem.save_all', {project_id: _p.projectId})
            ,type: 'POST'
            ,contentType: "application/json;charset=utf-8"
            ,dataType: 'json'
            ,data: JSON.stringify(data)
            ,beforeSend:function(){

            }
        })
    };

    function maximizeDiagramView(){
        $("#topContent").removeClass("col-md-10");
        $("#topContent").removeClass("col-md-offset-1");
        $("#topContent").find(".maximizeTarget").each(function(index,ele){
            $(ele).css("display","none");
        });
        $("#diagramViewHolder").removeClass("height100");
        $("#diagramViewHolder").addClass("heightPlus120");

    };


    function setNormalDiagramView(){
        $("#topContent").addClass("col-md-10");
        $("#topContent").addClass("col-md-offset-1 ")
        $("#topContent").find(".maximizeTarget").each(function(index,ele){
            $(ele).css("display","");
        });
        $("#diagramViewHolder").addClass("height100");
        $("#diagramViewHolder").removeClass("heightPlus120");
    };

    function getEntityTypeBaseEle(){
        return $('<div class="entityTypeContainer"><div class="entityTypeTextContainer"></></div>');
    };

    function resetTypeSystemDiagram(){

        jsPlumb.setContainer(innerMapEle);


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


        //일단 relation 나중에...
        return;











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
        /*
        var entity = {
            "id":entityType.id,
            "label":entityType.label,
            "entFillColor":entityType.sireProp.backGroundColor,
            "subtypes": entityType.subtypes,
            "roles":roles,
            "x":diagramItem.x,
            "y":diagramItem.y
        };
        */

        //계획변경.
        var entity = {
            "id":entityType.id,
            "label":entityType.label
        }

        $('<div></div>').entity(entity).appendTo(innerMapEle);

        //entityTypeEle.resizable();
    };

    function drawTypeSystem1(entityType, Xoffset,Yoffset){
        var entityTypeEle = getEntityTypeBaseEle();
        entityTypeEle.find(".entityTypeTextContainer").html(entityType.label);
        entityTypeEle.css("background-color",entityType.sireProp.backGroundColor);
        innerMapEle.append(entityTypeEle);

        entityTypeEle.attr("gtcEntityTypeLabel",entityType.label);
        entityTypeEle.attr("gtcEntityTypeId",entityType.id);

        entityTypeEle.css("left",Xoffset);
        entityTypeEle.css("top",Yoffset);










        //상항이 이게 아님. 다시 id 찾아야함.
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