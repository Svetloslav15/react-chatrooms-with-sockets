import React, { Component, Fragment } from 'react';
import {Link} from 'react-router-dom';
import openSocket from "socket.io-client";

export default class WaitingRoom extends Component{
    constructor() {
        super();
        this.state = {
            rooms: [],
            room: "",
            endpoint: 'http://localhost:4001',
        };
        this.socket = openSocket(this.state.endpoint);
    }
    componentDidMount = () => {
        this.socket.emit('join-room', 'waiting-room');
        this.socket.on('new-room-added', (data) => {
            let rooms = this.state.rooms;
            rooms.push(data);
            this.setState({rooms});
        });
    };
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    addRoom = (event) => {
        event.preventDefault();
        this.socket.emit('room-added', this.state.room);
        let rooms = this.state.rooms;
        rooms.push(this.state.room);
        rooms = rooms.filter((room, index) => rooms.indexOf(room) === index);
        this.state.room = "";
        this.setState({rooms});
    };

    render() {
        let isDisabled = this.state.room.trim() === "";
        let rooms = this.state.rooms
            .map(x => <div className='bg-success border border-white my-2 mx-auto p-1 col-8'>
                <Link className="text-white" to={'/details/' + x}>{x}</Link>
            </div>);
        return (
            <div>
                <h1 className='text-center my-3'>Rooms: </h1>
                <ul>
                    {rooms}
                </ul>
                <div>
                    <form onSubmit={this.addRoom} className='mx-auto'>
                        <div className="input-group mb-3 col-6 mx-auto">
                            <input type="text" className="form-control"name='room' placeholder="Add new room..." value={this.state.room} name='room' onChange={this.handleChange}/>
                                <div className="input-group-append">
                                    <button className="btn btn-danger" disabled={isDisabled} type="submit">Add</button>
                                </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
}