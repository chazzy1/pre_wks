from runme import db
from flask import url_for
from flask_login import current_user
from datetime import datetime

import mongoengine

def _current_user():
    return current_user._get_current_object().id


class ProjectInvitationError(Exception):
    pass


class Project(db.Document):

    title = db.StringField(required=True, max_length=40, min_length=2)
    description = db.StringField()
    created_by = db.ReferenceField('User', default=_current_user, required=True)
    created_at = db.DateTimeField(default=datetime.now, required=True)
    modified_at = db.DateTimeField(
        default=datetime.now, required=True)

    @property
    def url(self):
        return url_for('project.index', project_id=self.id)

    @property
    def queryset_post(self):
        return Post.objects(project=self)

    @property
    def queryset_project_user(self):
        return ProjectUser.objects(project=self)

    @property
    def owner(self):
        return self.created_by

    def invite(self, email):
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise ProjectInvitationError('not user')
        if ProjectUser.objects(user=user, project=project).first():
            raise ProjectInvitationError('already member')
        return ProjectUser.objects(user=user, project=project).save()



class ProjectUser(db.Document):

    project = db.ReferenceField('Project', required=True, reverse_delete_rule=mongoengine.CASCADE)
    user = db.ReferenceField('User', required=True, reverse_delete_rule=mongoengine.CASCADE)
    last_visited_at = db.DateTimeField(default=datetime.now, required=True)
    role = db.StringField()
    created_at = db.DateTimeField(default=datetime.now, required=True)


class Post(db.Document):

    project = db.ReferenceField('Project', required=True, reverse_delete_rule=mongoengine.CASCADE)
    title = db.StringField(required=True)
    contents = db.StringField(required=True)
    created_by = db.ReferenceField('User', default=_current_user, required=True)
    created_at = db.DateTimeField(default=datetime.now, required=True)
    modified_at = db.DateTimeField(default=datetime.now, required=True)
