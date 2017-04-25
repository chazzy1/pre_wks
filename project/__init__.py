# -*- encoding:utf-8 -*-
from flask import Blueprint
from flask import render_template


bpproject = Blueprint('project', __name__, template_folder='templates', static_folder='static')


@bpproject.route('/typesystem')
def typesystem(projectid=None):
    return render_template('base.html.tmpl', my_string="asdf")




from . import views
