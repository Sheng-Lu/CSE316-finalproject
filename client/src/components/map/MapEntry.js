import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol } from 'wt-frontend';

const MapEntry = (props) => {

    const value = props.value.name;
    const [editing, toggleEdit] = useState(false);

    return(
        <WRow className='map-entry'>
            <WCol size='9' className='map-entry-name'>
                    {
                        editing ?
                        <WInput />
                        :
                        <div className='map-entry-text'>{value}</div>
                    }
            </WCol>

            <WCol size='3' className='map-entry-delete'>
                <WButton className='map-delete'>
                <i className="material-icons">delete</i>
                </WButton>
            </WCol>
            
        </WRow>
    )
}

export default MapEntry