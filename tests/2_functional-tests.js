const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

const strings = require("../controllers/puzzle-strings").puzzlesAndSolutions;
const puzzle = strings[0][0];
const solution = strings[0][1];

const errorHandler = (err, done) => {
    console.error(err);

    done(err);
};

suite("Functional Tests", () => {
    suite("/api", function () {
        suite("POST /solve", function () {
            test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function (done) {
                chai.request(server)
                    .post("/api/solve")
                    .send({ puzzle })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["solution"]);
                        assert.equal(res.body.solution, solution);

                        done();
                    })
                    .catch(errorHandler);
            });

            test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function (done) {
                chai.request(server)
                    .post("/api/solve")
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["error"]);
                        assert.equal(res.body.error, "Required field missing");

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Solve a puzzle with invalid characters: POST request to /api/solve", function (done) {
                chai.request(server)
                    .post("/api/solve")
                    .send({
                        puzzle:
                            "1.5..g.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["error"]);
                        assert.equal(
                            res.body.error,
                            "Invalid characters in puzzle"
                        );

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Solve a puzzle with incorrect length: POST request to /api/solve", function (done) {
                chai.request(server)
                    .post("/api/solve")
                    .send({
                        puzzle:
                            "78156356.6781574264514.656329.42.13220526.25739472287559.486754276142.739720199476.804.406",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["error"]);
                        assert.equal(
                            res.body.error,
                            "Expected puzzle to be 81 characters long"
                        );

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Solve a puzzle that cannot be solved: POST request to /api/solve", function (done) {
                chai.request(server)
                    .post("/api/solve")
                    .send({
                        puzzle:
                            "78156356.6781574264514.656329.42.13220526.25739472287559.486754276142.73972019947",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["error"]);
                        assert.equal(res.body.error, "Puzzle cannot be solved");

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });
        });

        suite("POST /check", function () {
            test("Check a puzzle placement with all fields: POST request to /api/check", function (done) {
                chai.request(server)
                    .post("/api/check")
                    .send({
                        puzzle: puzzle,
                        coordinate: "A1",
                        value: "7",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["valid"]);
                        assert.equal(res.body.valid, true);

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Check a puzzle placement with single placement conflict: POST request to /api/check", function (done) {
                chai.request(server)
                    .post("/api/check")
                    .send({
                        puzzle: puzzle,
                        coordinate: "A2",
                        value: "4",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["valid", "conflict"]);
                        assert.equal(res.body.valid, false);
                        assert.isArray(res.body.conflict);
                        assert.lengthOf(res.body.conflict, 1);

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function (done) {
                chai.request(server)
                    .post("/api/check")
                    .send({
                        puzzle: puzzle,
                        coordinate: "E2",
                        value: "6",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["valid", "conflict"]);
                        assert.equal(res.body.valid, false);
                        assert.isArray(res.body.conflict);
                        assert.lengthOf(res.body.conflict, 2);

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function (done) {
                chai.request(server)
                    .post("/api/check")
                    .send({
                        puzzle: puzzle,
                        coordinate: "A2",
                        value: "2",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["valid", "conflict"]);
                        assert.equal(res.body.valid, false);
                        assert.isArray(res.body.conflict);
                        assert.lengthOf(res.body.conflict, 3);

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Check a puzzle placement with missing required fields: POST request to /api/check", function (done) {
                chai.request(server)
                    .post("/api/check")
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["error"]);
                        assert.equal(
                            res.body.error,
                            "Required field(s) missing"
                        );

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
                chai.request(server)
                    .post("/api/check")
                    .send({
                        puzzle:
                            "1.5..g.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
                        coordinate: "A2",
                        value: "2",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["error"]);
                        assert.equal(
                            res.body.error,
                            "Invalid characters in puzzle"
                        );

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Check a puzzle placement with incorrect length: POST request to /api/check", function (done) {
                chai.request(server)
                    .post("/api/check")
                    .send({
                        puzzle:
                            "78156356.6781574264514.656329.42.13220526.25739472287559.486754276142.739720199476.804.406",
                        coordinate: "A2",
                        value: "2",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["error"]);
                        assert.equal(
                            res.body.error,
                            "Expected puzzle to be 81 characters long"
                        );

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function (done) {
                chai.request(server)
                    .post("/api/check")
                    .send({
                        puzzle: puzzle,
                        coordinate: "T2",
                        value: "2",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["error"]);
                        assert.equal(res.body.error, "Invalid coordinate");

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });

            test("Check a puzzle placement with invalid placement value: POST request to /api/check", function (done) {
                chai.request(server)
                    .post("/api/check")
                    .send({
                        puzzle: puzzle,
                        coordinate: "A2",
                        value: "20",
                    })
                    .then((res) => {
                        assert.ok(res);
                        assert.equal(res.status, 200);
                        assert.isNotEmpty(res.body);
                        assert.containsAllKeys(res.body, ["error"]);
                        assert.equal(res.body.error, "Invalid value");

                        done();
                    })
                    .catch((err) => errorHandler(err, done));
            });
        });
    });
});
