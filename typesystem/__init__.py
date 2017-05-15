# -*- encoding:utf-8 -*-
from flask import Blueprint

bptypesystem = Blueprint('typesystem', __name__,
                  template_folder='templates',
                  static_folder='static')

from . import views