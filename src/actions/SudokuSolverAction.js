import request from 'superagent';
import AppDispatcher from "../dispatcher/Dispatcher";
import SudokuSolverStore from "../stores/SudokuSolverStore";

const SudokuSolverAction = {

    initSamplePuzzle(){
        console.log("SudokuSolverAction initSamplePuzzle()");
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

        AppDispatcher.dispatch({
            actionName: 'NEW_DATA',
            data: puzzle.rows
        });
    },

    clearData(){
        console.log("SudokuSolverAction initSamplePuzzle()");
        var puzzle = {
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

        AppDispatcher.dispatch({
            actionName: 'NEW_DATA',
            data: puzzle.rows
        });
    },

    updatePuzzleData(newData){
        AppDispatcher.dispatch({
            actionName: 'NEW_DATA',
            data: newData
        });
    },

    parseResponse(response){
        var parsedData = {};
        var temp = response.rows;
        for (var row=0;row<9;row++) {
            parsedData[row] = [];
            parsedData[row] = temp[row].split('');
        }
        return parsedData;
    },

    buildRequest(){
        var requestData = [];
        //console.log("check before , array in store: " + JSON.stringify( SudokuSolverStore.getData()));
        //use slice() to clone the original array, to not modify it directly
        var currentData = SudokuSolverStore.getData().slice();
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
    },

    callSolverLambda() {
        console.log("SudokuSolverAction callSolverLambda()");

        //TODO: convert state/store to this format

        // var requestPayload = {
        //     rows:
        //         [
        //             "...81.67.",
        //             "..749.2.8",
        //             ".6..5.1.4",
        //             "1....39..",
        //             "4...8...7",
        //             "..69....3",
        //             "9.2.3..6.",
        //             "6.1.743..",
        //             ".34.69..."
        //         ]
        // }

        var requestPayload = {};
        requestPayload.rows = this.buildRequest();

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
                        //dispatch response
                        AppDispatcher.dispatch({
                            actionName: 'ERROR',
                            message: "Failed to solve puzzle, is it a valid puzzle with a single solution?"
                        });
                    } else {
                        //dispatch response
                        var parsedData = SudokuSolverAction.parseResponse(res.body);
                        AppDispatcher.dispatch({
                            actionName: 'UPDATE',
                            data: parsedData
                        });
                    }
                }
            });
    }
}
export default SudokuSolverAction;