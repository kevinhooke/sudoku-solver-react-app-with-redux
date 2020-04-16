import React, {Component} from 'react';
import CellComponent from "../components/CellComponent";
import SudokuSolverAction from "../actions/SudokuSolverAction";
import SudokuSolverStore from "../stores/SudokuSolverStore";

//TODO validation on input fields

//TODO clear error message on each action

//TODO show solving progress/status while waiting for response

//TODO spruce up error message box

class SudokuSolver extends Component {

    constructor(props) {
        super(props);

        this.state =
            {
                grid: [],
                message: ""
            };

        for (var row = 0; row < 9; row++) {
            this.state.grid[row] = [];
        }

        this.onChange = this.onChange.bind(this);
        this.onError = this.onError.bind(this);
    };

    //handler approach 2:
    handleGridChange(row, colIndex, event) {
        console.log("row [" + row + "] col [" + colIndex + "] : " + event.target.value);
        var updatedGrid = [...this.state.grid];
        updatedGrid[row][colIndex] = event.target.value;

        //before adding Flux, to update state directly
        //this.setState({grid: updatedGrid});

        //with Flux, call Action to send updated data to Store
        SudokuSolverAction.updatePuzzleData(updatedGrid);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("submit pressed");
        SudokuSolverAction.callSolverLambda();
    }

    handleClear(event) {
        event.preventDefault();
        console.log("clear pressed");
        SudokuSolverAction.clearData();
    }

    handleRestSample(event){
        event.preventDefault();
        SudokuSolverAction.initSamplePuzzle();
    }

    /**
     * Load initial state with a sample.
     */
    componentWillMount() {
        SudokuSolverStore.addChangeListener(this.onChange);
        SudokuSolverStore.addErrorListener(this.onError);
        SudokuSolverAction.initSamplePuzzle();
    }

    onError(){
        console.log('SudokuSolver onError triggered');
        this.setState({message: SudokuSolverStore.getMessage()});
    }

    /**
     * Updates state when an event is triggered from the Store.
     */
    onChange() {
        console.log('SudokuSolver onChange triggered');
        this.setState({grid: SudokuSolverStore.getData()});
    }

    render() {
        return (
            <div className="sudoku-grid-container">
                <div id="messages">{this.state.message}</div>
                <div className="buttons">
                    <button className="buttons" onClick={this.handleSubmit}>Solve Puzzle</button>
                    <button className="buttons" onClick={this.handleClear}>Clear grid</button>
                    <button className="buttons" onClick={this.handleRestSample}>Reload sample puzzle</button>
                </div>

                <table className="sudoku-grid">
                    <tbody>
                    <tr>
                        {
                            this.state.grid[0].map((cell, colIndex) => (
                                    <td key={"row0" + colIndex}>
                                        <CellComponent value={this.state.grid[0][colIndex]}
                                                       onChange={this.handleGridChange.bind(this, 0, colIndex)}/>
                                    </td>
                                )
                            )}
                    </tr>
                    <tr>
                        {

                            this.state.grid[1].map((cell, colIndex) => (
                                    <td key={"row1" + colIndex}>
                                        <CellComponent value={this.state.grid[1][colIndex]}
                                                       onChange={this.handleGridChange.bind(this, 1, colIndex)}/>
                                    </td>
                                )
                            )}
                    </tr>
                    <tr>
                        {
                            this.state.grid[2].map((cell, colIndex) => (
                                    <td key={"row2" + colIndex}>
                                        <CellComponent value={this.state.grid[2][colIndex]}
                                                       onChange={this.handleGridChange.bind(this, 2, colIndex)}/>
                                    </td>
                                )
                            )}
                    </tr>
                    <tr>
                        {
                            this.state.grid[3].map((cell, colIndex) => (
                                    <td key={"row3" + colIndex}>
                                        <CellComponent value={this.state.grid[3][colIndex]}
                                                       onChange={this.handleGridChange.bind(this, 3, colIndex)}/>
                                    </td>
                                )
                            )}
                    </tr>
                    <tr>
                        {
                            this.state.grid[4].map((cell, colIndex) => (
                                    <td key={"row4" + colIndex}>
                                        <CellComponent value={this.state.grid[4][colIndex]}
                                                       onChange={this.handleGridChange.bind(this, 4, colIndex)}/>
                                    </td>
                                )
                            )}
                    </tr>
                    <tr>
                        {
                            this.state.grid[5].map((cell, colIndex) => (
                                    <td key={"row5" + colIndex}>
                                        <CellComponent value={this.state.grid[5][colIndex]}
                                                       onChange={this.handleGridChange.bind(this, 5, colIndex)}/>
                                    </td>
                                )
                            )}
                    </tr>
                    <tr>
                        {
                            this.state.grid[6].map((cell, colIndex) => (
                                    <td key={"row6" + colIndex}>
                                        <CellComponent value={this.state.grid[6][colIndex]}
                                                       onChange={this.handleGridChange.bind(this, 6, colIndex)}/>
                                    </td>
                                )
                            )}
                    </tr>
                    <tr>
                        {
                            this.state.grid[7].map((cell, colIndex) => (
                                    <td key={"row7" + colIndex}>
                                        <CellComponent value={this.state.grid[7][colIndex]}
                                                       onChange={this.handleGridChange.bind(this, 7, colIndex)}/>
                                    </td>
                                )
                            )}
                    </tr>
                    <tr>
                        {
                            this.state.grid[8].map((cell, colIndex) => (
                                    <td key={"row8" + colIndex}>
                                        <CellComponent value={this.state.grid[8][colIndex]}
                                                       onChange={this.handleGridChange.bind(this, 8, colIndex)}/>
                                    </td>
                                )
                            )}
                    </tr>
                    </tbody>
                </table>
            </div>
        );
    }

}

export default SudokuSolver;