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
`;

const RadioDiv = styled.div`
  display: box;
  background: #9dbde3;
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
      { "types": ["geocode"], componentRestrictions: {country: 'my'} });
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

    const lat = place.geometry.location.lat()
    const lng = place.geometry.location.lng()

    this.setState({
        location: { "lat": lat, "lng": lng }
    })
  }

  handleChangeLocation = (e) => {
    e.preventDefault()
    this.setState({
      location: e.target.value
    });
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
    const { num_people, room_id, location, rounds } = this.state
    console.log(rounds)

    if (this.state.redirect) {
      return this.renderRedirect();
    }
    
    return (
      <LobbyBody>
        <div>
          <PageTitle>Set Up Game</PageTitle>
        </div>

        <div style={{margin: "30px"}}>
          <div className="d-flex flex-column">
            <h4>Please Share This ID: {room_id}</h4>
            <p>Players: {num_people}</p>
          </div>
          </form>

          <h2>Select Rounds&hellip;</h2>

        <form onSubmit={ this.handleSubmit }>
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

          <button type="submit" disabled={!location}>PLAY!</button>
        </form>

        <Link to={"/home"}>Return</Link>
      </LobbyBody>
    );
  }
}
