from deepstack_sdk import Detection, ServerConfig
import os

class FEModelConnector():
    '''
    FEModelConnector class used to train and make predictions
    '''
    def __init__(self, path:str, model_name:str):
        self.config = ServerConfig("http://localhost:80")
        self.detector = Detection(config=self.config, name="ThreeClass")
        self.path = path

    def predict(self, in_file_path:str, out_file_path:str):
        detections = self.detector.detectObject(image=os.path.abspath(in_file_path), output=os.path.join(out_file_path))
        for d in detections:
            print(f'{d.label} @ {d.confidence} confidence')

    def predict_all(self, path:str, out_path:str):
        for f in os.listdir(path):
            self.predict(f, os.path.abspath(path,f), os.path.abspath(out_path,f))

#pip install deepstack-sdk --upgrade
#sudo docker run -e VISION-DETECTION=True -v /home/cade/projects/capstone/DeepStack/models:/modelstore/detection -p 80:5000 deepquestai/deepstack
#https://docs.deepstack.cc/python-sdk/index.html