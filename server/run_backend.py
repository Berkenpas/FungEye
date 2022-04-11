from db_runner import dbRunner
from time import sleep


if __name__ == "__main__":
    # Connect to MongoDB
    print("Starting MongoDB Connection")
    runner = dbRunner()

    # Start / Connect to Model
    print("Starting Model")

    while(True):
        print("Verifying DB Connection")
    
        print("Verifying model connection")

        print("Pulling new posts from MongoDB")

        print("Posts: ")

        print("Making Predictions")

        print("Predictions: ")

        print("Uploading Predictions to MongoDB")

        print("Updating Post prediction values")

        print("Saving posts to local db")

        sleep(30)
    
