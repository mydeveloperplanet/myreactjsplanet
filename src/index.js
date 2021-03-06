import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={props.showColor ? {backgroundColor:'green'} : {backgroundColor:'white'}}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                showColor={this.props.winnerLines && this.props.winnerLines.includes(i)}
                onClick={() => this.props.onClick(i)}
            />
            );
    }

    createBoard = () => {
        let board = []

        // Outer loop to create parent
        for (let row = 0; row < 3; row++) {
            let children = []
            let startIndex = row * 3
            //Inner loop to create children
            for (let squareIndex = startIndex; squareIndex < startIndex + 3; squareIndex++) {
                children.push(this.renderSquare(squareIndex))
            }
            //Create the parent and add the children
            board.push(<div className="board-row">{children}</div>)
        }
        return board
    }


    render() {
        return (
            <div>{this.createBoard()}</div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                column: 0,
                row: 0,
            }],
            stepNumber: 0,
            xIsNext: true,
            isReversed: false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                column: (i % 3) + 1,
                row: Math.floor(i / 3) + 1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    toggleReversed() {
        this.setState({
            isReversed: !this.state.isReversed,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move + ' location(' + history[move].column + ',' + history[move].row + ')' : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>
                        {move === this.state.stepNumber ? <b>{desc}</b> : desc}
                    </button>
                </li>
            )
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner.square;
        } else if (this.state.stepNumber === 9) {
            status = 'It is a draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winnerLines={winner ? winner.winnerLines : null}
                        onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.toggleReversed()}>Toggle moves sorting</button>
                    <ol>{this.state.isReversed ? moves.reverse() : moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {square: squares[a],
                    winnerLines: lines[i]};
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
