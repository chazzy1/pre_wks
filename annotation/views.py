# -*- encoding:utf-8 -*-
from flask import render_template, request, send_file
from annotation import bpannotator
import models
import json
from bson.json_util import dumps
import sys
from util import *




@bpannotator.route('/list', methods=['GET', 'POST'])
def list(projectid=None):
    print "@@@@@@@@@@@@@@@@@@"


    project_id = "asdf"

    annotation_list = models.get_annotation_list(project_id=project_id)

    return render_template('annotation_list.html.tmpl', projectid="asdf", active_menu="annotation", annotation_list=annotation_list)



@bpannotator.route('/tool/<documentid>', methods=['GET', 'POST'])
def tool(documentid, projectid=None):
    print "!!!!!!!!!!!!!!!!!"
    print documentid


    project_id = "asdf"


    return render_template('annotation_tool.html.tmpl', projectid="asdf", documentid=documentid)




@bpannotator.route('/getEntityTypeList/<project_id>', methods=['POST', 'GET'])
def get_entity_type_list(project_id):
    result = {}
    entity_type_list = None

    try:
        #project_id = str(request.json['project_id'])
        result = {}
        entity_type_list = models.get_entity_type_list(project_id)
        result["resultOK"] = True
        result["list"] = entity_type_list

    except Exception as e:
        result["resultOK"] = False
        result["message"] = str(Exception)
        log_exception(e)

    return dumps(result, ensure_ascii=False)

@bpannotator.route('/getRelationshipTypeList/<project_id>', methods=['POST', 'GET'])
def get_relationship_type_list(project_id):
    result = {}
    relationship_type_list = None

    try:
        result = {}
        relationship_type_list = models.get_relationship_type_list(project_id)
        result["resultOK"] = True
        result["list"] = relationship_type_list

    except Exception as e:
        result["resultOK"] = False
        result["message"] = str(Exception)
        log_exception(e)

    return dumps(result, ensure_ascii=False)

@bpannotator.route('/getGroundTruth/<project_id>', methods=['POST', 'GET'])
def get_ground_truth(project_id):
    result = {}

    try:
        document_id = str(request.json['document_id'])
        result = {}
        document = models.get_ground_truth(project_id, document_id)
        result["resultOK"] = True
        result["document"] = document

    except Exception as e:
        result["resultOK"] = False
        result["message"] = str(Exception)
        log_exception(e)

    return dumps(result, ensure_ascii=False)


@bpannotator.route('/getSireInfo/<project_id>', methods=['POST', 'GET'])
def get_sire_info(project_id):
    result = {}

    try:
        document_id = str(request.json['document_id'])
        result = {}
        document = models.get_sire_info(project_id)
        result["resultOK"] = True
        result["sireInfo"] = document

    except Exception as e:
        result["resultOK"] = False
        result["message"] = str(Exception)
        log_exception(e)

    return dumps(result, ensure_ascii=False)

@bpannotator.route('/saveAll/<project_id>', methods=['POST', 'GET'])
def save_all(project_id):
    result = {}

    try:
        ground_truth_id = str(request.json['ground_truth_id'])
        save_data = request.json['saveData']
        result = {}
        save_result = models.save_all(project_id, ground_truth_id=ground_truth_id, save_data=save_data)
        result["resultOK"] = True
        result["result"] = save_result

    except Exception as e:
        result["resultOK"] = False
        result["message"] = str(Exception)
        log_exception(e)

    return dumps(result, ensure_ascii=False)

