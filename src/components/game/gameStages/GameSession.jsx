import OwnGameBoard from "../../gameBoards/ownGameBoard/OwnGameBoard.jsx";
import OpponentGameBoard from "../../gameBoards/opponentGameBoard/OpponentGameBoard.jsx";
import {Alert, Button, Grid, Paper, Snackbar, Typography} from "@mui/material";
import GameLogList from "./components/GameLogList.jsx";
import {useEffect, useState} from "react";
import useWebSocket from "react-use-websocket";
import WaitingOpponentDialog from "../../dialogs/WaitingOpponentDialog.jsx";
import ConnectionState from "./components/ConnectionState.jsx";
import AlertDialog from "../../dialogs/AlertDialog.jsx";
import GameState from "./components/GameState.jsx";
import PlayerScore from "./components/PlayerScore.jsx";
import {properties} from "../../../../properties.js";
import TurnTimer from "./components/TurnTimer.jsx";

export default function GameSession({
    ships,
    onShips,
    onIsPlayingGame,
}) {
    const [openWaitingDialog, setOpenWaitingDialog] = useState(false);
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [gameState, setGameState] = useState("");
    const [opponentStrikes, setOpponentStrikes] = useState([]);
    const [ownStrikes, setOwnStrikes] = useState([]);
    const [gameLogMessages, setGameLogMessages] = useState([]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameId, setGameId] = useState("");
    const [turnSecondsLeft, setTurnSecondsLeft] = useState(0)

    const {sendJsonMessage, lastJsonMessage, readyState} = useWebSocket(properties.WS_URL,
        {shouldReconnect: !isGameOver})

    useEffect(() => {
        if (readyState === 1) {
            if (window.sessionStorage?.getItem('gameId')) {
                sendJsonMessage({
                    type: "RECONNECT",
                    gameId: window.sessionStorage.getItem('gameId'),
                    row: null,
                    column: null,
                    ships: ships
                })
            } else {
                sendJsonMessage({
                    type: "JOIN",
                    gameId: null,
                    row: null,
                    column: null,
                    ships: ships
                })
            }
            if (window.sessionStorage?.getItem("messages")) {
                setGameLogMessages(JSON.parse(window.sessionStorage.getItem("messages")))
            }
        } else {
            setOpenWaitingDialog(false)
        }
    }, [readyState]);

    useEffect(() => {
        setGameState(lastJsonMessage?.eventType)

        if (lastJsonMessage?.strikeRow && lastJsonMessage?.strikeCol) {
            createGameLogMessage()
        }
        if (lastJsonMessage?.opponentStrikes && lastJsonMessage?.ownStrikes) {
            setOpponentStrikes(lastJsonMessage.opponentStrikes)
            setOwnStrikes(lastJsonMessage.ownStrikes)
        }
        if (lastJsonMessage?.gameId) {
            setGameId(lastJsonMessage.gameId)
            window.sessionStorage.setItem("gameId", lastJsonMessage.gameId)
        }
        if (lastJsonMessage?.timeLeft) {
            setTurnSecondsLeft(lastJsonMessage.timeLeft)
        }
        switch (lastJsonMessage?.eventType) {
            case "WON":
            case "LOST":
            case "OPPONENT_LEFT":
            case "NO_GAME":
            case "TIMEOUT_OWN":
            case "TIMEOUT_OPPONENT":
                window.sessionStorage.removeItem("gameId")
                window.sessionStorage.removeItem("isPlayingGame")
                setTurnSecondsLeft(0)
                setIsGameOver(true)
                break
        }
        if (lastJsonMessage?.eventType === "WAITING_OPPONENT") {
            setOpenWaitingDialog(true)
        } else {
            setOpenWaitingDialog(false)
        }
        if (lastJsonMessage?.ships) {
            onShips(lastJsonMessage.ships)
        }
    }, [lastJsonMessage]);

    const handleStrike = (e) => {
        if (gameState === "TURN_OWN") {
            if (e !== null) {
                sendJsonMessage({
                    type: "STRIKE",
                    gameId: gameId,
                    row: e.row,
                    column: e.col,
                    ships: null
                })
            }
        } else {
            setShowSnackbar(true)
        }
    }

    const handleLeaveGame = () => {
        if (readyState === 1) {
            sendJsonMessage({
                type: "LEAVE",
                gameId: gameId,
                row: null,
                column: null,
                ships: null
            })
        }
        window.sessionStorage.removeItem("messages")
        window.sessionStorage.removeItem("gameId")
        window.sessionStorage.removeItem("isPlayingGame")
        setTurnSecondsLeft(0)
        setOpenWaitingDialog(false)
        onIsPlayingGame(false)
        setGameState("")
    }

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setShowSnackbar(false)
    }

    const createGameLogMessage = () => {
        const letter = String.fromCharCode(97 + +lastJsonMessage.strikeRow).toUpperCase()
        const content = `${lastJsonMessage.eventType === "TURN_OWN" ? "Enemy" : "You"} ${lastJsonMessage.hit
            ? " hit a ship" : "missed"} at ${letter + (+lastJsonMessage.strikeCol + 1)}`
        const today = new Date()
        const message = {
            isOwnMove: lastJsonMessage.eventType === "TURN_OPPONENT",
            content: content,
            isHit: lastJsonMessage.hit,
            time: today.getHours().toString().padStart(2, '0') + ":" + today.getMinutes().toString().padStart(2, '0')
        }
        setGameLogMessages(messages => [...messages, message])
        window.sessionStorage.setItem("messages", JSON.stringify([...gameLogMessages, message]))
    }

    return (
        <div>
            <WaitingOpponentDialog
                isOpen={openWaitingDialog}
                handleLeave={handleLeaveGame}
            />
            <Grid container
                  sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: "12px",
                  }}>
                <Grid item xs={12} md={2}>
                    <ConnectionState style={{marginBottom: "12px"}} state={readyState}/>
                    {isGameOver ?
                        <Button
                            sx={{boxShadow: 5}}
                            size="small"
                            variant="contained"
                            color="primary"
                            onClick={handleLeaveGame}>
                            {"Leave Game"}
                        </Button>
                        :
                        <AlertDialog
                            dialogButtonText={"Leave Game"}
                            acceptDialogButtonText={"Leave"}
                            cancelDialogButtonText={"Stay"}
                            title={"Are you sure you want to leave this game?"}
                            onAccept={handleLeaveGame}/>}
                </Grid>
                <Grid item xs={0} md={1}/>
                <Grid item xs={12} md={3}>
                    <GameState state={gameState}/>
                </Grid>
                <Grid item xs={0} md={2}>
                    <TurnTimer gameState={gameState} turnSecondsLeft={turnSecondsLeft} setTurnSecondsLeft={setTurnSecondsLeft} />
                </Grid>
                <Grid item xs={0} md={3}/>
            </Grid>
            <Grid container spacing={10}>
                <Grid item xs={12} md={5} sx={{
                    display: "grid",
                    alignContent: "center",
                    justifyContent: "right",
                    marginTop: "24px",
                }}>
                    <Grid container>
                        <Grid item xs={12} md={5}>
                            <Typography variant="h5" component="div">{"Own"}</Typography>

                        </Grid>
                        <Grid item xs={12} md={7}>
                            <PlayerScore strikes={opponentStrikes}/>
                        </Grid>
                    </Grid>
                    <Paper elevation={7}>
                        <OwnGameBoard ships={ships} tileStrikes={opponentStrikes}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4} sx={{
                    display: "grid",
                    alignContent: "center",
                    justifyContent: "center",
                    marginTop: "24px"
                }}>
                    <Grid container>
                        <Grid item xs={12} md={5}>
                            <Typography variant="h5" component="div">{"Enemy"}</Typography>

                        </Grid>
                        <Grid item xs={12} md={7}>
                            <PlayerScore strikes={ownStrikes}/>
                        </Grid>
                    </Grid>
                    <Paper elevation={7}>
                        <OpponentGameBoard handleStrike={handleStrike} tileStrikes={ownStrikes}/>
                    </Paper>

                </Grid>
                <Grid item xs={12} md={2} sx={{
                    alignContent: "center",
                    justifyContent: "left",
                    marginTop: "24px"
                }}>
                    <Typography variant="h5" component="div">{"Action log"}</Typography>
                    <GameLogList messages={gameLogMessages}/>
                </Grid>
            </Grid>
            <Snackbar
                open={showSnackbar}
                autoHideDuration={1500}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    severity="error"
                    variant="filled">
                    Not your turn.
                </Alert>
            </Snackbar>
        </div>
    )
}