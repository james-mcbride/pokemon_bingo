import React, {useEffect, useState} from "react";
import "../css/Register.css"
import axios from "axios";
const Register = (props) =>{
    const [username, setUsername] =useState("");
    const [password, setPassword] =useState("");
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");
    const[favPokemon, setFavPokemon] = useState("");
    const [profilePicture, setProfilePicture] = useState("")
    const [pokemon, setPokemon] = useState([])
    const [matchingCards, setMatchingCards] = useState([])
    const [currentInterval, setCurrentInterval] = useState(0)

    useEffect(()=>{
        axios.get("http://localhost:8090/allCards")
            .then(response=> {
                console.log(response);
                setProfilePicture(response.data[57].imageURL)
                setPokemon(response.data)
            })
    }, [])


    const onRegister = () =>{
            axios.post("http://localhost:8090/register", {
                username: username,
                password: password,
                firstName: firstName,
                lastName: lastName,
                profilePicture: profilePicture
            })
                .then(response=> {
                    console.log(response);
                    props.setUser(response.data)
                    document.cookie = `username=${response.data.username}`
                })
    }

    const onChooseFavPokemon = (card) =>{
        setMatchingCards([])
        setFavPokemon("")
        setProfilePicture(card.imageURL);
    }

    const searchPokemon = (event) => {
        setFavPokemon(event.target.value);

        let timeoutId;
        clearTimeout(currentInterval);

            timeoutId = setTimeout(function () {
                let matchingPokemon=pokemon.filter(card=>card.name.toLowerCase().includes(favPokemon));
                setMatchingCards(matchingPokemon)
            }, 500);

        setCurrentInterval(timeoutId);
    }

    let renderedPokemon=matchingCards.map(card=>{
        return (
            <div style={{height:"100%", position: "relative"}}>
                <img src={card.imageURL} style={{height:"100%"}} />
                <button className="ui mini green button" style={{position:"absolute", bottom:10, zIndex:1, left: 13}} onClick={()=>onChooseFavPokemon(card)}>Save</button>
            </div>
        )
    })

    return (
        <div id="flexContainer">
            <div id="formDiv">
                <form className="ui form pokemonForm">
                    <div className="field" style={{width:"50%", float: "left", textAlign: "center"}}>
                        <label>Profile Picture</label>
                        <div style={{width:150, height:122, overflow: "hidden", borderRadius: "50%", margin: "0 auto"}}>
                            <img src={profilePicture} style={{objectFit:"cover", width: "100%"}}/>
                        </div>
                    </div>
                    <div style={{width:"50%", float: "left"}}>
                        <div style={{height:122, display: "flex", flexWrap:"no wrap", width:"100%", whiteSpace:"nowrap", overflow: "auto", margin: "0 10px"}}>
                            {renderedPokemon}
                        </div>

                        <input type="text" name="profilePicture" placeholder="enter favorite pokemon" style={{ float: "right"}} value={favPokemon} onChange={(event)=>searchPokemon(event)}/>
                    </div>
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
