import React, {Component} from 'react';
import RoomJoinPage from "./RoomJoinPage";
import CreateRoomPage from "./CreateRoomPage";
import Room from './Room';
import { BrowserRouter as Router ,Route, Routes, Link, Navigate } from 'react-router-dom';
import {
    Grid,
    Button,
    ButtonGroup,
    Typography
} from "@material-ui/core"
export default class HomePage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            roomCode: null,
        };
        this.clearRoomCode = this.clearRoomCode.bind(this)
    }

    async componentDidMount(){
        fetch('/api/user-in-room')
            .then((response) => response.json())
            .then((data) => {
                this.setState({
                    roomCode : data.code
                })
            });
    }

    clearRoomCode() {
        this.setState({
            roomCode: null,
        });
    }

    renderHomePage() {
        return (
            <Grid container spacing={3}>
                <Grid item xs={12} align="center">
                    <Typography variant="h3" component="h3">
                        Vibe
                    </Typography>
                </Grid>
                <Grid item xs={12} align="center">
                    <ButtonGroup  variant='contained' color="primary">
                        <Button color="primary" to='/join' component={Link}>
                            Join A Room
                        </Button>
                        <Button color="secondary" to='/create' component={Link}>
                            Create A Room
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        );
    }

    render(){
        return (
            <Router>
                <Routes>
                    <Route exact path="/" element={
                        this.state.roomCode ? 
                        (< Navigate replace to={`/room/${this.state.roomCode}`}/>) 
                        : this.renderHomePage()
                    }/>
                    <Route exact path="/join" element={<RoomJoinPage/>}/>
                    <Route exact path="/create" element={<CreateRoomPage/>}/>
                    <Route exact path="/room/:roomCode" element={<Room leaveRoomCallBack={this.clearRoomCode}/>}/>
                </Routes>
            </Router>
        );
    }
};