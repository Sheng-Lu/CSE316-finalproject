import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol, WNavItem} from 'wt-frontend';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import RegionSheet          from './RegionSheet';

const MapEntry = (props) => {

    const value = props.value.name;
    const [editing, toggleEdit] = useState(props.newMap);

    const handleRename = (e) =>{
        toggleEdit(false);
        const newName = e.target.value ? e.target.value : 'untitled';
        props.renameMap(props.value._id, newName);
        let temp = props.newMap;
        props.toggleNewMap(false);
        // if(temp){
        //     props.handleSelectMap(props.value)
        // }
    }

    const handleDelete = () =>{
        props.deleteMap(props.value._id);
    }

    const handleEdit = () =>{
        toggleEdit(true);
    }

    const handleClick = () =>{
        props.handleSelectMap(props.value)
    }
    return(

        <>
        <WRow className={!editing ? 'map-entry' : 'map-entry-edit'}>
            <WCol size='1' className='map-entry-ed'>
            <WButton className='map-edit' onClick={handleEdit} >
                <i className="material-icons">edit</i>
                </WButton>
            </WCol>

            <WCol size='9' className='map-entry-name' onClick={handleClick}>
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
        
        </>
    )
}

export default MapEntry