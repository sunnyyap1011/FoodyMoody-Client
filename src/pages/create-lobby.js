// Importing Section
import React from 'react'
import { Redirect } from 'react-router-dom'
import { toast } from 'react-toastify'
import Socket from '../utils/socket'
import styled from 'styled-components'
import '../create-lobby.css'

// Styling Section
const LobbyBody = styled.div`
background-color: #9DBDE3;
height: 100vh;
width: 100vw;
`

export default class Create extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        rooms: '',
        room_id: '',
        redirectHost: false,
        redirectWait: false,
    }
}

componentDidMount() {
    Socket.on('connect', () => {
        console.log("Connected to the server")
    })

    Socket.on('broadcast_rooms', data => {
        this.setState({
            rooms: data
        })
    })

    Socket.on('check_room_exist', data => {
        if (data['valid']) {
            this.setState({
                redirectWait: true
            })
        }
        else {
            toast("Room ID does not exist")
        }
    })
}

componentWillUnmount() {
    Socket.off('broadcast_rooms')
    Socket.off('check_room_exist')
}

joinRoom = (e) => {
    e.preventDefault()
    Socket.emit('join_room', {"room_id": this.state.room_id})
}

createRoom = (e) => {
    e.preventDefault()

    Socket.emit('create_room')

    Socket.on('get_room_id', data => {
        this.setState({
            room_id: data['room_id'],
            redirectHost: true
        })
    })
}

renderRedirectHost = () => {
    return <Redirect to={{
        pathname: `/${this.state.room_id}/game_lobby`,
        state: { room_id: `${this.state.room_id}`}
    }} />
}

renderRedirectWait = () => {
    return <Redirect to={{
        pathname: `/${this.state.room_id}/waiting_lobby`,
        state: { room_id: `${this.state.room_id}`}
    }} />
}

handleChange = (e) => {
    this.setState({
        room_id: e.target.value
    })
}

render() {
    console.log(this.state.rooms)
    
    if (this.state.redirectHost) {
        return this.renderRedirectHost()
    }
    if (this.state.redirectWait) {
        return this.renderRedirectWait()
    }
    return (
        <LobbyBody className="container">
            <form onSubmit={ this.createRoom } className="d-flex">
                <button type="submit" className="btn-success mb-3">Create a Room</button>
            </form>

            <form onSubmit={ this.joinRoom } className="d-flex">
                <input type="text" id="room_id" onChange={ this.handleChange } placeholder="Key in Room ID here" />
                <button type="submit" id="submit_btn" className="btn-primary">Join a Room</button>
            </form>
        </LobbyBody>
    );
  }
}