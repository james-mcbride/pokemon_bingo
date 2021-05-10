import React from 'react';
import PokemonCard from "./components/PokemonCard";

const CardRow = ({cards})=>{
    let renderedCards=cards.map(card=>{
        return (
            <PokemonCard card={card} style={{height: "100%"}}/>
        )
    })
    return (
        <div className="bingoRow">
            {renderedCards}
        </div>
    )
}

export default CardRow;