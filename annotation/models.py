# -*- encoding:utf-8 -*-
import uuid
import datetime
from util import *
from werkzeug.utils import secure_filename
import os

def get_annotation_list(project_id):

    documents = documents_collection.find_one({"project_id":project_id})

    return documents["documents"]


