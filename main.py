from flask import Flask, render_template, jsonify, request
from mongo import *
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
    print(pat)
    return jsonify("lorem ipsum dolor sit amet")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)