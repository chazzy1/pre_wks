var $J1 = (function (module){
	var _p = module._p = module._p || {};

    _p.drawEntityRelations = function(relations){


        for (var k in relations){
            var relation = relations[k];

            var srcTgtRelationId = relation.srcEntType + "-" + relation.tgtEntType;
            var srcTgtRelation = _p.loadedSrcTgtRelationMap[srcTgtRelationId];


             //= {"shown":false,"connection":null,"relation":relationType};
            _p.drawRelation(srcTgtRelation);

        };
    };

    _p.drawRelation = function(srcTgtRelation){
        if (!srcTgtRelation.shown){
            var connection = jsPlumb.connect({
                source:$("#"+srcTgtRelation.relation.srcEntType),
                target:$("#"+srcTgtRelation.relation.tgtEntType),
                anchor:"Continuous",
                paintStyle:{ strokeWidth:1, stroke:"rgb(131,8,135)" },
                endpoint:["Dot", { radius:1 }],
                connector:["Bezier" , {curviness:90}],
                overlays:[
                    ["Arrow" , { width:5, length:5, location:0.9 }],
                     [ "Label", {label:srcTgtRelation.relation.label, id:srcTgtRelation.relation.id}]
                ]
            });

            srcTgtRelation.shown = true;
            srcTgtRelation.connection = connection;
        }



    };

    _p.removeEntityRelations = function(relations){
        for (var k in relations){
            var relation = relations[k];
            var srcTgtRelationId = relation.srcEntType + "-" + relation.tgtEntType;
            var srcTgtRelation = _p.loadedSrcTgtRelationMap[srcTgtRelationId];
            _p.removeRelation(srcTgtRelation);
        };
    };

    _p.removeRelation = function(srcTgtRelation){
        if (srcTgtRelation.shown){
            //jsPlumb.detach(srcTgtRelation.connection);
            jsPlumb.deleteConnection(srcTgtRelation.connection);
            srcTgtRelation.shown = false;
            srcTgtRelation.connection = null;
        };
    };


	return module;
}($J1 || {}));