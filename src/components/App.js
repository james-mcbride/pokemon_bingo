import React, {Component, useState, useEffect} from 'react';
import {BrowserRouter, Route, Redirect, Link} from 'react-router-dom'
import BingoCard from "./BingoCard";
import pokemon from "pokemontcgsdk";
import axios from "axios";
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Profile from "./Profile";
import CreateBingoCard from "./CreateBingoCard";
import CreateGroup from "./CreateGroup";
import UserCards from "./UserCards";
import GroupProfile from "./GroupProfile";


export default()=>{
    const [user, setUser] = useState(null);
    const [selectedBingo, setSelectedBingo] = useState(null)
    const [userCards, setUserCards]= useState([]);


    useEffect(()=>{

        // pokemon.card.where({ q: 'set.id:base4' })
        //     .then(set=>{
        //         console.log(set);
        //         for (let card of set.data.slice(0,68)) {
        //             console.log(card.name, card.level, card.nationalPokedexNumbers.large, card.set.id)
        //             let url;
        //             if (card.nationalPokedexNumbers) {
        //                  url = "http://localhost:8090/newCard?cardName=" + card.name + "&imageUrl=" + card.images.large + "&deckSet=" + card.set.id + "&level=" + card.level + "&hp=" + card.hp + "&pokedexNumber=" + card.nationalPokedexNumbers[0];
        //             }
        //            axios.get(url)
        //                .then(response=>console.log(response))
        //         }
        //     });
        // let url="http://localhost:8090/profile/"+loggedInUser.id+"/groups"
        // axios.get(url)
        //     .then(response=> {
        //         console.log(response);
        //         setGroups(response.data)
        //     })




    },[])

    const onLogin = (loggedInUser) =>{
        setUser(loggedInUser)
        axios.get(`http://localhost:8090/profile/${loggedInUser.id}/draw?draw=no`)
            .then(response=> {
                onUpdateCards(response.data.cards);
            })
        //
        // //will do ajax call to internal api to get all users groups.
        // let url="http://localhost:8090/profile/"+loggedInUser.id+"/groups"
        // axios.get(url)
        //     .then(response=> {
        //         console.log(response);
        //         setGroups(response.data)
        //     })
    }

    const onUpdateCards= (cards) =>{
        setUserCards(cards);
    }

    const onSelectBingoCard = (bingoCard)=>{
        setSelectedBingo(bingoCard)
    }
        return (
            <div className="container" style={{height: "100%"}}>
                <BrowserRouter>
                    <div id="routerContainer">
                        <div className="ui menu green" style={{background: "green", marginBottom: 0}}>
                            {user!=null ? <Link to="/profile"><a className="item">Home</a></Link> : ""}
                            {user!=null ? <Link to="/profile/cards"><a className="item">View cards</a></Link> : ""}
                            {user!=null ? <Link to="/group/create"><a className="item">Create Group</a></Link> : ""}

                            <div className="right menu">
                                {user!=null ? "" : <Link to="/register"><a className="item">Sign up</a></Link>}
                                {user!=null ? "" : <Link to="/login"><a className="item">Log in</a></Link>}
                                {user!=null ? <a className="item" href="/login">Logout</a> :"" }

                            </div>
                        </div>
                        <Route exact path="/">
                            {user===null ? <Redirect to="/login" /> : <Home setUser={onLogin}/>}
                        </Route>
                        <Route exact path="/group/:id/bingo">
                            {user===null ? <Redirect to="/profile" /> : <BingoCard bingoCard={selectedBingo} user={user}/>}
                        </Route>
                        <Route exact path="/register">
                            {user!==null ? <Redirect to="/profile" /> : <Register setUser={onLogin}/>}
                        </Route>
                        <Route exact path="/login">
                            {user!==null ? <Redirect to="/profile" /> : <Login setUser={onLogin}/> }
                        </Route>
                        <Route exact path="/profile">
                            {user===null ? <Redirect to="/login" /> : <Profile setUser={onLogin} user={user}  onSelectBingoCard={onSelectBingoCard} onUpdateCards={onUpdateCards} userCards={userCards}/>}
                        </Route>
                        <Route exact path="/profile/cards">
                            {user===null ? <Redirect to="/login" /> : <UserCards cards={userCards} />}
                        </Route>
                        <Route exact path="/group/:id/bingo/create">
                            {user===null ? <Redirect to="/login" /> : <CreateBingoCard user={user} onSelectBingoCard={onSelectBingoCard} />}
                        </Route>
                        <Route exact path="/group/create">
                            {user===null ? <Redirect to="/login" /> : <CreateGroup user={user} onSelectBingoCard={onSelectBingoCard} />}
                        </Route>
                        <Route exact path="/group/:id">
                            {user===null ? <Redirect to="/login" /> : <GroupProfile user={user} onSelectBingoCard={onSelectBingoCard} />}
                        </Route>

                    </div>
                </BrowserRouter>
            </div>
        )
}

