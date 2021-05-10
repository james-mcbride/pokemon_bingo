import React, {useState} from "react";
import "../css/Login.css"
import axios from "axios";
import {Redirect} from 'react-router-dom'


const Login = (props) =>{
    const [username, setUsername] =useState("");
    const [password, setPassword] =useState("");


    const onLogin = () =>{
        axios.get("http://localhost:8090/login", {
            params: {
                username: username,
                password: password
            }
        })
            .then(response=> {
                console.log(response);
                props.setUser(response.data)
            })
    }


    return (
        <div id="flexContainer">
            <div id="formDiv">
                <form className="ui form pokemonForm" >
                    <div className="field">
                        <label>Username</label>
                        <input type="text" name="username" placeholder="Username" value={username}
                               onChange={event => setUsername(event.target.value)}/>
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Password" value={password}
                               onChange={event => setPassword(event.target.value)}/>
                    </div>

                    <button className="ui button" type="button" onClick={() => onLogin()}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Login;