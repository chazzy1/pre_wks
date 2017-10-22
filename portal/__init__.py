from flask import Blueprint
from flask import render_template


bpportal = Blueprint('portal', __name__, template_folder='templates', static_folder='static')

from . import views
