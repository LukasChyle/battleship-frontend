import {useState} from "react";

export default function OpponentGameBoardTile({tile, handleStrike}) {
    const [image, setImage] = useState("/src/assets/framed-water.jpg")
    const handleOnMouseEnter = () => {
        if (tile.alreadyUsed) {
            setImage("/src/assets/red-framed-water.jpg")
        } else {
            setImage("/src/assets/strike-framed-water.jpg")
        }
    }
    const handleOnMouseLeave = () => {
        setImage("/src/assets/framed-water.jpg")
    }
    return (
        <span className="board-tile">
            <img
                onClick={() => handleStrike(!tile.alreadyUsed? {row: tile.row, col: tile.col} : null)}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                className="opponent-tile-img tile-img"
                src={image} alt="board-tile"/>
        </span>
    )
}