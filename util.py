import sys
import traceback
from pymongo import MongoClient

client = MongoClient('localhost', 27017)
collections = client['prewks']

documents_sets_collection = collections.documents_sets
documents_collection = collections.documents
sets_collection = collections.sets
ground_truth_collection = collections.ground_truth

entity_types_collection = collections.entity_types
relationship_types_collection = collections.relationship_types
typesystem_collection = collections.typesystem


def log_exception(e):
    print e
    traceback.print_tb(sys.exc_traceback)


