import React, {Component} from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import CellComponent from "../components/CellComponent";
import { connect } from 'react-redux';
import { updatePuzzleData, updateSpinner, clearData, initSamplePuzzle, fetchPuzzleSolution, getPuzzle } from '../actions/actionCreators';

const mapStateToProps = state => {
    //if grid is undefined, initialize with empty arrays which we use later
    //to draw the grid
    if(state.grid == null){
        state.grid = [];
        for (var row = 0; row < 9; row++) {
            state.grid[row] = [];
        }
    }
    return { 
        grid: state.grid,
        message: state.message,
        showSpinner: state.showSpinner,
        puzzleId: state.puzzleId,
        puzzleDifficulty: state.puzzleDifficulty
     };
};

function mapDispatchToProps(dispatch) {
    return {
        updatePuzzleData :  grid => dispatch(updatePuzzleData(grid)),
        clearData : () => dispatch(clearData()),
        initSamplePuzzle : () => dispatch(initSamplePuzzle()),
        fetchPuzzleSolution : () => fetchPuzzleSolution(),
        getPuzzle : (difficulty) => getPuzzle(difficulty),
        updateSpinner : (value) => dispatch(updateSpinner(value))
    }
}

//TODO validation on input fields

//TODO clear error message on each action

//TODO show solving progress/status while waiting for response

//TODO spruce up error message box

class ConnectedSudokuSolver extends Component {

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
        //Flux approach, not needed with Redux
        //this.onChange = this.onChange.bind(this);
        //this.onError = this.onError.bind(this);

