// Importing Section
import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import Socket from "../utils/socket";
import { Button, Input } from "reactstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "../game-lobby.css";

// Stylings Section
const LobbyBody = styled.div`
  background-color: #9dbde3;
  height: 100vh;
  text-align: center;
  font-family: "Amatic SC", cursive;

  .fas {
    display: inline-block;
    font-family: FontAwesome;
  }

  .fa-chevron-circle-left:before {
    content: "\f137";
  }

  .copied {
    font-size: 30px;
    font-weight: bold;
    color: red;
    margin-left: 10px;
  }

  .share {
    font-size: 40px;
    font-weight: bold;
    margin-left: 10px;
    color: black;
  }

  .room-info {
    margin: 1.2rem;
    font-weight: bold;

    h3 {
      font-weight: bold;
      font-size: 90px;
    }

    p {
      font-family: monospace;
      font-size: 25px;
    }
  }

  #location-container {
    margin: 30px;

    label {
      margin-right: 0.5rem;
      font-weight: bold;
      font-size: 30px;
    }
  }

  form {
    h4 {
      font-weight: bold;
    }

    label {
      margin: 0 0.8rem;
      font-weight: bold;
    }

    button {
      margin-top: 1.5rem;
    }
  }
`;

const RadioDiv = styled.div`
  display: box;
  color: black;
  font-family: "Helvetica Neue", "Helvetica", "Roboto", "Arial", sans-serif;
  text-align: center;
`;

const Setup = styled.div`
  background-color: #dbe2ef;
  width: 550px;
  height: 360px;
  border: solid black 3px;
  margin: 20px auto 20px auto;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`;

const SetupTitle = styled.h2`
  font-size: 50px;
  font-weight: bold;
`;

// Components Section
const google = window.google;
export default class GameLobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num_people: 1,
      room_id: this.props.location.state.room_id,
      redirect: false,
      location: "",
      rounds: "3",
      restaurants: "",
      copied: false
    };
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
  }

  componentDidMount() {
    Socket.on("broadcast_num_ppl", () => {
      this.setState({
        num_people: this.state.num_people + 1
      });
      Socket.emit("total_ppl", {
        num_ppl: this.state.num_people,
        room_id: this.state.room_id
      });
    });

    Socket.on("on_leave", () => {
      this.setState({
        num_people: this.state.num_people - 1
      });
    });
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.current,
      { types: ["geocode"], componentRestrictions: { country: "my" } }
    );
    this.autocomplete.addListener("place_changed", this.handlePlaceChanged);
  }

  handleSubmit = e => {
    e.preventDefault();
    const { location, rounds, room_id } = this.state;
    Socket.emit("conditions", {
      lat: location.lat,
      lng: location.lng,
      rounds: rounds,
      room: room_id
    });
    this.setState({
      redirect: true
    });
  };

  handlePlaceChanged = e => {
    const place = this.autocomplete.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      const name = place.name;

      this.setState({
        location: { lat: lat, lng: lng, name: name },
        current_loc_alert: false
      });
    } else {
      console.log("Please select from Google dropdown");
    }
  };

  handleChangeLocation = e => {
    e.preventDefault();
    console.log(e.target);
    if (!e.target.value) {
      this.setState({
        location: e.target.value,
        alert_visible: false
      });
    }
  };

  handleChangeRound = e => {
    e.preventDefault();
    this.setState({
      rounds: e.target.value
    });
  };

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

  // Rendering Section
  render() {
<<<<<<< HEAD
    const { num_people, room_id, location, rounds } = this.state
    console.log(rounds)
    console.log(location)
=======
    const { num_people, room_id, location, rounds } = this.state;
    console.log(rounds);
>>>>>>> design game setup

    if (this.state.redirect) {
      return this.renderRedirect();
    }

    return (
      <LobbyBody>
        <div className="room-info">
          <h3>Welcome To Room "{room_id}"</h3>
          <p>Player(s) In Room: {num_people}</p>
        </div>

        <CopyToClipboard
          text={this.state.room_id}
          onCopy={() => this.setState({ copied: true })}
        >
          <Button
            style={{
              backgroundColor: "#48466D",
              fontSize: "40px",
              borderRadius: "20px",
              marginBottom: "10px"
            }}
          >
            Copy this room ID
          </Button>
        </CopyToClipboard>

        {/* <span className="share">& share it with your friends!</span> */}

        {this.state.copied ? (
          <span className="copied">Copied to Clipboard!</span>
        ) : (
          <span className="share">& share it!</span>
        )}

        <Setup>
          <SetupTitle>Set Up Game</SetupTitle>
          <div
            style={{ marginBottom: "10px", marginTop: "15px" }}
            id="location-container"
          >
            <label>Choose your location :</label>
            <Input
              innerRef={this.autocompleteInput}
              onChange={this.handleChangeLocation}
              id="autocomplete"
              placeholder="Search location"
              type="text"
            ></Input>
          </div>

          <form
            onSubmit={this.handleSubmit}
            className="m-3 d-flex align-items-center flex-column"
          >
            <RadioDiv>
              <label>
                <input
                  type="radio"
                  className="option-input radio"
                  name="example"
                  value="3"
                  defaultChecked
                />
                3 ROUNDS
              </label>
              <label>
                <input
                  type="radio"
                  className="option-input radio"
                  name="example"
                  value="5"
                />
                5 ROUNDS
              </label>
              <label>
                <input
                  type="radio"
                  className="option-input radio"
                  name="example"
                  value="8"
                />
                8 ROUNDS
              </label>
            </RadioDiv>

            <button id="play_btn" disabled={!location} type="submit">
              PLAY!
            </button>
          </form>
        </Setup>

        <Button
          style={{
            backgroundColor: "#48466D",
            fontSize: "40px",
            borderRadius: "20px",
            marginBottom: "10px"
          }}
          href={"/home"}
        >
          <i class="fas fa-chevron-circle-left"></i>
          GO HOME
        </Button>
      </LobbyBody>
    );
  }
}
