# -*- encoding:utf-8 -*-
from flask import render_template, request, send_file, redirect, flash, url_for, current_app
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
from flask_mongoengine.wtf import model_form
from documents import document_parser
from util import *
from documents.document_exporter import export_document_sets
from typesystem import typesystem_parser
from project.forms import ProjectCreateForm, ProjectEditForm, PostCreateForm, PostEditForm
from models import Project
from flask_login import current_user
from models import (
    DocumentSets,
    Post,
)
from forms import (
    DocumentUploadForm
)


@bpproject.route('/<mbj:project_id>/invite', methods=['POST'])
def invite(project_id):
    project = Project.objects.get_or_404(id=project_id)
    email = request.form['email']
    try:
        project.invite(email)
        flash('성공적으로 초대되었습니다.')
    except:
        flash('초대에 실패했습니다.')
    return redirect(url_for('project.members', project_id=project_id))


@bpproject.route('/b/<mbj:post_id>', methods=['GET'])
def post_view(post_id):
    post = Post.objects.get_or_404(id=post_id)
    project = post.project
    return render_template('project_community_view.html.tmpl', project=project, post=post)


@bpproject.route('/b/<mbj:post_id>/delete', methods=['GET', 'POST'])
def post_delete(post_id):
    post = Post.objects.get_or_404(id=post_id)
    project = post.project
    post.delete()
    return redirect(url_for('project.index', project_id=project.id))


@bpproject.route('/b/<mbj:post_id>/edit', methods=['GET', 'POST'])
def post_edit(post_id):
    post = Post.objects.get_or_404(id=post_id)
    project = post.project
    if request.method == 'POST':
        form = PostEditForm(request.form)
        if form.validate():
            form.populate_obj(post)
            post.save()
            flash('성공적으로 저장되었습니다.')
            return redirect(url_for('project.post_view', post_id=post.id))
        else:
            flash('폼에 문제가 있습니다.')
    else:
        form = PostEditForm(obj=post)
    return render_template('project_community_edit.html.tmpl', project=project, post=post, form=form)


@bpproject.route('/<mbj:project_id>/post_write', methods=['GET', 'POST'])
def post_write(project_id):
    project = Project.objects.get_or_404(id=project_id)
    if request.method == 'POST':
        form = PostCreateForm(request.form)
        if form.validate():
            post = Post(project=project)
            form.populate_obj(post)
            post.save()
            flash('성공적으로 저장되었습니다.')
            return redirect(url_for('project.post_view', post_id=post.id))
        else:
            flash('폼에 문제가 있습니다.')
            current_app.logger.debug(form.errors)
    else:
        form = PostCreateForm()
    return render_template('project_community_write.html.tmpl', project=project, form=form)


@bpproject.route('/<mbj:project_id>/members')
def members(project_id):
    project = Project.objects.get_or_404(id=project_id)
    return render_template('project_members.html.tmpl', project=project)


@bpproject.route('/<mbj:project_id>')
def index(project_id):
    project = Project.objects.get_or_404(id=project_id)
    return render_template('project_community.html.tmpl', project=project)


@bpproject.route('/<mbj:project_id>/info', methods=['GET', 'POST'])
def info(project_id):
    project = Project.objects.get_or_404(id=project_id)
    if request.method == 'POST':
        form = ProjectEditForm(request.form)
        if form.validate():
            form.populate_obj(project)
            project.save()
            flash('Saved the project successfully.')
        else:
            flash('Sorry, There are invalid form data.')
    else:
        form = ProjectEditForm(obj=project)
    return render_template('project_info.html.tmpl', project=project, form=form)


@bpproject.route('/<mbj:project_id>/delete')
def delete(project_id):
    project = Project.objects.get_or_404(id=project_id)
    project.delete()
    return redirect(url_for('portal.index'))


@bpproject.route('/createproject', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        form = ProjectCreateForm(request.form)
        if form.validate():
            project = Project()
            form.populate_obj(project)
            project.save()
            flash('Created the project successfully.')
            return redirect(url_for('project.index', project_id=project.id))
        else:
            flash('invalid form data.')
    else:
        form = ProjectCreateForm()
    return render_template('projectcreate.html.tmpl', form=form)

# @bpproject.route('/projects')
# def projects():
#     projects = Project.objects(created_by=current_user._get_current_object())
#     return render_template('projects.html.tmpl', projects=projects)

@bpproject.route('/<mbj:project_id>/annotation', methods=['GET', 'POST'])
def annotation(project_id):
    project = Project.objects.get_or_404(id=project_id)
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = current_app.config['UPLOAD_DIR']
        file.save(os.path.join(current_app.config['UPLOAD_DIR'], filename))
        parser = typesystem_parser.TypesystemParser(filename=filename, filepath=filepath, project_id=project_id)
        parser.wks_json_parser()

    return render_template('annotation.html.tmpl', project=project, active_menu="humanAnnotation")


@bpproject.route('/<mbj:project_id>/dictionaries', methods=['GET', 'POST'])
def dictionaries(project_id):

    project = Project.objects.get_or_404(id=project_id)
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = current_app.config['UPLOAD_DIR']
        file.save(os.path.join(current_app.config['UPLOAD_DIR'], filename))
        parser = typesystem_parser.TypesystemParser(filename=filename, filepath=filepath, project_id=project_id)
        parser.wks_json_parser()

    return render_template('dictionaries.html.tmpl', project=project, active_menu="dictionaries")


@bpproject.route('/<mbj:project_id>/documents/export', methods=['GET', 'POST'])
def documents_export(project_id):
    zip_file_path = export_document_sets(project_id)
    return send_file(zip_file_path, mimetype='application/octet-stream')


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
        filepath = current_app.config['UPLOAD_DIR']
        file.save(os.path.join(current_app.config['UPLOAD_DIR'], filename))

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
