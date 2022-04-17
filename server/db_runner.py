import sys
import os
sys.path.append('./mongo')
sys.path.append('./model')
from mongo_connect import FungEyeConnector
from pandas import DataFrame
from model_connect import FEModelConnector
import requests # to get image from the web
import shutil # to save it locally

class dbRunner:
    def __init__(self, con_link:str, db_name:str, model_dir:str, model_name:str):
        self.connection = FungEyeConnector(con_link, db_name)
        self.model = FEModelConnector(model_dir, model_name)

    def _download_picture(self, download_path:str, fname:str, url:str):
        r = requests.get(url, stream = True)

        if r.status_code == 200:
            r.raw.decode_content = True

            with open(os.path.join(download_path, fname), 'wb') as f:
                shutil.copyfileobj(r.raw, f)

    def download_new_posts(self, dl_path:str):
        '''
        TODO DOCS
        true if downloaded posts
        false if failed
        '''
        posts = self.connection.get_new_posts()
        pic_f_names = set([str(p['_id']) + '.jpg' for p in posts])
        for p in posts:
            self._download_picture(dl_path, str(p['_id']) + ".jpg", p['image'])
        return pic_f_names.issubset(os.listdir(dl_path))
        
    
    def db_connected(self):
        '''
        True if db connected
        False if not
        '''
        return self.connection.connected()

    def predict_all_staged(self, in_path:str, out_path:str):
        '''
        True if predictions made for all posts
        False if failed
        '''
        files = set(os.listdir(in_path))
        predictions = self.model.predict_all(in_path, out_path)
        if files.issubset(set(os.listdir(out_path))):
            return True
        return False

    def remove_all_staged(self, path:str):
        '''
        TODO DOCS
        '''
        for f in os.listdir(path):
            os.remove(os.path.join(path, f))
        return True if len(os.listdir(path)) == 0 else False

    def upload_predicted(self):
        '''
        TODO Implement
        '''
        return False

    def update_newly_predicted(self):
        '''
        TODO Implement
        '''
        return False

    def store_predicted_local(self):
        '''
        TODO Implement
        '''
        return False

if __name__ == "__main__":
    # Connection and Database Parameters
    CONNECTION_LINK = 'mongodb+srv://test:test@cluster0.ra83u.mongodb.net/InstaClone?retryWrites=true&w=majority'
    DATABASE = 'InstaClone'

    # Create access points
    runner = dbRunner()

    print(runner.db_connected())
    # Get all new posts
    #runner.download_new_posts(os.path.abspath(MODEL_DIR, "/staged/"))

    # Make predictions on new post
    #runner.predict_all_staged(os.path.abspath(MODEL_DIR, "/predicted/"))

    #/data/FungEye/testing/misc_testing/BerkPhotoshop