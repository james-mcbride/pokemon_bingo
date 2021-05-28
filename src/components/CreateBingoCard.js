import React, {useEffect, useState} from "react";
import "../css/Login.css"
import axios from "axios";
import {Redirect} from 'react-router-dom'


const CreateBingoCard = (props) =>{
    const groupId=window.location.pathname.split("/")[2];


    const [selected, setSelected] = useState(null)
    const[groups, setGroups] = useState([])
    const [redirect, setRedirect] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(()=>{
        //will do a separate ajax call to get all bingo cards
        let url="http://localhost:8090/profile/"+props.user.id+"/bingoCard"
        axios.get(url)
            .then(response=> {

                // setGroups(response.data.groups);
                setGroups(response.data.groups);
                //will grab default group from url
                let defaultGroup=response.data.groups.filter(group=>group.id==groupId)[0]
                setSelected(defaultGroup.id)
            })
    },[])

    const onSelectGroup = (event)=>{
        console.log(event.target.value)
        setSelected(event.target.value)
    }

    //will render the group options in the select dropdown
    const renderedGroupOptions=groups.map((group)=>{
        return (
            <option value={group.id} >
                {group.name}
            </option>
        )
    })

    const onSubmit = () =>{
        console.log(selected)
        axios.get("http://localhost:8090/groups/"+selected+"/bingo", {
        })
            .then(response=> {
                //if bingoCard is more than 10 seconds old, then it is returning an old card because it is not done yet.
                let today=new Date();
                if (today.getTime()-response.data.createdAt>10000){
                    setErrorMessage("Can't generate new bingoCard before current one is finished")
                } else {
                    console.log(response);
                    props.onSelectBingoCard(response.data)
                    setRedirect(true);
                }
            })
    }

    if (redirect){
        return (<Redirect to={"/group/"+selected+"/bingo"} />)
    } else {
        return (
            <div id="flexContainer">
                <div id="formDiv">
                    <form className="ui form pokemonForm">
                        <div className="field">
                            <select className="ui fluid dropdown" onChange={event=>onSelectGroup(event)} value={selected}>
                                {renderedGroupOptions}
                            </select>
                        </div>

                        <button className="ui button" type="button" onClick={() => onSubmit()}>Submit</button>
                        <div style={{textAlign: "center", color: "red"}}>{errorMessage}</div>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateBingoCard;