# -*- encoding:utf-8 -*-
from flask import render_template, request, send_file
from project import bpproject
from wtforms import (
    Form,
    TextField,
    BooleanField,
    HiddenField,
    FileField,
    FormField,
    validators,
    widgets,
    FieldList,
)
from werkzeug.utils import secure_filename
from runme import db
from runme import app
from flask_mongoengine.wtf import model_form
import os
from documents import document_parser
from util import *
from documents.document_exporter import export_document_sets

from typesystem import typesystem_parser







@bpproject.route('/annotation', methods=['GET', 'POST'])
def annotation(projectid=None):

    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = app.config['UPLOAD_DIR']
        file.save(os.path.join(app.config['UPLOAD_DIR'], filename))
        parser = typesystem_parser.TypesystemParser(filename=filename, filepath=filepath, project_id=projectid)
        parser.wks_json_parser()

    return render_template('annotation.html.tmpl', projectid="asdf", active_menu="humanAnnotation")





@bpproject.route('/typesystem', methods=['GET', 'POST'])
def typesystem(projectid='asdf'):

    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = app.config['UPLOAD_DIR']
        file.save(os.path.join(app.config['UPLOAD_DIR'], filename))
        parser = typesystem_parser.TypesystemParser(filename=filename, filepath=filepath, project_id=projectid)
        parser.wks_json_parser()

    return render_template('typesystem.html.tmpl', projectid="asdf", active_menu="typeSystem")


























class DocumentUploadForm(Form):
    title = TextField('title', [validators.Length(min=2, max=255)])
    # banner_imgf = FileField(u'배너 이미지')


class DocumentSets(db.Document):
    title = db.StringField(required=False, max_length=255, min_length=2)

# uploadForm = model_form(DocumentUploadForm)

@bpproject.route('/<projectid>/documents/export', methods=['GET', 'POST'])
@bpproject.route('/documents/ex[prt', methods=['GET', 'POST'])
def documents_export(projectid='asdf'):
    zip_file_path = export_document_sets(projectid)
    return send_file(zip_file_path, mimetype='application/octet-stream')

@bpproject.route('/<projectid>/documents', methods=['GET', 'POST'])
@bpproject.route('/documents', methods=['GET', 'POST'])
def documents(projectid='asdf'):
    # form = RegistrationForm.objects.get_or_404(id='test')

    form = DocumentUploadForm((request.form))

    # basedoc =  baseDocument.objects.get_or_404(title="asdf")
    basedoc = DocumentSets()
    basedoc.project_id = projectid

    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = app.config['UPLOAD_DIR']
        file.save(os.path.join(app.config['UPLOAD_DIR'], filename))

        form.populate_obj(basedoc)

        #basedoc.save()

        parser = document_parser.DocumentParser(filename=filename, filepath=filepath, project_id=projectid)
        parser.csv_parser()

        # return render_template('documents.html.tmpl', active_menu="documents", form=form, document_sets=document_sets)

    else:
        pass

    project_sets = sets_collection.find_one({"project_id": projectid})
    document_sets = project_sets["sets"] if project_sets is not None else []

    return render_template('documents.html.tmpl', active_menu="documents", form=form, document_sets=document_sets)




