from db_runner import dbRunner
from time import sleep
from collections import namedtuple
from typing import List
from datetime import datetime, timedelta
import os

CONNECTION_LINK = 'mongodb+srv://test:test@cluster0.ra83u.mongodb.net/InstaClone?retryWrites=true&w=majority'
DATABASE = 'InstaClone'
MODEL_DIR = os.path.abspath('./model/model_files/')
MODEL_NAME = 'ThreeClass'

Task = namedtuple('Task', ['func', 'params', 'msg'])

curtime = lambda: str(datetime.now().strftime("%m-%d-%y %H:%M"))

def main(runner: dbRunner, tasks: List[Task]):
    starting = lambda message: print(curtime().ljust(15) + "STARTING:".ljust(9) + f"{message}".ljust(40))
    success = lambda message: print(curtime().ljust(15) + "SUCCESS:".ljust(9) + f"{message}".ljust(40))
    error = lambda message: print(curtime().ljust(15) + "ERROR:".ljust(9) + f"{message}".ljust(40))

    while(True):
        for t in tasks:
            #starting(t.msg)
            while not (t.func() if t.params == [] else t.func(*t.params)):
                error(t.msg)
                sleep(5)
            success(t.msg)
        sleep(10)

if __name__ == "__main__":
    DOWNLOAD_PATH = os.path.abspath('./data/staged') # Newly downloaded post files
    PREDICTED_PATH = os.path.abspath('./data/predicted') # Where new post predictions go
    COMPLETED_PATH = os.path.abspath('./data/completed') # After MongoDB post has been updated store file here

    runner = dbRunner(CONNECTION_LINK, DATABASE, MODEL_DIR, MODEL_NAME)

    tasks = [
        Task(func=runner.db_connected, params=[], msg="MongoDB Connection"),
        Task(func=runner.download_to_predict, params=[DOWNLOAD_PATH], msg="Download posts with no prediction"),
        Task(func=runner.predict_all_staged, params=[DOWNLOAD_PATH, PREDICTED_PATH], msg="Predict all staged"),
        Task(func=runner.remove_all_staged, params=[DOWNLOAD_PATH], msg="Delete all staged files"),
        Task(func=runner.upload_predicted, params=[], msg="Upload Predicted"),
    ]
    
    main(runner, tasks)