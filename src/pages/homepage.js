// Importing Section
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import img from "../components/background_images/homepage_background_2.jpg";
import Socket from "../utils/socket";
import "../homepage.css";

// Stylings Section
const Home = styled.div`
  background-image: url(${img});
  background-attachment: fixed;
  position: fixed;
  height: 100vh;
  width: 100vw;
  background-size: cover;

  .home_div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .home_title {
    margin-top: 20px;
  }
`;

// Rendering Section
export default class Homepage extends React.Component {
  state = {};

  componentDidMount() {
    Socket.on("connect", () => {
      console.log("You've connected!");
    });
  }

  render() {
    return (
      <Home>
        <div className="home_title">
          <h1>
            <span>F</span>
            <span>o</span>
            <span>o</span>
            <span>d</span>
            <span>y</span>
            <span>M</span>
            <span>o</span>
            <span>o</span>
            <span>d</span>
            <span>y</span>
          </h1>
        </div>

        <div className="home_div">
          <div>
            <Link to={"/create_lobby"}>
              <button className="learn-more">PLAY GAME</button>
            </Link>
          </div>

          <div>
            <Link to={"/discover"}>
              <button className="learn-more">LET'S EAT</button>
            </Link>
          </div>
        </div>
      </Home>
    );
  }
}
