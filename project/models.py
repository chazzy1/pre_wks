from runme import db
from flask import url_for
from flask_login import current_user
from datetime import datetime

def _current_user():
    return current_user._get_current_object().id

class Project(db.Document):

    title = db.StringField(required=True, max_length=40, min_length=2)
    description = db.StringField()
    created_by = db.ReferenceField('User', default=_current_user, required=True)
    created_at = db.DateTimeField(default=datetime.now, required=True)
    modified_at = db.DateTimeField(
        default=datetime.now, required=True)
    meta = {
        'ordering': ['-modified_at', '-created_at']
    }

    @property
    def url(self):
        return url_for('project.documents', project_id=self.id)
