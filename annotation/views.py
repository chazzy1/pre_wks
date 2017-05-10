# -*- encoding:utf-8 -*-
from flask import render_template, request, send_file
from annotation import bpannotator
from models import *


@bpannotator.route('/list', methods=['GET', 'POST'])
def list(projectid=None):
    print "@@@@@@@@@@@@@@@@@@"


    project_id = "asdf"

    annotation_list = get_annotation_list(project_id=project_id)

    return render_template('annotation_list.html.tmpl', projectid="asdf", active_menu="annotation", annotation_list=annotation_list)



@bpannotator.route('/tool', methods=['GET', 'POST'])
def tool(projectid=None):
    print "!!!!!!!!!!!!!!!!!"


    project_id = "asdf"


    return render_template('annotation_list.html.tmpl', projectid="asdf", active_menu="annotation", annotation_list=annotation_list)

