from deepstack_sdk import Detection,ServerConfig
import os

class FEModelConnector():
    '''
    FEModelConnector class used to train and make predictions
    '''
    def __init__(self, path:str, model_name:str):
        self.config = ServerConfig("http://localhost:80")
        self.detector = Detection(config=self.config, name="ThreeClass")
        self.path = path

    def predict(self, file):
        detections = self.detector.detectObject(image=os.path.join(self.path, file), output=os.path.join(".","out_"+file))
        for d in detections:
            print(f'{d.label} @ {d.confidence} confidence')

    def predict_all(self):
        for f in os.listdir(self.path):
            self.predict(f)

#pip install deepstack-sdk --upgrade
#sudo docker run -e VISION-DETECTION=True -v /home/cade/projects/capstone/DeepStack/models:/modelstore/detection -p 80:5000 deepquestai/deepstack
#https://docs.deepstack.cc/python-sdk/index.html