# -*- encoding:utf-8 -*-
import uuid
import datetime
from util import *
from werkzeug.utils import secure_filename
import os
import json



class TypesystemParser:
    def __init__(self, filename, filepath, project_id):
        self.uploaded_file = os.path.join(filepath, filename)
        self.global_file_name = filename
        self.global_project_id = project_id

    global_file_name = None
    global_project_id = None

    def get_base_document(self, document_index=0, modified_date=0):
        if self.global_document_id is None:
            self.global_document_id = str(uuid.uuid1())

        document_id = str(self.global_document_id) + "-{0}".format(document_index)
        document = {"id": document_id,
                    "name": None,
                    "text": None,
                    "status": "READY",
                    "modifiedDate": modified_date}
        return document

    @classmethod
    def get_base_set(cls):
        token = {"id": None,
                 "name": None,
                 "documents": [],
                 "count": None,
                 "type": False,
                 "modifiedDate": 0}
        return token

    @classmethod
    def get_epoch_time(cls):
        epoch = datetime.datetime.utcfromtimestamp(0)
        return int((datetime.datetime.today() - epoch).total_seconds() * 1000.0)

    def wks_json_parser(self):
        print self.uploaded_file
        f = open(self.uploaded_file, 'r')
        data = f.read()
        f.close()

        json_data = json.loads(data)

        entity_types = json_data["entityTypes"]
        relationship_types = json_data["relationshipTypes"]
        sire_info = json_data["sireInfo"]
        functionalEntityTypes = json_data["functionalEntityTypes"]
        kgimported = json_data["kgimported"]

        self.create_entity_types(entity_types)
        self.create_relationship_types(relationship_types)
        self.create_sire_info(sire_info)

    def create_entity_types(self, entity_types):
        entity_types_collection.update(
            {"project_id": self.global_project_id},
            {
                "$set":{"entity_types": entity_types}
            },
            multi=False,
            upsert=True
        )




    def create_relationship_types(self, relationship_types):
        relationship_types_collection.update(
            {"project_id": self.global_project_id},
            {
                "$set": {"entity_types": relationship_types}
            },
            multi=False,
            upsert=True
        )


    def create_sire_info(self, sire_info):
        sire_info_collection.update(
            {"project_id": self.global_project_id},
            {
                "$set": {"sire_info": sire_info}
            },
            multi=False,
            upsert=True
        )
