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

    

    return(
        <WRow>
            <WCol size='3' className='sheetCol' >
                <WButton className='sheet-delete' >
                        <i className="material-icons">close</i>
                </WButton>
                <div className='sheetEntry' > 
                    {props.region.name}</div>
            </WCol>

            <WCol size='2' className='sheetCol'>
                <div className='sheetEntry' >{props.region.capital}</div>
            </WCol>

            <WCol size='2' className='sheetCol'>
                <div className='sheetEntry' >{props.region.leader}</div>
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