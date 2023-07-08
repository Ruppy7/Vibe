import React, { useState } from 'react';
import { Button, Typography, Grid, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, Collapse } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import { Link, useNavigate } from "react-router-dom";

const CreateRoomPage = ({
    update = false,
    initVotesToSkip = 2,
    initGuestCanPause = false,
    roomCode = null,
    updateCallBack = () => {}
}) => {
    const navigate = useNavigate();
    const [guestCanPause, setGuestCanPause] = useState(initGuestCanPause);
    const [votesToSkip, setVotesToSkip] = useState(initVotesToSkip);
    const [msg, setMsg] = useState("");
    const [responseOk, setResponseOk] = useState(false);

    const handleVoteChange = (e) => {
        setVotesToSkip(e.target.value);
    };

    const handleGuestControl = (e) => {
        setGuestCanPause(e.target.value === "true" ? true : false);
    };

    const handleRoomButton = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
            }),
        };

        fetch('/api/create-room', requestOptions)
            .then((response) => response.json())
            .then((data) => navigate('/room/' + data.code));
    };

    const handleUpdateButtononClick = () => {
        const requestOptions = {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                votes_to_skip: votesToSkip,
                guest_can_pause: guestCanPause,
                code: roomCode,
            }),
        };

        fetch('/api/update-room', requestOptions)
            .then((response) => {
                setResponseOk(response.ok);
                return response.json();
            })
            .then((data) => {
                setMsg(data.message);
                updateCallBack();
            })
    };

    const renderCreateButtons = () => {
        return (
            <Grid container spacing={1}>
                <Grid item xs={12} align="center">
                    <Button color='primary' variant='contained' onClick={handleRoomButton}>
                        Create a Room
                    </Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button color='secondary' variant='contained' to="/" component={Link}>
                        Go Back
                    </Button>
                </Grid>
            </Grid>
        );
    };

    const renderUpdateButtons = () => {
        return (
            <Grid item xs={12} align="center">
                <Button color='primary' variant='contained' onClick={handleUpdateButtononClick}>
                    Update a Room
                </Button>
            </Grid>
        );
    };

    const title = update ? "Update Room" : "Create a Room";

    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Collapse in={responseOk}>
                    {responseOk ? (
                        <Alert severity="success" onClose={() => { setMsg(""); setResponseOk(false) }}>
                            {msg}
                        </Alert>
                    ) : (
                        <Alert severity="error" onClose={() => { setMsg(""); setResponseOk(false) }}>
                            {msg}
                        </Alert>
                    )}
                </Collapse>
            </Grid>
            <Grid item xs={12} align="center">
                <Typography component='h4' variant='h4'>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue={guestCanPause.toString()} onChange={handleGuestControl}>
                        <FormControlLabel
                            value="true"
                            control={<Radio color="primary" />}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel
                            value="false"
                            control={<Radio color="secondary" />}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField
                        required={true}
                        type="number"
                        value={votesToSkip}
                        inputProps={{
                            min: 1,
                            style: { textAlign: "center" },
                        }}
                        onChange={handleVoteChange}
                    />
                    <FormHelperText>
                        <div align="center">
                            Votes Required to skip a song
                        </div>
                    </FormHelperText>
                </FormControl>
            </Grid>
            {update ? renderUpdateButtons() : renderCreateButtons()}
</Grid>
    );
};

export default CreateRoomPage;
