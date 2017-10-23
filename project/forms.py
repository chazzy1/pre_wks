from wtforms import (
    # Form,
    TextField,
    # SelectField,
    FileField,
    HiddenField,
    validators,
    BooleanField,
    widgets,
)
from wtforms.validators import ValidationError
from flask_wtf import FlaskForm as Form


class ProjectBasicMixin(object):
    title = TextField(
        label='프로젝트이름',
        validators=[
            validators.Required("프로젝트이름은 필수입력항목입니다."),
            validators.Length(
                min=2, max=40, message='2-40자 길이로 가능합니다.'),
        ],
        render_kw=dict(placeholder="프로젝트 이름(2~40자)"))
    description = TextField(
        label='프로젝트 소개',
        render_kw=dict(placeholder='프로젝트에 대한 설명'))


class ProjectCreateForm(Form, ProjectBasicMixin):
    pass


class ProjectEditForm(Form, ProjectBasicMixin):
    pass
