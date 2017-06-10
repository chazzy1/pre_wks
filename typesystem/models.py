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
            logical_entity_type_map[logical_entity_type["label"]] = logical_entity_type
        for entity_type in entity_types["entity_types"]:
            if entity_type["label"] in logical_entity_type_map:
                logical_entity_type = logical_entity_type_map[entity_type["label"]]

                if "definition" in logical_entity_type:
                    entity_type["definition"] = logical_entity_type["definition"]
                if "logical_value" in logical_entity_type:
                    entity_type["logical_value"] = logical_entity_type["logical_value"]["ko"]

    return entity_types["entity_types"]


def get_relationship_type_list(project_id):
    entity_types = relationship_types_collection.find_one({"project_id": project_id})
    logical_relationship_types = logical_relationship_types_collection.find_one({"project_id": project_id})
    if logical_relationship_types is not None:
        logical_relationship_type_map = {}

        for logical_relationship_type in logical_relationship_types["logical_relationship_types"]:
            logical_relationship_type_map[logical_relationship_type["label"]] = logical_relationship_type["logical_value"]["ko"]
        for relationship_type in entity_types["relationship_types"]:
            if relationship_type["label"] in logical_relationship_type_map:
                relationship_type["logical_value"] = logical_relationship_type_map[relationship_type["label"]]
    return entity_types["relationship_types"]


def get_type_system_diagram(project_id):
    diagram = type_system_diagram_collection.find_one({"project_id": project_id})

    return diagram["type_system_diagram"] if diagram is not None else None


def save_all(project_id, type_system_diagram, entity_types):
    new_entity_types = []
    new_logical_entity_types = []

    for key, entity_type in entity_types.iteritems():
        #logical_entity_type.setdefault(key, []).append(value)
        new_logical_entity_type = {}
        logical_value = entity_type["logical_value"] if "logical_value" in entity_type else None
        definition = entity_type["definition"] if "definition" in entity_type else None
        if logical_value is not None or definition is not None:
            new_logical_entity_type["label"] = entity_type["label"]
            if definition is not None:
                new_logical_entity_type["definition"] = definition
            if logical_value is not None:
                new_logical_entity_type["logical_value"] = {"ko": logical_value}
            new_logical_entity_types.append(new_logical_entity_type)


        entity_type.pop('logical_value', None)
        entity_type.pop('definition', None)
        new_entity_types.append(entity_type)

    logical_entity_types_collection.update(
        {
            "project_id": project_id,
        },
        {
            "$set": {"logical_entity_types": new_logical_entity_types}
        },
        multi=False,
        upsert=True
    )

    entity_types_collection.update(
        {"project_id": project_id,
        },
        {
            "$set": {"entity_types": new_entity_types}
        },
        multi=False,
        upsert=True
    )

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
