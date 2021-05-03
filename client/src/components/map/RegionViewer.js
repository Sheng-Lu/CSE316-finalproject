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
        <div className='viewerLeft' >
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
            <div> flag </div>
            <WRow>
                <WCol size='3' className='viewer-region-name' >
                    Region Name: 
                </WCol>
                <WCol size='8' className='viewer-region-name-value viewer-region-name' >
                    {props.region.name}
                </WCol>
            </WRow>
            <WRow>
                <WCol size='3' className='viewer-region-name' >
                    Parent Name: 
                </WCol>
                <WCol size='8' className='viewer-region-name viewer-parent-name-value viewer-region-name-value' onClick={handleBackToSheet} >
                    {props.region.name}
                </WCol>
            </WRow>

        </div>
    )

}

export default RegionViewer