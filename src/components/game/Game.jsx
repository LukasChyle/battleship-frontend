import {useEffect, useState} from "react";
import GameSession from "./gameStages/GameSession.jsx";
import GameSetUp from "./gameStages/GameSetUp.jsx";

const getInitialShips = [
    {id: "ship-1", isHorizontal: true, length: 2, row: 1, col: 1},
    {id: "ship-2", isHorizontal: true, length: 2, row: 2, col: 2},
    {id: "ship-3", isHorizontal: true, length: 3, row: 3, col: 3},
    {id: "ship-4", isHorizontal: true, length: 4, row: 4, col: 4},
    {id: "ship-5", isHorizontal: true, length: 5, row: 5, col: 5},
]
export default function Game() {
    const [ships, setShips] = useState(getInitialShips);
    const [isPlayingGame, setIsPlayingGame] = useState(false);

    useEffect(() => {
        if (window.sessionStorage?.getItem("isPlayingGame")) {
            setIsPlayingGame(window.sessionStorage.getItem("isPlayingGame"))
        }
    }, []);

    return (
        <div>
            {isPlayingGame ?
                <GameSession
                    ships={ships}
                    onShips={setShips}
                    onIsPlayingGame={setIsPlayingGame}
                />
                :
                <GameSetUp
                    ships={ships}
                    onShips={setShips}
                    onIsPlayingGame={setIsPlayingGame}
                />}
        </div>
    )
}