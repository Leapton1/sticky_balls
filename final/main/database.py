from dataclasses import dataclass, asdict, field
from typing import Dict, Any

#python -m pip install "pymongo[srv]"==3.11
from pymongo.mongo_client import MongoClient
from pymongo.collection import Collection as mongoCollection

@dataclass(repr=False)
class PlayerData:
    name: str
    score: int
    _id: int = 0
    # bounces: int
    # time: int


URI = "mongodb+srv://jettytjs:9OFOhE5WWwTjwGrn@hacksussex2023edward.c5wftaz.mongodb.net/?retryWrites=true&w=majority"
# Create a new client and connect to the server
client = MongoClient(URI)
# Send a ping to confirm a successful connection

try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

# Connect to database

database = client["balls"]
leaderboard = database["leaderboard"]

def get_user_from_name(username: str, *, collection: mongoCollection = leaderboard) -> dict:
    user = collection.find_one({"name": username})
    return print("User name not found!") if user is None else user

def get_user_from_id(user_id: int, *, collection: mongoCollection = leaderboard) -> dict:
    id = collection.find_one({"_id": user_id})
    return print("User ID not found!") if id is None else id

def insert_user(player_data: PlayerData, collection: mongoCollection = leaderboard) -> int:
    data = asdict(player_data)
    collection.insert_one(data)

def delete_user(user_id: int, *, collection: mongoCollection = leaderboard) -> int:
    user = get_user_from_id(user_id)
    collection.delete_one(user)

def update_user(user_id: int, new_data: PlayerData, *, collection: mongoCollection = leaderboard) -> int:
    # new_data = asdict(new_data)
    user = get_user_from_id(user_id)
    new_data._id = user_id
    if not user:
        print("Error: user does not exist")
        return 0
    
    delete_user(user_id)
    insert_user(new_data)

def get_top(amount: int = 5, *, collection: mongoCollection = leaderboard) -> list:
    top_scores = collection.find().sort("score", -1)
    top_score_list = []
    for position, user in enumerate(top_scores):
        top_score_list.append(user)
        if position == amount:
            return top_score_list
