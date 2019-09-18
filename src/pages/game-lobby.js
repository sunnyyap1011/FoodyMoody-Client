// Importing Section
import React from 'react'
import '../App.css'
import styled from 'styled-components'
import { Redirect, Link } from 'react-router-dom'
import Socket from '../utils/socket'

// Stylings Section
const LobbyBody = styled.div`
background-color: #9DBDE3;
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
      rounds: ''
    }
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
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { location, rounds, room_id } = this.state
    Socket.emit('conditions', { "location": location, "rounds": rounds, "room": room_id })
    this.setState({
      redirect: true
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
    const { num_people, room_id } = this.state
    if (this.state.redirect) {
      return this.renderRedirect()
    }

    return (
      <LobbyBody>
        <div>
          <h1>Choose Rounds To Play!</h1>
        </div>

        <div className="d-flex flex-column">
          <h4>Room ID: { room_id }</h4>
          <p>No. of participant: { num_people }</p>
        </div>

        <form onSubmit={ this.handleSubmit }>

          <div className="form-group">
            <label>Location</label>
            <input type="text" id="location" onChange={ this.handleChangeLocation } />
          </div>

          <h2>Select Rounds&hellip;</h2>
          <div>
            <label>
              <input type="radio" className="option-input radio" value="3" name="example" defaultChecked />
              3 ROUNDS
          </label>
            <label>
              <input type="radio" className="option-input radio" value="5" name="example" />
              5 ROUNDS
          </label>
            <label>
              <input type="radio" className="option-input radio" value="8" name="example" />
              8 ROUNDS
          </label>
          </div>

          <button type="submit">PLAY!</button>
        </form>

        <Link to={ "/home" }>Return</Link>
      </LobbyBody>
    )
  }
}