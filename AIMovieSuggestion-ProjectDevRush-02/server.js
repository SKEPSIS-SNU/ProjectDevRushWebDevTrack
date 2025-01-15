const express = require('express')
const cors = require('cors');
const app = express()
const { askAI } = require('./ai')

const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(cors());

const serveHome = (req, res) => {
    res.send('GOO GOO, GAGA ')
}

app.get('/', serveHome)
app.get('/ai', async (req, res) => {
    // const question = req.body;
    const result = await askAI("Batman Begins");
    res.send(result);
})

app.post('/ai', async (req, res) => {
    const { currently_watching } = req.body;
    const result = await askAI(currently_watching);
    console.log(result, 'result');

    res.send(result);
})

app.post('/aia', async (req, res) => {
    // const { currently_watching } = req.body;
    // const result = await askAI(currently_watching);
    console.log(req.body);

    res.send('nihao');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})