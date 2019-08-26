
var WebSocketClient = require('websocket').client;

var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};


client.on('connect', function(connection) {
    connection.socket.id = getUniqueID()
    client.socket.id = getUniqueID()
    // console.log('WebSocket Client Connected', client.id);
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
    });
    
    function sendNumber() {
        if (connection.connected) {
            const data = {
                username: "testing"
            };
            var number = Math.round(Math.random() * 0xFFFFFF);
            // connection.sendUTF(number.toString());
            // setTimeout(sendNumber, 5000);
            connection.sendUTF(JSON.stringify({
                ...data,
                type: "userevent"
            }));
        }
    }
    sendNumber();
});

client.connect('ws://localhost:8080/', 'echo-protocol');