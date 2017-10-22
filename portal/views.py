# -*- encoding:utf-8 -*-
from flask import render_template, request, send_file, redirect, flash, url_for
import os
from portal import bpportal
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


@bpportal.route('/')
def index():
    if current_user.is_active:
        return render_template('myprojects.html.tmpl')
    else:
        return render_template('index.html.tmpl')


