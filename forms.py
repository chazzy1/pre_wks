from wtforms import (
    Form,
    TextField,
    BooleanField,
    HiddenField,
    FileField,
    FormField,
    validators,
    widgets,
    FieldList,
)


class DocumentUploadForm(Form):
    title = TextField('title', [validators.Length(min=2, max=255)])
    # banner_imgf = FileField(u'배너 이미지')
