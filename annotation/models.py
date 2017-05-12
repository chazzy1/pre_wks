# -*- encoding:utf-8 -*-
import uuid
import datetime
from util import *
from werkzeug.utils import secure_filename
import os




def get_annotation_list(project_id):
    documents = documents_collection.find_one({"project_id":project_id})
    return documents["documents"]

def get_entity_type_list(project_id):
    entity_types = entity_types_collection.find_one({"project_id": project_id})
    return entity_types["entity_types"]


def get_ground_truth(project_id, document_id):
    document = ground_truth_collection.find_one(
        {"project_id": project_id,
         "ground_truth.id": document_id
         }
    )
    return document["ground_truth"]

