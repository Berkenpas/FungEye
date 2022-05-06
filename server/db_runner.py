import sys
import os
sys.path.append('./mongo')
sys.path.append('./model')
from mongo_connect import FungEyeConnector
from pandas import DataFrame
from model_connect import FEModelConnector
from bson.objectid import ObjectId
import requests # to get image from the web
import shutil # to save it locally

class dbRunner:
    def __init__(self, con_link:str, db_name:str, model_dir:str, model_name:str):
        self.connection = FungEyeConnector(con_link, db_name)
        self.model = FEModelConnector(model_dir, model_name)
        self.last_predictions = dict()

    def _download_picture(self, download_path:str, fname:str, url:str):
        r = requests.get(url, stream = True)

        if r.status_code == 200:
            r.raw.decode_content = True

            with open(os.path.join(download_path, fname), 'wb') as f:
                shutil.copyfileobj(r.raw, f)

    def download_to_predict(self, dl_path:str):
        '''
        TODO DOCS
        true if downloaded posts
        false if failed
        '''
        posts = self.connection.no_predictions()
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
        self.last_predictions = self.model.predict_all(in_path, out_path)
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
        TODO DOCS
        '''
        print(self.last_predictions)
        for k in self.last_predictions.keys():
            post_id = ObjectId(k.split(".")[0])
            mush_id = ObjectId("6254a6b4f7119aeb95641472") # "OTHER" mushroom type by default
            confidence = 0.0

            # This will need to be changed to accomodate multiple predictions in the same picture (if desired)
            if self.last_predictions[k] != []:
                try:
                    mush_id = self.connection.mush_id(self.last_predictions[k][0][0])
                    confidence = self.last_predictions[k][0][1] * 100.0 # Confidence from model is 0.00-1.00 so multiply by 100 for percent confidence
                except Exception as e:
                    print(f"Error Updating mush_id and confidence field for latest prediction {post_id} (no mushroom found?)")
                    print(e)
                
            self.connection.add_prediction(post_id, mush_id, confidence)
        return True