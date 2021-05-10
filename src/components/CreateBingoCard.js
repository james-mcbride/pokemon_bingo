import React, {useState} from "react";
import "../css/Login.css"
import axios from "axios";
import {Redirect} from 'react-router-dom'


const CreateBingoCard = (props) =>{
    const [selected, setSelected] = useState(props.groups[0].id)

    //will render the group options in the select dropdown
    const renderedGroupOptions=props.groups.map((group)=>{
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
            })
    }

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

export default CreateBingoCard;