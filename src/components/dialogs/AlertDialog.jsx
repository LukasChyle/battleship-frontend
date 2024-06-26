import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme} from "@mui/material";
import {Fragment, useState} from "react";

export default function AlertDialog({
    onAccept,
    title,
    content,
    dialogButtonText,
    acceptDialogButtonText,
    cancelDialogButtonText
}) {
    const theme = useTheme()
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleAccept = () => {
        onAccept()
        handleClose()
    }

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Fragment>
            <Button
                sx={{boxShadow: 5, backgroundColor: theme.palette.leaveButton}}
                size="small"
                color="error"
                variant="contained"
                onClick={handleClickOpen}>
                {dialogButtonText}
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    fontWeight="bold"
                    id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        size="small"
                        variant="contained"
                        color="primary"
                        onClick={handleClose}>{cancelDialogButtonText}</Button>
                    <Button
                        size="small"
                        color="error"
                        variant="contained"
                        onClick={handleAccept}
                        autoFocus>
                        {acceptDialogButtonText}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
}