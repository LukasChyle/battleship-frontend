import React, {useEffect, useState} from "react";
import Ship from "./Ship.jsx";

const getTileImage = (tile) => {
    return tile.usedByShip ? getUsedByShipTileImage(tile.usedBySunkenShip)
        : "/src/assets/framed-water.jpg"
}

const getUsedByShipTileImage = (isSunken) => {
    if (isSunken) {
        return "/src/assets/red-framed-water.jpg"
    }
    return "/src/assets/green-framed-water.jpg"
}

function GameBoardTile({tile, tileStrikes, handleStrike, isOwnTile}) {
    const [image, setImage] = useState(getTileImage(tile))

    const handleClick = () => {
        if (!isOwnTile && !tile.alreadyStruck) {
            handleStrike({ row: tile.row, column: tile.column })
        }
    }

    const handleOnMouseEnter = () => {
        if (!isOwnTile) {
            setImage("/src/assets/strike-framed-water.jpg")
        }
    }

    const handleOnMouseLeave = () => {
        if (!isOwnTile) {
            setImage(getTileImage(tile))
        }
    }

    useEffect(() => {
        setImage(getTileImage(tile, tileStrikes));
    }, [tile, tileStrikes]);

    return (
        <span className="board-tile">
            <img
                onClick={handleClick}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
                className="tile-img tile-img"
                src={image}
                alt="board-tile"/>
            {tile.ship && <Ship
                key={tile.ship.id}
                isHorizontal={tile.ship.isHorizontal}
                length={tile.ship.length}
                isSunk={tile.ship.isSunk}
            />}
        </span>
    )
}

export default React.memo(GameBoardTile)