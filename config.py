import os

_base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__)))

PORT = 18000
MONGODB_SETTINGS = {'DB': "prewks", 'host': 'localhost'}
SECRET_KEY = "pasjlfkjasdjflkqjeofjdkdjf"
UPLOAD_DIR = os.path.join(_base_dir, 'upload_dir')
DOWNLOAD_DIR = os.path.join(_base_dir, 'download_dir')
SECURITY_PASSWORD_SALT = 'helloworld'