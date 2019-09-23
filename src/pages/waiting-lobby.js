// Importing Section
import React from "react";
// import PageTitle from "../components/PageTitle";
import { Redirect } from "react-router-dom";
import Socket from "../utils/socket";
import "../waiting-host.css";

export default class Waiting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      room_id: this.props.location.state.room_id,
      start: false,
      num_people: 1
    };
  }

  componentDidMount() {
    Socket.on("check_start", () => {
      this.setState({
        start: true
      });
    });

    Socket.on("broadcast_total_ppl", data => {
      this.setState({
        num_people: data["num_ppl"]
      });
    });

    Socket.on("on_leave", () => {
      this.setState({
        num_people: this.state.num_people - 1
      });
    });
  }

  renderRedirect = () => {
    return (
      <Redirect
        to={{
          pathname: `/${this.state.room_id}/play_game`,
          state: {
            room_id: `${this.state.room_id}`,
            num_people: `${this.state.num_people}`
          }
        }}
      />
    );
  };

  render() {
    const { room_id, num_people } = this.state;
    if (this.state.start) {
      return this.renderRedirect();
    }
    return (
      <div id="waiting-page-container">
        <div id="waiting">
          <h4 id="room-id">Room ID: <span>{room_id}</span></h4>
          <p id="players">Players: {num_people}</p>
        </div>

        <h1 id="waiting_title">Waiting on Host...</h1>
        
        <div id="cooking">
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>
          <div className="bubble"></div>

          <div id="area">
            <div id="sides">
              <div id="pan"></div>
              <div id="handle"></div>
            </div>

            <div id="pancake">
              <div id="pastry"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
