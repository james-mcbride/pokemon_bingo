import React, {useEffect} from 'react';

import PokemonCard from './PokemonCard';
import "../css/BingoCard.css";
import CardRow from "./CardRow";
import cardBack from "../img/pokemon-card-back-2.png"



const UserCards = (props)=>{
    console.log(props.cards)
    let userCards = {}
    let cards=[]

    for (let card of props.cards) {
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
                cards.push(cardDuplicate)
            } else{
                cards.push({
                    id: i,
                    card: {
                        name: "pokemonBack",
                        imageURL: cardBack
                    }
                })
            }
        }
    console.log(cards);





    //creating blank array of length five
    let rowArray = [...Array(30)]
    let renderedRows = rowArray.map((row, i) => {
        return (
            <CardRow cards={cards.slice(i * 5, 5 * i + 5)}/>
        )
    })

    return (
        <div className="bingoCard">
            {renderedRows}
        </div>
    )
}

export default UserCards;