# -*- encoding:utf-8 -*-
from flask import render_template, request, send_file, redirect, flash, url_for
import os
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
from documents import document_parser
from util import *
from documents.document_exporter import export_document_sets
from typesystem import typesystem_parser
from project.forms import ProjectCreateForm
from project.models import Project
from flask_login import current_user


@bpproject.route('/createproject', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        form = ProjectCreateForm(request.form)
        if form.validate():
            project = Project()
            form.populate_obj(project)
            project.save()
            flash('Created the project successfully.')
            return redirect(url_for('project.documents', project_id=project.id))
        else:
            flash('invalid form data.')
    else:
        form = ProjectCreateForm()
    return render_template('projectcreate.html.tmpl', form=form)

@bpproject.route('/projects')
def projects():
    projects = Project.objects(created_by=current_user._get_current_object())
    return render_template('projects.html.tmpl', projects=projects)

@bpproject.route('/<mbj:project_id>/annotation', methods=['GET', 'POST'])
def annotation(project_id):
    project = Project.objects.get_or_404(id=project_id)
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = app.config['UPLOAD_DIR']
        file.save(os.path.join(app.config['UPLOAD_DIR'], filename))
        parser = typesystem_parser.TypesystemParser(filename=filename, filepath=filepath, project_id=project_id)
        parser.wks_json_parser()

    return render_template('annotation.html.tmpl', project=project, active_menu="humanAnnotation")


@bpproject.route('/<mbj:project_id>/dictionaries', methods=['GET', 'POST'])
def dictionaries(project_id):

    project = Project.objects.get_or_404(id=project_id)
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = app.config['UPLOAD_DIR']
        file.save(os.path.join(app.config['UPLOAD_DIR'], filename))
        parser = typesystem_parser.TypesystemParser(filename=filename, filepath=filepath, project_id=project_id)
        parser.wks_json_parser()

    return render_template('dictionaries.html.tmpl', project=project, active_menu="dictionaries")


class DocumentUploadForm(Form):
    title = TextField('title', [validators.Length(min=2, max=255)])
    # banner_imgf = FileField(u'배너 이미지')


class DocumentSets(db.Document):
    title = db.StringField(required=False, max_length=255, min_length=2)

# uploadForm = model_form(DocumentUploadForm)

@bpproject.route('/<mbj:project_id>/documents/export', methods=['GET', 'POST'])
def documents_export(project_id):
    zip_file_path = export_document_sets(project_id)
    return send_file(zip_file_path, mimetype='application/octet-stream')


@bpproject.route('/<mbj:project_id>')
@bpproject.route('/<mbj:project_id>/documents', methods=['GET', 'POST'])
def documents(project_id):
    # form = RegistrationForm.objects.get_or_404(id='test')
    project = Project.objects.get_or_404(id=project_id)
    form = DocumentUploadForm((request.form))

    # basedoc =  baseDocument.objects.get_or_404(title="asdf")
    basedoc = DocumentSets()
    basedoc.project_id = project_id

    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = app.config['UPLOAD_DIR']
        file.save(os.path.join(app.config['UPLOAD_DIR'], filename))

        form.populate_obj(basedoc)

        #basedoc.save()

        parser = document_parser.DocumentParser(filename=filename, filepath=filepath, project_id=project_id)
        parser.csv_parser()

        # return render_template('documents.html.tmpl', active_menu="documents", form=form, document_sets=document_sets)
    else:
        pass

    project_sets = sets_collection.find_one({"project_id": project_id})
    document_sets = project_sets["sets"] if project_sets is not None else []

    return render_template(
        'documents.html.tmpl',
        active_menu="documents",
        form=form,
        document_sets=document_sets,
        project=project)
