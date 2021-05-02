import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol, WNavItem} from 'wt-frontend';

const MapEntry = (props) => {

    const value = props.value.name;
    const [editing, toggleEdit] = useState(false);

    const handleRename = (e) =>{
        toggleEdit(false);
        const newName = e.target.value ? e.target.value : 'untitled';
        props.renameMap(props.value._id, newName);
    }

    const handleDelete = () =>{
        props.deleteMap(props.value._id);
    }
    // onDoubleClick={toggleEdit(!editing)}
    return(
        <WRow className='map-entry'>
            <WCol size='9' className='map-entry-name'  >
                    {
                        editing ?
                        <WInput className='map-entry-input' onBlur={handleRename} autoFocus={true} defaultValue={value} 
                            type='text'/>
                        :
                        <WRow className='map-entry-text' >{value}</WRow>
                    }
            </WCol>

            <WCol size='3' className='map-entry-delete'>
                <WButton className='map-delete' onClick={handleDelete} >
                <i className="material-icons">delete</i>
                </WButton>
            </WCol>
            
        </WRow>
    )
}

export default MapEntry