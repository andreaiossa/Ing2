const app = require('../app');
const match_POST = app.match_POST;
const match_GET = app.matches_GET;
const match_G = app.matches_matchID_GET;
const match_patch = app.matches_matchID_PATCH;

function Request() {
    this.params = {};
    this.query = {};
    this.body = {};
}

describe("/match_POST good Response", () => {
    test("match_POST working", () => {
        let request = new Request();
        request.body.guardia = 10;
        request.body.ladro = -10;
        let response = match_POST(request);

        expect(response.status).toBe(201);
    });
});

describe("/match_get good Response", () => {
    test("match_GET working", () => {
        let request = new Request();
        request.body.guardia = 10;
        request.body.ladro = -10;
        match_POST(request);

        let response = match_GET(request);

        expect(response.status).toBe(200);
    });
});

describe("/match_get_id bad Response", () => {
    test("match_GET_ID not working", () => {
        let request = new Request();
        request.params.id = "test"

        let response = match_G(request);

        expect(response.status).toBe(400);
    });
});


describe("/match_PATCH_id bad Response", () => {
    test("match_PATCH_ID not working", () => {
        let request = new Request();
        request.body.guardia = 1;
        request.body.guardia = 2;

        let response = match_patch(request);
        expect(response.status).toBe(400);
    });
});