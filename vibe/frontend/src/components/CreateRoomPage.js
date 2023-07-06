import React, {Component} from 'react';
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

import {Link} from "react-router-dom";

export default class CreateRoomPage extends Component{
    defaultVotes = '2';
    constructor(props) {
        super(props);
        this.state = {
            guestCanPause : true,
            votesToSkip : this.defaultVotes,
        };
        this.handleRoomButton = this.handleRoomButton.bind(this);
        this.handleVoteChange = this.handleVoteChange.bind(this);
        this.handleGuestControl = this.handleGuestControl.bind(this);
    }

    handleVoteChange(e) {
        this.setState({
            votesToSkip : e.target.value,
        });
    }

    handleGuestControl(e) {
        this.setState({
            guestCanPause : e.target.value === "true" ? true : false,
        });
    }

    handleRoomButton() {
        const requestOptions = {
            method  : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body    : JSON.stringify({
                votes_to_skip : this.state.votesToSkip,
                guest_can_pause : this.state.guestCanPause
            }),
        };
        fetch('/api/create-room', requestOptions)
        .then((response) => response.json())
        .then((data) => console.log(data));
    }

    render() {
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
                    <RadioGroup row defaultValue="true" onChange={this.handleGuestControl}>
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
                        default={this.defaultVotes} 
                        inputProps={{
                            min:1,
                            style:{textAlign : "center"},
                        }}
                        onChange={this.handleVoteChange}
                        >
                    </TextField>
                    <FormHelperText>
                        <div align="center">
                            Votes Required to a skip song
                        </div>
                    </FormHelperText>
                </FormControl>
                <Grid item xs={12} align="center">
                    <Button color='primary' variant='contained' onClick={this.handleRoomButton}>
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
}