from flask import Flask, render_template, jsonify, request
import json

app=Flask("dom")

@app.route("/")
def presentable():
    return render_template('index.html')

@app.route('/postman', methods = ['POST'])
def postman():
    pat=request.get_json()
    print(pat)
    return jsonify(['hello'])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)