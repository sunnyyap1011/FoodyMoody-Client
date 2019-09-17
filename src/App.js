// Importing Section
import React from 'react'
import Homepage from './pages/homepage'
import GameLobby from './pages/game-lobby' 
import Random from './containers/random-game' 
import Create from './pages/create-room'
import GameRoom from './containers/play-game'
import { Route } from 'react-router-dom'

class App extends React.Component {
  render() {
    return (
      <div>
        <Route exact path = "/home" component = { Homepage } />
        <Route path = "/game_lobby" component = { GameLobby } />
        <Route path = "/random_restaurants" component = { Random } />
        <Route path = "/create_lobby" component = { Create } />
        <Route path = "/game_room" component = { GameRoom } />
      </div>
    )
  }
}

export default App;
