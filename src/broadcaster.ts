import mqtt from "mqtt"; // import namespace "mqtt"
let client = mqtt.connect("mqtt://test.mosquitto.org"); // create

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
    //    client.end();
});
(async () => {

    const transformWsUrl = (url, options, client) => {
        // client.options.username = `token=${client.get_current_auth_token()}`;
        // client.options.clientId = `${client.get_updated_clientId()}`;

        const get_signed_cloud_url = (url) => {
            console.log(url);
            return url;
        }
        return `${get_signed_cloud_url(url)}`;
    }
    const createWebsocket = (url, websocketSubProtocols, options) => {
        const subProtocols = [
            websocketSubProtocols[0],
            'myCustomSubprotocolOrOAuthToken',
        ]
        return new WebSocket(url, subProtocols)
    }

    const connection = await mqtt.connectAsync("mqtt://test.mosquitto.org", {
        transformWsUrl: transformWsUrl,

        createWebsocket: createWebsocket,
    });
})()
