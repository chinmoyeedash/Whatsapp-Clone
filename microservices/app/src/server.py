from src import app
from flask import render_template, session, request
from flask_socketio import SocketIO, send, emit
import requests
import json
import datetime

app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

print("STARTING NOW")

sockets = []
mobile = []
clients = []

clientdic = {}

# #sockets[0] = socketio

def updateLastSeen( userid ):
   
        # This is the url to which the query is made
    url = "https://data.crawfish92.hasura-app.io/v1/query"
    now = datetime.datetime.now()

    # This is the json payload for the query
    requestPayload = {
        "type": "update",
        "args": {
            "table": "users",
            "where": {
                "user_id": {
                    "$eq": userid
                }
            },
            "$set": {
                "lastseen": str(now)
            }
        }
    }

    # Setting headers
    headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer 6367e4fc89e80a142071170876248bf65157081698930b18"
    }

    # Make the query and store response in resp
    resp = requests.request("POST", url, data=json.dumps(requestPayload), headers=headers)

    # resp.content contains the json response.
    print (resp.content)
    return


@socketio.on('myConnect')
def handleconnect(json):
    print('in MYCONNECT')
    print(str(json))
    fromuserid = json['fromuserid']
    #if fromuserid not in mobile:
    #mobile.append(fromuserid)
    #clients.append(request.sid)
    if fromuserid in clientdic:
        del clientdic[fromuserid]
    clientdic[fromuserid]= request.sid 
    print(clientdic)
    print(mobile)
    print(clients)
    updateLastSeen(fromuserid)
#   sockets.append(socketio)
#   print(sockets)
#   print('Message is ' + msg)
#   print('from mobile' + str(fromMobile))
#   sockets.append(socketio)

@socketio.on('myDisonnect')
def handledisconnect(json):
    print('in MYDISCONNECT')
    fromuserid = json['fromuserid']
    updateLastSeen(fromuserid)
    #mobile.remove(fromuserid)
    #clients.remove(request.sid)
    print('deleting user',fromuserid)
    if fromuserid in clientdic:
        del clientdic[fromuserid]

@socketio.on('myMessage')
def handlemessage(jsondata):
    print('in MYMESSAGE',str(jsondata))
    print('the message',jsondata['msg_text'])
    receiverid = jsondata['receiver_id']
    print(receiverid)
    #tp_index = mobile.index(receiverid)
    #print('mobile=',mobile)
    #print('tp_index=',tp_index)
    #print('clients=',clients)
#    emit('message',json['msg'])
    jsonresp =  {
        "sent_time": jsondata['sent_time'],
        "msg_text": jsondata['msg_text'],
        "user_id": jsondata['sender_id'],
        "receiver_id": jsondata['receiver_id'],
        "sender_id": jsondata['sender_id'],
        "recd_time": "NULL"
    }
    #emit('message',jsonresp,room=clients[tp_index])
    emit('message',jsonresp,room=clientdic.get(receiverid))
    print('Message is ' + jsondata['msg_text'])
    print('sent time ' + jsondata['sent_time'])
    print('sender_id' + jsondata['sender_id'])
    print('receiver_id' + jsondata['receiver_id'])
#   socketio.to(sockets[tp_index]).emit('message',json['msg'])
    #emit('message',json['msg'])
#   socketio.emit()
#   send(msg,broadcast=True)
    url = "https://data.crawfish92.hasura-app.io/v1/query"
    # This is the json payload for the query
    requestPayload = {
        "type": "insert",
        "args": {
        "table": "messages",
        "objects": [
            {
                "sent_time": jsondata['sent_time'],
                "msg_text": jsondata['msg_text'],
                "user_id": jsondata['sender_id'],
                "receiver_id": jsondata['receiver_id'],
                "sender_id": jsondata['sender_id'],
                "recd_time": "NULL"
            }
        ]
    }
    }
    # Setting headers
    headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer 6367e4fc89e80a142071170876248bf65157081698930b18"
    }
    # Make the query and store response in resp
    resp = requests.request("POST", url, data=json.dumps(requestPayload), headers=headers)
    # resp.content contains the json response.
    print(resp.content)

@socketio.on('message')
def handlemessage2(msg):
    print('in message handler '+msg)
	
#if __name__ == '__main__':
    # socketio.run(app)
    #socketio.run(app, host='https://app.crawfish92.hasura-app.io')
	
@app.route("/")
def home():
    return render_template('chatFront.html')

	