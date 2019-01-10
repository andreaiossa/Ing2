const express = require('express'),
    bodyParser = require('body-parser');


const app = express();
app.use(bodyParser.json());
app.set('port', (process.env.PORT || 5000));

const match_list = {};

const isInteger = Number.isInteger;

function isNumber(value) {
    return typeof value === 'number' && isFinite(value);
}

function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}

function isString(value) {
    return (typeof value === 'string' || value instanceof String) && value.length > 0;
}

function toInt(value) {
    if (/^(\-|\+)?([0-9]+|Infinity)$/.test(value))
        return Number(value);
    return NaN;
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
    while (matches_list[this.id]) {
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

function matches_GET(req) {
    let result = Object.values(match_list);

    return new Response(200, { matches: result });
}

function matches_matchID_GET(req) {
    let id = toInt(req.params.id);
    if (!isInteger(id) || id < 1) {
        return new Response(400, "Bad id parameter");
    }
    if (!match_list[id]) {
        return new Response(404, "Game not found");
    }
    return new Response(200, match_list[id]);
}

function matches_matchID_PATCH(req) {
    let guardia = req.body.guardia;
    let ladro = req.body.ladro;
    let valore;
    let key;

    if ((guardia !== undefined) && (ladro !== undefined)) {
        return new Response(400, "Bad request");
    }
    if (guardia !== undefind) {
        key = "guardia";
        valore = guardia;
    }
    if (ladro !== undefind) {
        key = "ladro";
        valore = ladro;
    }

    if (!isNumber(valore)) return new Response(400, "Bad request");
    if (!isInt(valore)) return new Response(400, "Bad request");
    if (valore > 10) return new Response(400, "Bad request");
    if (valore < -10) return new Response(400, "Bad request");

    let id = toInt(req.params.id);

    if (!isInteger(id) || id < 1) {
        return new Response(400, "Bad id parameter");
    }
    if (!match_list[id]) {
        return new Response(404, "Game not found");
    }

    let game = match_list[id];
    if (game.catturato === true) {
        return new Response(400, "already completed");
    }

    game[key] = valore;
    if (game.guardia === game.ladro) {
        game.catturato = true;
    }

    match_list[id] = game;
    return new Response(200, game);
}



app.post("/games", (req, res) => {
    let response = match_POST(req);
    res.status(response.status);
    res.send(response.json || response.text);
});

app.get("/games", (req, res) => {
    let response = matches_GET(req);
    res.status(response.status);
    res.send(response.json || response.text);
});

app.get("/games/:id", (req, res) => {
    let response = matches_matchID_GET(req);
    res.status(response.status);
    res.send(response.json || response.text);
});

app.patch("/games/:id", (req, res) => {
    let response = matches_matchID_PATCH(req);
    res.status(response.status);
    res.send(response.json || response.text);
});










app.listen(app.get('port'), function () {
    console.log('Node app is running on port', app.get('port'));
});
