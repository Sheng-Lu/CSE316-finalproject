import React, { useState } 	from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import Logo 							from '../navbar/Logo';
import UpdateAccount					from '../modals/UpdateAccount';
import NavbarOptions 					    from '../navbar/NavbarOptions';
import { GET_DB_MAPS } 				from '../../cache/queries';
import { WNavbar, WSidebar, WNavItem, WRow, WButton, WCol } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import SheetEntry							from './SheetEntry';
import * as mutations 					from '../../cache/mutations';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';

const RegionSheet = (props) =>{
    let history = useHistory();

    const [RenameMap] 			= useMutation(mutations.RENAME_MAP);
    const [AddRegion]           = useMutation(mutations.ADD_REGION);

    let regionList = props.map.region;

    const handleReturnHome = () =>{
        props.toggleMap(true);
        history.push("/map");
    }

    const renameMap = async(_id, newName) =>{
		const {data} = await RenameMap({variables: {_id:_id, newName:newName}, refetchQueries: [{query: GET_DB_MAPS}]});
		return data;
	}

    const handleAddRegion = async () =>{
        let nRegion = {
			_id : '',
			name: 'untitled',
			capital: 'capital',
			leader: 'leader',
            flag: 'flag',
            landmarks: []
		}
        const {data} = await AddRegion({variables: {_id:props.map._id, region:nRegion}, refetchQueries: [{query: GET_DB_MAPS}]});
        props.refetch();
        return data;
    }

    return(
        !props.showAccount &&
        <div className='spreadSheet'> 
            <WRow className='spreadSheet-title'>
                <WCol size='1'>
                    <WButton className='region-add' hoverAnimation='lighten' span='true' clickAnimation='ripple-dark'
                        onClick={handleAddRegion} >
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
                <WCol size='4' className='regionNameSheetCol' >
                    <div className='regionNameSheet'> Region Name: </div>
                    
                </WCol>
                <WCol size='4' className='sheetNameCol'>
                    <div className='sheetName'> {props.map.name}</div>
                </WCol>
                <WCol size='1'>
                    <WButton className='region-home' onClick={handleReturnHome} hoverAnimation='lighten'
                     span='true' clickAnimation='ripple-dark' >
                        <i className="material-icons">home</i>
                    </WButton>
                </WCol>
            </WRow>

            <WRow className='spreadSheet-header'>
                <WCol size='3'>
                    <div className='sheet-header' >Name</div>
                </WCol>
                <WCol size='2'>
                    <div className='sheet-header'>Capital</div>
                </WCol>
                <WCol size='2'>
                    <div className='sheet-header'>Leader</div>
                </WCol>
                <WCol size='2'>
                    <div className='sheet-header'>Flag</div>
                </WCol>
                <WCol size='3'>
                    <div className='sheet-header'>Landmarks</div>
                </WCol>
            </WRow>
            <div className='sheetContent'>
            {
                regionList.map((value, index) =>(
                    <SheetEntry region={value} />
                ))
            }
            </div>
        
        </div>
    );

}

export default RegionSheet;