# -*- encoding:utf-8 -*-
from flask import Blueprint
from flask import render_template


bpproject = Blueprint('project', __name__, template_folder='templates', static_folder='static')







from . import views
from annotation import views
