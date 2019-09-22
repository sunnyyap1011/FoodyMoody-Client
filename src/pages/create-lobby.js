// Importing Section
import React from "react";
import { Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import Socket from "../utils/socket";
import styled from "styled-components";
import { Button, Input } from "reactstrap";
import "../create-lobby.css";

// Styling Section
const CreateDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #9dbde3;
  height: 100vh;
  width: 100vw;
  
  .create_form {
    margin-bottom: 30px;
  }

  .create_text {
    font-family: "Amatic SC", cursive;
    font-size: 4rem;
    text-align: center;
    margin: 0.5rem;
  }

  .join_form {
    display: flex;
    justify-content: center;
    align-items: center;  
    margin: 1.2rem;
    width: 80%;

    Input {
      width: 60%;
    }

    Button {
      width: 30%;
      font-size: 18px;
    }
  }
`;

// Rendering & Component Section
export default class Create extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: "",
      room_id: "",
      redirectHost: false,
      redirectWait: false
    };
  }

  componentDidMount() {
    Socket.on("connect", () => {
      console.log("Connected to the server");
    });

    Socket.on("broadcast_rooms", data => {
      this.setState({
        rooms: data
      });
    });

    Socket.on("check_room_exist", data => {
      if (data["valid"]) {
        this.setState({
          redirectWait: true
        });
      } else {
        toast("Room ID does not exist");
      }
    });
  }

  componentWillUnmount() {
    Socket.off("broadcast_rooms");
    Socket.off("check_room_exist");
  }

  joinRoom = e => {
    e.preventDefault();
    Socket.emit("join_room", { room_id: this.state.room_id });
  };

  createRoom = e => {
    e.preventDefault();

    Socket.emit("create_room");

    Socket.on("get_room_id", data => {
      this.setState({
        room_id: data["room_id"],
        redirectHost: true
      });
    });
  };

  renderRedirectHost = () => {
    return (
      <Redirect
        to={{
          pathname: `/${this.state.room_id}/game_lobby`,
          state: { room_id: `${this.state.room_id}` }
        }}
      />
    );
  };

  renderRedirectWait = () => {
    return (
      <Redirect
        to={{
          pathname: `/${this.state.room_id}/waiting_lobby`,
          state: { room_id: `${this.state.room_id}` }
        }}
      />
    );
  };

  handleChange = e => {
    this.setState({
      room_id: e.target.value
    });
  };

  render() {
    const { room_id } = this.state

    if (this.state.redirectHost) {
      return this.renderRedirectHost();
    }
    if (this.state.redirectWait) {
      return this.renderRedirectWait();
    }
    return (
      <CreateDiv>
        <form onSubmit={this.createRoom} className="create_form">
          <button id="create_room_btn" type="submit">
            Create A Room
            </button>
        </form>

        <p className="create_text">Or</p>

        <p className="create_text">Join an Existing Room</p>

        <form onSubmit={this.joinRoom} className="join_form">
          <Input
            type="text"
            onChange={this.handleChange}
            placeholder="Enter room ID"
          />
          <Button className="btn-success" type="submit" disabled={!room_id}>Join</Button>
        </form>
      </CreateDiv>
    );
  }
}