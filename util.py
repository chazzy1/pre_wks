import sys
import traceback

def log_exception(e):
    print e
    traceback.print_tb(sys.exc_traceback)