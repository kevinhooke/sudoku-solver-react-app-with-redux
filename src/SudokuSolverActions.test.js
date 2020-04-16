import SudokuSolverAction from"./actions/SudokuSolverAction.js";
import SudokuSolverStore from "./stores/SudokuSolverStore";

it('replaces blanks with "."', () => {

    var testData =
            [
                ["", "", "", "8", "1", "", "6", "7", ""],
                ["", "", "7", "4", "9", "", "2", "", "8"],
                ["", "6", "", "", "5", "", "1", "", "4"],
                ["1", "", "", "", "", "3", "9", "", ""],
                ["4", "", "", "", "8", "", "", "", "7"],
                ["", "", "6", "9", "", "", "", "", "3"],
                ["9", "", "2", "", "3", "", "", "6", ""],
                ["6", "", "1", "", "7", "4", "3", "", ""],
                ["", "3", "4", "", "6", "9", "", "", ""]
    ];
    SudokuSolverStore.setData(testData);
    var result = SudokuSolverAction.buildRequest();
    console.log(JSON.stringify(result));
    expect(result[0].length).toBe(9);
    expect(result[0]).toBe("...81.67.");
    expect(result[1]).toBe("..749.2.8");
    expect(result[2]).toBe(".6..5.1.4");
    expect(result[3]).toBe("1....39..");
    expect(result[4]).toBe("4...8...7");
    expect(result[5]).toBe("..69....3");
    expect(result[6]).toBe("9.2.3..6.");
    expect(result[7]).toBe("6.1.743..");
    expect(result[8]).toBe(".34.69...");
});