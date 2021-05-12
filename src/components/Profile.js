import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "../css/Profile.css"

const Profile = (props) =>{
    console.log(props)
    const [selectedBingo, setSelectedBingo] = useState(null)



    useEffect(()=>{
        if (props.bingoCards.length>0) {
            setSelectedBingo(props.bingoCards[0])
        }

    }, [])

    const renderedBingoCards = props.bingoCards.map(bingoCard=>{
        return (
            <a className="item active">
                {bingoCard.group.name}
            </a>
        )
    })
    const renderBingoLink = () =>{
        props.onSelectBingoCard(selectedBingo)
        if (selectedBingo!==null){
            console.log("returning bingoCard link")
            return (
                <Link to={"/group/"+selectedBingo.group.id+"/bingo"}>
                    <div className="ui primary button">
                        View Bingo Card</div></Link>
            )
        } else{
            return (
                <div></div>
            )
        }
    }

    return (
        <div id="homeContainer">
            <h2 className="ui header">
                <img src="https://s3.amazonaws.com/alumni.codeup.com/JamesMcBride.jpg" className="ui circular image" />
                {props.user.firstName + " "+ props.user.lastName}
                <Link to="/bingo/create">
                    <div className="ui right floated primary button">
                        Create Bingo Card</div></Link>

            </h2>
            <div className="ui segment" id="profileMenu">
                <div className="ui two column very relaxed grid">
                    <div className="column" id="cardCollection">
                        <div className="ui grid">
                            <div className="four wide column">
                                <div className="ui vertical fluid tabular menu">
                                    {renderedBingoCards}

                                </div>
                            </div>
                            <div className="twelve wide stretched column">
                                <div className="ui segment">
                                    <img src="../img/PokemonBingo.png" id="bingoCardImage"/>
                                    {renderBingoLink()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column" id="bingoCards">
                        <img src="https://static1.gamerantimages.com/wordpress/wp-content/uploads/2021/04/pokemon-card-backs.jpg"/>
                    </div>
                </div>
                <div className="ui vertical divider">
                    and
                </div>
            </div>
        </div>
    )
}

export default Profile;