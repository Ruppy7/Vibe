import React, { useEffect, useState } from "react";
import {
    Grid,
    Typography,
    Card,
    IconButton,
    LinearProgress,
    Icon,
} from "@material-ui/core";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";

const Player = ({ time,duration, image_url, title, artist, is_playing, votes, votes_required }) => {

    const songProgress = (time/duration) * 100;

    const skipSong = () => {
        const requestOptions = {
            method : "POST",
            headers : {"Content-Type" : "application/json"},
        };
        fetch('/spotify/skip', requestOptions);
    }

    const pauseSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {"Content-Type" : "application/json"},
        };
        fetch("/spotify/pause", requestOptions);
    }

    const playSong = () => {
        const requestOptions = {
            method: 'PUT',
            headers: {"Content-Type" : "application/json"},
        };
        fetch("/spotify/play", requestOptions);
    }

    return (
        <Card>
            <Grid container alignItems="center">
                <Grid item align="center" xs={4}>
                    <img src={image_url} height="100%" width="100%"/>
                </Grid>
                <Grid item align="center" xs={8}>
                    <Typography component="h5" variant="h5">
                        {title}
                    </Typography>
                    <Typography color="textSecondary" variant="subtitle1">
                        {artist}
                    </Typography>
                    <div >
                        <IconButton onClick={ () => {
                            is_playing ? pauseSong() : playSong();
                        }}>
                            { is_playing ? <PauseIcon/> : <PlayArrowIcon/> }
                        </IconButton>
                        <IconButton onClick={skipSong}>
                            <SkipNextIcon/> <h6> {votes} / {votes_required} </h6>
                        </IconButton>
                    </div>
                </Grid>
            </Grid>
            <LinearProgress variant="determinate" value={ songProgress }/>
        </Card>
    );
};

export default Player;