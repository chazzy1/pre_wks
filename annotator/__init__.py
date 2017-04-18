# -*- encoding:utf-8 -*-
from flask import Blueprint
from flask import render_template

bpannotator = Blueprint('annotator', __name__, template_folder='templates', static_folder='static')

@bpannotator.route('/')
def hello_world():
    return render_template('annotator.html.tmpl')

from . import views


