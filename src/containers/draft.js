import React from 'react';
import Socket from '../utils/socket';
import ReactCardFlip from 'react-card-flip';
import '../play-game.css'
import styled from "styled-components";
import { Link } from "react-router-dom"
import {
    Card, CardText, CardBody,
    CardTitle, Button, CardHeader
} from 'reactstrap';


const Game = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-height: 100vh;

    .title {
        margin: 10px;
        text-align: center;

        span {
            color: lightgreen;
            font-weight: bolder;
        }
    }

    .subtitle {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        h4 {
            color: crimson;
        }

        h6 {
            color: cornflowerblue;
        }
    }

    .cards_container {
        display: flex;
        justify-content: space-between;
        height: 70vh;
        margin: 2vh 0;
        font-weight: bold;

        .card {
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f0f0f0;
            color: black;
            margin: 0 2vw;
            width: 40vw;
            height: 100%;

            .card-header{
                width: 100%;
                text-align: center;
                background-color: slategrey;
                padding: 6px 20px;

            }

            .card-title{
                margin: 0.5rem;
                text-align: center;
                height: 7vh;
                font-size: 15px;
                color: deeppink;
            }

            img {
                width: 100%;
                height: 40%;
            }

            .card-body {
                display: flex;
                flex-direction: column;
                align-items: start;
                margin-bottom: 0.5rem;
                width: 100%;

                .card-text {
                    display: flex;
                    width: 100%;

                    span {
                        color: blue;
                        margin-right: 1rem;
                        width: 30%;
                    }
                }

                .btn_container {
                    width: 100%;
                    display: flex;

                    .button {
                        margin-bottom: 0.5rem;
                        padding: 2px;
                    }
                }

                .flip_btn {
                    align-self: center; 
                }
            }

        }
    }
