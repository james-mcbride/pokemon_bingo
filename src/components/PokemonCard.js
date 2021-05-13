import React, {useEffect, useState} from 'react';
import cardBack from "../img/pokemon-card-back-2.png"

const PokemonCard = ({card}) => {
    console.log(card)

    const [flipped, setFlipped] = useState("")
    const [backOfCard, setBackOfCard]=useState("")
    const [flippedStatus, setFlippedStatus] = useState(false)
    const [cardWidth, setCardWidth] = useState("100px");

    useEffect(()=>{
        let height=window.innerWidth;
        setCardWidth(600*height/(5*1000)+"px")
    },[])

    let cardClick=()=>{
        if (!flippedStatus){
            setFlipped("flipCardOver")
            setFlippedStatus(true);
            setTimeout(function(){setBackOfCard("backOfCardFlippedOver")}, 500)
        } else{
            setBackOfCard("")
            setFlipped("")
            setFlippedStatus(false);
        }
    }



    if (card===null){
        return (
            <a className="yellow card pokemonCard" style={{width: cardWidth}} >
                <div className="flip-card-inner " >
                    <div className="image flip-card-front">
                        <img className="ui wireframe image" src={cardBack} />
                    </div>
                </div>
            </a>
        )
    } else {
        console.log(card.card.imageURL)
        return (
            <a className="yellow card pokemonCard flip-card" style={{width: cardWidth}}>
                <div
                    className={"flip-card-inner "+flipped}
                     onClick={()=>cardClick()}
                    //  onMouseEnter={()=>setFlipped("flipCardOver")}
                    // onMouseLeave={()=>setFlipped("")}
                >
                    <div className="image flip-card-front">
                        <img className={"ui wireframe image " +backOfCard} src={cardBack} alt="cardBack"/>
                    </div>
                    <div className="image flip-card-back">
                        <img className="ui wireframe image" src={card.card.imageURL}/>
                    </div>
                </div>
            </a>
        )
    }
}

export default PokemonCard;