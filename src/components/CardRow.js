import React from 'react';
import PokemonCard from "./PokemonCard";

const CardRow = ({cards, owner})=>{
    const [url, setUrl]=React.useState("")

    React.useEffect(()=>{
        setUrl(window.location.href)
    })
    let renderedCards=cards.map(card=>{
        return (
            <PokemonCard card={card} style={{height: "100%"}} owner={owner}/>
        )
    })
    return (
        <div className="bingoRow" style={url.indexOf("/cards")!==-1 ? {height:"3.33%"} : {height:"17%"}}>
            {renderedCards}
        </div>
    )
}

export default CardRow;