import React, {useEffect, useState} from "react";
import "../css/Login.css"
import axios from "axios";
import {Redirect} from 'react-router-dom'


const Login = (props) =>{
    const [groupName, setGroupName] =useState("");
    const [name, setName] =useState("");
    const [currentInterval, setCurrentInterval] = useState(0);
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [addedUsers, setAddedUsers] = useState([]);
    const [newGroup, setNewGroup]=useState(null);

    useEffect(()=>{
        clearTimeout(currentInterval);
        let timeoutId;
        if (name!=="") {
            timeoutId = setTimeout(function () {
                axios.get("http://localhost:8090/users/search", {
                    params: {
                        name: name
                    }
                })
                    .then(response=> {
                        console.log(addedUsers)
                        console.log(response)
                        let returnedUsers=response.data;
                        let filteredUsers=returnedUsers.filter(user=>{
                            //will check to see if user is already in added group members
                            let addedUsersIncludesUser=addedUsers.reduce((bool, addedUser)=>{
                                if (bool){
                                    return bool;
                                } else {
                                    return addedUser.id === user.id;
                                }
                            },false)

                            //will only return users who are not already added to group and is not the logged in user
                            return user.id!==props.user.id&&!addedUsersIncludesUser;
                        });
                        setSearchedUsers(filteredUsers)
                    })
            }, 500);
        } else{
            setSearchedUsers([])
        }
        setCurrentInterval(timeoutId);


    }, [name])


    const onGroupSubmit = (event) =>{
        let groupMembersList=document.getElementById("groupMembersSelectList").value;
        axios.get("http://localhost:8090/groups/create", {
            params: {
                name: groupName,
                owner: props.user.id,
                groupMembersList: groupMembersList
            }
        })
            .then(response=> {
                console.log(response);
                props.onSelectBingoCard(null);
                setNewGroup(response.data);
            })

    }

    const onAddGroupMember = (newMember) =>{
        let newMemberList=[...addedUsers];
        newMemberList.push(newMember);
        setAddedUsers(newMemberList);
    }

    const renderedAddedMembers = addedUsers.map(user=>{
        return (
            <div className="item">
                <img className="ui avatar image" src="https://s3.amazonaws.com/alumni.codeup.com/JamesMcBride.jpg"/>
                <div className="content">
                    <div className="header">{user.firstName+" "+user.lastName}</div>
                    {user.username}
                </div>
            </div>
    )
    })

    //will add members to hidden select input, to send to controller to save.
    const renderedMembersSelect = addedUsers.map(user=>{
        return (
            <option className="groupMemberOption" value={user.id} selected="true"></option>
        )
    })

    const renderGroupMembers = searchedUsers.map(user=>{
        return (
        <div className="item">
            <img className="ui avatar image" src="https://s3.amazonaws.com/alumni.codeup.com/JamesMcBride.jpg" />
                <div className="content">
                    <div className="header">{user.firstName+" "+user.lastName}</div>
                    <div className="ui right floated primary button" onClick={()=>onAddGroupMember(user)}>
                        Add to Group</div>
                </div>
        </div>
        )
    })

    if (newGroup!=null){
        return (<Redirect to={"/group/"+newGroup.id+"/bingo"} />)
    } else {

        return (
            <div id="flexContainer">
                <div id="formDiv">
                    <div className="ui ordered horizontal list" id="groupMemberList">
                        {renderedAddedMembers}
                    </div>
                    <form className="ui form pokemonForm" id="pokemonGroupForm">
                        <div className="field">
                            <label>Username</label>
                            <input type="text" name="name" placeholder="Enter Group Name..." value={groupName}
                                   onChange={event => setGroupName(event.target.value)}/>
                        </div>
                        <div className="field">
                            <label>Search for Group Members</label>
                            <input type="text" name="memberName" placeholder="Enter friend's name..." value={name}
                                   onChange={event => setName(event.target.value)}/>
                        </div>
                        <div className="ui middle aligned selection list">
                            {renderGroupMembers}
                        </div>
                        <select className="form-control" name="groupMembersList" multiple="multiple"
                                id="groupMembersSelectList">
                            {renderedMembersSelect}
                        </select>
                        <input type="hidden" value={props.user.id} name="owner"/>
                        <button className="ui button" type="button" onClick={event => onGroupSubmit(event)}>Submit
                        </button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login;