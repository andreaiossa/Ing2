const express = require('express'),
    bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

const match_list = {};


function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function Response(status, result) {
    if (arguments.length > 2 || !isInteger(status) || status < 0 || result === undefined || result === null) {
        throw new Error("Wrong response parameters");
    }
    this.status = status;
    if (isString(result)) {
        this.text = result;
    } else if (result === Object(result)) {
        this.json = result;
    } else {
        throw new Error("Wrong response parameter");
    }
}

function Match(guardia, ladro) {
    this.id = 1;
    while (exams_list[this.id]) {
        this.id++;
    }
    this.guardia = guardia;
    this.ladro = ladro;
    this.catturato = false;
}

function createMatch(guardia, ladro) {

    if (!isNumber(guardia)) return false;
    if (!isNumber(ladro)) return false;
    if (!isInt(guardia)) return false;
    if (!isInt(ladro)) return false;
    if (guardia > 10) return false;
    if (guardia < -10) return false;
    if (ladro > 10) return false;
    if (ladro < -10) return false;
    if (ladro === guardia) return false;

    let match = new Match(guardia, ladro);
    return match;
}

function match_POST(req) {
    let guardia = req.body.guardia;
    let ladro = req.body.ladro;
    let match = createMatch(guardia, ladro);

    if (match === false) {
        return new Response(400, "Wrong arguments");
    }

    match_list[match.id] = match;
    return new Response(201, match);
}

app.post("/games", (req, res) => {
    let response = match_POST(req);
    res.status(response.status);
    res.send(response.json || response.text);
})












app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
