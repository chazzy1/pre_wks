# -*- encoding:utf-8 -*-
from flask import render_template, request
from typesystem import bptypesystem
#from runme import app
import runme
from werkzeug.utils import secure_filename
import os
from typesystem import typesystem_parser


@bptypesystem.route('/<projectid>/typesystem/import', methods=['GET', 'POST'])
@bptypesystem.route('/typesystem/import', methods=['GET', 'POST'])
def import_typesystem(projectid='asdf'):

    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = runme.app.config['UPLOAD_DIR']
        file.save(os.path.join(runme.app.config['UPLOAD_DIR'], filename))
        parser = typesystem_parser.TypesystemParser(filename=filename, filepath=filepath, project_id=projectid)
        parser.wks_json_parser()


    return render_template('typesystem.html.tmpl', projectid="asdf", active_menu="typeSystem")


