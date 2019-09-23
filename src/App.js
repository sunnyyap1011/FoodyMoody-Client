// Importing Section
import React from "react";
import Homepage from "./pages/homepage";
import GameLobby from "./pages/game-lobby";
import Create from "./pages/create-lobby";
import GamePage from "./containers/play-game";
import Waiting from "./pages/waiting-lobby";
import { ToastContainer } from "react-toastify";
import { Route, Switch, Redirect } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.min.css' 
import DiscoverPage from "./pages/discover_page";

class App extends React.Component {
  render() {
    return (
      <div>
        <ToastContainer />
        <Switch>
          <Route exact path="/home" component={Homepage} />
          <Route path="/create_lobby" component={Create} />
          <Route path="/:room_id/game_lobby" component={GameLobby} />
          <Route path="/:room_id/play_game" component={GamePage} />
          <Route path="/:room_id/waiting_lobby" component={Waiting} />
          <Route path="/discover" component={DiscoverPage} />
          <Redirect from="/" to="/home" />
        </Switch>
      </div>
    );
  }
}

export default App;
