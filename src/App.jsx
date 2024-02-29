import {List} from "@mui/material";
import {useState} from "react";
import {DndContext, useDraggable, useDroppable} from "@dnd-kit/core";
import {CSS} from "@dnd-kit/utilities"

const board = Array.apply(null, Array(10)).map(() => (
    Array.apply(null, Array(10)).map(function () {
    })))

function loadTileRows() { //TODO function to const, put board directly inside equation.
    return board.map((row, rowIndex) => ({
        rowNumber: rowIndex + 1,
        tiles: row.map((tile, columnIndex) => ({
            id: (rowIndex + "" + columnIndex),
            row: rowIndex + 1,
            col: columnIndex + 1,
            used: false
        }))
    }))
}

const initialShips = [
    {id: "ship-1", isHorizontal: true, length: 2, position: {Row: 1, Col: 1}},
    {id: "ship-2", isHorizontal: false, length: 2, position: {Row: 5, Col: 5}},
    {id: "ship-3", isHorizontal: false, length: 3, position: {Row: 5, Col: 6}},
    {id: "ship-4", isHorizontal: false, length: 4, position: {Row: 5, Col: 7}},
    {id: "ship-5", isHorizontal: false, length: 5, position: {Row: 5, Col: 8}},
]

function App() {
    const [ships, setShips] = useState(initialShips);
    const [tiles, setTiles] = useState([]) //TODO. Make list of tiles: id, row, col, used
    console.log(ships)
    console.log(tileRows)

    const handleDragStart = (e) => {
    }

    const handleDragOver = (e) => {
        if (e.over) {
            console.log(`${e.active.id} was moved over ${e.over.id}.`)
        }
        if (!e.over) {
            console.log(`${e.active.id} is no longer over.`)
        }
    }

    const handleDragEnd = (e) => {
        if (e.over) {
            console.log(`${e.active.id} was dropped on ${e.over.id}`)
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd} onDragStart={handleDragStart} onDragOver={handleDragOver}>
            <div>
                <ShipList ships={ships}/>
                <Board tileRows={loadTileRows()}/>
            </div>
        </DndContext>
    )
}

function Board({tileRows}) {
    //TODO if boat row and col matches, put ship in as child.
    //TODO if boat was matched, change used status on tiles effected by length and boat direction.
    return (
        <div>
            {tileRows.map((row) => (
                <div className="board-row" key={row.rowNumber}>
                    {row.tiles.map((tile) => (<BoardTile key={tile.id} tile={tile}/>))}
                </div>
            ))}
        </div>
    )
}

function BoardTile({tile}) {
    const {setNodeRef} = useDroppable({id: tile.id, data: {row: tile.row, col: tile.col}, disabled: tile.used})
    return (
        <span className="board-tile" ref={setNodeRef}>
            {tile.children}
            <img src="/src/assets/framed-water.jpg" width={75} height={75} alt="board-tile"/>
        </span>
    )
}

function ShipList({ships}) {
    return (
        <List>
            {ships.map((ship) => (
                <Ship key={ship.id} id={ship.id} isHorizontal={ship.isHorizontal}
                      length={ship.length}/>
            ))}
        </List>
    )
}

function Ship(ship) {
    const {
        attributes, listeners, setNodeRef, transform
    } = useDraggable({
        id: ship.id,
        data: {length: ship.length, isHorizontal: ship.isHorizontal}
    })

    let srcString = "";
    if (ship.isHorizontal) {
        switch (ship.length) {
            case 2 :
                srcString = "src/assets/Boat_4.png"
                break
            case 3 :
                srcString = "src/assets/Boat_3.png"
                break
            case 4 :
                srcString = "src/assets/Boat_2.png"
                break
            case 5 :
                srcString = "src/assets/Boat_1.png"
                break
        }
    } else {
        switch (ship.length) {
            case 2 :
                srcString = "src/assets/Boat_4_vert.png"
                break
            case 3 :
                srcString = "src/assets/Boat_3_vert.png"
                break
            case 4 :
                srcString = "src/assets/Boat_2_vert.png"
                break
            case 5 :
                srcString = "src/assets/Boat_1_vert.png"
                break
        }
    }
    return (
        <div
            ref={setNodeRef}
            style={{transform: CSS.Translate.toString(transform)}}
            {...attributes}
            {...listeners}
        >
            <img src={srcString} alt={"Ship"}/>
        </div>
    )
}

export default App

