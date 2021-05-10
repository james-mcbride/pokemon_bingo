import React, {useEffect} from 'react';

import PokemonCard from './PokemonCard';
import "../css/BingoCard.css";
import CardRow from "../CardRow";


const BingoCard = ({cards, user})=>{



    //creating blank array of length five
    let rowArray=[...Array(5)]
    let  renderedRows = rowArray.map((row, i)=>{
        return (
            <CardRow cards={cards.slice(i*5, 5*i+5)} />
        )
    })
    console.log(user)




    return (
        <div className="bingoCard">
            {renderedRows}
        </div>
    )
}

export default BingoCard;



