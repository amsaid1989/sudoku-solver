class SudokuSolver {
    validate(puzzleString) {
        const pattern = /^[\d\.]{81}$/;

        return pattern.test(puzzleString);
    }

    getRowIndex(index) {
        return Math.floor(index / 9);
    }

    getColIndex(index) {
        return index % 9;
    }

    getRegionIndices(rowIndex, colIndex) {
        return [Math.floor(rowIndex / 3), Math.floor(colIndex / 3)];
    }

    coordinateToIndices(coordinate) {
        const allowedLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];

        if (
            coordinate.length !== 2 ||
            !allowedLetters.includes(coordinate[0].toUpperCase())
        ) {
            return "invalid coordinate";
        }

        const rowIndex = allowedLetters.indexOf(coordinate[0].toUpperCase());
        const colIndex = Number(coordinate[1]) - 1;

        return [rowIndex, colIndex];
    }

    splitRows(puzzleString) {
        const arr = puzzleString.split("");

        const rows = arr.reduce((out, cur, idx) => {
            const index = this.getRowIndex(idx);

            out[index] = out[index] ? [...out[index], cur] : [cur];

            return out;
        }, []);

        return rows;
    }

    splitColumns(puzzleString) {
        const arr = puzzleString.split("");

        const columns = arr.reduce((out, cur, idx) => {
            const index = this.getColIndex(idx);

            out[index] = out[index] ? [...out[index], cur] : [cur];

            return out;
        }, []);

        return columns;
    }

    splitRegions(puzzleString) {
        const arr = puzzleString.split("");

        const base = [
            [[], [], []],
            [[], [], []],
            [[], [], []],
        ];

        const regions = arr.reduce((out, cur, idx) => {
            const region = this.getRegionIndices(
                this.getRowIndex(idx),
                this.getColIndex(idx)
            );

            out[region[0]][region[1]] = [...out[region[0]][region[1]], cur];

            return out;
        }, base);

        return regions;
    }

    check(puzzleString, rowIndex, colIndex, value) {
        return (
            this.checkRowPlacement(puzzleString, rowIndex, value) &&
            this.checkColPlacement(puzzleString, colIndex, value) &&
            this.checkRegionPlacement(puzzleString, rowIndex, colIndex, value)
        );
    }

    checkRowPlacement(puzzleString, rowIndex, value) {
        const row = this.splitRows(puzzleString)[rowIndex];

        return !row.includes(value);
    }

    checkColPlacement(puzzleString, colIndex, value) {
        const col = this.splitColumns(puzzleString)[colIndex];

        return !col.includes(value);
    }

    checkRegionPlacement(puzzleString, rowIndex, colIndex, value) {
        const regionIndices = this.getRegionIndices(rowIndex, colIndex);
        const region = this.splitRegions(puzzleString)[regionIndices[0]][
            regionIndices[1]
        ];

        return !region.includes(value);
    }

    solve(puzzleString) {
        if (puzzleString.length !== 81) {
            return "puzzle should be 81 characters";
        } else if (!this.validate(puzzleString)) {
            return "invalid puzzle string";
        }

        if (!puzzleString.includes(".")) {
            return puzzleString;
        }

        let resultString = puzzleString;

        let possibleSolutions = {};

        for (let idx = 0; idx < resultString.length; idx++) {
            if (resultString[idx] === ".") {
                const rowIndex = this.getRowIndex(idx);
                const colIndex = this.getColIndex(idx);

                const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

                possibleSolutions[idx] = digits.filter((digit) => {
                    return this.check(resultString, rowIndex, colIndex, digit);
                });

                if (possibleSolutions[idx].length === 1) {
                    resultString =
                        resultString.slice(0, idx) +
                        possibleSolutions[idx][0] +
                        resultString.slice(idx + 1);
                } else if (possibleSolutions[idx].length === 0) {
                    return "puzzle can't be solved";
                }
            }
        }

        return this.solve(resultString);
    }
}

module.exports = SudokuSolver;
