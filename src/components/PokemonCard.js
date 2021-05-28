import React, {useEffect, useState} from 'react';
import cardBack from "../img/pokemon-card-back-2.png"

const PokemonCard = ({card, owner}) => {
    const [flipped, setFlipped] = useState("")
    const [backOfCard, setBackOfCard]=useState("")
    const [flippedStatus, setFlippedStatus] = useState(false)
    const [cardWidth, setCardWidth] = useState("100px");
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(()=>{
        let width=window.innerWidth;
        let height=window.innerHeight;
        if (width>=height) {
            setCardWidth(600 * width / (5 * 1000) + "px")
        } else{
            setCardWidth( width / 6 + "px")
        }
    }, [width])

    useEffect(()=>{
        let width=window.innerWidth;
        let height=window.innerHeight;
        if (width>=height) {
            setCardWidth(600 * width / (5 * 1000) + "px")
        } else{
            setCardWidth( width / 6 + "px")
        }
        if ((card.counter) || (card.groupMembers && card.groupMembers[owner]!==undefined && flippedStatus===false)){
            cardClick()
        }

    },[])

    useEffect(()=>{
        if ((card.counter) || (card.groupMembers && card.groupMembers[owner]!==undefined && flippedStatus===false)){
            cardClick()
        }else if ((card.groupMembers && !card.groupMembers[owner] && flippedStatus===true)){
            cardClick()
        }
    }, [owner])

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


    if (card===null||card===undefined){

        return (
            <a className="yellow card pokemonCard" style={{width: cardWidth}} >
                <div className="flip-card-inner " >
                    <div className="image flip-card-front">
                        <img className="ui wireframe image" src={cardBack} />
                    </div>
                </div>
            </a>
        )
    } else if(card.pokedexNumber){
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
                        <img className="ui wireframe image" src={card.imageURL}/>
                        {card.groupMembers[owner]!=undefined && card.groupMembers[owner]>1 ? <div className="cardCounter">{card.groupMembers[owner]}</div> : ""}
                    </div>
                </div>
            </a>
        )
    }else {
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
                        {card.counter>1 ? <div className="cardCounter">{card.counter}</div> : ""}
                    </div>
                </div>
            </a>
        )
    }
}

export default PokemonCard;