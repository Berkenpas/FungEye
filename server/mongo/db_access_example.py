from mongo_connect import FungEyeConnector
from pandas import DataFrame

# Connection and Database Parameters
CONNECTION_LINK = 'mongodb+srv://test:test@cluster0.ra83u.mongodb.net/InstaClone?retryWrites=true&w=majority'
DATABASE = 'InstaClone'

# Create MongoDB Database Connection
db = FungEyeConnector(CONNECTION_LINK, DATABASE)

# Grab all collections from database
mushrooms = db.get('mushrooms')
posts = db.get('posts')
predictions = db.get('predictions')
users = db.get('users')
votes = db.get('votes')

# Create pandas DataFrame with mushroom data
mushrooms_df = DataFrame(mushrooms)
print(mushrooms_df)

# A post and mushroom id
post_id = posts[0]['_id']
predicted_mushroom_id = mushrooms[0]["_id"]
confidence = 66.43

# Insert post id, mushroom predction id, and confidence score to 'predictions' collection
db.add_prediction(post_id, predicted_mushroom_id, confidence)