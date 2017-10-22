from flask import Flask, redirect, url_for
from flask import render_template
from flask_security import Security, MongoEngineUserDatastore, \
    UserMixin, RoleMixin, login_required
from flask_jsglue import JSGlue
from flask_mongoengine import MongoEngine
from werkzeug.routing import BaseConverter

app = Flask(__name__, static_url_path='/_static')
app.config.from_object('config')

jsglue = JSGlue(app)
db = MongoEngine(app)


class Role(db.Document, RoleMixin):
    name = db.StringField(max_length=80, unique=True)
    description = db.StringField(max_length=255)


class User(db.Document, UserMixin):
    email = db.StringField(max_length=255)
    password = db.StringField(max_length=255)
    active = db.BooleanField(default=True)
    confirmed_at = db.DateTimeField()
    roles = db.ListField(db.ReferenceField(Role), default=[])

    @property
    def queryset_project(self):
        from project.models import Project
        return Project.objects(created_by=self)



# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, User, Role)
security = Security(app, user_datastore)


# Create a user to test with
@app.before_first_request
def create_user():
    user_datastore.create_user(email='matt@nobien.net', password='password')


# Views
# @app.route('/')
# @login_required
# def home():
#     return render_template('index.html')


# @app.route('/')
# @login_required
# def hello_world():
#     return redirect(url_for('project.documents'))


if __name__ == '__main__':

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

    # Use the RegexConverter function as a converter
    # method for mapped urls
    app.url_map.converters['regex'] = RegexConverter
    app.url_map.converters['mbj'] = MongoObjRegexConverter

    app.register_blueprint(bpportal, url_prefix='/')
    app.register_blueprint(bpproject, url_prefix='/p')
    app.register_blueprint(bptypesystem, url_prefix='/p/typesystem')
    app.register_blueprint(bpresources, url_prefix='/resources')
    app.register_blueprint(bpannotator, url_prefix='/p/a')

    app.run(host='0.0.0.0', port=app.config['PORT'], debug=True)
