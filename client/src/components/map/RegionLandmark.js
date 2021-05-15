import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol, WNavItem} from 'wt-frontend';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';


const RegionLandmark = (props) => {

    // console.log(props.landmark)
    const deleteLandmark = () =>{
        let old = props.landList;
        let deleted = [];
        deleted = old.filter(item => item !== props.landmark);
        // console.log(old, deleted);
        props.deleteLandmark(props.parent._id, props.region._id, 'landmarks', old, deleted)
    }
    return(
        <WRow>
            {/* <div className="landmark" >{props.landmark}</div> */}
            <WCol size="1">
            <WButton className='landmark-delete' >
                        <i className="material-icons" onClick={deleteLandmark} >close</i>
                </WButton>
            </WCol>
            <WCol size = "10">
                <div className="landmark" >{props.landmark}</div>
            </WCol>
        </WRow>
    )

}

export default RegionLandmark