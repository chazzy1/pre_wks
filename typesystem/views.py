# -*- encoding:utf-8 -*-
from flask import render_template, request
from typesystem import bptypesystem
#from runme import app
import runme
from werkzeug.utils import secure_filename
import os
from typesystem import typesystem_parser
import models
from util import log_exception
from bson.json_util import dumps

@bptypesystem.route('/<projectid>/import', methods=['GET', 'POST'])
@bptypesystem.route('/import', methods=['GET', 'POST'])
def import_typesystem(projectid='asdf'):
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = runme.app.config['UPLOAD_DIR']
        file.save(os.path.join(runme.app.config['UPLOAD_DIR'], filename))
        parser = typesystem_parser.TypesystemParser(filename=filename, filepath=filepath, project_id=projectid)
        parser.wks_json_parser()


    return render_template('typesystem.html.tmpl', projectid="asdf", active_menu="typeSystem")




@bptypesystem.route('/getEntityTypeList/<project_id>', methods=['POST', 'GET'])
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

@bptypesystem.route('/getRelationshipTypeList/<project_id>', methods=['POST', 'GET'])
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



