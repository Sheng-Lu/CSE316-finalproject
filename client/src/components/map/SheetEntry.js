import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol, WNavItem} from 'wt-frontend';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';


const SheetEntry = (props) => {

    const landmark = "";

    if(props.region.landmarks.length >0){
        landmark=props.region.landmarks[0];
    }

    let temp = landmark + " ...";

    const handleLandmarkClick = () =>{
        props.handleSelectRegion(props.region, props.parent)
    }

    const [editingName, toggleName] = useState(false);
    const [editingCapital, toggleCapital] = useState(false);
    const [editingLeader, toggleLeader] = useState(false);

    const handleEditName = (e) =>{
        toggleName(false);
        const newName = e.target.value ? e.target.value : 'untitled';
        if(newName !== props.region.name){
            props.handleChangeRegionSheet(props.parent._id, props.region._id, 'name', newName);
        }
    }

    const handleEditCapital =(e) =>{
        toggleCapital(false);
        const newCapital = e.target.value ? e.target.value : 'capital';
        if(newCapital !== props.region.capital){
            props.handleChangeRegionSheet(props.parent._id, props.region._id, 'capital', newCapital);
        }
    }

    const handleEditLeader =(e) =>{
        toggleLeader(false);
        const newLeader = e.target.value ? e.target.value : 'leader';
        if(newLeader !== props.region.leader){
            props.handleChangeRegionSheet(props.parent._id, props.region._id, 'leader', newLeader);
        }
    }

    return(
        <WRow>
            <WCol size='3' className='sheetCol' >
                <div className='sheetCol-name'>
                <WButton className='sheet-delete' >
                        <i className="material-icons">close</i>
                </WButton>
                {
                    editingName ?
                    <WInput 
                        className='sheetEntry-input' onBlur={handleEditName}
                        autoFocus={true} defaultValue={props.region.name} type='text'
                        inputClass="table-input-class"
                    />
                    : <div className='sheetEntry sheetEntry-name' onClick={() => toggleName(true)} > 
                        {props.region.name}</div>
                }
                </div>
            </WCol>

            <WCol size='2' className='sheetCol'>
                {
                    editingCapital ?
                    <WInput 
                        className='sheetEntry-input' onBlur={handleEditCapital}
                        autoFocus={true} defaultValue={props.region.capital} type='text'
                        inputClass="table-input-class"
                    />
                    : <div className='sheetEntry' onClick={() => toggleCapital(true)} >{props.region.capital}</div>
                }
            </WCol>

            <WCol size='2' className='sheetCol'>
                {editingLeader ?
                    <WInput 
                        className='sheetEntry-input' onBlur={handleEditLeader}
                        autoFocus={true} defaultValue={props.region.leader} type='text'
                        inputClass="table-input-class"
                    />
                : <div className='sheetEntry' onClick={() => toggleLeader(true)} >{props.region.leader}</div>
                }
            </WCol>

            <WCol size='2' className='sheetCol'>
                <div className='sheetEntry' >
                    <img src={"/flag/" +props.region.name+ " Flag.png"} alt="No Flag Found" className='sheetFlag' />
                </div>
            </WCol>

            <WCol size='3' className='sheetCol' onClick={handleLandmarkClick} >
                <div className='sheetEntry' >{temp}</div>
            </WCol>

        </WRow>
    )
}

export default SheetEntry