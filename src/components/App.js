import React, {Component, useState, useEffect} from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom'
import BingoCard from "./BingoCard";
import pokemon from "pokemontcgsdk";
import axios from "axios";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";
import CreateBingoCard from "./CreateBingoCard";


export default()=>{
    const [user, setUser] = useState(null);
    const [groups, setGroups] = useState([])
    const [bingoCards, setBingoCards] = useState([])
    const [selectedBingo, setSelectedBingo] = useState(null)

    useEffect(()=>{
        // pokemon.card.where({ q: 'set.id:base1' })
        //     .then(set=>{
        //         console.log(set);
        //         setCards(set.data)
        //         for (let card of set.data.slice(0,68)) {
        //             console.log(card.name, card.level, card.nationalPokedexNumbers.large, card.set.id)
        //             let url;
        //             if (card.nationalPokedexNumbers) {
        //                  url = "http://localhost:8090/newCard?cardName=" + card.name + "&imageUrl=" + card.images.large + "&deckSet=" + card.set.id + "&level=" + card.level + "&pokedexNumber=" + card.nationalPokedexNumbers[0];
        //             } else{
        //                 url = "https://localhost:8090/newCard?cardName=" + card.name + "&imageUrl=" + card.images.large + "&deckSet=" + card.set.id + "&level=" + card.level
        //             }
        //            axios.get(url)
        //                .then(response=>console.log(response))
        //         }
        //     });




    },[])

    const onLogin = (loggedInUser) =>{
        setUser(loggedInUser)
        //
        // //will do ajax call to internal api to get all users groups.
        // let url="http://localhost:8090/profile/"+loggedInUser.id+"/groups"
        // axios.get(url)
        //     .then(response=> {
        //         console.log(response);
        //         setGroups(response.data)
        //     })

        //will do a separate ajax call to get all bingo cards
         let url="http://localhost:8090/profile/"+loggedInUser.id+"/bingoCard"
        axios.get(url)
            .then(response=> {
                console.log(response);
                setGroups(response.data.groups);
                setBingoCards(response.data.bingoCards)
            })
    }

    const onSelectBingoCard = (bingoCard)=>{
        setSelectedBingo(bingoCard)
    }
        return (
            <div className="container" style={{height: "100%"}}>
                <BrowserRouter>
                    <div id="routerContainer">
                        <Route exact path="/">
                            {user===null ? <Redirect to="/login" /> : <Home setUser={onLogin}/>}

                        </Route>
                        <Route exact path="/group/:id/bingo">
                            <BingoCard bingoCard={selectedBingo} user={user}/>
                        </Route>
                        <Route exact path="/register">
                            {user!==null ? <Redirect to="/profile" /> : <Register setUser={onLogin}/>}
                        </Route>
                        <Route exact path="/login">
                            {user!==null ? <Redirect to="/profile" /> : <Login setUser={onLogin}/>}
                        </Route>
                        <Route exact path="/profile">
                            {user===null ? <Redirect to="/login" /> : <Profile setUser={onLogin} user={user} groups={groups} bingoCards={bingoCards} onSelectBingoCard={onSelectBingoCard}/>}
                        </Route>
                        <Route exact path="/bingo/create">
                            {user===null ? <Redirect to="/login" /> : <CreateBingoCard groups={groups} user={user}/>}
                        </Route>
                    </div>
                </BrowserRouter>
            </div>
        )
}

