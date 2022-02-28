class MongoConnector():
    '''
    Fundamental MongoDB connection class
    Can get or add to collection
    '''
    def __init__(self, url:str, db_name:str):
        from pymongo import MongoClient
        self._client = MongoClient(url)
        self._db = self._client[db_name]
    
    def get(self, collection:str):
        '''
        Returns list of instances in a collection
        '''
        # Retrieves db cursor and processes instances into list
        return [post for post in self._db[collection].find()]
    
    def add(self, collection_name:str, insertion_dictionary:dict):
        '''
        Adds a given collection element to specified collection

        '''
        self._db[collection_name].insert_one(insertion_dictionary)

class FungEyeConnector(MongoConnector):
    '''
    Extends MongoConnector class to include specific actions used for 
    FungEye MongoDB manipulation
    '''
    def add_prediction(self, picture:str, mush_type:str, confidence:float):
        '''
        Add a prediction to the 'predictions' collection
        '''
        # TODO: Add check to see if prediction for specific photo already exists, if it does, overwrite?
        self._db['predictions'].insert_one( { "picture" : picture , "mush_type" : mush_type, "confidence" : confidence } )
        print("Prediction Added")