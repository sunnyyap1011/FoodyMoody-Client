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
    margin: 1rem;
    width: 80%;

    Input {
      width: 50%;
      height: 100%;
      border-radius: 50px;
    }

    Button {
      width: 25%;
      font-size: 1.5rem;
      font-family: "Amatic SC", cursive;
      border-radius: 50px;
      font-weight: bold;
      background-color: #28A745;
      border: transparent;

      :hover {
        letter-spacing: 0.3rem;
        width: 30%;
      }

      :disabled {
        background-color: #48466d;
        letter-spacing: 0;
        width: 25%;
      }
    }

  }

  .fas {
    display: inline-block;
    font-family: FontAwesome;
    margin-right: 10px;
  }

  .home-btn {
    font-family: "Amatic SC", cursive;
  }

  .home-btn:hover, .home-btn:focus, .home-btn:active {
    letter-spacing: 0.2rem;
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
      redirectWait: false,
      room_not_exist: false
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
        // toast("Room ID does not exist");
        this.setState({
          room_not_exist: true
        })
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
    const { room_id, room_not_exist } = this.state

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
          <Button type="submit" disabled={room_id.length < 4}>Join</Button>
        </form>
        {room_not_exist ?
          <p style={{ color: "#800000", fontWeight: "bold" }}>Room ID does not EXIST.</p>
          :
          ""
        }

        <Button
          style={{
            backgroundColor: "#8B0000",
            fontSize: "1.4rem",
            borderRadius: "50px",
            margin: "1rem",
            fontWeight: "bold"
          }}

          className="home-btn"
          href={"/home"}
        >
          <i className="fas fa-chevron-circle-left"></i>
          GO HOME
        </Button>
      </CreateDiv>
    );
  }
}