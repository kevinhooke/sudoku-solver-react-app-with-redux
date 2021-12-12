import store from '../stores/SudokuSolverReduxStore';
import request from 'superagent';
import { NEW_DATA, UPDATE_SPINNER } from './ActionConstants';
import config from '../config.js';

const emptyGrid = {
    rows:
        [
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""]
        ]
}

export function clearData(){
    return { type: NEW_DATA, showSpinner : false, grid: emptyGrid.rows }
}

export function updateSpinner(value){
    return { type: UPDATE_SPINNER, showSpinner : value }
}

export function updatePuzzleData(payload) {
    return { type: NEW_DATA, grid: payload }
};

export function initSamplePuzzle(){
    console.log("actionCreators initSamplePuzzle()");
    var puzzle = {
        showSpinner : "false",
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
        grid: puzzle.rows
    };
}

export function fetchPuzzleSolution() {
    console.log("actionCreators: fetchPuzzleSolution()");

    var requestPayload = {};
    //TODO convert to get current state from Redux Store
    requestPayload.rows = buildRequest();

    request.post('https://aqfhv970kg.execute-api.us-west-1.amazonaws.com/test/sudoku')
        .send(requestPayload)
        .set('Content-Type', 'application/json')
        .timeout({
            response: 10000,  // 10 secs before response
            deadline: 15000, // 15 sec to complete
        })
        .end(function(err, res){
            if (err) {
                console.log("request failed: " + JSON.stringify(err));
            } else {
                console.log("success: ");
                console.log(JSON.stringify(res));
                if (res.body.errorMessage) {
                    //Flux dispatch response
                    //AppDispatcher.dispatch({
                    //    actionName: 'ERROR',
                    //    message: "Failed to solve puzzle, is it a valid puzzle with a single solution?"
                    //});
                    store.dispatch( {
                        type: 'ERROR',
                        message: "Failed to solve puzzle, is it a valid puzzle with a single solution?"
                    });
                } else {
                    //dispatch response
                    //var parsedData = SudokuSolverAction.parseResponse(res.body);
                    var parsedData = parseResponse(res.body.rows);
                    //Flux dispatch approach
                    //AppDispatcher.dispatch({
                    //    actionName: 'UPDATE',
                    //    data: parsedData
                    //});
                    store.dispatch( {
                        type: 'UPDATE',
                        data: parsedData
                    });
                }
            }
        });
}

export function getPuzzle(difficulty) {
    console.log("actionCreators: getPuzzle(): " + difficulty);

    var requestPayload = {};

    //request.get('https://7ivvexkae1.execute-api.us-west-1.amazonaws.com/sudoku/puzzle?difficuty=' + difficulty)
    request.get(config.getPuzzleUrl + '?difficuty=' + difficulty)
        .set('Content-Type', 'application/json')
        .timeout({
            response: 10000,  // 10 secs before response
            deadline: 15000, // 15 sec to complete
        })
        .end(function(err, res){
            if (err) {
                console.log("request failed: " + JSON.stringify(err));
            } else {
                console.log("success: ");
                console.log(JSON.stringify(res));
                if (res.body.errorMessage) {
                    //Flux dispatch response
                    //AppDispatcher.dispatch({
                    //    actionName: 'ERROR',
                    //    message: "Failed to solve puzzle, is it a valid puzzle with a single solution?"
                    //});
                    store.dispatch( {
                        type: 'ERROR',
                        message: "Failed to get puzzle?"
                    });
                } else {
                    //dispatch response
                    //var parsedData = SudokuSolverAction.parseResponse(res.body);
                    var parsedData = parseResponse(res.body.data.puzzle.puzzle);
                    //Flux dispatch approach
                    //AppDispatcher.dispatch({
                    //    actionName: 'UPDATE',
                    //    data: parsedData
                    //});
                    store.dispatch( {
                        type: 'UPDATE',
                        data: parsedData,
                        puzzleId : res.body.data.puzzle.id,
                        puzzleDifficulty: res.body.data.puzzle.difficulty
                    });
                }
            }
        });
}

//parses response from api call
function parseResponse(response){
    var parsedData = {};
    var temp = response;
    for (var row=0;row<9;row++) {
        parsedData[row] = [];
        let rowValues = temp[row];
        parsedData[row] = rowValues.split('');
        //replace '.'s with '' for display in the grid
        parsedData[row] = parsedData[row].map( (value, index) => { return value === '.' ? '' : value});
    }
    return parsedData;
}

//builds request to Solver API (AWS Lambda)
function buildRequest(){
    var requestData = [];
    //Previous Flux approach
    //use slice() to clone the original array, to not modify it directly
    //var currentData = SudokuSolverStore.getData().slice();
    //get state from Redux store
    var currentData = store.getState().grid;

    console.log("current data: " + JSON.stringify(currentData));
    for (var row=0;row<9;row++) {
        //clone a copy of the current row array
        var currentRow = [...currentData[row]];
        for(var cell=0;cell<9;cell++){
            if(currentRow[cell].trim() === ""){
                currentRow[cell] = ".";
            }
        }
        //join array to a string
        requestData[row] = currentRow.join("");
    }
    //console.log("check, array in store: " + JSON.stringify( SudokuSolverStore.getData()));
    return requestData;
}
