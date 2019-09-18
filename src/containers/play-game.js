import React from 'react';
import Socket from '../utils/socket';
import { toast } from 'react-toastify';

// import { Link } from "react-router-dom"
import {
    Card, CardImg, CardText, CardBody, CardLink,
    CardTitle, CardSubtitle, Button, Alert
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
            result: ''
        }
    }

    componentDidMount() {
        Socket.on("broadcast_restaurants", data => {
            console.log("HEllo")
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
                disabled_btn: false
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
                    {restaurants_list.length > 1
                        ?
                        <>
                            <Card className="w-50 m-2">
                                <p>No. of Votes: {card_A}</p>
                                <CardBody className="d-flex flex-column align-items-center">
                                    <CardTitle>{restaurants_list ? restaurants_list[0]['name'] : ''}</CardTitle>
                                </CardBody>
                                <img width="100%" src="https://carepharmaceuticals.com.au/wp-content/uploads/sites/19/2018/02/placeholder-600x400.png" alt="Card image cap" />
                                <CardBody className="d-flex flex-column align-items-center">
                                    <CardText>Rating: {restaurants_list ? restaurants_list[0]['rating'] : ''}</CardText>
                                    <CardText>Review: Put the review here</CardText>
                                    <CardText>Operating Hours: 9.00am - 10.00pm</CardText>
                                    <Button className="btn-danger" onClick={this.dislikeCardA} disabled={disabled_btn}>Dislike</Button>
                                </CardBody>
                            </Card>
                            <Card className="w-50 m-2">
                                <p>No. of Votes: {card_B}</p>
                                <CardBody className="d-flex flex-column align-items-center">
                                    <CardTitle>{restaurants_list ? restaurants_list[1]['name'] : ''}</CardTitle>
                                </CardBody>
                                <img width="100%" src="https://carepharmaceuticals.com.au/wp-content/uploads/sites/19/2018/02/placeholder-600x400.png" alt="Card image cap" />
                                <CardBody className="d-flex flex-column align-items-center">
                                    <CardText>Rating: {restaurants_list ? restaurants_list[1]['rating'] : ''}</CardText>
                                    <CardText>Review: Put the review here</CardText>
                                    <CardText>Operating Hours: 9.00am - 10.00pm</CardText>
                                    <Button className="btn-danger" onClick={this.dislikeCardB} disabled={disabled_btn}>Dislike</Button>
                                </CardBody>
                            </Card>
                        </>
                        :
                        <Card className="m-2">
                            <CardBody className="d-flex flex-column align-items-center">
                                <CardTitle>{restaurants_list ? restaurants_list[0]['name'] : ''}</CardTitle>
                            </CardBody>
                            <img width="100%" src="https://carepharmaceuticals.com.au/wp-content/uploads/sites/19/2018/02/placeholder-600x400.png" alt="Card image cap" />
                            <CardBody className="d-flex flex-column align-items-center">
                                <CardText>Rating: {restaurants_list ? restaurants_list[0]['rating'] : ''}</CardText>
                                <CardText>Review: Put the review here</CardText>
                                <CardText>Operating Hours: 9.00am - 10.00pm</CardText>
                                <Button className="btn-primary">Play Again</Button>
                                <Button className="btn-success">Let's GO</Button>
                            </CardBody>
                        </Card>
                    }
                </div>
            </>
        );
    }
}
