import React, { useState } 	from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import Logo 							from '../navbar/Logo';
import UpdateAccount					from '../modals/UpdateAccount';
import NavbarOptions 					    from '../navbar/NavbarOptions';
import { GET_DB_MAPS, GET_MAP_ID} 				from '../../cache/queries';
import { WNavbar, WSidebar, WNavItem, WRow, WButton, WCol } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import SheetEntry							from './SheetEntry';
import * as mutations 					from '../../cache/mutations';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';

const RegionViewer = (props) =>{
    let history = useHistory();

    const handleBackToSheet = () =>{
        props.toggleRegion(true);
        history.push("/map/"+props.parent._id);
    }

    return(
        <WRow className='regionViewer'>

        <WCol size='6' className='viewerLeft' >
            <WRow>
                <WCol size='1'>
                    <WButton className='viewer-undo' hoverAnimation='lighten'
                        span='true' clickAnimation='ripple-dark' >
                        <i className="material-icons">undo</i>
                    </WButton>
                </WCol>
                <WCol size='1'>
                    <WButton className='viewer-redo' hoverAnimation='lighten'
                        span='true' clickAnimation='ripple-dark' >
                        <i className="material-icons">redo</i>
                    </WButton>
                </WCol>
            </WRow>
            <div className='viewerFlag' > flag </div>
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
                <WCol size='4' className='viewer-region-name viewer-parent-name-value viewer-region-name-value' onClick={handleBackToSheet} >
                    {props.parent.name}
                </WCol>
                <WCol size='1'>
                    <WButton className='viewer-edit' hoverAnimation='lighten'
                        span='true' clickAnimation='ripple-dark' >
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

            </div>
        </WCol>
        </WRow>
    )

}

export default RegionViewer