import React, { Component, Fragment } from "react";
import {Route} from 'react-router-dom';
import WaitingRoom from "./components/WaitingRoom";
import Room from "./components/Room";

class App extends Component {
    render = () => {
        return(
            <Fragment>
                <Route exact path="/" component={WaitingRoom}/>
                <Route exact path="/details/:room" component={Room}/>
            </Fragment>
        );
    }
}
export default App;