from deepstack_sdk import Detection, ServerConfig
import os

class FEModelConnector():
    '''
    FEModelConnector class used to train and make predictions
    '''
    def __init__(self, path:str, model_name:str):
        '''
        TODO DOCS
        '''
        self.config = ServerConfig("http://localhost:80")
        self.detector = Detection(config=self.config, name="ThreeClass")
        self.path = path

    def predict(self, in_file_path:str, out_file_path:str):
        '''
        TODO DOCS
        '''
        detections = self.detector.detectObject(image=os.path.abspath(in_file_path), output=os.path.join(out_file_path))
        return [[d.label, d.confidence] for d in detections]

    def predict_all(self, path:str, out_path:str):
        '''
        TODO DOCS
        Returns Dictionary
        KEY = file
        VALUE = array of detections
        '''
        all = dict()
        for f in os.listdir(path):
            all[f] = self.predict(os.path.abspath(os.path.join(path,f)), os.path.abspath(os.path.join(out_path,f)))
        return all

#pip install deepstack-sdk --upgrade
#sudo docker run -e VISION-DETECTION=True -v /home/cade/projects/capstone/DeepStack/models:/modelstore/detection -p 80:5000 deepquestai/deepstack
#https://docs.deepstack.cc/python-sdk/index.html