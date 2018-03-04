from src import app
from flask import render_template, session, request
from flask_socketio import SocketIO, send, emit

app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

print("STARTING NOW")

sockets = []
mobile = []
clients = []

# #sockets[0] = socketio

@socketio.on('myConnect')
def handleconnect(json):
    print('in MYCONNECT')
    print(str(json))
    fromuserid = json['fromuserid']
    if fromuserid not in mobile:
        mobile.append(fromuserid)
        clients.append(request.sid)
    print(mobile)
    print(clients)
#     sockets.append(socketio)
#     print(sockets)
#   print('Message is ' + msg)
#   print('from mobile' + str(fromMobile))
#   sockets.append(socketio)

@socketio.on('disconnect')
def handledisconnect(json):
    print('in MYCONNECT')

@socketio.on('myMessage')
def handlemessage(json):
    print('in MYMESSAGE',str(json))
    print('the message',json['msg_text'])
    tp_index = mobile.index(json['receiver_id'])
    print('tp_index=',tp_index)
#    emit('message',json['msg'])
    emit('message',json['msg_text'],room=clients[tp_index])
    print('Message is ' + json['msg_text'])
    print('sent time ' + json['sent_time'])
    print('sender_id' + json['sender_id'])
    print('receiver_id' + json['receiver_id'])
#   socketio.to(sockets[tp_index]).emit('message',json['msg'])
    
    #emit('message',json['msg'])
#   socketio.emit()
#   send(msg,broadcast=True)

@socketio.on('disconnect')
def test_disconnect():
    print('Client disconnected')
    clients.remove(request.sid)

@socketio.on('message')
def handlemessage2(msg):
    print('in message handler '+msg)
	
#if __name__ == '__main__':
    # socketio.run(app)
    #socketio.run(app, host='https://app.crawfish92.hasura-app.io')
	
@app.route("/")
def home():
    return render_template('chatFront.html')

	