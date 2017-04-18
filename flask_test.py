# -*- encoding:utf-8 -*-
from flask import Flask
import annotator
from annotator import bpannotator
from resources import bpresources
app = Flask(__name__)
app.config.from_object('config')

@app.route('/')
def hello_world():
    return 'Hello World!'

if __name__ == '__main__':

    app.register_blueprint(bpannotator,url_prefix='/annotator')
    app.register_blueprint(bpresources, url_prefix='/resources')

    app.run(port=app.config['PORT'],debug=True)