# -*- encoding:utf-8 -*-
from flask import Flask
import project
from project import bpproject
from resources import bpresources
import sys
import traceback

app = Flask(__name__)
app.config.from_object('config')
from flask_mongoengine import MongoEngine
db = MongoEngine(app)




@app.route('/')
def hello_world():
    return 'Hello World!'




if __name__ == '__main__':

    app.register_blueprint(bpproject, url_prefix='/p')
    #app.register_blueprint(bpannotator,url_prefix='/project')
    app.register_blueprint(bpresources, url_prefix='/resources')

    app.run(port=app.config['PORT'],debug=True)