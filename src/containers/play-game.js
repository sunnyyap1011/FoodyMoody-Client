import React from 'react';
import Socket from '../utils/socket';
import ReactCardFlip from 'react-card-flip';
// import { toast } from 'react-toastify';
// import { Link } from "react-router-dom"
import {
    Card, CardText, CardBody,
    CardTitle, Button, Alert
} from 'reactstrap';

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


    render() {
        const { room_id, restaurants_list, num_people, card_A, card_B, disabled_btn, result } = this.state
        console.log(restaurants_list)
        console.log(card_A)
        console.log(card_B)
        console.log(num_people)
        console.log(result)

        if (card_A + card_B == num_people) {
            const data = {
                A: { "votes": card_A, "restaurant_name": restaurants_list[0]['name'] },
                B: { "votes": card_B, "restaurant_name": restaurants_list[1]['name'] },
                "room_id": room_id
            }
            Socket.emit('check_result', data)
        }

        return (
            <>
                {restaurants_list.length == 1
                    ?
                    <h2>CONGRATULATIONS !!! You have chosen {restaurants_list[0]['name']}.</h2>
                    : <h2>Choose the one you DISLIKE</h2>
                }

                {result ?
                    <Alert color="primary"> {result} </Alert>
                    :
                    ''
                }
                <div className="d-flex justify-content-between">
                    <h4>Room ID: {room_id}</h4>
                    <h6>No. of Participants: {num_people}</h6>
                </div>
                <div className="d-flex justify-content-between mh-75">
                    {restaurants_list.length == 0 ?
                        ""
                        :
                        (restaurants_list.length == 1 ?
                        <>
                            <ReactCardFlip isFlipped={this.state.isFlipped_A} flipDirection="vertical" flipSpeedBackToFront="0.5" flipSpeedFrontToBack="0.5" infinite="false">
                                <Card className="w-50 m-2" key="front">
                                    <p>No. of Votes: {card_A}</p>
                                    <CardBody className="d-flex flex-column align-items-center">
                                        <CardTitle>{restaurants_list ? restaurants_list[0]['name'] : ''}</CardTitle>
                                    </CardBody>
                                    <img width="100%" src={restaurants_list ? restaurants_list[0]['photo_url'] : ''} alt="Card cap" />
                                    <CardBody className="d-flex flex-column align-items-center">
                                        <CardText>Rating: {restaurants_list ? restaurants_list[0]['rating'] : ''}</CardText>
                                        <CardText>Review: Put the review here</CardText>
                                        <CardText>Operating Hours: 9.00am - 10.00pm</CardText>
                                        <Button className="btn-danger" onClick={this.dislikeCardA} disabled={disabled_btn}>Dislike</Button>
                                    </CardBody>
                                </Card>
                                <Card className="w-50 m-2" key="back">
                                    <p>No. of Votes: {card_A}</p>
                                    <CardBody className="d-flex flex-column align-items-center">
                                        <CardTitle>{restaurants_list ? restaurants_list[0]['name'] : ''}</CardTitle>
                                    </CardBody>
                                    <img width="100%" src={restaurants_list ? restaurants_list[0]['photo_url'] : ''} alt="Card cap" />
                                    <CardBody className="d-flex flex-column align-items-center">
                                        <CardText>Rating: {restaurants_list ? restaurants_list[0]['rating'] : ''}</CardText>
                                        <CardText>Review: Put the review here</CardText>
                                        <CardText>Operating Hours: 9.00am - 10.00pm</CardText>
                                        <Button className="btn-danger" onClick={this.dislikeCardA} disabled={disabled_btn}>Dislike</Button>
                                    </CardBody>
                                </Card>
                            </ReactCardFlip>

                            <ReactCardFlip isFlipped={this.state.isFlipped_B} flipDirection="vertical">
                                <Card className="w-50 m-2" key="front">
                                    <p>No. of Votes: {card_B}</p>
                                    <CardBody className="d-flex flex-column align-items-center">
                                        <CardTitle>{restaurants_list ? restaurants_list[1]['name'] : ''}</CardTitle>
                                    </CardBody>
                                    <img width="100%" src={restaurants_list ? restaurants_list[1]['photo_url'] : ''} alt="Card cap" />
                                    <CardBody className="d-flex flex-column align-items-center">
                                        <CardText>Rating: {restaurants_list ? restaurants_list[1]['rating'] : ''}</CardText>
                                        <CardText>Review: Put the review here</CardText>
                                        <CardText>Operating Hours: 9.00am - 10.00pm</CardText>
                                        <Button className="btn-danger" onClick={this.dislikeCardB} disabled={disabled_btn}>Dislike</Button>
                                    </CardBody>
                                </Card>
                                <Card className="w-50 m-2" key="back">
                                    <p>No. of Votes: {card_B}</p>
                                    <CardBody className="d-flex flex-column align-items-center">
                                        <CardTitle>{restaurants_list ? restaurants_list[1]['name'] : ''}</CardTitle>
                                    </CardBody>
                                    <img width="100%" src={restaurants_list ? restaurants_list[1]['photo_url'] : ''} alt="Card cap" />
                                    <CardBody className="d-flex flex-column align-items-center">
                                        <CardText>Rating: {restaurants_list ? restaurants_list[1]['rating'] : ''}</CardText>
                                        <CardText>Review: Put the review here</CardText>
                                        <CardText>Operating Hours: 9.00am - 10.00pm</CardText>
                                        <Button className="btn-danger" onClick={this.dislikeCardB} disabled={disabled_btn}>Dislike</Button>
                                    </CardBody>
                                </Card>
                            </ReactCardFlip>
                        </>
                        :
                        <Card className="m-2">
                            <CardBody className="d-flex flex-column align-items-center">
                                <CardTitle>{restaurants_list ? restaurants_list[0]['name'] : ''}</CardTitle>
                            </CardBody>
                            <img width="100%" src={restaurants_list ? restaurants_list[0]['photo_url'] : ''} alt="Card cap" />
                            <CardBody className="d-flex flex-column align-items-center">
                                <CardText>Rating: {restaurants_list ? restaurants_list[0]['rating'] : ''}</CardText>
                                <CardText>Review: Put the review here</CardText>
                                <CardText>Operating Hours: 9.00am - 10.00pm</CardText>
                                <Button className="btn-primary">Play Again</Button>
                                <Button className="btn-success">Let's GO</Button>
                            </CardBody>
                        </Card>
                        )}
                </div>
            </>
        );
    }
}
