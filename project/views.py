# -*- encoding:utf-8 -*-
from flask import render_template,request
from project import bpproject
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
from werkzeug.utils import secure_filename
from runme import db
from runme import app
from flask_mongoengine.wtf import model_form
import os
from documents import document_parser

class DocumentUploadForm(Form):
    title     = TextField('title', [validators.Length(min=2, max=255)])
    #banner_imgf = FileField(u'배너 이미지')


class baseDocument(db.Document):
    title = db.StringField(required=False, max_length=255, min_length=2)

#uploadForm = model_form(DocumentUploadForm)

@bpproject.route('/<projectid>/documents', methods=['GET', 'POST'])
@bpproject.route('/documents', methods=['GET', 'POST'])
def documents(projectid='asdf'):
    #form = RegistrationForm.objects.get_or_404(id='test')
    print projectid
    form = DocumentUploadForm((request.form))

    #basedoc =  baseDocument.objects.get_or_404(title="asdf")
    basedoc = baseDocument()
    if request.method == 'POST':
        file = request.files['file']
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_DIR'], filename)
        file.save(filepath)

        parser = document_parser.DocumentParser(filepath)
        parser.csv_parser()


        form.populate_obj(basedoc)


        basedoc.save()





        return render_template('documents.html.tmpl', active_menu="documents", form=form)

    else:
        pass




    return render_template('documents.html.tmpl', active_menu="documents", form=form)




