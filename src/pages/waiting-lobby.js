// Importing Section
import React from 'react'
import PageTitle from '../components/PageTitle'
import { Redirect } from "react-router-dom"
import Socket from '../utils/socket';
import '../waiting-host.css'


export default class Waiting extends React.Component {
  constructor(props) {
      super(props)
      this.state = {
          room_id: this.props.location.state.room_id,
          start: false, 
          num_ppl: 1
      }
  }

  componentDidMount() {
      Socket.on('check_start', () => {
          this.setState({
              start: true
          })
      })

      Socket.on('broadcast_total_ppl', data => {
          this.setState({
              num_ppl: data['num_ppl']
          })
      })

      Socket.on('on_leave', () => {
          this.setState({
              num_ppl: this.state.num_ppl - 1
          })
      })
  }

  renderRedirect = () => {
      return <Redirect to={{
          pathname: `/${this.state.room_id}/play_game`,
          state: { 
              room_id: `${this.state.room_id}`,
              num_ppl: `${this.state.num_ppl}`
          }
      }} />
  }

  render() {
      const {room_id, num_ppl} = this.state
      if (this.state.start) {
          return this.renderRedirect()
      }
      return (
        <>
          <body id="body">
            <div id="waiting">
            <h4 id="room_id">Room ID: { room_id }</h4>
            <p id="players">Players: { num_ppl }</p>
            </div>

            <h1>Waiting on Host...</h1>
             <div id="cooking">
              <div class="bubble"></div>
              <div class="bubble"></div>
              <div class="bubble"></div>
              <div class="bubble"></div>
              <div class="bubble"></div>

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
          </body>
        </>
      );
  }
}
