import AppDispatcher from "../dispatcher/Dispatcher";
var EventEmitter = require('events').EventEmitter;

var puzzleData = {
}

var message = {

}

class SudokuSolverStore extends EventEmitter {

    constructor() {
        super();
        this.payload = AppDispatcher.register(this.handleAction.bind(this));
    }

    addChangeListener(callback){
        this.on('change', callback);
    }

    removeChangeListener(callback){
        this.removeListener('change', callback);
    }

    addErrorListener(callback){
        this.on('error', callback);
    }

    removeErrorListener(callback){
        this.removeListener('error', callback);
    }

    getMessage(){
        return message;
    }

    setMessage(newMessage){
        message = newMessage;
    }

    setData(newData){
        puzzleData = newData;
    }

    getData(){
        return puzzleData;
    }

    handleAction(action) {

        switch (action.actionName) {

            case 'NEW_DATA' :
                this.setData(action.data);
                this.emit('change');
                break;

            case 'UPDATE':
                console.log("SudokuSolverStore is handling UPDATE action!: " + JSON.stringify(action.data));
                var newData = [];

                for(var row in action.data){
                    console.log("row: " + JSON.stringify(action.data[row]));
                    newData[row] = action.data[row];
                }
                this.setData(newData);
                this.emit('change');
                break;

            case 'ERROR' :
                this.setMessage(action.message);
                this.emit('error');
                break;
        }
    }

}

export default new SudokuSolverStore();