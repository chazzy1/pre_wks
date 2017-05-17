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