        this.handleGridChange = this.handleGridChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClear = this.handleClear.bind(this);
        this.handleResetSample = this.handleResetSample.bind(this);
        this.updateSpinner = this.updateSpinner(this);
    };

    //handler approach 2:
    handleGridChange(row, colIndex, event) {
        console.log("row [" + row + "] col [" + colIndex + "] : " + event.target.value);
        //var updatedGrid = [...this.state.grid];
        var updatedGrid = [...this.props.grid];
        updatedGrid[row][colIndex] = event.target.value;

        //before adding Flux, to update state directly
        //this.setState({grid: updatedGrid});

        //with Flux, call Action to send updated data to Store
        //SudokuSolverAction.updatePuzzleData(updatedGrid);

        //Redux action creator
        this.props.updatePuzzleData(updatedGrid);
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("submit pressed");
        this.props.updateSpinner("true");
        //TODO add fetch
        //SudokuSolverAction.callSolverLambda();
        //Redux Action creator
        this.props.fetchPuzzleSolution();
        //this.props.updateSpinner(false);
    }

    handleClear(event) {
        event.preventDefault();
        console.log("clear pressed");
        //Flux approach:
        //SudokuSolverAction.clearData();

        //Redux Action creator
        this.props.clearData();
    }

    handleResetSample(event){
        //event.preventDefault();
        //Flux approach:
        //SudokuSolverAction.initSamplePuzzle();

        //Redux Action creator
        this.props.initSamplePuzzle();
    }

    handleGetPuzzle = (difficulty) => {
        console.log("handleGetPuzzle(): " + difficulty)
        this.props.updateSpinner("true");
        this.props.getPuzzle(difficulty);
    }

    /**
     * Load initial state with a sample.
     */
    componentWillMount() {
        //Flux approach:
        //SudokuSolverStore.addChangeListener(this.onChange);
        //SudokuSolverStore.addErrorListener(this.onError);
        //SudokuSolverAction.initSamplePuzzle();

        //Redux Action creator
        this.props.initSamplePuzzle();
    }

    onError(){
        console.log('SudokuSolver onError triggered');
        //TODO
        //this.setState({message: SudokuSolverStore.getMessage()});
    }

    updateSpinner(value){
        //TODO how to update only one vale, preserving rest of state in store
        this.props.updateSpinner(value);
    }

    /**
     * Updates state when an event is triggered from the Store.
     */
    //Not needed with Redux
    //onChange() {
    //    console.log('SudokuSolver onChange triggered');
    //    //this.setState({grid: SudokuSolverStore.getData()});
    //}

    render() {
        return (
            <div className="main-container">

                <div className="spinner">
                    { this.props.showSpinner === "true" && <CircularProgress/> }
                </div>

                <div className="button-container">
                    <div id="messages">{this.props.message}</div>
                    <div>
                        <button className="buttons" onClick={this.handleSubmit}>Solve Puzzle</button>
                    </div>
                    <div>
                        <button className="buttons" onClick={this.handleClear}>Clear grid</button>
                    </div>
                    <div>
                        <button className="buttons" onClick={this.handleResetSample}>Reload sample puzzle</button>
                    </div>
                    <div>
                        <br/>
                    </div>
                    <div>
                        <button onClick={ () => this.handleGetPuzzle('EASY')}>Load easy puzzle</button>                        
                    </div>
                    <div>
                        <button onClick={ () => this.handleGetPuzzle('MEDIUM')}>Load medium puzzle</button>
                    </div>
                    <div>
                        <button onClick={() => this.handleGetPuzzle('HARD')}>Load hard puzzle</button>
                    </div>
                </div>
                <div className="sudoku-grid-container">
                    <table className="sudoku-grid">
                        <tbody>
                        <tr>
                            {
                                this.props.grid[0].map((cell, colIndex) => (
                                        <td key={"row0" + colIndex}>
                                            <CellComponent value={this.props.grid[0][colIndex]}
                                                        onChange={this.handleGridChange.bind(this, 0, colIndex)}/>
                                        </td>
                                    )
                                )}
                        </tr>
                        <tr>
                            {

                                this.props.grid[1].map((cell, colIndex) => (
                                        <td key={"row1" + colIndex}>
                                            <CellComponent value={this.props.grid[1][colIndex]}
                                                        onChange={this.handleGridChange.bind(this, 1, colIndex)}/>
                                        </td>
                                    )
                                )}
                        </tr>
                        <tr>
                            {
                                this.props.grid[2].map((cell, colIndex) => (
                                        <td key={"row2" + colIndex}>
                                            <CellComponent value={this.props.grid[2][colIndex]}
                                                        onChange={this.handleGridChange.bind(this, 2, colIndex)}/>
                                        </td>
                                    )
                                )}
                        </tr>
                        <tr>
                            {
                                this.props.grid[3].map((cell, colIndex) => (
                                        <td key={"row3" + colIndex}>
                                            <CellComponent value={this.props.grid[3][colIndex]}
                                                        onChange={this.handleGridChange.bind(this, 3, colIndex)}/>
                                        </td>
                                    )
                                )}
                        </tr>
                        <tr>
                            {
                                this.props.grid[4].map((cell, colIndex) => (
                                        <td key={"row4" + colIndex}>
                                            <CellComponent value={this.props.grid[4][colIndex]}
                                                        onChange={this.handleGridChange.bind(this, 4, colIndex)}/>
                                        </td>
                                    )
                                )}
                        </tr>
                        <tr>
                            {
                                this.props.grid[5].map((cell, colIndex) => (
                                        <td key={"row5" + colIndex}>
                                            <CellComponent value={this.props.grid[5][colIndex]}
                                                        onChange={this.handleGridChange.bind(this, 5, colIndex)}/>
                                        </td>
                                    )
                                )}
                        </tr>
                        <tr>
                            {
                                this.props.grid[6].map((cell, colIndex) => (
                                        <td key={"row6" + colIndex}>
                                            <CellComponent value={this.props.grid[6][colIndex]}
                                                        onChange={this.handleGridChange.bind(this, 6, colIndex)}/>
                                        </td>
                                    )
                                )}
                        </tr>
                        <tr>
                            {
                                this.props.grid[7].map((cell, colIndex) => (
                                        <td key={"row7" + colIndex}>
                                            <CellComponent value={this.props.grid[7][colIndex]}
                                                        onChange={this.handleGridChange.bind(this, 7, colIndex)}/>
                                        </td>
                                    )
                                )}
                        </tr>
                        <tr>
                            {
                                this.props.grid[8].map((cell, colIndex) => (
                                        <td key={"row8" + colIndex}>
                                            <CellComponent value={this.props.grid[8][colIndex]}
                                                        onChange={this.handleGridChange.bind(this, 8, colIndex)}/>
                                        </td>
                                    )
                                )}
                        </tr>
                        </tbody>
                    </table>
                </div>
                <div className="puzzle-info">
                    <p>Puzzle id:</p>
                    <p>{ this.props.puzzleId }</p>
                    <p>Difficulty: { this.props.puzzleDifficulty }</p>
                </div>
            </div>
        );
    }

}

const SudokuSolver = connect(mapStateToProps, mapDispatchToProps)(ConnectedSudokuSolver);

export default SudokuSolver;