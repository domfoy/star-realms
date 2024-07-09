import { Client } from "boardgame.io/react";
import { SRGame } from "./game/index.js";
import { SRGameBoard } from "./board.jsx";

const App = Client({ game: SRGame, board: SRGameBoard });

export default App;
