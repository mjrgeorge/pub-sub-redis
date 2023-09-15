const express = require('express');
const redis = require('redis');

const app = express();

let publisher = redis.createClient({
    url: `redis://localhost:6379`
})

publisher.on('error', (err) => console.log("Redis error: " + err))
publisher.on('connect', (err) => console.log("Redis connect: " + err))

const connect = async () => {
    await publisher.connect();
}

connect();

app.get('/', (req, res) => {
    res.send({
        message: "Publisher active from port 3001"
    })
})

app.get('/publish', async (req, res) => {
    const id = Math.floor(Math.random() * 10);
    const data = {
        id: id,
        message: `My ID :-${id}`
    };
    console.log(data);
    await publisher.publish('message', JSON.stringify(data))
    res.send({
        message: "Data published",
        data: data,
    })
})

app.listen(3001, () => {
    console.log('Publisher server start on http://localhost:3001')
})