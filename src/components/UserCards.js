import React, {useEffect, useState} from 'react';

import PokemonCard from './PokemonCard';
import "../css/BingoCard.css";
import CardRow from "./CardRow";
import cardBack from "../img/pokemon-card-back-2.png"
import audio from "../files/109-pewter city's theme.mp3";
import axios from "axios";


const UserCards = (props)=>{
    const userId = window.location.pathname.split("/")[2];
    let [renderedRows, setRenderedRows] = useState("")
    useEffect(()=>{
        const userId = window.location.pathname.split("/")[2];
        axios.get(`http://localhost:8090/profile/${userId}/draw?draw=no`)
            .then(response=> {
                setUserCards(response.data.cards)
            })
    },[])

    const setUserCards = (profileCards) =>{
        let userCards = {}
        let cardDeck=[]
        for (let card of profileCards) {
            if (userCards[card.card.pokedexNumber]) {
                userCards[card.card.pokedexNumber].counter++
            } else {
                userCards[card.card.pokedexNumber] = {
                    card: card,
                    counter: 1
                }
            }
        }
        for (let i=1; i<151; i++){
            if (userCards[i]){
                let cardDuplicate={...userCards[i].card}
                cardDuplicate.counter=userCards[i].counter;
                cardDeck.push(cardDuplicate)
            } else{
                cardDeck.push({
                    id: i,
                    card: {
                        name: "pokemonBack",
                        imageURL: cardBack
                    }
                })
            }
        }
        console.log(cardDeck)
        //creating blank array of length five
        let rowArray = [...Array(30)]
        let renderedRowsArray = rowArray.map((row, i) => {
            return (
                <CardRow cards={cardDeck.slice(i * 5, 5 * i + 5)} />
            )
        })
        setRenderedRows(renderedRowsArray)
    }

    console.log(renderedRows)
    return (
        <div className="bingoCard" style={{height:"600%", background: "url(https://www.wallpapertip.com/wmimgs/167-1670207_play-nintendo-com-wallpaper-pokemon-red-blue-iphone.jpg)", backgroundSize: "contain"}}>
            <audio autoPlay loop>
                <source src={audio} type="audio/mpeg"/>
            </audio>
            {renderedRows}
        </div>
    )
}

export default UserCards;