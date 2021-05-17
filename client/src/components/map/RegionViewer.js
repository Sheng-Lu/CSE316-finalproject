import React, { useState } 	from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import Logo 							from '../navbar/Logo';
import UpdateAccount					from '../modals/UpdateAccount';
import NavbarOptions 					    from '../navbar/NavbarOptions';
import { GET_DB_MAPS, GET_MAP_ID} 				from '../../cache/queries';
import { WNavbar, WSidebar, WNavItem, WRow, WButton, WCol } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import RegionLandmark							from './RegionLandmark';
import * as mutations 					from '../../cache/mutations';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import WInput from 'wt-frontend/build/components/winput/WInput';

const RegionViewer = (props) =>{
    let history = useHistory();

    const [newLandmark, setNewLandmark] = useState("");
    const [editingParent, toggleEditingParent] = useState(false);

    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

    let landList = props.region.landmarks;
    let mapList = [];
    let parent = {};

    if(data) { 
        for(let map of data.getAllMaps){
            mapList.push(map);
			if(map._id == props.parent._id){
                parent = map;
                {
                    for(let region of map.region){
                        if(region._id == props.region._id){
                            landList = region.landmarks;
                            break;
                        }
                    }
                }
            }
		}
	}

    props.checkSiblingEnable(parent, props.region);

    const handleBackToSheet = () =>{
        props.toggleRegion(true);
        props.clearTps();
        history.push("/map/"+props.parent._id);
    }

    const handleAddLandmark = (e) =>{
        if(newLandmark !== ""){    
            for(let l of landList){
                if(l == newLandmark){
                    alert("Landmark already exist")
                    return;
                }
            }
            let temp = landList;
            let temp1 = [...temp, newLandmark];
            props.handleChangeLandmark(props.parent._id, props.region._id, 'landmarks', temp, temp1)
            setNewLandmark("");
        }
    }

    const handleLandmarkBlur = (e) =>{
        setNewLandmark(e.target.value);
    }

    const handleSetParent = (e) =>{
        toggleEditingParent(false);

        let newParent = e.target.value;
        if(newParent == props.parent.name || newParent == ""){
            return
        }
        let newParentId = "";
        let newParentObject = {};

        // console.log(mapList);
        for(let m of mapList){
            if(m.name == newParent){
                newParentId= m._id;
                newParentObject = m;
                break;
            }
        }

        if(newParentId == ""){
            alert("New Parent does not exist");
            return;
        }

        let index = 0;
        for(let r of props.parent.region){
            if(r._id == props.region._id){
                break;
            }
            index ++;
        }

        props.handleChangeParent(props.parent._id, newParentId, props.region._id, index, newParentObject)

        // console.log(mapList)
    }

    const handleEditParent = () =>{
        toggleEditingParent(true);
    }

    // console.log(props.region.landmarks)
    return(
        <WRow className='regionViewer'>

        <WCol size='6' className='viewerLeft' >
            <WRow>
                <WCol size='1'>
                    <WButton className={props.canUndo? 'viewer-undo':'regionButtonDisabled'} hoverAnimation='lighten'
                        span='true' clickAnimation='ripple-dark' onClick={props.undo} >
                        <i className="material-icons">undo</i>
                    </WButton>
                </WCol>
                <WCol size='1'>
                    <WButton className={props.canRedo? 'viewer-redo':'regionButtonDisabled'} hoverAnimation='lighten'
                        span='true' clickAnimation='ripple-dark' onClick={props.redo} >
                        <i className="material-icons">redo</i>
                    </WButton>
                </WCol>
            </WRow>
            <div className='viewerFlag' > <img src={"/flag/" +props.region.name+ " Flag.png"} alt="No Flag Found" className='flagViewer'/> </div>
            <WRow>
                <WCol size='4' className='viewer-region-name' >
                    Region Name: 
                </WCol>
                <WCol size='4' className='viewer-region-name-value viewer-region-name' >
                    {props.region.name}
                </WCol>
                <WCol size='.01'>
                    <WButton className='viewer-transpant' >
                        <i className="material-icons">circle</i>
                    </WButton>
                </WCol>
            </WRow>

            <WRow>
                <WCol size='4' className='viewer-region-name' >
                    Parent Name: 
                </WCol>
                <WCol size='4' className='viewer-region-name viewer-parent-name-value viewer-region-name-value' >
                    {editingParent ?
                        <WInput onBlur={handleSetParent} autoFocus={true}
                        defaultValue={props.parent.name} type='text'/>

                    : <div onClick={handleBackToSheet}>{props.parent.name}</div>
                    }
                </WCol>
                <WCol size='1'>
                    <WButton className='viewer-edit' hoverAnimation='lighten'
                        span='true' clickAnimation='ripple-dark' onClick={handleEditParent} >
                        <i className="material-icons">edit</i>
                    </WButton>
                </WCol>
                
            </WRow>

            <WRow>
                <WCol size='4' className='viewer-region-name' >
                    Region Capital: 
                </WCol>
                <WCol size='4' className='viewer-region-name-value viewer-region-name' >
                    {props.region.capital}
                </WCol>
                <WCol size='.01'>
                    <WButton className='viewer-transpant' >
                        <i className="material-icons">circle</i>
                    </WButton>
                </WCol>
            </WRow>

            <WRow>
                <WCol size='4' className='viewer-region-name' >
                    Region Leader: 
                </WCol>
                <WCol size='4' className='viewer-region-name-value viewer-region-name' >
                    {props.region.leader}
                </WCol>
                <WCol size='.01'>
                    <WButton className='viewer-transpant' >
                        <i className="material-icons">circle</i>
                    </WButton>
                </WCol>
            </WRow>

            <WRow>
                <WCol size='4' className='viewer-region-name' >
                    # of subRegions: 
                </WCol>
                <WCol size='4' className='viewer-region-name-value viewer-region-name' >
                    {}
                </WCol>
                <WCol size='.01'>
                    <WButton className='viewer-transpant' >
                        <i className="material-icons">circle</i>
                    </WButton>
                </WCol>
            </WRow>
        </WCol>

        <WCol size='6' className='viewerRight'>
            <div className='regionLandmarkTitle' >
                Region Landmarks:
            </div>
            <div className='viewerLandmarkBackground'>
                {
                    landList.map((value, index) =>( 
                    <RegionLandmark landmark={value} deleteLandmark={props.handleChangeLandmark} parent={props.parent} region={props.region}
                    landList={landList} />
                    ))
                }
            </div>
            <div className='viewerLandmarkInput'>
                <WRow>
                    <WCol size='1'>
                        <WButton className='viewerLandmarkInputAdd' onClick={handleAddLandmark} >
                            <i className="material-icons">add</i>
                        </WButton>
                    </WCol>
                    <WCol size ='10'>
                        <WInput className='viewerWinput' onBlur={handleLandmarkBlur} />
                    </WCol>
                </WRow>
            </div>
        </WCol>
        </WRow>
    )

}

export default RegionViewer