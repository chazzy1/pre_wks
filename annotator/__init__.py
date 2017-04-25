# -*- encoding:utf-8 -*-
from flask import Blueprint
from flask import render_template


bpannotator = Blueprint('annotator', __name__, template_folder='templates', static_folder='static')


@bpannotator.route('/typesystem')
def typesystem():
    return render_template('base.html.tmpl', my_string="asdf")




from . import views
