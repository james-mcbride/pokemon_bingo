import React, {useEffect, useState} from "react";
import "../css/Login.css"
import axios from "axios";
import {Redirect} from 'react-router-dom'


const CreateBingoCard = (props) =>{
    const [selected, setSelected] = useState(null)
    const[groups, setGroups] = useState([])
    const [redirect, setRedirect] = useState(false);

    useEffect(()=>{
        //will do a separate ajax call to get all bingo cards
        let url="http://localhost:8090/profile/"+props.user.id+"/bingoCard"
        axios.get(url)
            .then(response=> {
                console.log(response);
                // setGroups(response.data.groups);
                setGroups(response.data.groups);
                setSelected(response.data.groups[0].id)
            })
    },[])

    //will render the group options in the select dropdown
    const renderedGroupOptions=groups.map((group)=>{
        return (
            <option value={group.id} onSelect={()=>setSelected(group.id)}>
                {group.name}
            </option>
        )
    })

    const onSubmit = () =>{
        axios.get("http://localhost:8090/groups/"+selected+"/bingo", {
        })
            .then(response=> {
                console.log(response);
                props.onSelectBingoCard(response.data)
                setRedirect(true);
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
                            <select className="ui fluid dropdown">
                                {renderedGroupOptions}
                            </select>
                        </div>

                        <button className="ui button" type="button" onClick={() => onSubmit()}>Submit</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default CreateBingoCard;