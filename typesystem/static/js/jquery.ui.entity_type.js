/*!
 * jQuery UI Entity 1.0
 *
 * Copyright 2012, Copyright 2012, Jiwon,Cha (chazzy1@gmail.com)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://...
 *
 * Depends:
 *	
 */
 
 /*
	entity 생성시 인자
	{id: , x:, y:, width:, height:, entTyp:, entNm:, tabNm:, Pattr:[{PKYN:, colNm:, dataTyp:, nullYN:, FKYN:}, ], Lattr:[{PKYN:, attrNm:, FKYN: }]}
	entTyp:A(모두), P(PhysicalOnly),L(LogicalOnly)
	
	
 
 
 
 
 */
(function( $, undefined ) {


$.widget( "ui.entity", {

    options: {
        id:"",
        label:"",
    },


    _create: function() {
		this._drawEntity();
		
    },
    
    drawVirtual: function() {
    	this.element.empty();
    	this.element.resizable();
    },
    
    refreshEntity: function() {

    	if ($J1._p.zoomLevel < 19){
    		this.drawMinimal();
    	} else {
    		if ($J1._p.viewType=="L"){
    			this.drawLogical();
    		} else {
    			this.drawPhysical();
    		}
    	}
		//this.setResizable();
		this.resetSize();
		//this.saveZoomSize();
    },
    resetDraggable: function(){
    	this.element.draggable({
			stack: ".objectContainer",
			cursor:"move",
			containment: "parent"
		});
		this.element.css('position',"absolute");//IE때문임
		this.element.unbind('dragstart');
		this.element.bind('dragstart',$.proxy(function( event ){
		/*
            $J1._p.refreshEmbededObjectList(this.options.id);
		    var maxZindex = $J1._p.getMaxEntZ();
            $J1._p.setZIndexForEmbededObject(this.options.id,maxZindex);
            $J1._p.embededIdTmpList = [];
            $J1._p.createEmbededIdList(this.options.id);
            */
        },this));
		this.element.unbind('drag');
		this.element.bind('drag',$.proxy(function( event ){
                if (this.element.hasClass('jtk-endpoint-anchor')){
                    jsPlumb.revalidate($J1._p.getObjectId(this.element));
                };

		/*
			try{
			    var entId = this.options.id;
			    var entDtl = $J1._p.loadedEntDtl[entId];
				if ("relations" in entDtl && entDtl.relations["count"] <4){
					this.refreshRelation();
				};
				$J1._p.refreshEmbededObjectRelations(entId);
			} catch (err){
				//this.refreshRelation();
			};
			try{
				this.refreshBookmarks();
			} catch (err){

			}
			*/
        },this));
		this.element.unbind('dragstop');
		this.element.bind('dragstop',$.proxy(function( event ){
		    var label = this.options.label;
		    $J1._p.loadedTypeSystemDiagram[label].x =this.element.position().left;
		    $J1._p.loadedTypeSystemDiagram[label].y =this.element.position().top;


        },this));

    },
	_drawEntity: function() {
		this.element.attr("id",this.options.id);
		this.element.addClass("objectContainer");


        this.resetDraggable();


    	try {
    		this.element.resizable("destroy");
    	} catch (err){
    		
    	};



    	if ($J1._p.zoomLevel < 19){
    		this.drawMinimal();
    	} else {
    		if ($J1._p.viewType=="L"){
    			this.drawLogical();
    		} else {
    			this.drawPhysical();
    		}
    	}
		//this.setResizable();
	},
	drawMinimal: function(){
		this.options.isMinimalMode = true;
		this.element.empty();
		var entDtl = $J1._p.loadedEntDtl[this.options.id];
		if (entDtl.entTyp == "S"){
			this.element.addClass("subtype");
			var subtypeEle = $('<div class="subtypeImage"/>');
            if (entDtl.subtypeTyp == "I"){
			    subtypeEle.addClass("subtypeSUBI");
			} else {
    			subtypeEle.addClass("subtypeSUBE");
			};
            this.element.append(subtypeEle);

		} else if (this.options.UnivCType == "Node"){
                var nodeContainer = $('<div style="background:'+entDtl.entFillColor+'" class="nodeContainer">');
                var nodeMemberContainer = $('<div class="nodeMemberContainer">');
                nodeContainer.append(nodeMemberContainer);
                this.element.append(nodeContainer);
        } else if (this.options.UnivCType == "Array") {
			this.element.addClass("array")
			var attributeContainer = $('<div style="background:'+entDtl.entFillColor+'" class="attributeContainer"></div>');
			this.element.append('<div style="color:'+entDtl.entNmColor+'">'+entDtl.entNm+'</div>').append(attributeContainer);
        } else if (this.options.UnivCType == "ExArray") {
			this.element.addClass("exArray")
			var attributeContainer = $('<div style="background:'+entDtl.entFillColor+'" class="attributeContainer"></div>');
			this.element.append('<div style="color:'+entDtl.entNmColor+'">'+entDtl.entNm+'</div>').append(attributeContainer);
        } else {
			this.element.addClass("entity")
			var attributeContainer = $('<div style="background:'+entDtl.entFillColor+'" class="attributeContainer"></div>');
			this.element.append('<div style="color:'+entDtl.entNmColor+'">'+entDtl.entNm+'</div>').append(attributeContainer);
			this.checkForSquareOrRound();

		}
	},
	drawLogical: function() {
		this.options.isMinimalMode = false;
		this.element.empty();
        var label = this.options.label;

		var entityType = $J1._p.loadedEntityTypesLabelMap[label];
		var diagramItem = $J1._p.loadedTypeSystemDiagram[label];

		this.element.css("top" , diagramItem.y);
		this.element.css("left" , diagramItem.x);

        this.element.addClass("entity");
        this.element.addClass("entityOuter");

        var labelArea = $('<div class="labelArea"></div>');
        labelArea.html(label);
        this.element.append(labelArea);

        var typeColorLine = $('<div style="background-color:'+entityType.sireProp.backGroundColor+'" class="typeColorLine">');
        this.element.append(typeColorLine);


        var rolesContainer = $('<div style="border-color:'+entityType.sireProp.backGroundColor+'" class="attributeContainer">');

        var relationContainer = $('<div style="border-color:'+entityType.sireProp.backGroundColor+'" class="attributeContainer">');
        var outgoingRelationMap = $J1._p.loadedEntitySrcRelationIdMap[this.options.id];
        var outgoingRelationCount = 0;
        var incomingRelationMap = $J1._p.loadedEntityTgtRelationIdMap[this.options.id];
        var incomingRelationCount = 0;
        if (outgoingRelationMap) {
            outgoingRelationCount = outgoingRelationMap.relations.length;
        };
        if (incomingRelationMap) {
            incomingRelationCount = incomingRelationMap.relations.length;
        };

        var totalCount = outgoingRelationCount+incomingRelationCount;
        var relationCountEle = $('<div class="attributeTitle">Relations: '+totalCount+'</div>');
        relationContainer.append(relationCountEle);


        if (outgoingRelationCount){
            var showOutgoingEle = $('<div class="showRelations outgoing">Show Outgoing '+outgoingRelationCount+' <span class="glyphicon glyphicon-arrow-right" aria-hidden="true"></div>');
            relationContainer.append(showOutgoingEle);
        };







        if (incomingRelationCount){
            var showIncomingEle = $('<div class="showRelations incoming">Show Incoming '+incomingRelationCount+' <span class="glyphicon glyphicon-arrow-left" aria-hidden="true"></div>');
            relationContainer.append(showIncomingEle);
        };

        this.element.append(relationContainer);




        var rolesAreaTitleEle = $('<div class="attributeTitle">Roles:</div>');
        rolesContainer.append(rolesAreaTitleEle);
        var loopCount = 0;
        for (var k in entityType.sireProp.roles){
            var roleId = entityType.sireProp.roles[k];
            var roleEle = $('<div class="attributeItem"></div>');
            roleEle.html($J1._p.loadedEntityTypesIdMap[roleId].label);
            rolesContainer.append(roleEle);
            loopCount ++;
            if (loopCount > 6){
                rolesContainer.append($('<div>...</div>'));
                break;
            }
        };
        this.element.append(rolesContainer);


        var subtypeContainer = $('<div style="border-color:'+entityType.sireProp.backGroundColor+'" class="attributeContainer">');
        var subtypeAreaTitleEle = $('<div class="attributeTitle">Subtypes:</div>');
        subtypeContainer.append(subtypeAreaTitleEle);
        for (var k in entityType.sireProp.subtypes){
            var subtypeEle = $('<div class="attributeItem"></div>');
            roleEle.html(entityType.sireProp.subtypes[k]);
            subtypeContainer.append(roleEle);
        };
        this.element.append(subtypeContainer);






        this.element.show();
        return;

	},	
	drawPhysical: function() {
		this.options.isMinimalMode = false;
		this.element.empty();
		var entDtl = $J1._p.loadedEntDtl[this.options.id];
		if (entDtl.entTyp == "S"){
			this.element.css("width","0px");
			this.element.css("height","0px");
        } else if (entDtl.entTyp == "L"){
            this.element.empty();
		    this.element.hide();
		} else {
            if (this.options.UnivCType == "Array"){
                var arrayContainer = $('<div style="background:'+entDtl.entFillColor+'" class="arrayContainer">');
                var titleContainer = $('<div></div>');
                var LBracketArea = $('<div class="LBArea">');
                var arrayMemberContainer = $('<div class="arrayMemberContainer embedable">');
                var RBracketArea = $('<div class="RBArea">');
                this.element.addClass("array");
                if (entDtl.embeded) {
                    this.element.addClass("arrayEmbeded");
                } else {
                    this.element.addClass("arrayOuter");
                };
                titleContainer.html(entDtl.tabNm);
                this.element.append(titleContainer);
                LBracketArea.css("width",$J1._p.defaultArrayBracketWidth*$J1._p.getZoomMultiplier());
                RBracketArea.css("width",$J1._p.defaultArrayBracketWidth*$J1._p.getZoomMultiplier());

                arrayContainer.append(LBracketArea);
                arrayContainer.append(arrayMemberContainer);
                arrayContainer.append(RBracketArea);
                this.options.attrFilterMap = [];
                var column = $('<div class="column"></div>');
                arrayMemberContainer.append(column);
                for (var k in entDtl.attrs){
                    var attr = entDtl.attrs[k];
                    if (!attr.attrType) {
                        attr.attrType = "Attr";
                    };
                    if ("id" in attr && "Lattr" != attr.attrType) {
                        var attrEle = null;
                        if (!attr.objectType || attr.objectType == "Value") {
                            attrEle = this._getSimplePhysicalAttrEle(attr);
                        } else if (attr.objectType == "ColumnSplit") {
                            attrEle = $('<div id="'+attr.id+'" class="attr"></div>');
                            column.append();
                            column = $('<div class="column"></div>');
                            arrayMemberContainer.append(column);
                        } else {
                            var embedId = attr.embededId;
                            attrEle = $('<div id="'+attr.id+'" class="attr"></div>');
                            this.drawEmbededObject(entDtl,attrEle,embedId);
                        };
                        column.append(attrEle);
                    }
                };
                this.options.attrFilterMap = null;
                this.element.append(arrayContainer);
            } else if (this.options.UnivCType == "ExArray"){
                var exArrayContainer = $('<div style="background:'+entDtl.entFillColor+'" class="exArrayContainer">');
                var titleContainer = $('<div></div>');

                var exArrayMemberContainer = $('<div class="exArrayMemberContainer embedable"></div>');

                this.element.addClass("exArray");
                if (entDtl.embeded) {
                    this.element.addClass("exArrayEmbeded");
                } else {
                    this.element.addClass("exArrayOuter");
                };
                titleContainer.html(entDtl.tabNm);
                this.element.append(titleContainer);

                exArrayContainer.append(exArrayMemberContainer);
                this.options.attrFilterMap = [];
                var column = $('<div class="column"></div>');
                exArrayMemberContainer.append(column);
                for (var k in entDtl.attrs){
                    var attr = entDtl.attrs[k];
                    if (!attr.attrType) {
                        attr.attrType = "Attr";
                    };
                    if ("id" in attr && "Lattr" != attr.attrType) {
                        var attrEle = null;
                        if (attr.objectType == "ColumnSplit") {
                            attrEle = $('<div id="'+attr.id+'" class="attr"></div>');
                            column.append();
                            column = $('<div class="column"></div>');
                            exArrayMemberContainer.append(column);
                        } else if (!attr.objectType || attr.objectType == "Value") {
                            attrEle = this._getSimplePhysicalAttrEle(attr);
                        } else {
                            var embedId = attr.embededId;
                            attrEle = $('<div id="'+attr.id+'" class="attr"></div>');
                            this.drawEmbededObject(entDtl,attrEle,embedId);
                        };
                        column.append(attrEle);
                    }
                };
                this.options.attrFilterMap = null;
                this.element.append(exArrayContainer);
            } else if (this.options.UnivCType == "Node"){
                var nodeContainer = $('<div style="background:'+entDtl.entFillColor+'" class="nodeContainer">');
                var nodeMemberContainer = $('<div class="nodeMemberContainer">');
                nodeMemberContainer.html(entDtl.tabNm);
                nodeContainer.append(nodeMemberContainer);
                this.element.append(nodeContainer);
            } else {
                this.element.addClass("entity");
                this.element.html(entDtl.tabNm);
                var attributeContainer = $('<div style="background:'+entDtl.entFillColor+'" class="attributeContainer">');
                var PattrArea = $('<div class="PattrArea embedable">');
                $J1._p.resetColOrderInTblDtl(entDtl);
                if (entDtl.embeded) {
                    this.element.addClass("entityEmbeded");
                } else {
                    this.element.addClass("entityOuter");
                };
                var attrFilterMap = [];
                var isShowDataTyp = $J1._p.loadedSubjectAreaDtl.physicalShowDataTyp;
                var isShowNull = $J1._p.loadedSubjectAreaDtl.physicalShowNull;
                for (var key in entDtl.attrs){
                    var attr = entDtl.attrs[key];
                    if (!attr.attrType) {
                        attr.attrType = "Attr";
                    };
                    if ("id" in attr && "Lattr" != attr.attrType) {
                        var PattrItem = "";
                        if (!attr.objectType || attr.objectType == "Value") {
                            var attrItem = attr["Pattr"];
                            var attrNmColor = "#000000";
                            var attrClass = "attr ";
                            var isStrike = false;
                            if ("decorator" in attr){
                                var decorator = attr.decorator;

                                attrNmColor = decorator.ForeColor;
                                if (decorator.bold){
                                    attrClass+="attrBold";
                                };
                                if (decorator.italic){
                                    attrClass+="attrItalic";
                                };
                                if (decorator.underline){
                                    attrClass+="attrUnderline";
                                };
                                isStrike = decorator.strike;
                            };
                            var attrStyle = "color:"+attrNmColor+";";
                            if ($J1._p.isStringInArray(attrItem.colNm,attrFilterMap)){
                                //PattrItem.css("display","none");
                                attrStyle+="display:none;"
                            };
                            attrFilterMap.push(attrItem.colNm);
                            PattrItem = '<div id="'+attr.id+'" class="'+attrClass+'" style="'+attrStyle+'">';

                            if (attrItem.PKYN) {
                                PattrItem+='<div class="PattrKey">(PK)</div>';
                            } else if (attrItem.FKYN) {
                                PattrItem+='<div class="PattrKey">(FK)</div>';
                            } else {
                                PattrItem+='<div class="PattrKey">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>';
                            };
                            if (isStrike){
                                PattrItem+='<div class="PattrText"><del>'+attrItem.colNm+'</del></div>';
                            } else {
                                PattrItem+='<div class="PattrText">'+attrItem.colNm+'</div>';
                            };

                            if (isShowDataTyp){
                                PattrItem+='<div class="dib">&nbsp;&nbsp;'+attrItem.dataTyp+'</div>';
                            };
                            if (isShowNull){
                                var nullable = "NOT NULL";
                                if (attrItem.nullYN){
                                    nullable = "NULL";
                                }
                                PattrItem+='<div class="dib">&nbsp;&nbsp;'+nullable+'</div>';
                            };
                        } else {
                            PattrItem = $('<div id="'+attr.id+'" class="attr"></div>');
                            var embedId = attr.embededId;
                            this.drawEmbededObject(entDtl,PattrItem,embedId);
                        };
                        PattrArea.append($(PattrItem));
                    }
                };
                attributeContainer.append(PattrArea);
                this.element.append(attributeContainer);
                this.element.show();
                this.checkForSquareOrRound();
            }
		}
	},
	drawEmbededObject: function(entDtl,embedingAttr,embedId){
        var embedEntDtl = $J1._p.loadedEntDtl[embedId];
        //if (embedEntDtl){
        if (true){//테스트용!!!

            if ($J1._p.getEleFromId(embedId).length < 1){
                $J1._p.loadedEntEle[embedId] = $('<div></div>').entity(embedEntDtl).appendTo($J1._p.innerMapEle).entity("applyZoom");
                    if (embedEntDtl.UnivCType == "Array" || embedEntDtl.UnivCType == "ExArray"){
                        try{
                            $J1._p.loadedEntEle[embedId].entity("resetSize");
                        } catch (err){
                        }
                    }
            };
            //이부분 중요함. parentObject는 결국 save 시에 최신으로 업데이트 되지 않음. 그래서 엔티티를 그릴때 업데이트 다시함.
            //mongodb쪽에서 id 가 부모, 자식 둘다 무한반복 업데이트 되는걸 막기위함임.
            //뭔가 다른 로직이 떠오른다염 아래부분은 제거될 수 있음.
            embedEntDtl.embedInfo.parentObject = entDtl.id;
            embedEntDtl.isSubjMember = true;
            var embedEle = $("#"+embedId);
            $J1._p.embedEle(embedingAttr,embedEle);
            //embedEle.entity("refreshEntity");

            //이부분 동작 안된다. rendering타이밍 문제로.
            //결국 주제영역에 다시 추가하는 경우 entity 다 그려진 다음, relation 을 몰아서 그려주는 형태로 고쳐야함
            //$J1._p.addEntRelatedRelationsToSubjectarea(embedId);
        }
	},
	_getDecoratorInfo: function(decorator){
	    var decoratorInfo = {attrNmColor:null, attrClass:""};
        if (decorator){
            decoratorInfo.attrNmColor = decorator.ForeColor;
            if (decorator.bold){
                decoratorInfo.attrClass+="attrBold ";
            };
            if (decorator.italic){
                decoratorInfo.attrClass+="attrItalic ";
            };
            if (decorator.underline){
                decoratorInfo.attrClass+="attrUnderline ";
            };
            if (decorator.strike){
                decoratorInfo.attrClass+="attrStrike ";
            };
        };
        return decoratorInfo
	},
	_getLogicalAttrEle: function(attr,isShowDataTyp){
	    var attrEle = null;
        var Lattr = attr.Lattr;

        var attrNmColor = "#000000";
        var attrClass = "attr ";
        var isStrike = false;
        if ("decorator" in attr){
            var decorator = attr.decorator;
            attrNmColor = decorator.ForeColor;
            if (decorator.bold){
                attrClass+="attrBold";
            };
            if (decorator.italic){
                attrClass+="attrItalic";
            };
            if (decorator.underline){
                attrClass+="attrUnderline";
            };
            isStrike = decorator.strike;
        }
        var attrStyle = "color:"+attrNmColor+";";
        if($J1._p.isStringInArray(Lattr.attrNm,this.options.attrFilterMap)){
            attrStyle+="display:none;";
        };
        this.options.attrFilterMap.push(Lattr.attrNm);
        if (isStrike){
            attrEle = $('<div id="'+attr.id+'" class="'+attrClass+'" style="'+attrStyle+'"><del>'+Lattr.attrNm+'</del></div>');
        } else {
            attrEle = $('<div id="'+attr.id+'" class="'+attrClass+'" style="'+attrStyle+'">'+Lattr.attrNm+'</div>');
        };
        return attrEle;
	},
	_getLogicalEntityAttrEle: function(attr,drawOption){
	    var attrEle = null;
        var Lattr = attr.Lattr;
        attrEle = '<div class="attr" >';


        attrEle+='<div class="attrText">'+attr+'</div>';
        attrEle+='</div>';

        return $(attrEle);
	},
	_getSimplePhysicalAttrEle: function(attr){
	    var attrEle = null;
        var Pattr = attr.Pattr;

        var attrNmColor = "#000000";
        var attrClass = "attr ";
        var isStrike = false;
        if ("decorator" in attr){
            var decorator = attr.decorator;
            attrNmColor = decorator.ForeColor;
            if (decorator.bold){
                attrClass+="attrBold";
            };
            if (decorator.italic){
                attrClass+="attrItalic";
            };
            if (decorator.underline){
                attrClass+="attrUnderline";
            };
            isStrike = decorator.strike;
        }
        var attrStyle = "color:"+attrNmColor+";";
        if($J1._p.isStringInArray(Pattr.attrNm,this.options.attrFilterMap)){
            attrStyle+="display:none;";
        };
        this.options.attrFilterMap.push(Pattr.colNm);
        if (isStrike){
            attrEle = $('<div id="'+attr.id+'" class="'+attrClass+'" style="'+attrStyle+'"><del>'+Pattr.colNm+'</del></div>');
        } else {
            attrEle = $('<div id="'+attr.id+'" class="'+attrClass+'" style="'+attrStyle+'">'+Pattr.colNm+'</div>');
        };
        return attrEle;
	},
	processDragStop: function(){
	    try{
            this.options.x = this.element.position().left*$J1._p.getReverseZoomMultiplier();
            this.options.y = this.element.position().top*$J1._p.getReverseZoomMultiplier();

            $J1._p.loadedEntDtl[this.options.id].x = this.options.x;
            $J1._p.loadedEntDtl[this.options.id].y = this.options.y;
            this.refreshRelation();

            $J1._p.registerERDModification($J1._p.ERDModified.subjectarea.entities,this.options.id);
            $J1._p.resetMiniMapEnt(this.options.id);
	    } catch (err) {

	    }
	},
	removeResizable: function(){
        try {
    		this.element.resizable("destroy");
    	} catch (err){

    	};
	},
	setResizable: function(){
	    this.removeResizable();
		if (this.options.entTyp!="S"){
			this.element.resizable({
				stop: function (event,ui){
					$(this).entity("saveZoomSize");
					$(this).entity("refreshRelation");
					var entId = $(this).entity("option","id");
					if ($J1._p.viewType=="L"){
					    $J1._p.loadedEntDtl[entId].entAutosize = false;
					} else {
					    $J1._p.loadedEntDtl[entId].tblAutosize = false;
					}
					$J1._p.registerERDModification($J1._p.ERDModified.subjectarea.entities,entId);
					$J1._p.resetMiniMapEnt(entId);
				},
				resize: function( event, ui ) {
				    if ($(this).entity("option","UnivCType") == "Node"){
				        $(this).entity("redrawNodeCircle");
				    };
				    event.stopPropagation();
				},
				handles: "n, e, s, w, ne, se, sw, nw"
			});	
		}
	},
	redrawNodeCircle: function(){
	    var width = this.element.width();
	    var height = this.element.height();
	    var size = width>height ? width : height;
        this.element.css("width",size).css("height",size);
        size=size-5;
	    this.element.find(".nodeContainer").css("width",size).css("height",size);
	    this.element.find(".nodeContainer").css("-webkit-border-radius",size/2);
	    this.element.find(".nodeContainer").css("-moz-border-radius",size/2);
	    this.element.find(".nodeContainer").css("border-radius",size/2);
	},
	applyZoom: function(){
		$J1._p.entZoomSize(this.element);
		$J1._p.eleZoomPosition(this.element);
	},
	setEleSize: function(){

		if (!$J1._p.loadedEntDtl[this.options.id].NM_width){
			this.resetSize();
		}
	},	
	resetSize: function(){
	    var isAutosize = false;
	    var entDtl = $J1._p.loadedEntDtl[this.options.id];
	    if (entDtl.entTyp == "S"){
	        if ($J1._p.viewType=="P"){
	        	this.element.css("width","0px");
			    this.element.css("height","0px");
	        } else {
			    $J1._p.entZoomSize(this.element);
	        }
	        return;
	    };
	    if ($J1._p.viewType=="L"){
	        isAutosize = entDtl.entAutosize;
	    } else {
            isAutosize = entDtl.tblAutosize;
	    };


		if (!this.options.isMinimalMode && isAutosize){
			this.element.css("width","").css("height","");
			this.saveZoomSize();
		} else {
		    var entDtl = $J1._p.loadedEntDtl[this.options.id];
            if ($J1._p.viewType=="L"){
                this.element.css("width",entDtl.NM_width*$J1._p.getZoomMultiplier());
                this.element.css("height",entDtl.NM_height*$J1._p.getZoomMultiplier());
            } else {
                this.element.css("width",entDtl.NM_Pwidth*$J1._p.getZoomMultiplier());
                this.element.css("height",entDtl.NM_Pheight*$J1._p.getZoomMultiplier());
            }
		};

		if (this.options.UnivCType == "Array"){
            this.element.css("height",this.element.height());
            var titleheight = ((12+5)*$J1._p.getZoomMultiplier());
            var bracketWidth = ($J1._p.defaultArrayBracketWidth+12)*$J1._p.getZoomMultiplier();
            this.element.find(".arrayContainer").css("height",'-webkit-calc(100% - '+titleheight+'px)');
            this.element.find(".arrayContainer").css("height",'-moz-calc(100% - '+titleheight+'px)');
            this.element.find(".arrayContainer").css("height",'calc(100% - '+titleheight+'px)');
            this.element.find(".arrayMemberContainer").css("width",'-webkit-calc(100% - '+bracketWidth+'px)');
            this.element.find(".arrayMemberContainer").css("width",'-moz-calc(100% - '+bracketWidth+'px)');
            this.element.find(".arrayMemberContainer").css("width",'calc(100% - '+bracketWidth+'px)');
		} else if (this.options.UnivCType == "ExArray"){
            this.element.css("height",this.element.height());
            var titleheight = ((12+5)*$J1._p.getZoomMultiplier());
            this.element.find(".exArrayContainer").css("height",'-webkit-calc(100% - '+titleheight+'px)');
            this.element.find(".exArrayContainer").css("height",'-moz-calc(100% - '+titleheight+'px)');
            this.element.find(".exArrayContainer").css("height",'calc(100% - '+titleheight+'px)');
		} else if (this.options.UnivCType == "Node"){
		    this.redrawNodeCircle();
		}
	},
	refreshRelation: function(){
		for (var id in $J1._p.loadedEntDtl[this.options.id].relations){
		    //이부분....원래는 refreshRelationE 였으나, 이게 더 동작이 나은거 같음.
			$J1._p.getEleFromId(id).relation("refreshRelation");
		}
	},
	embedRelation: function(){
		for (var id in $J1._p.loadedEntDtl[this.options.id].relations){
			$J1._p.getEleFromId(id).relation("embedRelation");
		}
	},
	saveZoomSize: function (){
	    var entDtl = $J1._p.loadedEntDtl[this.options.id];
		if ($J1._p.viewType=="L"){
			entDtl.NM_width = $(this.element).width()*$J1._p.getReverseZoomMultiplier();
			entDtl.NM_height = $(this.element).height()*$J1._p.getReverseZoomMultiplier();
		} else {
			entDtl.NM_Pwidth = $(this.element).width()*$J1._p.getReverseZoomMultiplier();
			entDtl.NM_Pheight = $(this.element).height()*$J1._p.getReverseZoomMultiplier();
		}
	},
	changeId: function(newId){
		this.options.id = newId;
		this.element.attr("id",newId);
	},	
	unregisterRelation: function(id){
		try{
			delete $J1._p.loadedEntDtl[$J1._p.loadedEntDtl[this.options.id].relations[id]];
			$J1._p.loadedEntDtl[this.options.id].relations["count"]--;
		}catch (err){
		}
	},
	registerRelation: function(id) {
		if ($J1._p.loadedEntDtl[this.options.id].relations){
			$J1._p.loadedEntDtl[this.options.id].relations[id]="";
			$J1._p.loadedEntDtl[this.options.id].relations["count"]++;
		} else {
			$J1._p.loadedEntDtl[this.options.id].relations = {"count":1};
			$J1._p.loadedEntDtl[this.options.id].relations[id]="";
		}
	},
	registerBookmark: function(id){
		if ($J1._p.loadedEntDtl[this.options.id].bookmarks){
			$J1._p.loadedEntDtl[this.options.id].bookmarks[id]="";
		} else {
			$J1._p.loadedEntDtl[this.options.id].bookmarks = {};
			$J1._p.loadedEntDtl[this.options.id].bookmarks[id]="";
		}
	},
	unregisterBookmark: function(id){
        delete $J1._p.loadedEntDtl[this.options.id].bookmarks;
	},
	refreshBookmarks: function(){
		for (var id in $J1._p.loadedEntDtl[this.options.id].bookmarks){
		    try{
		        $J1._p.getEleFromId(id).bookmark("refreshBookmark");
		    } catch (err){
		    }

		}
	},
	getOffset: function(LRUD){
		if (LRUD =="R"){
			var offset = this.options.Roffset+20;
			if (offset > this.element.height()) offset = this.element.height();
			this.options.Roffset=offset;
			return offset;
		} else if (LRUD =="D"){
			var offset = this.options.Doffset+20;
			if (offset > this.element.width()) offset = this.element.width();
			this.options.Doffset=offset;
			return offset;
		} else if (LRUD =="L"){
			var offset = this.options.Loffset+20;
			if (offset > this.element.height()) offset = this.element.height();
			this.options.Loffset=offset;
			return offset;			
		} else if (LRUD =="U"){
			var offset = this.options.Uoffset+20;
			if (offset > this.element.width()) offset = this.element.width();
			this.options.Uoffset=offset;
			return offset;
		}
	},

    // Use the _setOption method to respond to changes to options

    _setOption: function( key, value ) {
      switch( key ) {

        case "clear":
          // handle changes to clear option

          break;

      }

      // In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget

      $.Widget.prototype._setOption.apply( this, arguments );
      // In jQuery UI 1.9 and above, you use the _super method instead
      //this._super( "_setOption", key, value );

    },
 
    // Use the destroy method to clean up any modifications your widget has made to the DOM

    destroy: function() {

      // In jQuery UI 1.8, you must invoke the destroy method from the base widget

      $.Widget.prototype.destroy.call( this );
      // In jQuery UI 1.9 and above, you would define _destroy instead of destroy and not call the base method

    }

  });


})(jQuery);
