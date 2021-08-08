import React, {useState} from "react";
import "../css/Login.css"
import axios from "axios";
import {Redirect} from 'react-router-dom'


const Login = (props) =>{
    const [username, setUsername] =useState("");
    const [password, setPassword] =useState("");
    const [errorMessage, setErrorMessage]=useState("")
    let currentUser = document.cookie;
    let updatedCookie = currentUser+"; expires=Thu, 18 Dec 2013 12:00:00 UTC"
    document.cookie = updatedCookie


    const onLogin = () =>{
        axios.post("http://localhost:8090/login", {
            username: username,
            password: password,
            alreadyLoggedIn: false
        })
            .then(response=> {
                console.log(response.data)
                if (response.data===""){
                    console.log("invalid login")
                    setErrorMessage("Invalid Login, try again!")
                } else {
                    props.setUser(response.data)
                    document.cookie = `username=${response.data.username}`
                }
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

                    <button className="ui button" type="button" onClick={() => onLogin()}>Login</button>
                    <a href="/register"><button className="ui button" type="button" style={{float: "Right", background: "gold"}}>Not a user? Register!</button></a>
                    <div style={{ color: "red"}}>{errorMessage}</div>
                </form>

            </div>
        </div>
    )
}

export default Login;