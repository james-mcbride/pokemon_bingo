import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import "../css/Profile.css"
import bingoImage from "../img/PokemonBingo.png"
import axios from "axios";
import { Button, Header, Image, Modal } from 'semantic-ui-react'


const Profile = (props) =>{
    console.log(props);
    const [selectedBingo, setSelectedBingo] = useState(null)
    const [bingoCards, setBingoCards] = useState([]);
    const [open, setOpen] = useState(false)
    const [pokemonCard, setPokemonCard]=useState(null)



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
                </a>
            )
    })
    const renderBingoLink = () =>{
        if (selectedBingo!==null){
            console.log("returning bingoCard link")
            return (
                <Link to={"/group/"+selectedBingo.group.id+"/bingo"}>
                    <div className="ui primary button" onClick={()=>props.onSelectBingoCard(selectedBingo)}>
                        View {selectedBingo.group.name}'s Bingo Card</div></Link>
            )
        } else if (selectedBingo==null & bingoCards.length>0){
            return (
                <Link to={"/group/"+bingoCards[0].group.id+"/bingo"}>
                    <div className="ui primary button" onClick={()=>props.onSelectBingoCard(bingoCards[0])}>
                        View Bingo Card</div></Link>
            )
        }else{
            return (
                <div></div>
            )
        }
    }

    const newPokemonCard = () => {

        axios.get(`http://localhost:8090/profile/${props.user.id}/draw?draw=yes`)
            .then(response=> {
                console.log(response)
                console.log(response.data)
                // console.log(response.data.card.imageURL);
                console.log(response.data[response.data.length-1])
                setPokemonCard(response.data.cards[response.data.cards.length-1].card.imageURL);
                props.onUpdateCards(response.data.cards);
            })
    }


    let modal = (
        <Modal
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
            open={open}
            trigger={<Button className="ui yellow button" onClick={()=>newPokemonCard()}>Draw Pokemon Card</Button>}
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

            <h2 className="ui header">
                <img src="https://s3.amazonaws.com/alumni.codeup.com/JamesMcBride.jpg" className="ui circular image" />
                {props.user.firstName + " "+ props.user.lastName}
                {modal}
                <Link to="/group/create">
                    <div className="ui right floated primary button">
                        Create Group</div></Link>
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
                                    <img src={bingoImage} id="bingoCardImage"/>
                                    {renderBingoLink()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="column" id="bingoCards">
                        <img src="https://static1.gamerantimages.com/wordpress/wp-content/uploads/2021/04/pokemon-card-backs.jpg"/>
                        <Link to="/profile/cards">
                            <div className="ui primary button">
                                Your Card Collection</div></Link>
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