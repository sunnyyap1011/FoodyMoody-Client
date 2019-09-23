import React from 'react';
import { Link } from 'react-router-dom'
import Socket from '../utils/socket';
import {
    Card, CardText, CardBody,
    CardTitle, Button, Alert, CardHeader
} from 'reactstrap';
import styled, { keyframes } from 'styled-components'
import ReactCardFlip from 'react-card-flip'
import "../play-game.css";


const Game = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100vh;
    background-color: #9DBDE3;
    font-family: 'Mansalva', cursive;

    .far {
        display: inline-block;
        font-family: FontAwesome;
    }

    /* .title {
        margin: 10px;
        text-align: center;
        font-family: "Amatic SC",cursive;
        font-weight: bolder;
        font-size: 70px;
    } */

    .title {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;

        h4 {
            font-family: "Amatic SC",cursive;
            font-size: 70px;
            font-weight: bold;
            text-align: center;
        }

        h6 {
            font-size: 20px;
            font-family: monospace;
        }
    }

    #cooking {
        bottom: 10px;
        height: 100vh;
    }

    .cards_container {
        display: flex;
        justify-content: space-between;
        height: 70vh;
        margin: 2vh 0;

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
                background-color: #116466;
                padding: 6px 20px;
                color: white;
            }

            .card-title{
                margin: 0.5rem;
                text-align: center;
                height: 6vh;
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
                padding: 3px 20px 5px 20px;

                .card-text {
                    display: flex;
                    width: 100%;
                    font-size: 15px;

                    span {
                        color: blue;
                        margin-right: 1rem;
                        width: 30%;
                    }

                    .address {
                        width: 100%;
                        color: black;
                        font-size: 11px;
                    }
                }

                .btn_container {
                    width: 100%;
                    display: flex;
                    justify-content: space-between;

                    .button {
                        margin-bottom: 0.5rem;
                        padding: 2px;
                    }

                    .fa-thumbs-down:before {
                        content: "\f165";
                    }
                }

                .btn_container_2 {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    margin-top: 1rem;
                }

                .flip_btn {
                    align-self: center; 
                }
            }

        }
    }
`

class GamePage extends React.Component {
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
            isFlippedA: false,
            isFlippedB: false,
            isLoading: true
        }
    }

    componentDidMount() {
        Socket.on("broadcast_restaurants", data => {
            this.setState({
                restaurants_list: data,
                isLoading: false
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
                isFlippedA: false,
                isFlippedB: false
            })

        })

        Socket.on('on_leave', () => {
            this.setState({
                num_people: this.state.num_people - 1
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

    handleFlipA = (e) => {
        e.preventDefault()
        this.setState(prevState => ({
            isFlippedA: !prevState.isFlippedA
        }))
    }

    handleFlipB = (e) => {
        e.preventDefault()
        this.setState(prevState => ({
            isFlippedB: !prevState.isFlippedB
        }))
    }

    goToMap = () => {
        const { restaurants_list } = this.state

        const lat = restaurants_list[0].lat
        const lng = restaurants_list[0].lng
        // const place_id = restaurants_list[0].place_id
        const name = encodeURI(restaurants_list[0].name)
        const address = encodeURI(restaurants_list[0].address)

        // return window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${place_id}`)
        return window.open(`https://www.google.com/maps/search/?api=1&query=${name}+${address}`)
    }


    render() {
        const { room_id, restaurants_list, num_people, card_A, card_B, disabled_btn, isLoading } = this.state
        console.log(restaurants_list)

        const img_placehld = 'https://cdn.dribbble.com/users/1012566/screenshots/4187820/topic-2.jpg'

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
                {/* {restaurants_list.length == 1
                    ?
                    <h2 className="title">THE CHOSEN ONE</h2>
                    : <h2 className="title">Choose the one you DISLIKE
                    </h2>
                } */}

                <div className="title">
                    <h4>Welcome to Room '{room_id}'</h4>
                    <h6>Player(s) in room: {num_people}</h6>
                </div>

                {isLoading ?
                    <div id="cooking">
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>
                        <div className="bubble"></div>

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

                    :
                    ""
                }

                <div className="cards_container">

                    {restaurants_list.length == 0 ?
                        ""
                        :
                        (restaurants_list.length == 1 ?
                            <>
                                <ReactCardFlip isFlipped={this.state.isFlippedA} flipDirection="horizontal">
                                    <Card key="front">
                                        <CardTitle>{restaurants_list[0]['name']}</CardTitle>
                                        <img src={restaurants_list[0]['photo_url'] ? restaurants_list[0]['photo_url'] : img_placehld} alt="Card cap" />
                                        <CardBody>
                                            <CardText><span>Rating:</span> {restaurants_list[0]['rating']}</CardText>
                                            <CardText><span>Cuisine:</span> {restaurants_list[0]['cuisines']}</CardText>
                                            <div className="btn_container">
                                                <Link to={'/create_join_rooms'} ><Button className="btn-primary">Play Again</Button></Link>
                                                <Button onClick={this.goToMap} className="btn-success">Let's GO</Button>
                                            </div>
                                            <div className="btn_container_2">
                                                <Button className="btn-info" onClick={this.handleFlipA}>More details</Button>
                                            </div>
                                        </CardBody>
                                    </Card>

                                    <Card key="back">
                                        <CardTitle>{restaurants_list[0]['name']}</CardTitle>
                                        <CardBody>
                                            <CardText><span>Cuisine:</span> {restaurants_list[0]['cuisines']}</CardText>
                                            <CardText><span>Price Range:</span> {restaurants_list[0]['price_range']}</CardText>
                                            <CardText><span>Address:</span> <span className="address">{restaurants_list[0]['address']}</span></CardText>
                                            <div className="btn_container_2">
                                                <Button onClick={this.goToMap} className="btn-success">Let's GO</Button>
                                            </div>
                                            <div className="btn_container_2">
                                                <Button className="flip_btn btn-info" onClick={this.handleFlipA}>Back to front</Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                </ReactCardFlip>
                            </>
                            :
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
                                                <Button className="btn-danger mr-3" onClick={this.dislikeCardA} disabled={disabled_btn}>Dislike <i className="far fa-thumbs-down" aria-hidden="true"></i></Button>
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
                                            <CardText className="address"><span>Address:</span> <span className="address">{restaurants_list[0]['address']}</span></CardText>
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
                                                <Button className="btn-danger mr-3" onClick={this.dislikeCardB} disabled={disabled_btn}>Dislike <i className="far fa-thumbs-down" aria-hidden="true"></i></Button>
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
                                            <CardText className="address"><span>Address:</span> <span className="address">{restaurants_list[1]['address']}</span></CardText>
                                            <Button className="flip_btn btn-info" onClick={this.handleFlipB}>Go back to vote</Button>
                                        </CardBody>
                                    </Card>
                                </ReactCardFlip>

                            </>
                        )
                    }
                </div>
            </Game >
        );
    }
}


export default GamePage;