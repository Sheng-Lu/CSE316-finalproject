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
        <div onClick={handleBackToSheet} >
            {props.parent.name}
        </div>
    )

}

export default RegionViewer