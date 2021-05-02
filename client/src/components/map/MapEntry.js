import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol, WNavItem} from 'wt-frontend';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';

const MapEntry = (props) => {

    const value = props.value.name;
    const [editing, toggleEdit] = useState(false);
    let history = useHistory();

    const handleRename = (e) =>{
        toggleEdit(false);
        const newName = e.target.value ? e.target.value : 'untitled';
        props.renameMap(props.value._id, newName);
    }

    const handleDelete = () =>{
        props.deleteMap(props.value._id);
    }

    const handleEdit = () =>{
        toggleEdit(true);
    }

    const handleClick = () =>{
        history.push("/map1");
    }
    return(
        <>
        <WRow className={!editing ? 'map-entry' : 'map-entry-edit'}>
            <WCol size='1' className='map-entry-ed'>
            <WButton className='map-edit' onClick={handleEdit} >
                <i className="material-icons">edit</i>
                </WButton>
            </WCol>

            <WCol size='9' className='map-entry-name'>
                    {
                        editing ?
                        <WInput className='map-entry-input' onBlur={handleRename} autoFocus={true} defaultValue={props.value.name} 
                            type='text'/>
                        :
                        <WRow className='map-entry-text' onClick={handleClick} >{value}</WRow>
                    }
            </WCol>

            <WCol size='2' className='map-entry-delete'>
                <WButton className='map-delete' onClick={handleDelete} >
                <i className="material-icons">delete</i>
                </WButton>
            </WCol>
            
        </WRow>
        <Switch>
                <Route
                path="/map1"
                name="map1"
                >
                </Route>
        </Switch>
        </>
    )
}

export default MapEntry