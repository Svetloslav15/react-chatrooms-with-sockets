import React, { Component, Fragment } from 'react';
import openSocket from "socket.io-client";

export default class Room extends Component{
    constructor(props) {
        super(props);
        this.state = {
            endpoint: 'http://localhost:4001',
            messages: [],
            message: "",
            username: '',
            size: 0,
        };
        this.socket = openSocket(this.state.endpoint);
        this.room = this.props.match.params.room;
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };
    send = (event) => {
        event.preventDefault();
        let data = {
            username: this.state.username,
            message: this.state.message
        };
        this.setState({message: ""});
        this.socket.emit('message-send', this.room, data);
        this.appendMessageMine(data);
    };
    componentDidMount = () => {
        this.socket.emit('join-room', this.room);
        this.socket.on('message', (data) => {
            this.appendMessage(data);
        });
    };

    appendMessage = (data) => {
        let currentLi = <li  key={this.state.size} className='d-block bg-danger col-8 text-white mx-auto p-2 my-2'>{data.username}: {data.message}</li>;
        let lis = this.state.messages;
        lis.push(currentLi);
        this.setState({messages: lis, size: +this.state.size + 1});
    };

    appendMessageMine = (data) => {
        let currentLi = <li  key={this.state.size} className='d-block bg-warning text-white col-8 mx-auto p-2 my-2'>{data.username}: {data.message}</li>;
        let lis = this.state.messages;
        lis.push(currentLi);
        this.setState({messages: lis, size: +this.state.size + 1});
    };

    render() {
        let isDisabled = this.state.message.trim() === "" || this.state.username.trim() === "";

        return (
            <Fragment>
                <h1 className='text-center my-3'>Room: {this.room}</h1>
                <input type="text" className="form-control col-2 mx-auto"
                       placeholder="Add username..."
                       value={this.state.username}
                       name='username'
                       onChange={this.handleChange}/>
                <ul>
                    {this.state.messages}
                </ul>
                <form onSubmit={this.send} className='m-2'>
                    <div className="input-group mb-3 col-6 mx-auto">
                        <input type="text"
                               className="form-control"
                               name="message"
                               placeholder="Add message..."
                               value={this.state.message}
                               onChange={this.handleChange}/>
                        <div className="input-group-append">
                            <button className="btn btn-danger" disabled={isDisabled} type="submit">Send</button>
                        </div>
                    </div>
                </form>
            </Fragment>
        )
    }
}