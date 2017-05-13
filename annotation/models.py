# -*- encoding:utf-8 -*-
import uuid
import datetime
from util import *
from werkzeug.utils import secure_filename
import os
from bson import json_util

import json

def get_annotation_list(project_id):
    documents = documents_collection.find_one({"project_id":project_id})
    return documents["documents"]


def get_entity_type_list(project_id):
    entity_types = entity_types_collection.find_one({"project_id": project_id})
    return entity_types["entity_types"]


def get_sire_info(project_id):
    sire_info = sire_info_collection.find_one({"project_id": project_id})
    return sire_info["sire_info"]


def get_ground_truth(project_id, ground_truth_id):
    document = ground_truth_collection.find_one(
        {"project_id": project_id,
         "ground_truth.id": ground_truth_id
         }
    )
    return document["ground_truth"]


def save_all(project_id, ground_truth_id, save_data):

    result = ground_truth_collection.update(
        {"project_id": project_id,
         "ground_truth.id": ground_truth_id
        },
        {
            "$set": {"ground_truth.mentions": save_data["mentions"],
                     "ground_truth.relations": save_data["relations"],
                     "ground_truth.corefs": save_data["corefs"]
                     }
        },
        multi=False,
        upsert=True
    )

    return result

