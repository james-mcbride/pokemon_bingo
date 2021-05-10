import React, {useState} from "react";
import "../css/Login.css"
import axios from "axios";
import {Redirect} from 'react-router-dom'


const CreateBingoCard = ({groups}) =>{



    const onLogin = () =>{
        axios.get("http://localhost:8090/login", {
            params: {

            }
        })
            .then(response=> {
                console.log(response);
            })
    }


    return (
        <div id="flexContainer">
            <div id="formDiv">
                <form className="ui form pokemonForm" action="localhost:8090/login" method="GET">
                    <div className="field">
                        <label>Select Group</label>
                        <input type="text" name="username" placeholder="Username"/>
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="Password"/>
                    </div>

                    <button className="ui button" type="submit" onClick={() => onLogin()}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default CreateBingoCard;