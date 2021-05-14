import React, {useEffect} from 'react';

import PokemonCard from './PokemonCard';
import "../css/BingoCard.css";
import CardRow from "./CardRow";
import {Link} from "react-router-dom";


const BingoCard = (props)=>{
    console.log(props)
    if (props.bingoCard!==null) {
        let cards = props.bingoCard.cards;

        //creating blank array of length five
        let rowArray = [...Array(5)]
        let renderedRows = rowArray.map((row, i) => {
            return (
                <CardRow cards={cards.slice(i * 5, 5 * i + 5)}/>
            )
        })

        const renderGroupInfo=()=>{
            if (props.bingoCard!=null){
                let groupMembers = props.bingoCard.group.groupMembers.map(groupMember=>{
                    return (
                        <div className="item">
                            <img className="ui avatar image" src="https://s3.amazonaws.com/alumni.codeup.com/JamesMcBride.jpg"/>
                            <div className="content">
                                <div className="header">{groupMember.member.firstName+" "+groupMember.member.lastName}</div>
                                {groupMember.member.username}
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




