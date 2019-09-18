// Importing Section
import React from 'react'
import Homepage from './pages/homepage'
import GameLobby from './pages/game-lobby' 
import Create from './pages/create-lobby'
import Random from './containers/random-game' 
import GamePage from './containers/play-game'
import { Route } from 'react-router-dom'

class App extends React.Component {
  render() {
    return (
      <div>
        <Route exact path = "/home" component = { Homepage } />
        <Route path = "/random_restaurants" component = { Random } />
        <Route path = "/create_lobby" component = { Create } />
        <Route path = "/:room_id/game_lobby" component = { GameLobby } />
        <Route path = "/:room_id/play_game" component = { GamePage } />
      </div>
    )
  }
}

export default App;
