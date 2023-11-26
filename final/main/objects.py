
from flask import Flask, render_template, jsonify, request
import json

app=Flask("dom")

@app.route("/")
def presentable():
    return render_template('index.html')

@app.route('/postman', methods = ['POST'])
def postman():
    pat=request.get_json()
    tably.append(pat)
    cat="INSERT INTO experichat (Username, MainText) VALUES ('"+str(pat[0])+"','"+str(pat[1])+"');"
    cur.execute(cat)
    return jsonify(['hello'])