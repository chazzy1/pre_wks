# -*- encoding:utf-8 -*-
from flask import Flask
import project
from project import bpproject
from annotation import bpannotator
from resources import bpresources
from typesystem import bptypesystem
import sys
import traceback
from flask_jsglue import JSGlue

app = Flask(__name__)
app.config.from_object('config')
jsglue = JSGlue(app)

from flask_mongoengine import MongoEngine
db = MongoEngine(app)


@app.route('/')
def hello_world():
    return 'Hello World!'


if __name__ == '__main__':

    app.register_blueprint(bpproject, url_prefix='/p')
    app.register_blueprint(bptypesystem, url_prefix='/p/typesystem')
    app.register_blueprint(bpresources, url_prefix='/resources')
    app.register_blueprint(bpannotator, url_prefix='/p/a')

    app.run(port=app.config['PORT'],debug=True)