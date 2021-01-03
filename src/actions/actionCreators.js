import store from '../stores/SudokuSolverReduxStore';
import request from 'superagent';
import { NEW_DATA } from './ActionConstants';

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
    return { type: NEW_DATA, grid: emptyGrid.rows }
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
            response: 5000,  // 3 secs before response
            deadline: 10000, // 6 sec to complete
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
                    var parsedData = parseResponse(res.body);
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

//parses response from api call
function parseResponse(response){
    var parsedData = {};
    var temp = response.rows;
    for (var row=0;row<9;row++) {
        parsedData[row] = [];
        parsedData[row] = temp[row].split('');
    }
    return parsedData;
}

//builds request to Solver API (AWS Lambda)
function buildRequest(){
    var requestData = [];
    //Previous Flux approac
    //use slice() to clone the original array, to not modify it directly
    //var currentData = SudokuSolverStore.getData().slice();
    //get state from Redux store
    var currentData = store.getState().grid;

    console.log("current data: " + JSON.stringify(currentData));
    for (var row=0;row<9;row++) {
        //clone a copy of the current row array
        var currentRow = [...currentData[row]];
        for(var cell=0;cell<9;cell++){
            if(currentRow[cell] === ""){
                currentRow[cell] = ".";
            }
        }
        //join array to a string
        requestData[row] = currentRow.join("");
    }
    //console.log("check, array in store: " + JSON.stringify( SudokuSolverStore.getData()));
    return requestData;
}
