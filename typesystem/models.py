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
    logical_entity_types = logical_entity_types_collection.find_one({"project_id": project_id})
    if logical_entity_types is not None:
        logical_entity_type_map = {}

        for logical_entity_type in logical_entity_types["logical_entity_types"]:
            logical_entity_type_map[logical_entity_type["label"]] = logical_entity_type["logical_value"]["ko"]
        for entity_type in entity_types["entity_types"]:
            if entity_type["label"] in logical_entity_type_map:
                entity_type["logical_value"] = logical_entity_type_map[entity_type["label"]]
    return entity_types["entity_types"]