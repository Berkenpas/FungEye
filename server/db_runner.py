import sys
import os
sys.path.append('./mongo')
sys.path.append('./model')
from mongo_connect import FungEyeConnector
from pandas import DataFrame
from model_connect import FEModelConnector
import requests # to get image from the web
import shutil # to save it locally

# Connection and Database Parameters
# TODO: Move to configuration file
CONNECTION_LINK = 'mongodb+srv://test:test@cluster0.ra83u.mongodb.net/InstaClone?retryWrites=true&w=majority'
DATABASE = 'InstaClone'
MODEL_DIR = '/data/FungEye/download_test/'
MODEL_NAME = 'ThreeClass'

class dbRunner:
    def __init__(self):
        self.connection = FungEyeConnector(CONNECTION_LINK, DATABASE)
        self.model = FEModelConnector(MODEL_DIR, MODEL_NAME)

    def _download_picture(self, download_path:str, fname:str, url:str):
        r = requests.get(url, stream = True)

        if r.status_code == 200:
            r.raw.decode_content = True

            with open(os.path.join(download_path, fname), 'wb') as f:
                shutil.copyfileobj(r.raw, f)

    def download_new_posts(self, dl_path:str):
        posts = self.connection.get_new_posts()
        for p in posts:
            self._download_picture(dl_path, str(p['_id']) + ".jpg", p['image'])
    
    def db_connected(self):
        '''
        True if db connected
        False if not
        '''
        return self.connection.connected()
    
    def model_connected(self):
        '''
        True if model is running
        False if not
        '''

if __name__ == "__main__":
    # Connection and Database Parameters
    CONNECTION_LINK = 'mongodb+srv://test:test@cluster0.ra83u.mongodb.net/InstaClone?retryWrites=true&w=majority'
    DATABASE = 'InstaClone'

    # Create access points
    runner = dbRunner()

    # Get all new posts
    runner.download_new_posts("/data/FungEye/download_test/")

    # Make predictions on new post
    runner.model.predict_all()

    #/data/FungEye/testing/misc_testing/BerkPhotoshop