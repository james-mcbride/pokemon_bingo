import React, {useEffect} from "react";
import {Link} from "react-router-dom";
// import "../css/Profile.css"

const Profile = (props) =>{
    console.log(props);
    useEffect(()=>{
        if (props.user===null){
            window.location.replace("/login");
        }
    }, [])

    const renderedBingoCards = props.bingoCards.map(bingoCard=>{
        return (
            <a className="item active">
                {bingoCard.group.name}
            </a>
        )
    })

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
                                    This is an stretched grid column. This segment will always match the tab height
                                    <img src="https://static1.gamerantimages.com/wordpress/wp-content/uploads/2021/04/pokemon-card-backs.jpg"/>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column" id="bingoCards">
                        <img src="../img/PokemonBingo.png"/>
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