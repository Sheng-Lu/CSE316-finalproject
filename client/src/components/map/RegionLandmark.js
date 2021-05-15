import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol, WNavItem} from 'wt-frontend';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';


const RegionLandmark = (props) => {

    const [editingName, toggleLandmark] = useState(false);
    // console.log(props.landmark)
    const deleteLandmark = () =>{
        let old = props.landList;
        let deleted = [];
        deleted = old.filter(item => item !== props.landmark);
        // console.log(old, deleted);
        props.deleteLandmark(props.parent._id, props.region._id, 'landmarks', old, deleted);
    }

    const handleEditLandmark =(e)=>{
        toggleLandmark(false);
        let old = props.landList;
        let updated = [];
        old.map(item => {
            if(item !== props.landmark){
                updated.push(item)
            }else{
                updated.push(e.target.value)
            }
        });
        props.deleteLandmark(props.parent._id, props.region._id, 'landmarks', old, updated);
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

                {editingName ?
                    <WInput className='landmark-input' autoFocus={true} onBlur={handleEditLandmark}
                     defaultValue={props.landmark} type='text' inputClass="table-input-class"/>
                    : <div className="landmark" onClick={() => toggleLandmark(true)}>{props.landmark}</div>
                }
            </WCol>
        </WRow>
    )

}

export default RegionLandmark