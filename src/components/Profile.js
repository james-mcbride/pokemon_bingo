import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "../css/Profile.css"
import bingoImage from "../img/PokemonBingo.png"
import drawsRemainingImage from "../img/pokemon_draws_remaining.png"
import axios from "axios";
import { Button, Header, Image, Modal, Transition } from 'semantic-ui-react'
import cardBack from "../img/pokemon-card-back-2.png";
import audio from "../files/106-the road to viridian city - from palette.mp3"
import cardDraw from "../files/108-victory (vs wild pokemon).mp3"


const Profile = (props) =>{
    const [selectedBingo, setSelectedBingo] = useState(null)
    const [bingoCards, setBingoCards] = useState([]);
    const [open, setOpen] = useState(false)
    const [pokemonCard, setPokemonCard]=useState(null)
    const [numCards, setNumCards] = useState(0);
    const [uniqueCards, setUniqueCards] = useState(0)
    const [drawsRemaining, setDrawsRemaining] = useState(5);
    const [visible, setVisible] = useState(true);
    const [animation, setAnimation] = useState("shake")
    const audioFile = document.getElementById("cardDrawAudio")
    const backgroundAudio = document.getElementById("backgroundMusic")
    const [isUsersProfile, setIsUsersProfile] = useState(false)
    const [profileOwnerId, setProfileOwnerId] = useState(null)
    const [cards, setCards] = useState([])
    const [user, setUser] = useState([])

    useEffect(()=>{
        //will do a separate ajax call to get all bingo cards
        if (props.user) {
            const userId = window.location.pathname.split("/")[2];
            setIsUsersProfile(props.user.id == userId)
            let url = "http://localhost:8090/profile/" + userId + "/bingoCard"
            axios.get(url)
                .then(response => {
                    console.log(response);
                    let dbBingoCards = response.data.bingoCards;
                    //will add all bingoCard groups to obj
                    let bingoObj = {};
                    let lastBingoCardId;
                    if (dbBingoCards.length > 0) {
                        lastBingoCardId = dbBingoCards[0].id
                    } else {
                        lastBingoCardId = 0;
                    }
                    for (let bingoCard of dbBingoCards) {
                        bingoObj[bingoCard.group.id] = true;
                    }

                    //will check to see if group has bingoCard, if not, will generate empty one to show group info.
                    let groups = response.data.groups;
                    for (let group of groups) {
                        if (!bingoObj[group.id]) {
                            lastBingoCardId++;
                            let newBingoObj = {
                                group: group,
                                groupMemberMatches: {},
                                cards: [],
                                id: lastBingoCardId
                            }
                            for (let groupMember of group.groupMembers) {
                                newBingoObj.groupMemberMatches[groupMember.id] = []
                            }
                            dbBingoCards.push(newBingoObj)
                        }

                    }
                    setBingoCards(response.data.bingoCards)
                })
            if (!isUsersProfile){
                axios.get("http://localhost:8090/profile/"+userId)
                    .then(response => {
                        console.log(response)
                        setUser(response.data.user)
                        setCards(response.data.cards)
                    })
            } else{
                setCards(props.userCards);
                setUser(props.user)
            }

        }
    },[props.user, profileOwnerId, props.userCards])

    useEffect(()=>{
        let currentUrlProfileId=window.location.pathname.split("/")[2]
        if (profileOwnerId!==currentUrlProfileId){
            setProfileOwnerId(currentUrlProfileId)
        }
    }, [profileOwnerId])


    useEffect(()=>{
        setNumCards(cards.length)

        // will loop through user cards and count unqiue ones
        let userCardObj={};
        let counter=0;
        for (let card of cards){
            if (userCardObj[card.card.name]){
            } else{
                userCardObj[card.card.name]=1
                counter++
            }
        }
        setUniqueCards(counter)

        //now will check to see if cards are remaining to draw today
        // let date = new Date(props.userCards[props.userCards.length-1].createdAt)
        // console.log(date)
        let today=new Date();
        let currentDate = today.toString().split(" ").slice(0,3).join(" ")
        let todaysDrawnCards=cards.filter(card=>{
            let cardTime = new Date(card.createdAt);
            let cardDate=cardTime.toString().split(" ").slice(0,3).join(" ");
            return currentDate===cardDate;
        })
        console.log(todaysDrawnCards.length)
        setDrawsRemaining(5-todaysDrawnCards.length);


    },[cards])
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
        //create an object with groupMembers in it, to track pokemon card matches later on.
        let groupMembers = bingoCard.group.groupMembers;
        let groupMemberObj = {};

        //create an object with each bingo card in it.
        let bingoCardObj = {}
        for (let card of bingoCard.cards) {
            card.card.groupMembers = {};
            bingoCardObj[card.card.pokedexNumber] = card.card;
        }



        //create an object with each groupmember in it.
        for (let groupMember of groupMembers) {
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



    const closeModal=()=>{
        console.log("changing animation to shake")
        setAnimation("shake")
        setOpen(false);
        audioFile.pause()
        setTimeout(function(){
            backgroundAudio.play()

        },200)
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
            let displayGroupMembers=sortedGroupMembers.map(groupMember=>{
                return (
                    <div className="item" style={groupMember.username===user.username ? {background: "green",borderRadius: "5px", padding: "5px",opacity: .8, display: "flex",width:"fit-content", margin: "5px 0"} : {display:"flex", width: "fit-content", margin: "5px 0", fontSize:'medium'}} >
                        <div className="content">

                            <a href={"/profile/"+groupMember.id} >
                                <div className="header">
                                <div style={{width:40, height:35, overflow: "hidden", borderRadius: "50%", margin: "0 5px", float: "left"}}>
                                    <img src={groupMember.profilePicture} style={{objectFit:"cover", width: "100%"}}/>
                                </div>
                                {groupMember.firstName+" "+groupMember.lastName}</div>
                            </a>
                            {groupMember.bingoMatches} {groupMember.bingoMatches===1 ? "match" : "matches"}
                        </div>
                    </div>
                )
            })
            return (
                <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                    <Link to={"/group/" + bingoCard.group.id}>
                        <h1>{bingoCard.group.name}</h1>
                    </Link>
                    <div className="ui ordered horizontal list" id="groupMemberList" style={{width: "fit-content"}}>
                        {displayGroupMembers}
                    </div>
                    <br />
                    {bingoCard.cards.length>0 ? <Link to={"/group/" + bingoCard.group.id + "/bingo"}>
                        <div className="ui primary button" onClick={() => props.onSelectBingoCard(bingoCard)}>
                            View Bingo Card
                        </div>
                    </Link> : ""}
                    {bingoCard.cards.length===0 ? <div className="bingoCard" >
                        <Link to={"/group/"+bingoCard.group.id+"/bingo/create"} >
                            <div className="ui primary button" >
                                Create First Bingo Card</div></Link>
                    </div> : ""}
                </div>
            )
        }else{
            return (
                <div></div>
            )
        }
    }

    const newPokemonCard = () => {

        backgroundAudio.pause()
        audioFile.currentTime = 0;
        audioFile.play()
        setAnimation("shake")
        setPokemonCard(cardBack)


        setTimeout(()=>{

        axios.get(`http://localhost:8090/profile/${user.id}/draw?draw=yes`)
            .then(response=> {

                setPokemonCard(response.data.cards[response.data.cards.length-1].card.imageURL);
                setTimeout(()=> {
                    setAnimation("tada")
                },200)
                props.onUpdateCards(response.data.cards);

                //after drawing new pokemon card, all bingo cards that have a match ar returned, will update the bingo cards on screen with these matches.
                if (response.data.bingoMatches && response.data.bingoMatches.length>0){
                    let updatedBingoCards=response.data.bingoMatches;
                    let updatedBingoCardsObj={}
                    for (let bingoCard of updatedBingoCards){
                        bingoCard.notification=true;
                        updatedBingoCardsObj[bingoCard.id]=bingoCard;
                    }

                    //making a copy of state bingoCards
                    let currentBingoCards=[...bingoCards];

                    //loop through bingo card array from copy above, and update indexes that have a match.
                    let updatedStateBingoCards=currentBingoCards.map(bingoCard=>{
                        if (updatedBingoCardsObj[bingoCard.id]){
                            return updatedBingoCardsObj[bingoCard.id]
                        } else{
                            return bingoCard
                        }

                    })
                    setBingoCards(updatedStateBingoCards)
                }
            })
        },1500)

    }


    let modal = (
        <Modal
            onClose={() => closeModal}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button className="ui yellow button" style={{color: "blue"}} onClick={()=>newPokemonCard()} disabled={drawsRemaining===0 || !isUsersProfile}>Draw Pokemon Card</Button>}
        >
            <Modal.Header>New Pokemon Card</Modal.Header>
            <Modal.Content image>
                <Transition visible={visible} animation={animation} duration={1500}>
                    <Image className="ui small image scale visible transition" id="pokemonCardImage" size='large' src={pokemonCard} style={{textAlign: "center",marginLeft: "auto", marginRight: "auto",height: "500px", objectFit: "contain"}} />
                 </Transition>
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
                <Button color='black'  onClick={() => closeModal()}>
                    Return Home
                </Button>
            </Modal.Actions>
        </Modal>
    )
    if (user) {
        return (
            <div id="homeContainer">
                <audio autoPlay loop id="backgroundMusic" controls>
                    <source src={audio} type="audio/mpeg"/>
                </audio>
                <audio id="cardDrawAudio">
                    <source src={cardDraw} type="audio/mpeg"/>
                </audio>
                <div id="profileUserDetails">
                    <div id="profileImage">
                        <div style={{
                            width: 150,
                            height: 130,
                            overflow: "hidden",
                            borderRadius: "50%",
                            margin: "0 auto",
                            textAlign: "center",
                            border: "3px solid gold"
                        }}>
                            <img src={user.profilePicture} style={{objectFit: "cover", width: "100%"}}/>
                        </div>
                        <h3 style={{
                            textAlign: "center",
                            marginTop: 10
                        }}>{user.firstName + " " + user.lastName}</h3>
                    </div>
                    <div id="drawCards">
                        <div id="remainingCards">
                            <div>
                                <h1 id="remainingCardsCounter">{drawsRemaining}</h1>
                                <div style={{padding: 10}}>
                                    <img src={drawsRemainingImage} style={{width: 200}}/>
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
                            <Link to={"/profile/"+user.id+"/cards"}>
                                <button className="ui red button">View<br/> Collection!</button>
                            </Link>
                        </div>
                        <div className="statistic">
                            <div className="value">
                                <img src="https://cdn.pixabay.com/photo/2019/11/27/14/06/pokemon-4657023_1280.png"
                                     className="ui circular inline image"/>
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
                    <div className="ui grid" style={{margin: 0, minHeight:400}}>
                        <div className="four wide column" style={{overflowY: "scroll"}}>
                            <div className="ui vertical fluid tabular menu"
                                 style={{borderRight: "none", position: "absolute"}}>
                                {renderedBingoCards}

                            </div>
                        </div>
                        <div className="twelve wide stretched column" style={{height: "fit-content"}}>
                            <div className="ui segment">
                                {renderBingoLink()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else{
        return <div></div>
    }
}

export default Profile;

