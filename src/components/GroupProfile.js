import React, {useEffect, useState} from 'react';
import axios from "axios";
import {Link} from "react-router-dom";

const GroupProfile = (props) =>{
    const [groupMemberList, setGroupMemberList] = useState([]);
    const [group, setGroup] = useState(null)
    const [activeBingoCard, setActiveBingoCard]=useState(null);

    useEffect(()=>{
        const groupId=window.location.pathname.split("/")[2];
        let url="http://localhost:8090/group/"+groupId
        axios.get(url)
            .then(response=>{
                console.log(response)
                let  bingoCards=response.data.bingoCards;
                let groupMembers=response.data.group.groupMembers;

                for (let groupMember of groupMembers){
                    groupMember.numWins=0;
                }

                for (let bingoCard of bingoCards){
                    for (let groupMember of groupMembers){
                        if (bingoCard.winner===groupMember.username){
                            if (groupMember.numWins===0){
                                groupMember.numWins++
                            } else{
                                groupMember.numWins=1;
                            }
                        }
                    }
                }

                groupMembers.sort((a,b)=> b.numWins-a.numWins);
                console.log(groupMembers)

                //will set group and groupMembers to state
                setGroupMemberList(groupMembers)
                setGroup(response.data.group)

                //will check to see if there is an active bingoCard
                let activeBingoCardArray=bingoCards.filter(bingoCard=>!bingoCard.hasWinner)
                if (activeBingoCardArray.length>0){
                    setActiveBingoCard(activeBingoCardArray[0])
                }
            })
    },[])

    const renderGroupInfo=()=>{
            let groupMembers = groupMemberList.map(groupMember=>{
                console.log(groupMember)
                return (
                    <div className="item" style={groupMember.member.username===props.user.username ? {background: "green",borderRadius: "5px", padding: "5px",opacity: .8, display: "flex",width:"fit-content", float: "left"} : {display:"flex", width: "fit-content", float: "left"}}>
                        <div className="content">

                            <div className="header">
                                <div style={{width:40, height:35, overflow: "hidden", borderRadius: "50%", margin: "0 5px", float: "left"}}>
                                    <img src={groupMember.member.profilePicture} style={{objectFit:"cover", width: "100%"}}/>
                                </div>
                                {groupMember.member.firstName+" "+groupMember.member.lastName}</div>
                            {groupMember.numWins} {groupMember.numWins===1 ? "win" : "wins"}
                        </div>
                    </div>
                )
            })
        if (group!=null) {
            return (
                <div id="bingoGroupInfo">
                    <Link to={"/group/" + group.id}>
                        <h1 style={{color: "black", marginBottom: 5}}>{group.name}</h1>
                    </Link>
                    <div className="ui ordered horizontal list" id="groupMemberList" style={{height: 42}}>
                        {groupMembers}
                    </div>
                </div>
            )
        } else{
            return <div></div>
        }
    }

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

    const renderActiveBingoCard = () =>{
        console.log(activeBingoCard!=null)
        if (activeBingoCard!=null){
            let sortedGroupMembers=sortBingoCardGroupMembers(activeBingoCard);
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
                <div style={{display:"flex", flexDirection: "column", alignItems: "center", background: "white", margin: "0 auto", width: "fit-content", padding: 25, opacity: .9, borderRadius: 10, marginTop: 10}}>
                    <div className="ui ordered horizontal list" id="groupMemberList" style={{width: "fit-content"}}>
                        {displayGroupMembers}
                    </div>
                    <br />
                    {activeBingoCard.cards.length>0 ? <Link to={"/group/" + activeBingoCard.group.id + "/bingo"}>
                        <div className="ui primary button" onClick={() => props.onSelectBingoCard(activeBingoCard)}>
                            View Bingo Card
                        </div>
                    </Link> : ""}
                    {activeBingoCard.cards.length===0 ? <div className="bingoCard" >
                        <Link to={"/group/"+activeBingoCard.group.id+"/bingo/create"} >
                            <div className="ui primary button" >
                                Create First Bingo Card</div></Link>
                    </div> : ""}
                </div>
            )
        } else{
            return <div></div>
        }
    }


    return (
        <div>
            <div>{renderGroupInfo()}</div>
            {renderActiveBingoCard()}
        </div>

    )

}

export default GroupProfile;