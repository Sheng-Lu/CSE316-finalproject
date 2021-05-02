import React, { useState } 	from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import Logo 							from '../navbar/Logo';
import UpdateAccount					from '../modals/UpdateAccount';
import NavbarOptions 					    from '../navbar/NavbarOptions';
import { GET_DB_MAPS } 				from '../../cache/queries';
import { WNavbar, WSidebar, WNavItem, WRow, WButton, WCol } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import MapEntry							from './MapEntry';
import * as mutations 					from '../../cache/mutations';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';

const RegionSheet = (props) =>{
    let history = useHistory();

    const handleReturnHome = () =>{
        props.toggleMap(true);
        history.push("/map");
    }

    return(
        !props.showAccount &&
        <div className='spreadSheet'> 
            <WRow className='spreadSheet-title'>
                <WCol size='1'>
                    <WButton className='region-add' hoverAnimation='lighten' span='true' clickAnimation='ripple-dark'>
                        <i className="material-icons">add_box</i>
                    </WButton>
                </WCol>
                <WCol size='1'>
                    <WButton className='region-undo' hoverAnimation='lighten' span='true' clickAnimation='ripple-dark'>
                        <i className="material-icons">undo</i>
                    </WButton>
                </WCol>
                <WCol size='1'>
                    <WButton className='region-redo' hoverAnimation='lighten' span='true' clickAnimation='ripple-dark'>
                        <i className="material-icons">redo</i>
                    </WButton>
                </WCol>
                <WCol size='8'>
                    <div> {props.region.name}</div>
                </WCol>
                <WCol size='1'>
                    <WButton className='region-home' onClick={handleReturnHome} hoverAnimation='lighten'
                     span='true' clickAnimation='ripple-dark' >
                        <i className="material-icons">home</i>
                    </WButton>
                </WCol>
            </WRow>

        
        </div>
    );

}

export default RegionSheet;