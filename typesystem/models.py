# -*- encoding:utf-8 -*-
import uuid
import datetime
from util import *
from werkzeug.utils import secure_filename
import os
from bson import json_util

import json


def get_entity_type_list(project_id):
    entity_types = entity_types_collection.find_one({"project_id": project_id})
    return entity_types["entity_types"]


def get_relationship_type_list(project_id):
    entity_types = relationship_types_collection.find_one({"project_id": project_id})
    return entity_types["relationship_types"]


def get_type_system_diagram(project_id):
    diagram = type_system_diagram_collection.find_one({"project_id": project_id})

    return diagram["type_system_diagram"] if diagram is not None else None


def save_all(project_id, type_system_diagram):

    result = type_system_diagram_collection.update(
        {"project_id": project_id,
        },
        {
            "$set": {"type_system_diagram": type_system_diagram}
        },
        multi=False,
        upsert=True
    )

    return result
