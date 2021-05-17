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

const RegionSheet = (props) =>{
    let history = useHistory();

    const [RenameMap] 			= useMutation(mutations.RENAME_MAP);
    const [AddRegion]           = useMutation(mutations.ADD_REGION);

    // const { loading, error, data, refetch } = useQuery(GET_MAP_ID, { variables: { _id: props.map._id } });
    const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

    let regionList = props.map.region;

    if(data) { 
        for(let map of data.getAllMaps){
			if(map._id == props.map._id){
                regionList = map.region;
                break;
            }
		}
	}

    const handleReturnHome = () =>{
        props.toggleMap(true);
        props.clearTps();
        history.push("/map");
    }

    const renameMap = async(_id, newName) =>{
		const {data} = await RenameMap({variables: {_id:_id, newName:newName}, refetchQueries: [{query: GET_DB_MAPS}]});
		return data;
	}

    const handleAddRegion = async () =>{
        // let nRegion = {
		// 	_id : '',
		// 	name: 'untitled',
		// 	capital: 'capital',
		// 	leader: 'leader',
        //     flag: 'flag',
        //     landmarks: []
		// }
        // const {data} = await AddRegion({variables: {_id:props.map._id, region:nRegion}, refetchQueries: [{query: GET_DB_MAPS}]});

        // return data;
        props.handleAddRegion(props.map._id);
    }

    const handleSort = (criteria) =>{
        props.handleSort(props.map._id, regionList, criteria)
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
                    <WButton className={props.canUndo?'region-undo' :'regionButtonDisabled'} hoverAnimation='lighten' span='true' clickAnimation='ripple-dark' onClick={props.undo} >
                        <i className="material-icons" >undo</i>
                    </WButton>
                </WCol>
                <WCol size='1'>
                    <WButton className={props.canRedo?'region-redo': 'regionButtonDisabled'} hoverAnimation='lighten' span='true' clickAnimation='ripple-dark'onClick={props.redo}>
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
                    <div className={regionList.length==0?'sheet-header-disabled': 'sheet-header'} onClick={() =>handleSort("name")}>Name</div>
                </WCol>
                <WCol size='2'>
                    <div className={regionList.length==0?'sheet-header-disabled': 'sheet-header'} onClick={() =>handleSort("capital")}>Capital</div>
                </WCol>
                <WCol size='2'>
                    <div className={regionList.length==0?'sheet-header-disabled': 'sheet-header'} onClick={() =>handleSort("leader")}>Leader</div>
                </WCol>
                <WCol size='2'>
                    <div className='sheet-header-non'>Flag</div>
                </WCol>
                <WCol size='3'>
                    <div className='sheet-header-non'>Landmarks</div>
                </WCol>
            </WRow>
            <div className='sheetContent'>
            {
                regionList.map((value, index) =>(
                    <SheetEntry region={value} handleSelectRegion={props.handleSelectRegion} parent={props.map}
                    handleChangeRegionSheet={props.handleChangeRegionSheet} handleDeleteRegionSheet={props.handleDeleteRegionSheet} 
                     />
                ))
            }
            </div>
        
        </div>
    );

}

export default RegionSheet;