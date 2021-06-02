import React, {useEffect, useState} from 'react';

import PokemonCard from './PokemonCard';
import "../css/BingoCard.css";
import CardRow from "./CardRow";
import {Link} from "react-router-dom";
import axios from "axios";


const BingoCard = (props)=>{
    const groupId=window.location.pathname.split("/")[2];

    const [bingoPlayers, setBingoPlayers] = useState([])
    const [pokemonCards, setPokemonCards] = useState([])
    const [bingoCardOwner, setBingoCardOwner]= useState(props.user.username)
    const [bingoCardWinner, setBingoCardWinner]= useState(null);

    useEffect(()=>{

        if (props.bingoCard!=null) {
            //first will check to see if there was a winner.\
            if (props.bingoCard.winner){
                setBingoCardWinner(props.bingoCard.winner)
                setBingoCardOwner(props.bingoCard.winner)
            }

            //create an object with groupMembers in it, to track pokemon card matches later on.
            let groupMembers = [...props.bingoCard.group.groupMembers];
            let groupMemberObj = {};

            //create an object with each bingo card in it.
            let bingoCardObj = {}
            for (let card of props.bingoCard.cards) {
                card.card.groupMembers = {};
                bingoCardObj[card.card.pokedexNumber] = card.card;
            }

            //create an object with each groupmember in it.
            for (let groupMember of groupMembers) {
                groupMember.member.bingoMatches = 0;
                groupMemberObj[groupMember.id] = groupMember.member;

                //will check groupMember cards to see how many bingo matches they have.
                let groupMemberCards = props.bingoCard.groupMemberMatches[groupMember.id];
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

                //will only check for winner if there is no current winner

                if (props.bingoCard.winner==null||props.bingoCard.winner=="") {
                    //if the check for bingo winner function returns true, update page, and send an api call to update database
                    if (checkForBingoWinner(groupMemberCards, Object.values(bingoCardObj))) {
                        console.log("found a winner!")
                        setBingoCardWinner(groupMember.member.username)
                        let url="http://localhost:8090/groups/"+props.bingoCard.group.id+"/bingo/"+props.bingoCard.id+"/winner"
                        console.log(groupMember.member.username)
                        axios.post(url, {
                            winner: groupMember.member.username
                        })
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
            setPokemonCards(Object.values(bingoCardObj))
        }
    }, [])

    const checkForBingoWinner= (memberCards, bingoCards)=>{
        //first will load memberCards to object
        let memberCardsObj={};
        for (let cardId of memberCards){
            memberCardsObj[cardId]=true;
        }

        let bingoArray=[]
        for (let card of bingoCards){
            if (memberCardsObj[card.pokedexNumber]){
                bingoArray.push("X")
            } else{
                bingoArray.push ("")
            }
        }
        let multiBingoArray=[bingoArray.slice(0,5), bingoArray.slice(5,10), bingoArray.slice(10,15), bingoArray.slice(15,20), bingoArray.slice(20,25) ]
        console.log(multiBingoArray)
        //will check each row horizontally first
        for (let i=0; i<5; i++){
            let counter=0;
            for (let j=0; j<5; j++){
                if (multiBingoArray[i][j]==="X"){
                    counter++
                }
            }
            if (counter===5){
                return true;
            }
        }

        //will check each column for winner
        for (let i=0; i<5; i++){
            let counter=0;
            for (let j=0; j<5; j++){
                if (multiBingoArray[j][i]==="X"){
                    counter++
                }
            }
            if (counter===5){
                return true;
            }
        }

        //will check for winner diagonally top-left to bottom-right
        let diagonalCounter=0;
        for (let i=0, j=0; i<5;i++,j++){
            if (multiBingoArray[i][j]==="X"){
                diagonalCounter++
            }
        }
        if (diagonalCounter===5){
            return true;
        }

        //will check for winner diagonally bottom-right to top-left
         diagonalCounter=0;
        for (let i=4, j=4; i>=0;i--,j--){
            if (multiBingoArray[i][j]==="X"){
                diagonalCounter++
            }
        }
        if (diagonalCounter===5){
            return true;
        }


        return false;
    }



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
                    console.log(groupMember)
                    return (
                        <div className="item" style={groupMember.username===bingoCardOwner ? {background: "green",borderRadius: "5px", padding: "5px",opacity: .8, display: "flex",width:"fit-content", float: "left"} : {display:"flex", width: "fit-content", float: "left"}} onClick={()=>setBingoCardOwner(groupMember.username)}>
                            <div className="content">

                                <div className="header">
                                    <div style={{width:40, height:35, overflow: "hidden", borderRadius: "50%", margin: "0 5px", float: "left"}}>
                                        <img src={groupMember.profilePicture} style={{objectFit:"cover", width: "100%"}}/>
                                    </div>
                                    {groupMember.firstName+" "+groupMember.lastName}</div>
                                {bingoCardWinner===groupMember.username ? <strong>Winner<br /></strong> : ""}
                                {groupMember.bingoMatches} {groupMember.bingoMatches===1 ? "match" : "matches"}
                            </div>
                        </div>
                    )
                })
                return (
                    <div id="bingoGroupInfo">
                        <Link to={"/group/" + props.bingoCard.group.id}>
                            <h1 style={{color: "black", marginBottom: 5}}>{props.bingoCard.group.name}</h1>
                        </Link>
                        <div className="ui ordered horizontal list" id="groupMemberList" style={{height:42}}>
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
                <Link to={"/group/"+groupId+"/bingo/create"}>
                    <div className="ui primary button">
                        Create Bingo Card</div></Link>
            </div>
        )
    }
}

export default BingoCard;




