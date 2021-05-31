const chai = require("chai");
const assert = chai.assert;

const SudokuSolver = require("../controllers/sudoku-solver.js");
const solver = new SudokuSolver();

const strings = require("../controllers/puzzle-strings").puzzlesAndSolutions;

suite("UnitTests", function () {
    suite("SudokuSolver", function () {
        suite("validate", function () {
            test("Logic handles a valid puzzle string of 81 characters", function () {
                assert.isTrue(
                    strings.every(
                        (elem) =>
                            solver.validate(elem[0]) && solver.validate(elem[1])
                    )
                );
            });

            test("Logic handles a puzzle string with invalid characters (not 1-9 or .)", function () {
                assert.isFalse(
                    solver.validate(
                        "5.52a04f186w95rra985w1008994g3722..49fa4g68f82w77w0.ff36831gw2ff49f75.1144522478w"
                    )
                );
                assert.isFalse(
                    solver.validate(
                        "a..f1gr85.7w7wa546247675491.44a8185061r3829040g.6g34616621621wa4w7821w6f877gwr2.9"
                    )
                );
                assert.isFalse(
                    solver.validate(
                        "5fr805...w.6ww9a2048w9aw.g5w52rag5gg.1368496f.1f43.g7952f90w0fw91ag0r..1r4r23rw54"
                    )
                );
            });

            test("Logic handles a puzzle string that is not 81 characters in length", function () {
                assert.isFalse(
                    solver.validate(
                        "58382709326164742.336284978474.1031020892472619286321675330.7.409501564626438011643496.718"
                    )
                );
                assert.isFalse(
                    solver.validate(
                        "78156356.6781574264514.656329.42.13220526.25739472287559.486754276142.739720199476.804.406"
                    )
                );
                assert.isFalse(
                    solver.validate(
                        "36215444..4416.2008108.5.185915.8975770..47242037870812861240374773559.5715389520431543.00"
                    )
                );
                assert.isFalse(
                    solver.validate(
                        "7426912276141769630.686367338602799902541089.2974.2150071872032.842959"
                    )
                );
                assert.isFalse(
                    solver.validate(
                        "834217.3441..454.18378624.022425905209.24.0427498197458464131...316399"
                    )
                );
                assert.isFalse(
                    solver.validate(
                        ".8670990443030.961..340.815954506537.4811987780087312712.4155976378930"
                    )
                );
            });
        });

        suite("checkRowPlacement", function () {
            test("Logic handles a valid row placement", function () {
                const puzzle = strings[0][0];
                const rowIndex = solver.getRowIndex(5);

                assert.isTrue(solver.checkRowPlacement(puzzle, rowIndex, "6"));
            });

            test("Logic handles an invalid row placement", function () {
                const puzzle = strings[0][0];
                const rowIndex = solver.getRowIndex(5);

                assert.isFalse(solver.checkRowPlacement(puzzle, rowIndex, "4"));
            });
        });

        suite("checkColPlacement", function () {
            test("Logic handles a valid column placement", function () {
                const puzzle = strings[0][0];
                const colIndex = solver.getColIndex(5);

                assert.isTrue(solver.checkColPlacement(puzzle, colIndex, "4"));
            });

            test("Logic handles an invalid column placement", function () {
                const puzzle = strings[0][0];
                const colIndex = solver.getColIndex(5);

                assert.isFalse(solver.checkColPlacement(puzzle, colIndex, "6"));
            });
        });
        suite("checkRegionPlacement", function () {
            test("Logic handles a valid region (3x3 grid) placement", function () {
                const puzzle = strings[0][0];
                const rowIndex = solver.getRowIndex(5);
                const colIndex = solver.getColIndex(5);

                assert.isTrue(
                    solver.checkRegionPlacement(puzzle, rowIndex, colIndex, "4")
                );
            });

            test("Logic handles an invalid region (3x3 grid) placement", function () {
                const puzzle = strings[0][0];
                const rowIndex = solver.getRowIndex(5);
                const colIndex = solver.getColIndex(5);

                assert.isFalse(
                    solver.checkRegionPlacement(puzzle, rowIndex, colIndex, "5")
                );
            });
        });

        suite("solve", function () {
            test("Valid puzzle strings pass the solver", function () {
                assert.isTrue(
                    strings.every((elem) => {
                        return (
                            solver.solve(elem[0]) !== "invalid puzzle string" &&
                            solver.solve(elem[1]) !== "invalid puzzle string"
                        );
                    })
                );
            });

            test("Invalid puzzle strings fail the solver", function () {
                assert.equal(
                    solver.solve(
                        "5.52a04f186w95rra985w1008994g3722..49fa4g68f82w77w0.ff36831gw2ff49f75.1144522478w"
                    ),
                    "invalid puzzle string"
                );
                assert.equal(
                    solver.solve(
                        "5fr805...w.6ww9a2048w9aw.g5w52rag5gg.1368496f.1f43.g7952f90w0fw91ag0r..1r4r23rw54"
                    ),
                    "invalid puzzle string"
                );
                assert.equal(
                    solver.solve(
                        "78156356.6781574264514.656329.42.13220526.25739472287559.486754276142.739720199476.804.406"
                    ),
                    "puzzle should be 81 characters"
                );
                assert.equal(
                    solver.solve(
                        "7426912276141769630.686367338602799902541089.2974.2150071872032.842959"
                    ),
                    "puzzle should be 81 characters"
                );
            });

            test("Solver returns the the expected solution for an incomplete puzzle", function () {
                const puzzles = strings.map((elem) => elem[0]);
                const solutions = strings.map((elem) => elem[1]);

                assert.isTrue(
                    puzzles.every(
                        (puzzle, index) =>
                            solver.solve(puzzle) === solutions[index]
                    )
                );
            });
        });
    });
});
