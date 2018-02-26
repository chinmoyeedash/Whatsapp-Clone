from src import app
from flask import render_template
# from flask import jsonify

@app.route("/")
def home():
    return render_template('index.html')
