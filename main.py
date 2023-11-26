from flask import Flask, render_template, jsonify, request
from mongo import *
from random import randint
import json

app=Flask("dom")

@app.route("/")
def presentable():
    return render_template('index.html')

@app.route("/getleaderboard", methods = ['GET'])
def leaderboard():
    return get_top()


@app.route('/postman', methods = ['POST'])
def postman():
    pat=request.get_json()
    get_id = get_user_from_id(pat[0])
    if isinstance(pat, list) and len(pat)==2:
        if get_id:
            data = PlayerData(pat[0], pat[1], get_id)
            update_user(get_user_from_id(pat[0]), data)
        else:
            data = PlayerData(pat[0], pat[1], randint(0, 1000))
            insert_user(data)
        
    return jsonify("Database information received")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)