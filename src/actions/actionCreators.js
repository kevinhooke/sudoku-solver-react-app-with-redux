import { NEW_DATA } from './ActionConstants';

export function clearData(){
    return { type: NEW_DATA, grid: {} }
}

export function updatePuzzleData(payload) {
    return { type: NEW_DATA, payload }
};

export function initSamplePuzzle(){
    console.log("actionCreators initSamplePuzzle()");
    var puzzle = {
        rows:
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
            ]
    }

    return {
        type: 'NEW_DATA',
        data: puzzle.rows
    };
}