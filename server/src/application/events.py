from application import socketApp
from flask_socketio import emit, join_room, leave_room
from flask import request


@socketApp.on('connect')
def connected():
    print("Socket session %s connected" % (request.sid))


@socketApp.on('disconnect')
def connected():
    print("Socket session %s disconnected" % (request.sid))

@socketApp.on('message')
def handle_message(msg):
    action = msg.get('action')
    print('received action: %s from %s' % (action, request.sid))
    if action == "join":
        roomID = msg.get('room')
        user_id = msg.get('user_id')
        user_name = msg.get('user_name')
        print('%s with id %s wants to join room: %s' %
              (user_name, user_id, roomID))
        join_room(roomID)
        return
    if action == "leave":
        roomID = msg.get('room')
        user_id = msg.get('user_id')
        user_name = msg.get('user_name')
        print('%s with id %s wants to leave room: %s' %
              (user_name, user_id, roomID))
        leave_room(roomID)
        return
    if action == "chat_message":
        roomID = msg.get('room')
        user_id = msg.get('user_id')
        user_name = msg.get('user_name')
        message = msg.get('message')
        timestamp = msg.get('timestamp')
        print('%s with id %s has message %s for room: %s' %
              (user_name, user_id, message, roomID))
        socketApp.emit("chat_message", {
            'user_id' : user_id,
            'user_name': user_name,
            'message': message,
            'timestamp': timestamp
            }, broadcast=True, room=roomID)
