import { Client } from "boardgame.io/react";
import { TicTacToe } from "./game/index.js";
import { TicTacToeBoard } from "./board.jsx";

const App = Client({ board: TicTacToeBoard, game: TicTacToe });

export default App;
