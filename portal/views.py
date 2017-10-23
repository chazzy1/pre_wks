# -*- encoding:utf-8 -*-
from flask import render_template, request, send_file, redirect, flash, url_for
import os
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
from typesystem import typesystem_parser
from project.forms import ProjectCreateForm
from models import Project
from flask_login import current_user
from portal import bpportal


@bpportal.route('/')
def index():
    if current_user.is_active:
        return render_template('myprojects.html.tmpl')
    else:
        return render_template('index.html.tmpl')


@bpportal.route('/dialog_privacy_policy')
def dialog_privacy_policy():
    return render_template('dialog_privacy_policy.html')


@bpportal.route('/_dialog_toc')
def dialog_toc():
    return render_template('dialog_toc.html')


@bpportal.route('/_dialog_dont_collect_emails')
def dialog_dont_collect_emails():
    return render_template('dialog_dont_collect_emails.html')
