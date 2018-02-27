from src import app
from flask import render_template
from flask_socketio import SocketIO

app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

if __name__ == '__main__':
    socketio.run(app)
	
@app.route("/")
def home():
    return render_template('index.html')
