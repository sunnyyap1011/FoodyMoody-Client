// Importing Section
import React from "react";
import styled from "styled-components";
import { Redirect } from "react-router-dom";
import Socket from "../utils/socket";
import { Button, Input } from "reactstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import "../game-lobby.css";
import $ from 'jquery';

// Stylings Section
const LobbyBody = styled.div`
  background-color: #9dbde3;
  height: 100vh;
  text-align: center;
  font-family: "Amatic SC", cursive;

  .fas {
    display: inline-block;
    font-family: FontAwesome;
    margin-right: 10px;
  }

  .fa-chevron-circle-left:before {
    content: "\f137";
  }

  .copy-btn {
    background-color: #48466D;
    font-size: 1.6rem;
    border-radius: 20px;
    margin-bottom: 0.3rem;
  }

  .copied {
    font-size: 1.7rem;
    font-weight: bold;
    color: red;
    margin-left: 10px;
  }

  .share {
    font-size: 1.7rem;
    font-weight: bold;
    margin-left: 10px;
    color: black;
  }

  .room-info {
    /* margin: 0.5rem; */

    h3 {
      font-weight: bold;
      font-size: 3.6rem;
    }

    p {
      font-family: monospace;
      font-size: 2rem;
    }
  }

  label {
    margin-right: 0.5rem;
    font-weight: bold;
    font-size: 1.7rem;
  }

  #location-container {
    display: flex;
    justify-content: center;
    margin: 0 0.3rem;

    input {
      width: 60%;
      font-weight: bold;
      font-size: 1.3rem;
    }

    #current_location_btn {
      background-color: #4169e1;
      color: white;
      font-size: 1.3rem;
      font-weight: bold;
    }
  }

  form {

    label {
      margin: 0 0.8rem;
      font-weight: bold;
      font-size: 1.4rem;
      font-family: monospace;
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
  /* height: 360px; */
  border: solid black 3px;
  margin: 20px auto 20px auto;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
`;

const SetupTitle = styled.h2`
  font-size: 2.8rem;
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
      copied: false,
      location_placeholder: 'SEARCH LOCATION'
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

  getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition, this.showError)
    } else {
      console.log("Geolocation is not supported by this browser.")
    }
  };

  showPosition = (position) => {
    this.setState({
      location: { "lat": position.coords.latitude, "lng": position.coords.longitude },
      location_placeholder: "Current Location Chosen"
    })
    $('#autocomplete').val("")
  };

  showError = () => {
    console.log('Errors')
  };

  // Rendering Section
  render() {
    const { num_people, room_id, location, rounds, location_placeholder } = this.state
    console.log(rounds)
    console.log(location)

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
            className="copy-btn">
            Copy this room ID
          </Button>
        </CopyToClipboard>

        {this.state.copied ? (
          <span className="copied">Copied to Clipboard!</span>
        ) : (
            <span className="share">& share it!</span>
          )}

        <Setup>
          <SetupTitle>Set Up Game</SetupTitle>
          <label>Choose your location :</label>
          <div id="location-container">
            <Input
              innerRef={this.autocompleteInput}
              onChange={this.handleChangeLocation}
              id="autocomplete"
              placeholder={location_placeholder}
              type="text"
            ></Input>
            <button id='current_location_btn' onClick={this.getLocation}>Get current location</button>
          </div>

          <form
            onSubmit={this.handleSubmit}
            className="mb-2 d-flex align-items-center flex-column"
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
            backgroundColor: "#8B0000",
            fontSize: "1.6rem",
            borderRadius: "20px",
            marginBottom: "0.3rem",
            fontWeight: "bold"
          }}
          href={"/home"}
        >
          <i className="fas fa-chevron-circle-left"></i>
          GO HOME
        </Button>
      </LobbyBody>
    );
  }
}
