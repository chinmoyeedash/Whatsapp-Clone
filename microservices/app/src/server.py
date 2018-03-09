from src import app
from flask import render_template, session, request, jsonify
from flask_socketio import SocketIO, send, emit
import requests
import json
import datetime

app.config['SECRET_KEY'] = 'mysecret'
socketio = SocketIO(app)

print("STARTING NOW")

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
    if fromuserid in clientdic:
        del clientdic[fromuserid]
    clientdic[fromuserid]= request.sid 
    print(clientdic)
    updateLastSeen(fromuserid)


@socketio.on('myDisonnect')
def handledisconnect(json):
    print('in MYDISCONNECT')
    fromuserid = json['fromuserid']
    updateLastSeen(fromuserid)
    print('deleting user',fromuserid)
    if fromuserid in clientdic:
        del clientdic[fromuserid]

@socketio.on('myMessage')
def handlemessage(jsondata):
    print('in MYMESSAGE',str(jsondata))
    print('the message',jsondata['msg_text'])
    receiverid = jsondata['receiver_id']
    print(receiverid)
 
    jsonresp =  {
        "sent_time": jsondata['sent_time'],
        "msg_text": jsondata['msg_text'],
        "user_id": jsondata['sender_id'],
        "receiver_id": jsondata['receiver_id'],
        "sender_id": jsondata['sender_id'],
        "recd_time": "NULL"
    }
    emit('message',jsonresp,room=clientdic.get(receiverid))
    print('Message is ' + jsondata['msg_text'])
    print('sent time ' + jsondata['sent_time'])
    print('sender_id' + jsondata['sender_id'])
    print('receiver_id' + jsondata['receiver_id'])

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

#if __name__ == '__main__':
    # socketio.run(app)
    #socketio.run(app, host='https://app.crawfish92.hasura-app.io')
	
@app.route("/")
def home():
    return render_template('chatFront.html')

@app.route("/getLastMessages")
def getLastMessages():
    # This is the url to which the query is made
    url = "https://data.crawfish92.hasura-app.io/v1/query"
    args = request.args
    user_id = args['user_id']
    sqlquery = "SELECT DISTINCT ON (friend_id) * FROM (   SELECT 'out' AS type, msg_id, receiver_id AS friend_id, msg_text, sent_time, recd_time  FROM   messages  WHERE  sender_id = "+user_id+" UNION  ALL    SELECT 'in' AS type, msg_id, sender_id AS friend_id, msg_text, sent_time,recd_time FROM   messages WHERE  receiver_id = "+user_id+" ) sub ORDER BY friend_id, msg_id DESC;"
   

    # This is the json payload for the query
    requestPayload = {
        "type": "run_sql",
        "args": {
            "sql": sqlquery
        }
    }

    # Setting headers
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer 6e3bfbf5f7b27daa2812541585886b06215c48c30883031e"
    }

    # Make the query and store response in resp
    lastmsgresp = requests.request("POST", url, data=json.dumps(requestPayload), headers=headers)
    lastmsgrespdata = lastmsgresp.json()
    # resp.content contains the json response.
    print(lastmsgresp.content)
    return jsonify(lastmsgrespdata)

@app.route("/getUnreadMessages")
def getUnreadMessages():
    # This is the url to which the query is made
    url = "https://data.crawfish92.hasura-app.io/v1/query"
    
    sqlquery = "SELECT sender_id, count(recd_time) as unread FROM messages where recd_time = 'NULL' GROUP BY sender_id,recd_time;"

    # This is the json payload for the query
    requestPayload = {
        "type": "run_sql",
        "args": {
            "sql": sqlquery
        }
    }

    # Setting headers
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer 6e3bfbf5f7b27daa2812541585886b06215c48c30883031e"
    }

    # Make the query and store response in resp
    unreadresp = requests.request("POST", url, data=json.dumps(requestPayload), headers=headers)
    unreadrespdata = unreadresp.json()
    # resp.content contains the json response.
    print(unreadresp.content)
    return jsonify(unreadrespdata)

@app.route("/getAllMessages")
def getAllMessages():
    # This is the url to which the query is made
    url = "https://data.crawfish92.hasura-app.io/v1/query"
    args = request.args
    user_id = args['user_id']
    friend_id = args['friend_id']
    sqlquery = "SELECT * FROM   messages WHERE (sender_id = "+friend_id+" AND receiver_id = "+user_id+" OR sender_id = "+user_id+" AND receiver_id = "+friend_id+");"
   

    # This is the json payload for the query
    requestPayload = {
        "type": "run_sql",
        "args": {
            "sql": sqlquery
        }
    }

    # Setting headers
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer 6e3bfbf5f7b27daa2812541585886b06215c48c30883031e"
    }

    # Make the query and store response in resp
    allmsgresp = requests.request("POST", url, data=json.dumps(requestPayload), headers=headers)
    allmsgrespdata = allmsgresp.json()
    # resp.content contains the json response.
    print(allmsgresp.content)
    return jsonify(allmsgrespdata)

@app.route("/updateRecdTime")
def updateRecdTime():
    # This is the url to which the query is made
    url = "https://data.crawfish92.hasura-app.io/v1/query"
    args = request.args
    friend_id = args['friend_id']
    user_id = args['user_id']
    
    now = datetime.datetime.now()
    sqlquery = "UPDATE messages SET recd_time = '" + now + "' WHERE ((sender_id = " + friend_id + " AND receiver_id = " + user_id + ") AND recd_time = 'NULL') ;"


    # This is the json payload for the query
    requestPayload = {
        "type": "run_sql",
        "args": {
            "sql": sqlquery
        }
    }

    # Setting headers
    headers = {
        "Content-Type": "application/json",
        "Authorization": "Bearer 6e3bfbf5f7b27daa2812541585886b06215c48c30883031e"
    }

    # Make the query and store response in resp
    unreadresp = requests.request("POST", url, data=json.dumps(requestPayload), headers=headers)
    unreadrespdata = unreadresp.json()
    # resp.content contains the json response.
    print(unreadresp.content)
    return jsonify(unreadrespdata)