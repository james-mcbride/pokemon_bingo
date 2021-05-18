import React, {useEffect, useState} from 'react';

import PokemonCard from './PokemonCard';
import "../css/BingoCard.css";
import CardRow from "./CardRow";
import {Link} from "react-router-dom";


const BingoCard = (props)=>{
    console.log(props)

    const [bingoPlayers, setBingoPlayers] = useState([])
    const [pokemonCards, setPokemonCards] = useState([])
    const [bingoCardOwner, setBingoCardOwner]= useState(props.user.username)

    useEffect(()=>{
        if (props.bingoCard!=null) {
            //create an object with groupMembers in it, to track pokemon card matches later on.
            let groupMembers = [...props.bingoCard.group.groupMembers];
            let groupMemberObj = {};

            //create an object with each bingo card in it.
            let bingoCardObj = {}
            for (let card of props.bingoCard.cards) {
                card.card.groupMembers = {};
                bingoCardObj[card.card.pokedexNumber] = card.card;
            }

            console.log(bingoCardObj);


            //create an object with each groupmember in it.
            for (let groupMember of groupMembers) {
                groupMember.member.bingoMatches = 0;
                groupMemberObj[groupMember.id] = groupMember.member;

                //will check groupMember cards to see how many bingo matches they have.
                let groupMemberCards = props.bingoCard.groupMemberMatches[groupMember.id];
                console.log(groupMemberCards)
                for (let cardId of groupMemberCards) {
                    if (bingoCardObj[cardId]) {
                        if (bingoCardObj[cardId].groupMembers && bingoCardObj[cardId].groupMembers[groupMember.member.username] > 0) {
                            bingoCardObj[cardId].groupMembers[groupMember.member.username]++;
                        } else {
                            //will update group member matches
                            groupMemberObj[groupMember.id].bingoMatches++;
                            bingoCardObj[cardId].groupMembers[groupMember.member.username] = 1;
                        }
                    }
                }

            }

            //will sort group members by number of pokemon card matches
            let updatedGroupMembers = Object.values(groupMemberObj);
            let sortedGroupMembers = updatedGroupMembers.sort(function (a, b) {
                return b.bingoMatches - a.bingoMatches
            })
            setBingoPlayers(sortedGroupMembers)

            //will set pokemon cards that have groupMember matches tied to them to the state
            console.log(bingoCardObj)
            setPokemonCards(Object.values(bingoCardObj))
            console.log(pokemonCards)
        }
    }, [])

    if (props.bingoCard!==null) {
        let cards=[]
        if (pokemonCards.length===0){
            Array.apply(null, Array(25)).map(()=>"")
        } else{
            cards=pokemonCards;
        }

        //creating blank array of length five
        let rowArray = [...Array(5)]
        let renderedRows = rowArray.map((row, i) => {
            return (
                <CardRow cards={cards.slice(i * 5, 5 * i + 5)} owner={bingoCardOwner}/>
            )
        })

        const renderGroupInfo=()=>{
            if (props.bingoCard!=null){
                let groupMembers = bingoPlayers.map(groupMember=>{
                    return (
                        <div className="item" style={groupMember.username===bingoCardOwner ? {background: "green",borderRadius: "5px", padding: "5px",opacity: .8, display: "flex",width:"fit-content", float: "left"} : {display:"flex", width: "fit-content", float: "left"}} onClick={()=>setBingoCardOwner(groupMember.username)}>
                            <div className="content">

                                <div className="header">
                                    <div style={{width:40, height:35, overflow: "hidden", borderRadius: "50%", margin: "0 5px", float: "left"}}>
                                        <img src={groupMember.profilePicture} style={{objectFit:"cover", width: "100%"}}/>
                                    </div>
                                    {groupMember.firstName+" "+groupMember.lastName}</div>
                                {groupMember.bingoMatches} {groupMember.bingoMatches===1 ? "match" : "matches"}
                            </div>
                        </div>
                    )
                })
                return (
                    <div id="bingoGroupInfo">
                        <h1>{props.bingoCard.group.name}</h1>
                        <div className="ui ordered horizontal list" id="groupMemberList">
                            {groupMembers}
                        </div>
                    </div>
                )
            } else{
                return <div></div>
            }
        }

        return (
            <div className="bingoCard">
                {renderGroupInfo()}
                {renderedRows}
            </div>
        )
    } else{
        return (
            <div className="bingoCard">
                Create first Bingo Card!
                <Link to="/bingo/create">
                    <div className="ui primary button">
                        Create Bingo Card</div></Link>
            </div>
        )
    }
}

export default BingoCard;




