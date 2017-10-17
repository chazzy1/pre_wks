# -*- encoding:utf-8 -*-
import uuid
from util import (
    sets_collection,
    documents_collection,
    ground_truth_collection,
)
from flask import current_app

import os
import json
import zipfile


def export_document_sets(project_id):
    tmp_dir_id = str(uuid.uuid1())
    download_path = current_app.config['DOWNLOAD_DIR']

    new_dir_path = os.path.join(download_path, tmp_dir_id)
    new_gt_dir_path = os.path.join(new_dir_path, "gt")
    # os.makedirs(new_dir_path)
    os.makedirs(new_gt_dir_path)

    project_sets = sets_collection.find_one({"project_id": project_id})
    with open(os.path.join(new_dir_path, "sets.json"), 'w') as sets_file:
        json.dump(project_sets["sets"], sets_file)
    project_documents = documents_collection.find_one({
        "project_id": project_id
    })

    with open(os.path.join(new_dir_path, "documents.json"), 'w') as documents_file:
        json.dump(project_documents["documents"], documents_file)

    project_ground_truths = ground_truth_collection.find({
        "project_id": project_id
    })
    for ground_truth in project_ground_truths:
        print(ground_truth["global_document_id"])
        with open(os.path.join(new_gt_dir_path, ground_truth["ground_truth"]["id"]+".json"), 'w') as ground_truth_file:
            json.dump(ground_truth["ground_truth"], ground_truth_file)

    zip_file_path = os.path.join(
        download_path,
        f"pre_annotation_{tmp_dir_id}.zip"
    )
    zip_file = zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED)

    for root, sub_dirs, files in os.walk(new_dir_path):
        for target_file in files:
            filepath = os.path.join(root, target_file)
            zip_file.write(filepath, os.path.relpath(filepath, new_dir_path))
    zip_file.close()
    return zip_file_path
