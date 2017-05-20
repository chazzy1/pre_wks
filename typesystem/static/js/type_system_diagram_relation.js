var $J1 = (function (module){
	var _p = module._p = module._p || {};

    _p.drawEntityRelations = function(relations){

        console.log(relations)

        for (var k in relations){
            var relation = relations[k];
            _p.drawRelation($("#"+relation.srcEntType),$("#"+relation.tgtEntType),relation.label,relation.id);
        };
    };

    _p.drawRelation = function(sourceEle,targetEle,label,id){

        jsPlumb.connect({
            source:sourceEle,
            target:targetEle,
            anchor:"Continuous",
            paintStyle:{ strokeWidth:2, stroke:"rgb(131,8,135)" },
            endpoint:["Dot", { radius:1 }],
            connector:["Bezier" , {curviness:90}],
            overlays:[
                ["Arrow" , { width:5, length:5, location:0.9 }],
                 [ "Label", {label:label, id:id}]
            ]
        });

    }


	return module;
}($J1 || {}));