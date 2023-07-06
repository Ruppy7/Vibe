import React, { useState } from 'react';
import {
    Button,
    Typography,
    Grid,
    TextField,
    FormHelperText,
    FormControl,
    Radio,
    RadioGroup,
    FormControlLabel,
}  from "@material-ui/core";

import {Link, useNavigate} from "react-router-dom";

const CreateRoomPage = () => {
    const navigate = useNavigate();
    const defaultVotes = '2';
    const [guestCanPause, setGuestCanPause] = useState(true);
    const [votesToSkip, setVotesToSkip] = useState(defaultVotes);

    const handleVoteChange = (e) => {
        setVotesToSkip(e.target.value);
    };

    const handleGuestControl = (e) => {
        setGuestCanPause(e.target.value === "true" ? true : false);
    };

    const handleRoomButton = () => {
        const requestOptions = {
            method  : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body    : JSON.stringify({
                votes_to_skip : votesToSkip,
                guest_can_pause : guestCanPause,
            })
        };

        fetch('/api/create-room', requestOptions)
            .then((response) => response.json())
            .then((data) => navigate('/room/' + data.code));
    };
    
    
    return (
        <Grid container spacing={1}>
            <Grid item xs={12} align="center">
                <Typography component = 'h4' variant='h4'>
                    Create a Room
                </Typography>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl component="fieldset">
                    <FormHelperText>
                        <div align="center">
                            Guest Control of Playback State
                        </div>
                    </FormHelperText>
                    <RadioGroup row defaultValue="true" onChange={handleGuestControl}>
                        <FormControlLabel 
                            value="true" 
                            control = {<Radio color="primary"/>}
                            label="Play/Pause"
                            labelPlacement="bottom"
                        />
                        <FormControlLabel 
                            value="false" 
                            control = {<Radio color="secondary"/>}
                            label="No Control"
                            labelPlacement="bottom"
                        />
                    </RadioGroup>
                </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <FormControl>
                    <TextField 
                        required = {true} 
                        type="number" 
                        default={defaultVotes} 
                        inputProps={{
                            min:1,
                            style:{textAlign : "center"},
                        }}
                        onChange={handleVoteChange}
                        >
                    </TextField>
                    <FormHelperText>
                        <div align="center">
                            Votes Required to a skip song
                        </div>
                    </FormHelperText>
                </FormControl>
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
        </Grid>
    )
};

export default CreateRoomPage;