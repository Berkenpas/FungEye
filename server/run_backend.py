from db_runner import dbRunner
from time import sleep
from collections import namedtuple
from typing import List
import os

CONNECTION_LINK = 'mongodb+srv://test:test@cluster0.ra83u.mongodb.net/InstaClone?retryWrites=true&w=majority'
DATABASE = 'InstaClone'
MODEL_DIR = os.path.abspath('./model/model_files/')
MODEL_NAME = 'ThreeClass'

Task = namedtuple('Task', ['func', 'params', 'msg'])

def main(runner: dbRunner, tasks: List[Task]):
    starting = lambda message: print(f"START: {message}")
    success = lambda message: print(f"SUCCESS: {message}")
    error = lambda message: print(f"ERROR: {message}")
    while(True):
        for t in tasks:
            starting(t.msg)
            while not (t.func() if t.params == [] else t.func(*t.params)):
                error(t.msg)
                sleep(5)
            success(t.msg)
        sleep(60)

if __name__ == "__main__":
    DOWNLOAD_PATH = os.path.abspath('./data/staged') # Newly downloaded post files
    PREDICTED_PATH = os.path.abspath('./data/predicted') # Where new post predictions go
    COMPLETED_PATH = os.path.abspath('./data/completed') # After MongoDB post has been updated store file here

    runner = dbRunner(CONNECTION_LINK, DATABASE, MODEL_DIR, MODEL_NAME)

    tasks = [
        Task(func=runner.db_connected, params=[], msg="MongoDB Connection"),
        Task(func=runner.download_new_posts, params=[DOWNLOAD_PATH], msg="Download New MongoDB Posts"),
        Task(func=runner.predict_all_staged, params=[DOWNLOAD_PATH, PREDICTED_PATH], msg="Predict all staged"),
        Task(func=runner.remove_all_staged, params=[DOWNLOAD_PATH], msg="Delete all staged files"),
        Task(func=runner.upload_predicted, params=[], msg="Upload Predicted"),
        Task(func=runner.update_newly_predicted, params=[], msg="Update post(s) to reflect prediction"),
        Task(func=runner.store_predicted_local, params=[COMPLETED_PATH], msg="Store all newly predicted posts to model db")
    ]
    
    main(runner, tasks)