`



export default class GamePage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            room_id: this.props.location.state.room_id,
            restaurants_list: '',
            num_people: this.props.location.state.num_people,
            card_A: 0,
            card_B: 0,
            disabled_btn: false,
            result: '',
            isFlipped_A: false,
            isFlipped_B: false
        }
    }

    componentDidMount() {
        Socket.on("broadcast_restaurants", data => {
            console.log("Hello World")
            console.log(data)
            this.setState({
                restaurants_list: data
            })
        })

        Socket.on('broadcast_A_votes', () => {
            const { card_A } = this.state
            this.setState({
                card_A: card_A + 1
            })
        })

        Socket.on('broadcast_B_votes', () => {
            const { card_B } = this.state
            this.setState({
                card_B: card_B + 1
            })
        })

        Socket.on('broadcast_result', data => {
            const new_list = this.state.restaurants_list.filter(x => x.name !== data['restaurant_name'])

            this.setState({
                result: `${data['votes']} of you DISLIKE ${data['restaurant_name']}`,
                card_A: 0,
                card_B: 0,
                restaurants_list: new_list,
                disabled_btn: false,
                [data['card'] == "A" ? "isFlipped_A" : "isFlipped_B"]: !this.state[data['card'] == "A" ? "isFlipped_A" : "isFlipped_B"],
            })

        })
        Socket.on('on_leave', () => {
            this.setState({
                num_ppl: this.state.num_ppl - 1
            })
        })
    }

    dislikeCardA = () => {
        Socket.emit('vote_A', { "room_id": this.state.room_id })
        this.setState({
            disabled_btn: true
        })
    }

    dislikeCardB = () => {
        Socket.emit('vote_B', { "room_id": this.state.room_id })
        this.setState({
            disabled_btn: true
        })
    }

    goToMap = () => {
        const { restaurants_list } = this.state
        const lat = restaurants_list[0].lat
        const lng = restaurants_list[0].lng
        const place_id = restaurants_list[0].place_id

        return window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place_id}`)
    }


    render() {
        const { room_id, restaurants_list, num_people, card_A, card_B, disabled_btn, result } = this.state

        const img_placehld = 'http://www.weichertpropertiesnyc.com/Content/Images/placeholder_broken.png'

        console.log(restaurants_list)

        if (card_A + card_B == num_people) {
            const data = {
                A: { "votes": card_A, "restaurant_name": restaurants_list[0]['name'] },
                B: { "votes": card_B, "restaurant_name": restaurants_list[1]['name'] },
                "room_id": room_id
            }
            Socket.emit('check_result', data)
        }

        return (
            <Game>
                {/* {result ?
                    <Alert color="primary"> {result} </Alert>
                    :
                    ''
                } */}

                {restaurants_list.length == 1
                    ?
                    <h2 className="title">CONGRATULATIONS !!! You have chosen {restaurants_list[0]['name']}.</h2>
                    : <h2 className="title">Choose the one you DISLIKE</h2>
                }
                <div className="subtitle">
                    <h4>Room ID: {room_id}</h4>
                    <h6>No. of Participants: {num_people}</h6>
                </div>
                <div className="card_container">

                    {restaurants_list.length == 0 ?
                        ""
                        :
                        (restaurants_list.length > 1 ?
                            <>
                                <ReactCardFlip isFlipped={this.state.isFlippedA} flipDirection="horizontal">
                                    <Card key="front">
                                        <CardHeader>Votes: {card_A}</CardHeader>
                                        <CardTitle>{restaurants_list[0]['name']}</CardTitle>
                                        <img src={restaurants_list[0]['photo_url'] ? restaurants_list[0]['photo_url'] : img_placehld} alt="Card cap" />
                                        <CardBody>
                                            <CardText><span>Rating:</span> {restaurants_list[0]['rating']}</CardText>
                                            <CardText><span>Cuisine:</span> {restaurants_list[0]['cuisines']}</CardText>
                                            <div className="btn_container">
                                                <Button className="btn-danger mr-3" onClick={this.dislikeCardA} disabled={disabled_btn}>Dislike</Button>
                                                <Button className="btn-info" onClick={this.handleFlipA}>More details</Button>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card key="back">
                                        <CardHeader>Votes: {card_A}</CardHeader>
                                        <CardTitle>{restaurants_list[0]['name']}</CardTitle>
                                        <CardBody>
                                            <CardText><span>Cuisine:</span> {restaurants_list[0]['cuisines']}</CardText>
                                            <CardText><span>Price Range:</span> {restaurants_list[0]['price_range']}</CardText>
                                            <CardText><span>Address:</span> {restaurants_list[0]['address']}</CardText>
                                            <Button className="flip_btn btn-info" onClick={this.handleFlipA}>Go back to vote</Button>
                                        </CardBody>
                                    </Card>
                                </ReactCardFlip>

                                <ReactCardFlip isFlipped={this.state.isFlippedB} flipDirection="horizontal">
                                    <Card key="front">
                                        <CardHeader>Votes: {card_B}</CardHeader>
                                        <CardTitle>{restaurants_list[1]['name']}</CardTitle>
                                        <img src={restaurants_list[1]['photo_url'] ? restaurants_list[1]['photo_url'] : img_placehld} alt="Card cap" />
                                        <CardBody>
                                            <CardText><span>Rating:</span> {restaurants_list[1]['rating']}</CardText>
                                            <CardText><span>Cuisine:</span> {restaurants_list[1]['cuisines']}</CardText>
                                            <div className="btn_container">
                                                <Button className="btn-danger mr-3" onClick={this.dislikeCardB} disabled={disabled_btn}>Dislike</Button>
                                                <Button className="btn-info" onClick={this.handleFlipB}>More details</Button>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card key="back">
                                        <CardHeader>Votes: {card_B}</CardHeader>
                                        <CardTitle>{restaurants_list[1]['name']}</CardTitle>
                                        <CardBody>
                                            <CardText><span>Cuisine:</span> {restaurants_list[1]['cuisines']}</CardText>
                                            <CardText><span>Price Range:</span> {restaurants_list[1]['price_range']}</CardText>
                                            <CardText><span>Address:</span> {restaurants_list[1]['address']}</CardText>
                                            <Button className="flip_btn btn-info" onClick={this.handleFlipB}>Go back to vote</Button>
                                        </CardBody>
                                    </Card>
                                </ReactCardFlip>
                            </>
                            :
                            <>
                                <Card>
                                    <CardTitle>{restaurants_list[0]['name']}</CardTitle>
                                    <img src={restaurants_list[0]['photo_url'] ? restaurants_list[0]['photo_url'] : img_placehld} alt="Card cap" />
                                    <CardBody>
                                        <CardText><span>Rating:</span> {restaurants_list[0]['rating']}</CardText>
                                        <CardText><span>Cuisine:</span> {restaurants_list[0]['cuisines']}</CardText>
                                        <div className="btn_container">
                                            <Link to={'/create_join_rooms'} ><Button className="btn-primary">Play Again</Button></Link>
                                            <Button onClick={this.goToMap} className="btn-success">Let's GO</Button>
                                        </div>
                                    </CardBody>
                                </Card>

                            </>
                        )}
                </div>
            </Game>
        );
    }
}
