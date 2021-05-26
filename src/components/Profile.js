import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "../css/Profile.css"
import bingoImage from "../img/PokemonBingo.png"
import drawsRemaining from "../img/pokemon_draws_remaining.png"
import axios from "axios";
import { Button, Header, Image, Modal } from 'semantic-ui-react'
import cardBack from "../img/pokemon-card-back-2.png";


const Profile = (props) =>{
    console.log(props);
    const [selectedBingo, setSelectedBingo] = useState(null)
    const [bingoCards, setBingoCards] = useState([]);
    const [open, setOpen] = useState(false)
    const [pokemonCard, setPokemonCard]=useState(null)
    const [numCards, setNumCards] = useState(0);
    const [uniqueCards, setUniqueCards] = useState(0)



    useEffect(()=>{
        //will do a separate ajax call to get all bingo cards
        let url="http://localhost:8090/profile/"+props.user.id+"/bingoCard"
        axios.get(url)
            .then(response=> {
                console.log(response);
                // setGroups(response.data.groups);
                setBingoCards(response.data.bingoCards)
            })



    },[])

    useEffect(()=>{
        setNumCards(props.userCards.length)

        // will loop through user cards and count unqiue ones
        let userCardObj={};
        let counter=0;
        for (let card of props.userCards){
            if (userCardObj[card.card.name]){
            } else{
                userCardObj[card.card.name]=1
                counter++
            }
        }
        setUniqueCards(counter)

    },[props.userCards])

    const renderedBingoCards = bingoCards.map((bingoCard,index)=>{
        let tabIsActive="";
        if (selectedBingo!=null) {
            if (bingoCard.id === selectedBingo.id) {
                tabIsActive = "active";
            }
        } else if (selectedBingo==null & bingoCards.length>0 && index===0){
            tabIsActive="active"
        }

            return (
                <a className={"item "+tabIsActive} onClick={()=>setSelectedBingo(bingoCard)}>
                    {bingoCard.group.name}
                    {bingoCard.notification? <i style={{color: "red",fontSize: "large"}} className="exclamation circle icon"></i> : ""}
                </a>
            )
    })

    const sortBingoCardGroupMembers = (bingoCard) =>{
        console.log(bingoCard)
        //create an object with groupMembers in it, to track pokemon card matches later on.
        let groupMembers = bingoCard.group.groupMembers;
        console.log(groupMembers)
        let groupMemberObj = {};

        //create an object with each bingo card in it.
        let bingoCardObj = {}
        for (let card of bingoCard.cards) {
            card.card.groupMembers = {};
            bingoCardObj[card.card.pokedexNumber] = card.card;
        }

        console.log(bingoCardObj);


        //create an object with each groupmember in it.
        for (let groupMember of groupMembers) {
            console.log(groupMember)
            groupMember.member.bingoMatches = 0;
            groupMemberObj[groupMember.id] = groupMember.member;

            //will check groupMember cards to see how many bingo matches they have.
            let groupMemberCards = bingoCard.groupMemberMatches[groupMember.id];
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
        return updatedGroupMembers.sort(function (a, b) {
            return b.bingoMatches - a.bingoMatches
        })

    }

    const renderBingoLink = () =>{
        if (bingoCards.length>0){
            let bingoCard;
            if (selectedBingo !== null) {
                bingoCard=selectedBingo;
            } else if (selectedBingo == null & bingoCards.length > 0) {
                bingoCard=bingoCards[0]
            }
            let sortedGroupMembers=sortBingoCardGroupMembers(bingoCard);
            console.log(sortedGroupMembers)
            let displayGroupMembers=sortedGroupMembers.map(groupMember=>{
                return (
                    <div className="item" style={groupMember.username===props.user.username ? {background: "green",borderRadius: "5px", padding: "5px",opacity: .8, display: "flex",width:"fit-content", margin: "5px 0"} : {display:"flex", width: "fit-content", margin: "5px 0"}} >
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
                <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                    <div className="ui ordered horizontal list" id="groupMemberList" style={{width: "fit-content"}}>
                        {displayGroupMembers}
                    </div>
                    <br />
                    <Link to={"/group/" + bingoCard.group.id + "/bingo"}>
                        <div className="ui primary button" onClick={() => props.onSelectBingoCard(bingoCard)}>
                            View {bingoCard.group.name}'s Bingo Card
                        </div>
                    </Link>
                </div>
            )
        }else{
            return (
                <div></div>
            )
        }
    }

    const newPokemonCard = () => {
        setPokemonCard(cardBack)

        axios.get(`http://localhost:8090/profile/${props.user.id}/draw?draw=yes`)
            .then(response=> {
                console.log(response.data)
                setPokemonCard(response.data.cards[response.data.cards.length-1].card.imageURL);
                props.onUpdateCards(response.data.cards);

                //after drawing new pokemon card, all bingo cards that have a match ar returned, will update the bingo cards on screen with these matches.
                if (response.data.bingoMatches && response.data.bingoMatches.length>0){
                    console.log("we have a match")
                    let updatedBingoCards=response.data.bingoMatches;
                    let updatedBingoCardsObj={}
                    for (let bingoCard of updatedBingoCards){
                        bingoCard.notification=true;
                        updatedBingoCardsObj[bingoCard.id]=bingoCard;
                    }
                    console.log(updatedBingoCardsObj)

                    //making a copy of state bingoCards
                    let currentBingoCards=[...bingoCards];

                    //loop through bingo card array from copy above, and update indexes that have a match.
                    let updatedStateBingoCards=currentBingoCards.map(bingoCard=>{
                        if (updatedBingoCardsObj[bingoCard.id]){
                            console.log("we have found our match and will update now")
                            return updatedBingoCardsObj[bingoCard.id]
                        } else{
                            return bingoCard
                        }

                    })
                    console.log(updatedStateBingoCards)
                    setBingoCards(updatedStateBingoCards)
                }
            })
    }


    let modal = (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button className="ui yellow button" style={{color: "blue"}} onClick={()=>newPokemonCard()}>Draw Pokemon Card</Button>}
        >
            <Modal.Header>New Pokemon Card</Modal.Header>
            <Modal.Content image>
                <Image size='large' src={pokemonCard} style={{textAlign: "center",marginLeft: "auto", marginRight: "auto",height: "500px", objectFit: "contain"}} />
                {/*<div className="image content"><img src={pokemonCard} className="ui large image" style="height: 500px;"/></div>*/}

                {/*<Modal.Description>*/}
                {/*    <Header>Default Profile Image</Header>*/}
                {/*    <p>*/}
                {/*        We've found the following gravatar image associated with your e-mail*/}
                {/*        address.*/}
                {/*    </p>*/}
                {/*    <p>Is it okay to use this photo?</p>*/}
                {/*</Modal.Description>*/}
            </Modal.Content>
            <Modal.Actions style={{textAlign: "center"}}>
                <Button color='black'  onClick={() => setOpen(false)}>
                    Return Home
                </Button>
            </Modal.Actions>
        </Modal>
    )

    return (
        <div id="homeContainer">
            <div id="profileUserDetails">
                <div id="profileImage">
                    <div style={{
                        width: 150,
                        height: 130,
                        overflow: "hidden",
                        borderRadius: "50%",
                        margin: "0 auto",
                        textAlign:"center",
                        border: "3px solid gold"
                    }}>
                        <img src={props.user.profilePicture} style={{objectFit: "cover", width: "100%"}}/>
                    </div>
                    <h3 style={{textAlign: "center", marginTop: 10}}>{props.user.firstName + " " + props.user.lastName}</h3>
                </div>
                 <div id="drawCards">
                     <div id="remainingCards">
                         <div>
                             <h1 id="remainingCardsCounter">{5}</h1>
                             <div style={{padding:10}}>
                                 <img src={drawsRemaining} style={{width: 200}} />
                             </div>
                             {modal}
                         </div>

                     </div>

                 </div>
            </div>
            <div id="userCardStats">
                <div className="ui statistics" style={{alignItems: "center"}}>
                    <div className="statistic">
                        <div className="value">
                            {numCards}
                        </div>
                        <div className="label">
                            Cards Drawn
                        </div>
                    </div>
                    <div className="statistics">
                        <Link to="/profile/cards">
                            <button className="ui red button">View<br/> Collection!</button>
                        </Link>
                    </div>
                    <div className="statistic">
                        <div className="value">
                            <img src="https://cdn.pixabay.com/photo/2019/11/27/14/06/pokemon-4657023_1280.png" className="ui circular inline image" />
                            {uniqueCards}
                        </div>
                        <div className="label">
                            Unique Pokemon
                        </div>
                    </div>
                </div>
            </div>
            <div className="profilePaths" id="cardCollection">
                <h2 style={{textAlign: "center"}}>Your Bingo Cards</h2>
                <div className="ui grid" style={{margin: 0}}>
                    <div className="four wide column">
                        <div className="ui vertical fluid tabular menu" style={{borderRight: "none"}}>
                            {renderedBingoCards}

                        </div>
                    </div>
                    <div className="twelve wide stretched column">
                        <div className="ui segment">
                                {renderBingoLink()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;

