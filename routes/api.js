"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
    const solver = new SudokuSolver();

    app.route("/api/check").post((req, res) => {
        const puzzle = req.body.puzzle;
        const coordinate = req.body.coordinate;
        const value = req.body.value;

        if (puzzle && coordinate && value) {
            const indices = solver.coordinateToIndices(coordinate);
            const row = solver.splitRows(puzzle)[indices[0]];

            if (puzzle.length !== 81) {
                res.json({ error: "Expected puzzle to be 81 characters long" });
            } else if (!solver.validate(puzzle)) {
                res.json({ error: "Invalid characters in puzzle" });
            } else if (indices === "invalid coordinate") {
                res.json({ error: "Invalid coordinate" });
            } else if (!/\d/.test(value) || value < 1 || value > 9) {
                res.json({ error: "Invalid value" });
            } else {
                const rowCheck = solver.checkRowPlacement(
                    puzzle,
                    indices[0],
                    value
                );
                const colCheck = solver.checkColPlacement(
                    puzzle,
                    indices[1],
                    value
                );
                const regionCheck = solver.checkRegionPlacement(
                    puzzle,
                    indices[0],
                    indices[1],
                    value
                );

                if (
                    (rowCheck && colCheck && regionCheck) ||
                    value === row[indices[1]]
                ) {
                    res.json({ valid: true });
                } else {
                    let conflicts = [];

                    conflicts = !rowCheck ? [...conflicts, "row"] : conflicts;
                    conflicts = !colCheck
                        ? [...conflicts, "column"]
                        : conflicts;
                    conflicts = !regionCheck
                        ? [...conflicts, "region"]
                        : conflicts;

                    res.json({ valid: false, conflict: conflicts });
                }
            }
        } else {
            res.json({ error: "Required field(s) missing" });
        }
    });

    app.route("/api/solve").post((req, res) => {
        const puzzle = req.body.puzzle;

        if (!puzzle) {
            res.json({ error: "Required field missing" });
        } else {
            const result = solver.solve(puzzle);

            if (result === "invalid puzzle string") {
                res.json({ error: "Invalid characters in puzzle" });
            } else if (result === "puzzle should be 81 characters") {
                res.json({ error: "Expected puzzle to be 81 characters long" });
            } else if (result === "puzzle can't be solved") {
                res.json({ error: "Puzzle cannot be solved" });
            } else {
                res.json({ solution: result });
            }
        }
    });
};
