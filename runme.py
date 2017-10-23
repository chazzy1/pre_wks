from flask import Flask, redirect, url_for
from flask import render_template
from flask_security import Security, MongoEngineUserDatastore, \
    UserMixin, RoleMixin, login_required
from flask_jsglue import JSGlue
from flask_mongoengine import MongoEngine
from werkzeug.routing import BaseConverter
import time

db = MongoEngine()
jsglue = JSGlue()

def create_app():
    app = Flask(__name__, static_url_path='/_static')
    app.config.from_object('config')

    jsglue.init_app(app)
    db.init_app(app)


    from models import User, Role

    # Setup Flask-Security
    user_datastore = MongoEngineUserDatastore(db, User, Role)
    security = Security(app, user_datastore)


    # Create a user to test with
    @app.before_first_request
    def create_user():
        user_datastore.create_user(email='matt@nobien.net', password='password')

    @app.route('/')
    def index():
        return redirect(url_for('portal.index'))

    # Views
    # @app.route('/')
    # @login_required
    # def home():
    #     return render_template('index.html')


    # @app.route('/')
    # @login_required
    # def hello_world():
    #     return redirect(url_for('project.documents'))

    from project import bpproject
    from annotation import bpannotator
    from resources import bpresources
    from typesystem import bptypesystem
    from portal import bpportal
    # from login import bpapp as bplogin

    class RegexConverter(BaseConverter):

        def __init__(self, url_map, *items):
            super(RegexConverter, self).__init__(url_map)
            self.regex = items[0]

    class MongoObjRegexConverter(BaseConverter):

        def __init__(self, url_map):
            super(MongoObjRegexConverter, self).__init__(url_map)
            self.regex = "[a-z0-9]{24}"

    gen_timestamp = time.time()

    @app.template_filter('autoversion')
    def autoversion_filter(filename):
        # determining fullpath might be project specific
        # fullpath = os.path.join('some_app/', filename[1:])
        # try:
        #     timestamp = str(os.path.getmtime(fullpath))
        # except OSError:
        #     return filename
        newfilename = "{0}?v={1}".format(filename, gen_timestamp)
        return newfilename

    # Use the RegexConverter function as a converter
    # method for mapped urls
    app.url_map.converters['regex'] = RegexConverter
    app.url_map.converters['mbj'] = MongoObjRegexConverter

    app.register_blueprint(bpportal, url_prefix='/portal')
    app.register_blueprint(bpproject, url_prefix='/p')
    app.register_blueprint(bptypesystem, url_prefix='/p/typesystem')
    app.register_blueprint(bpresources, url_prefix='/resources')
    app.register_blueprint(bpannotator, url_prefix='/p/a')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(host='0.0.0.0', port=app.config['PORT'], debug=True)
