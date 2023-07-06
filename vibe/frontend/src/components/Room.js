import React from "react";
import { useParams } from "react-router-dom";

// Wrapper component to retrieve route parameters using useParams
const RoomWrapper = () => {
  const { roomCode } = useParams();

  return <Room roomCode={roomCode} />;
};

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      votesToSkip: 2,
      guestCanPause: false,
      isHost: false,
    };
    this.getRoomDetails();
  }

  getRoomDetails() {
    // Access the roomCode from props
    const { roomCode } = this.props;
    
    fetch('/api/get-room' + '?code=' + roomCode).then((response) => response.json()).then((data) => {
      this.setState({
        votesToSkip : data.votes_to_skip,
        guestCanPause : data.guest_can_pause,
        isHost : data.is_host,
      });
    });

  }

  render() {
    return (
      <div>
        <h3>{this.props.roomCode}</h3>
        <p>Votes: {this.state.votesToSkip}</p>
        <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
        <p>Host: {this.state.isHost.toString()}</p>
      </div>
    );
  }
}

export default RoomWrapper;
