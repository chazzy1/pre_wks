# -*- encoding:utf-8 -*-
from flask import render_template,request
from annotator import bpannotator
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

from runme import db
from flask_mongoengine.wtf import model_form


class DocumentUploadForm(Form):
    title     = TextField('title', [validators.Length(min=2, max=255)])
    banner_imgf = FileField(u'배너 이미지')


class baseDocument(db.Document):
    title = db.StringField(required=False, max_length=255, min_length=2)

#uploadForm = model_form(DocumentUploadForm)

@bpannotator.route('/documents', methods=['GET', 'POST'])
def documents():
    #form = RegistrationForm.objects.get_or_404(id='test')

    form = DocumentUploadForm((request.form))

    #basedoc =  baseDocument.objects.get_or_404(title="asdf")
    basedoc = baseDocument()
    if request.method == 'POST':
        print("@@@@@@@@@@@@@@@@@@@@@@@@2")
        form.populate_obj(basedoc)
        basedoc.save()
        return render_template('documents.html.tmpl', active_menu="documents", form=form)

    else:
        pass




    return render_template('documents.html.tmpl', active_menu="documents", form=form)




