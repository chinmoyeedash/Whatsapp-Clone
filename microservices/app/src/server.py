from src import app
from flask import render_template, session, request
from flask_socketio import SocketIO, send, emit

app.config['SECRET_KEY'] = 'mysecret'
params = {
	'ping_timeout': 30000,
	'ping_interval': 30000
}
socketio = SocketIO(app, **params)

print("STARTING NOW")

sockets = []
mobile = []
clients = []

# #sockets[0] = socketio

@socketio.on('myConnect')
def handleconnect(json):
    print('in MYCONNECT')
    print(str(json))
    mobile.append(json['fromuserid'])
    print(mobile)
    clients.append(request.sid)
#     sockets.append(socketio)
#     print(sockets)
    

    
#   print('Message is ' + msg)
#   print('from mobile' + str(fromMobile))
#   sockets.append(socketio)

@socketio.on('myMessage')
def handlemessage(json):
    print('in MYMESSAGE',str(json))
    print('the message',json['msg_text'])
    tp_index = mobile.index(json['receiver_id'])
    print('tp_index=',tp_index)
    emit('message',json['msg_text'],room=clients[tp_index])
    print('Message is ' + msg_text)
    print('sent time ' + sent_time)
    print('sender_id' + str(sender_id))
    print('receiver_id' + str(receiver_id))
#   socketio.to(sockets[tp_index]).emit('message',json['msg'])
    
    #emit('message',json['msg'])

   
#   socketio.emit()
#   send(msg,broadcast=True)

@socketio.on('message')
def handlemessage2(msg):
    print('in message handler '+msg)
	
if __name__ == '__main__':
    # socketio.run(app)
    socketio.run(app, host='https://app.crawfish92.hasura-app.io')
	
@app.route("/")
def home():
    return render_template('chatFront.html')

	