# -*- encoding:utf-8 -*-
import uuid
import datetime
from util import *
from werkzeug.utils import secure_filename
import os


class AnnotationDataModel():

    def __init__(self):
        pass

    def get_annotation_list(self, project_id):
        documents = documents_collection.find_one({"project_id":project_id})
        return documents["documents"]

    def get_entity_type_list(self, project_id):
        entity_types = entity_types_collection.find_one({"project_id": project_id})
        return entity_types["entity_types"]


    def get_document(self, project_id, document_id):
        document = documents_collection.find_one(
            {"project_id": project_id,
             "documents.id": document_id
             },
            {"documents.$": 1}
        )
        return document["documents"][0]

annotation_data_model = AnnotationDataModel()