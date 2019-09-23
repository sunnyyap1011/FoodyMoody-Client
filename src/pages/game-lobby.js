// Importing Section
import React from "react";
import styled from "styled-components";
import { Redirect, Link } from "react-router-dom";
import Socket from "../utils/socket";
import PageTitle from "../components/PageTitle";
import { Button, Form, Input } from "reactstrap";
import "../game-lobby.css";

// Stylings Section
const LobbyBody = styled.div`
  background-color: #9dbde3;
  height: 100vh;
  text-align: center;

  .room-info {
    margin: 1.2rem;
    font-weight: bold;

    h3 {
      font-weight: bold;
    }

    p {
      font-family: monospace;
      font-size: 17px;
    }
  }

  #location-container {
    margin: 30px;

    label {
      margin-right: 0.5rem;
      font-weight: bold;
      font-size: 17px;
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

// Components Section
const google = window.google;
export default class GameLobby extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      num_people: 1,
      room_id: this.props.location.state.room_id,
      redirect: false,
      location: '',
      rounds: '3',
      restaurants: ''
    }
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
      })
    })
    this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current,
      { "types": ["geocode"], componentRestrictions: { country: 'my' } });
    this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { location, rounds, room_id } = this.state
    Socket.emit('conditions', { "lat": location.lat, "lng": location.lng, "rounds": rounds, "room": room_id })
    this.setState({
      redirect: true
    });
  };

  handlePlaceChanged = (e) => {
    const place = this.autocomplete.getPlace();
    if (place.geometry) {
      const lat = place.geometry.location.lat()
      const lng = place.geometry.location.lng()
      const name = place.name

      this.setState({
        location: { "lat": lat, "lng": lng, "name": name },
        current_loc_alert: false
      })
    } else {
      console.log('Please select from Google dropdown')
    }
  }

  handleChangeLocation = (e) => {
    e.preventDefault()
    if (!e.target.value) {
      this.setState({
        location: e.target.value,
        alert_visible: false
      })
    }
  }

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
    const { num_people, room_id, location, rounds } = this.state
    console.log(rounds)
    console.log(location)

    if (this.state.redirect) {
      return this.renderRedirect();
    }

    return (
      <LobbyBody>
        <div>
          <PageTitle>Set Up Game</PageTitle>
        </div>

        <div className="room-info">
          <small>Share this room id with your friends</small>
          <h3>Room ID: {room_id}</h3>
          <p>Players: {num_people}</p>
        </div>

        <div id="location-container">
          <label>Location:</label>
          <input ref={this.autocompleteInput} onChange={this.handleChangeLocation} id="autocomplete" placeholder="keyword" type="text"></input>
        </div>


        <form onSubmit={this.handleSubmit} className="m-3">
          <RadioDiv>
            <h4>Select Rounds&hellip;</h4>
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

          <Button type="submit" className="btn-success" disabled={!location}>PLAY!</Button>
        </form>

        <Button href={"/home"}>Back to HomePage</Button>
      </LobbyBody>
    );
  }
}
