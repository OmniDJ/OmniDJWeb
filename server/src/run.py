from application import socketApp, app

if __name__ == "__main__":
    print("OmniDJ started")
    socketApp.run(app, host='0.0.0.0', port=5000)
    # app.run(host='0.0.0.0', port=5000, debug=True)
