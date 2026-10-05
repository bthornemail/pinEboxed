import mqtt, { connect,connectAsync } from "mqtt"; // import connect from mqtt
let client = connect("mqtt://test.mosquitto.org"); // create a client

client.on("connect", () => {
    client.subscribe("presence", (err) => {
        if (!err) {
            client.publish("presence", "Hello mqtt");
        }
    });
});

client.on("message", (topic, message) => {
    // message is Buffer
    console.log(message.toString());
    // client.end();
});

// const transformWsUrl = (url, options, client) => {
//     client.options.username = `token=${this.get_current_auth_token()}`;
//     client.options.clientId = `${this.get_updated_clientId()}`;

//     return `${this.get_signed_cloud_url(url)}`;
// }

// const connection = await connectAsync("mqtt://test.mosquitto.org", {
//     transformWsUrl: transformWsUrl,
// });
// const createWebsocket = (url, websocketSubProtocols, options) => {
//     const subProtocols = [
//         websocketSubProtocols[0],
//         'myCustomSubprotocolOrOAuthToken',
//     ]
//     return new WebSocket(url, subProtocols)
// }

// const clientAsync = await connectAsync("mqtt://test.mosquitto.org", {
//     createWebsocket: createWebsocket,
// });


// Then, on one terminal

// mqtt sub -t 'hello' -h 'test.mosquitto.org' -v
// On another

// mqtt pub -t 'hello' -h 'test.mosquitto.org' -m 'from MQTT.js'
import { spawn } from 'node:child_process';
import { once } from 'node:events';
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

const [code] = await once(ls, 'close');
console.log(`child process exited with code ${code}`);
