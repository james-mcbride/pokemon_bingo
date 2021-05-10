import React, {useState} from "react";
import "../css/Register.css"
import axios from "axios";
const Register = (props) =>{
    const [username, setUsername] =useState("");
    const [password, setPassword] =useState("");
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");


    const onRegister = () =>{
        axios.get("http://localhost:8090/register", {
            params: {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName
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
                <form className="ui form pokemonForm">
                    <div className="field">
                        <label>First Name</label>
                        <input type="text" name="first-name" placeholder="First Name" value={firstName}
                               onChange={event => setFirstname(event.target.value)}/>
                    </div>
                    <div className="field">
                        <label>Last Name</label>
                        <input type="text" name="last-name" placeholder="Last Name" value={lastName}
                               onChange={event => setLastname(event.target.value)}/>
                    </div>
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

                    <button className="ui button" type="button" onClick={()=>onRegister()}>Submit</button>
                </form>
            </div>
        </div>
    )
}

export default Register;
