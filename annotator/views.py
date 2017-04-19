from flask import render_template
from annotator import bpannotator
from wtforms import Form, BooleanField, TextField, validators



class RegistrationForm(Form):
    username     = TextField('Username', [validators.Length(min=4, max=25)])
    email        = TextField('Email Address', [validators.Length(min=6, max=35)])
    accept_rules = BooleanField('I accept the site rules', [validators.Required()])







@bpannotator.route('/documents')
def documents():
    form = RegistrationForm()


    return render_template('documents.html.tmpl', active_menu="documents", form=form)




