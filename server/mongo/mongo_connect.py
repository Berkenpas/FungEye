'''
MongoConnector class establishes simple connection to a MongoDB
FungEyeConnector class extends MongoConnector with specific operations to this project
'''
from bson.objectid import ObjectId

class MongoConnector():
    '''
    Used to connect to MongoDB
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

    def add_prediction(self, pic_id:str, m_type:str, confidence:float):
        '''
        Adds or updates a prediction to the 'predictions' collection
        If prediction for picture ObjectId does not exist, add a new entry
        If prediction for picture ObjectId exists, update confidence and mushroom type
        '''
        # Check for pre-existing prediction
        if len(list(self.find_prediction(pic_id = pic_id))) < 1:
            self._db['predictions'].insert_one( { "picture" : ObjectId(pic_id) , "mush_type" : ObjectId(m_type), "confidence" : confidence } )
            print("New prediction added")
        else:
            print("Prediction exists, overwriting")
            self._db['predictions'].update_one( { "picture" : ObjectId(pic_id) } , { "$set" : { "mush_type" : ObjectId(m_type), "confidence" : confidence } } )

    def remove_prediction(self, pic_id:str="", pred_id:str=""):
        '''
        Remove prediction using picture ObjectId or prediction ObjectId
        '''
        if pic_id != "":
            self._db['predictions'].delete_one( { "picture" : ObjectId(pic_id) } )
        elif pred_id != "":
            self._db['predictions'].delete_one( { "_id" : ObjectId(pred_id) } )
        return []
    
    def find_prediction(self, pred_id:str="", pic_id:str=""):
        '''
        Find predictions with prediction ObjectId or picture ObjectId
        Returns list of all matching prediction ObjectId (should be length 0-1)
        '''
        if pred_id != "":
            return [e for e in self._db['predictions'].find( { "_id" : ObjectId(pred_id) } )]
        elif pic_id != "":
            return [e for e in self._db['predictions'].find( { "picture" : ObjectId(pic_id) } )]
        return []
    
    def get_new_posts(self):
        '''
        Grab all posts that have "voted" attribute as false
        '''
        return [p for p in self._db['posts'].find( { "voted" : False } )]
