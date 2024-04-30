import {Divider, Grid, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {DndContext} from "@dnd-kit/core";
import SetUpGameBoardTile from "./components/SetUpGameBoardTile.jsx";
import MatchTilesWithShips from "../MatchTilesWithShips.jsx";

const board = Array.apply(null, Array(10)).map(() => (
    Array.apply(null, Array(10)).map(function () {
    })))

const getInitialTiles = () => {
    const tiles = []
    board.forEach((row, rowIndex) => (row.forEach((col, colIndex) => {
        tiles.push({
            id: (rowIndex + "" + colIndex),
            row: rowIndex,
            col: colIndex,
            src: "/src/assets/framed-water.jpg",
            used: false,
            ship: undefined
        })
    })))
    return tiles
}

export default function SetUpGameBoard({ships, onShips}) {
    const [tiles, setTiles] = useState(getInitialTiles())

    useEffect(() => {
        MatchTilesWithShips(tiles, setTiles, ships)
    }, [ships]);

    const handleDragOver = (e) => {
        if (e.over) {
            markTiles(canBeLaid(
                    e.active.data.current.length,
                    e.active.data.current.isHorizontal,
                    e.active.data.current.isHorizontal,
                    e.over.data.current.row,
                    e.over.data.current.col,
                    e.active.data.current.row,
                    e.active.data.current.col),
                e.active.data.current.length,
                e.active.data.current.isHorizontal,
                e.over.data.current.row,
                e.over.data.current.col)
        }
    }

    const handleDragEnd = (e) => {
        resetTileImages()
        if (!e.over) {
            return
        }
        if (!canBeLaid(
            e.active.data.current.length,
            e.active.data.current.isHorizontal,
            e.active.data.current.isHorizontal,
            e.over.data.current.row,
            e.over.data.current.col,
            e.active.data.current.row,
            e.active.data.current.col)) {
            return
        }
        onShips(ships.map((ship) => {
            const match = e.active.id === ship.id
            return match ? {...ship, row: e.over.data.current.row, col: e.over.data.current.col} : ship
        }))
    }

    const canBeLaid = (length, layIsHorizontal, currentIsHorizontal, overRow, overCol, currentRow, currentCol) => {
        if (layIsHorizontal) {
            if (length + overCol > 10) {
                return false
            }
        } else {
            if (length + overRow > 10) {
                return false
            }
        }
        const currentTiles = []
        for (let i = 0; i < length; i++) {
            currentIsHorizontal ? currentTiles.push({id: currentRow + "" + (currentCol + i)}) : currentTiles.push(
                {id: (currentRow + i) + "" + currentCol})
        }
        for (let i = 0; i < length; i++) {
            if (layIsHorizontal) {
                if (tiles.find(e => e.id === overRow + "" + (overCol + i)).used && !currentTiles.find(
                    e => e.id === overRow + "" + (overCol + i))) {
                    return false
                }
            } else {
                if (tiles.find(e => e.id === (overRow + i) + "" + overCol).used && !currentTiles.find(
                    e => e.id === (overRow + i) + "" + overCol)) {
                    return false
                }
            }
        }
        return true
    }

    const markTiles = (canBeLaid, length, isHorizontal, overRow, overCol) => {
        const tilesToChange = []
        for (let i = 0; i < length; i++) {
            isHorizontal ? tilesToChange.push({id: overRow + "" + (overCol + i)}) : tilesToChange.push(
                {id: (overRow + i) + "" + overCol})
        }
        setTiles(tiles.map((e) => {
            const match = tilesToChange.find(t => t.id === e.id)
            return match ? {
                ...e,
                src: canBeLaid ? "/src/assets/green-framed-water.jpg" : "/src/assets/red-framed-water.jpg"
            } : {...e, src: "/src/assets/framed-water.jpg"}
        }))
    }

    const resetTileImages = () => {
        setTiles(tiles.map((e) => {
            return {...e, src: "/src/assets/framed-water.jpg"}
        }))
    }

    const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]
    const numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]

    return (
        <div>
            <Grid container wrap="nowrap" style={{
                alignContent: "baseline",
                justifyContent: "right",
                backgroundColor: "lavender"
            }}>
                {numbers.map((number) => (
                    <div key={number} className="number-tile">
                        <Typography key={number} style={{
                            alignContent: "center",
                            textAlign: "center",
                        }} className="number-tile">{number}</Typography>
                            <Divider orientation="vertical" flexItem  style={{   alignSelf: "stretch",
                                height: "auto" }}/>

                    </div>

                ))}
            </Grid>
            <Grid container style={{backgroundColor: "lavender"}} wrap="nowrap">
                <Grid item xs={12} md={12}>
                    {letters.map((letter) => (
                        <div key={letter} className="letter-tile">
                            <Typography key={letter} style={{
                                alignContent: "center",
                                textAlign: "center",
                            }} className="letter-tile">{letter}</Typography>
                            <Divider/>
                        </div>
                    ))}
                </Grid>
                <DndContext onDragEnd={handleDragEnd} onDragOver={handleDragOver}>
                    <div>
                        <Grid container wrap="nowrap">
                            {board.map((col, colIndex) => (
                                <Grid key={colIndex}>
                                    {col.map((row, rowIndex) => (
                                        <Grid key={rowIndex}>
                                            <SetUpGameBoardTile key={rowIndex}
                                                                tile={tiles.find(
                                                                    t => t.id === rowIndex + "" + colIndex)}
                                                                ships={ships}
                                                                onShips={onShips}
                                                                canBeLaid={canBeLaid}
                                                                markTiles={markTiles}
                                                                resetTileImages={resetTileImages}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            ))}
                        </Grid>
                    </div>
                </DndContext>
            </Grid>
        </div>
    )
}