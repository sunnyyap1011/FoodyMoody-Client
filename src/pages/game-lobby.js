// Importing Section
import React from 'react'
import '../radio-button.css'
import styled from 'styled-components'
import { Redirect, Link } from 'react-router-dom'
import Socket from '../utils/socket'
import PageTitle from '../components/PageTitle'

const google = window.google

// Stylings Section
const LobbyBody = styled.div`
background-color: #9DBDE3;
height: 100vh;
`

const RadioDiv = styled.div`
display: -webkit-box;
display: -moz-box;
display: -ms-flexbox;
display: box;
background: #e8ebee;
color: #9faab7;
font-family: "Helvetica Neue", "Helvetica", "Roboto", "Arial", sans-serif;
text-align: center;
`

// Components Section
export default class GameLobby extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      num_people: 1,
      room_id: this.props.location.state.room_id,
      redirect: false,
      location: '',
      rounds: '',
      restaurants: ''
    }
    this.autocompleteInput = React.createRef();
    this.autocomplete = null;
    this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
  }

  componentDidMount() {
    Socket.on('broadcast_num_ppl', () => {
      this.setState({
        num_people: this.state.num_people + 1
      })
      Socket.emit('total_ppl', { "num_ppl": this.state.num_people, "room_id": this.state.room_id })
    })

    Socket.on('on_leave', () => {
      this.setState({
        num_people: this.state.num_people - 1
      })
    })
    this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current,
      { "types": ["geocode"] });
    this.autocomplete.addListener('place_changed', this.handlePlaceChanged);
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { location, rounds, room_id } = this.state
    Socket.emit('conditions', { "lat": location.lat, "lng": location.lng, "rounds": rounds, "room": room_id })
    this.setState({
      redirect: true
    })
  }

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
      location: e.target.value,
    })
  }

  handleChangeRound = (e) => {
    e.preventDefault()
    this.setState({
      rounds: e.target.value,
    })
  }

  renderRedirect = () => {
    return <Redirect to={{
      pathname: `/${ this.state.room_id }/play_game`,
      state: {
        room_id: `${ this.state.room_id }`,
        num_people: `${ this.state.num_people }`
      }
    }} />
  }

  // Rendering Section
  render() {
    const { num_people, room_id, location } = this.state
    if (this.state.redirect) {
      return this.renderRedirect()
    }
    // change ur design in index.css fucker
    return (
      <LobbyBody id="fuckluke">
        <div>
          <PageTitle>Set Up Game</PageTitle>
        </div>

        <div className="d-flex flex-column">
          <h4>Room ID: { room_id }</h4>
          <p>No. of participant: { num_people }</p>
        </div>

          <div className="form-group">
            <label>Location</label>
            <input ref={this.autocompleteInput} onChange={this.handleChangeLocation} id="location" placeholder="Enter your address" type="text"></input>
          </div>

          <h2>Select Rounds&hellip;</h2>

        <form onSubmit={ this.handleSubmit }>
          <RadioDiv>
          <label>
            <input type="radio" className="option-input radio" name="example" value="3" onChange={this.handleChangeRound} defaultChecked />
            3 ROUNDS
          </label>
          <label>
            <input type="radio" className="option-input radio" name="example" onChange={this.handleChangeRound} value="5" />
            5 ROUNDS
          </label>
          <label>
            <input type="radio" className="option-input radio" name="example" onChange={this.handleChangeRound} value="8" />
            8 ROUNDS
          </label>
          </RadioDiv>

          <button type="submit" disabled={!location}>PLAY!</button>
        </form>

        <Link to={ "/home" }>Return</Link>
      </LobbyBody>
    )
  }
}