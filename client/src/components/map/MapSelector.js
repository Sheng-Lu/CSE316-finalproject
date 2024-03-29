import React, { useState, useEffect } 	from 'react';
import { useMutation, useQuery } 		from '@apollo/client';
import Logo 							from '../navbar/Logo';
import UpdateAccount					from '../modals/UpdateAccount';
import NavbarOptions 					    from '../navbar/NavbarOptions';
import { GET_DB_MAPS } 				from '../../cache/queries';
import { WNavbar, WSidebar, WNavItem } 	from 'wt-frontend';
import { WLayout, WLHeader, WLMain, WLSide } from 'wt-frontend';
import MapEntry							from './MapEntry';
import * as mutations 					from '../../cache/mutations';

import RedGlobe							from '../../image/2554416-world-map-red-globe-america-europe-and-africa.jpg';
import WButton from 'wt-frontend/build/components/wbutton/WButton';
import {UpdateRegionSheet_Transaction,
		SortRegion_Transaction, 
		AddRegion_Transaction, 
		DeleteRegion_Transaction,
		ChangeParent_Transaction}				from '../../utils/jsTPS';

import { BrowserRouter, Switch, Route, Redirect, useHistory, useLocation } from 'react-router-dom';
import RegionSheet          from './RegionSheet';
import RegionViewer from './RegionViewer';


const MapSelector = (props) =>{

	const keyCombination = (e, callback) => {
		if(e.key === 'z' && e.ctrlKey) {
			if(props.tps.hasTransactionToUndo()) {
				tpsUndo();
			}
		}
		else if (e.key === 'y' && e.ctrlKey) { 
			if(props.tps.hasTransactionToRedo()) {
				tpsRedo();
			}
		}
	}
	document.onkeydown = keyCombination;

    const auth = props.user === null ? false : true;
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showAccount, toggleShowAccount]	= useState(false);

	const [AddMap] 				= useMutation(mutations.ADD_MAP);
	const [RenameMap] 			= useMutation(mutations.RENAME_MAP);
	const [DeleteMap]			= useMutation(mutations.DELETE_MAP);

	const [mapSelect, toggleMapSelect] = useState(true);
	const [regionSelect, toggleRegionSelect] = useState(true);
	const [currentMap, setCurrentMap] = useState({})
	const [currentRegion, setCurrentRegion] = useState({});
	// const [currentRegionParent, setCurrentRegionParent] = useState({});
	const [newMap, toggleNewMap]		= useState(false);
    let history = useHistory();
	const location = useLocation();

	const [canUndo, setCanUndo] = useState(props.tps.hasTransactionToUndo());
	const [canRedo, setCanRedo] = useState(props.tps.hasTransactionToRedo());

	const [UpdateRegionSheetField] = useMutation(mutations.UPDATE_REGION_SHEET_FIELD);
	const [UpdateLandmark]			=useMutation(mutations.UPDATE_LANDMARK);
	const [DeleteSheetRegion]		= useMutation(mutations.DELETE_SHEET_REGION);
	const [SortRegion]				= useMutation(mutations.SORT_REGION);
	const [AddRegion]           = useMutation(mutations.ADD_REGION);
	const [ChangeParent]		= useMutation(mutations.CHANGE_PARENT);

	let maplist = [];

	const { loading, error, data, refetch } = useQuery(GET_DB_MAPS);

	if(loading) { console.log(loading, 'loading'); }
	if(error) { console.log(error, 'error'); }


	if(data) { 
		for(let map of data.getAllMaps){
			maplist.push(map);
		}
		
	}

	const addNewMap = async () =>{
		let nMap = {
			_id : '',
			name: 'untitled',
			owner: props.user._id,
			region: []
		}
		const {data} = await AddMap({variables: {map: nMap}, refetchQueries: [{query: GET_DB_MAPS}] });
		toggleNewMap(true);
		if(data){
			let temp = data.addMap;
		}
	}

	const renameMap = async(_id, newName) =>{
		const {data} = await RenameMap({variables: {_id:_id, newName:newName}, refetchQueries: [{query: GET_DB_MAPS}]});
		return data;
	}

	const deleteMap = async(_id) =>{
		DeleteMap({ variables: { _id: _id }, refetchQueries: [{ query: GET_DB_MAPS }] });
	}

	const tpsUndo = async () => {
		const ret = await props.tps.undoTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const tpsRedo = async () => {
		const ret = await props.tps.doTransaction();
		if(ret) {
			setCanUndo(props.tps.hasTransactionToUndo());
			setCanRedo(props.tps.hasTransactionToRedo());
		}
	}

	const clearTps = async () =>{
		await props.tps.clearAllTransactions();
	}


	const setShowLogin = () => {
		toggleShowAccount(false);
		toggleShowCreate(false);
		toggleShowLogin(!showLogin);
	};

	const setShowCreate = () => {
		toggleShowAccount(false);
		toggleShowLogin(false);
		toggleShowCreate(!showCreate);
	};

	const setShowUpdate = () =>{
		toggleShowCreate(false);
		toggleShowLogin(false);
		toggleShowAccount(!showAccount);
	};

	const handleSelectMap = (region) =>{
		toggleMapSelect(false);
		setCurrentMap(region)
		history.push("/map/"+region._id);
	}

	const handleSelectRegion = (region, parent) =>{
		toggleMapSelect(false);
		toggleRegionSelect(false);
		setCurrentRegion(region);
		setCurrentMap(parent);
		clearTps();
		history.push("/map/"+currentMap._id+'/'+region._id);
	}

	const handleAddRegion = async (parentId) =>{
        let nRegion = {
			_id : '',
			name: 'untitled',
			capital: 'capital',
			leader: 'leader',
            flag: 'flag',
            landmarks: []
		}
        // const {data} = await AddRegion({variables: {_id:parentId, region:nRegion, index: -1}, refetchQueries: [{query: GET_DB_MAPS}]});
        // return data;
		let temp = [{ query: GET_DB_MAPS }];
		let transaction = new AddRegion_Transaction(parentId, nRegion, AddRegion, DeleteSheetRegion, temp);
		props.tps.addTransaction(transaction);
		tpsRedo();
    }

	const handleChangeRegionSheet = (id, regionId, field, old, value) =>{
		// UpdateRegionSheetField({ variables: { _id: id, regionId:regionId, field: field, value: value}, refetchQueries: [{ query: GET_DB_MAPS }] });
		let temp = [{ query: GET_DB_MAPS }];
		let transaction = new UpdateRegionSheet_Transaction(id, regionId, field, old, value, UpdateRegionSheetField, temp);
		props.tps.addTransaction(transaction);
		tpsRedo();

	}

	const handleChangeLandmark = (id, regionId, field, old, value) =>{
		let temp = [{ query: GET_DB_MAPS }];
		let transaction = new UpdateRegionSheet_Transaction(id, regionId, field, old, value, UpdateLandmark, temp);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const handleDeleteRegionSheet = (id, regionId, regList) => {
		let index = 0;
		let region = {};
		for(const m of maplist){
			if (m._id == id){
				for(const r of m.region){
					if(r._id == regionId){
						region=r;
						break;
					}
					index ++;
				}
				break;
			}
		}
		// console.log(region)

		// DeleteSheetRegion({ variables: { _id: id, regionId:regionId}, refetchQueries: [{ query: GET_DB_MAPS }] });
		let temp = [{ query: GET_DB_MAPS }];
		let transaction = new DeleteRegion_Transaction(id, regionId, index, AddRegion, DeleteSheetRegion, temp, region);
		props.tps.addTransaction(transaction);
		tpsRedo();
	
	}

	const isIncreasing = (regionList, criteria) =>{
		let temp = regionList;
		for(var i=0; i<temp.length-1; i++){
			if(temp[i][criteria] > temp[i+1][criteria])
				return false;
		}
		return true;
	}

	const handleSort = (id, regionList, criteria) =>{
		// const id = currentMap._id
		const increasing = isIncreasing(regionList, criteria);
		// console.log(increasing)
		// SortRegion({ variables: { _id: id, criteria:criteria, increasing:increasing }, refetchQueries: [{ query: GET_DB_MAPS }] });

		let temp = [{ query: GET_DB_MAPS }];
		let transaction = new SortRegion_Transaction(id, criteria, increasing, SortRegion, temp);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const handleChangeParent = (originalParent, newParent, regionId, index, newParentObject) =>{
		// console.log(originalParent, newParent, regionId, index);
		// ChangeParent({ variables: { originalParent: originalParent, newParent:newParent, regionId:regionId, index: -1 },
		// 	 refetchQueries: [{ query: GET_DB_MAPS }] });
			
		// setCurrentMap(newParentObject);
		// setCurrentRegionParent(newParentObject);
		// history.push("/map/"+newParentObject._id+'/'+regionId);
		// console.log(newParentObject, currentMap)
		let transaction = new ChangeParent_Transaction(originalParent, newParent, regionId, index, 
			handleChangeParentUndoRedo, newParentObject, currentMap);
		props.tps.addTransaction(transaction);
		tpsRedo();
	}

	const handleChangeParentUndoRedo= (originalParent, newParent, regionId, index, newParentObject) =>{
		ChangeParent({ variables: { originalParent: originalParent, newParent:newParent, regionId:regionId, index: index },
			refetchQueries: [{ query: GET_DB_MAPS }] });
		refetch();
	   	setCurrentMap(newParentObject);
	//    setCurrentRegionParent(newParentObject);
	   history.push("/map/"+newParentObject._id+'/'+regionId);
	}

	const [DisableSiblingL, toggleDisableSiblingL]	= useState(false);
	const [DisableSiblingR, toggleDisableSiblingR]	= useState(false);

	const checkSiblingEnable =(map, reg) =>{

		setCurrentMap(map);
		setCurrentRegion(reg);
		if(map.region[0]._id == reg._id){
			toggleDisableSiblingL(true);
		}else{
			toggleDisableSiblingL(false);
		}
		let len = map.region.length-1;
		if(map.region[len]._id == reg._id){
			toggleDisableSiblingR(true);
		}else{
			toggleDisableSiblingR(false);
		}
	}

	const siblingLeft = () =>{
		let regList = currentMap.region;
		let prev = {};
		for(let r of regList){
			if(r._id == currentRegion._id){
				break;
			}
			prev=r;
		}
		setCurrentRegion(prev);
		clearTps();
		history.push("/map/"+currentMap._id+'/'+prev._id);
	}

	const siblingRight = () =>{
		let regList = currentMap.region;
		let next = {};
		let temp = false;
		for(let r of regList){
			next = r;
			if(temp){
				break;
			}
			if(r._id == currentRegion._id){
				temp = true;
			}
		}
		console.log(next);
		setCurrentRegion(next);
		clearTps();
		history.push("/map/"+currentMap._id+'/'+next._id);
	}

    return(
        <WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' toggleMap={toggleMapSelect} mapSelect={mapSelect} 
							regionSelect={regionSelect} auth={auth} toggleRegion={toggleRegionSelect}
							clearTps={clearTps}	/>
						</WNavItem>
					</ul>
					<ul>
						{mapSelect ? <div></div> 
						:<div className="navRegionName" >{currentMap.name}{!regionSelect ? " > "+currentRegion.name : ""}</div> }
					</ul>
						{regionSelect ? <div></div> 
						: <div className='siblingLR' >
							<WButton className={DisableSiblingL? 'buttonDisabled' :'viewerLeftSib'} onClick={siblingLeft} hoverAnimation='lighten'>
								<i className="material-icons">arrow_back</i>
							</WButton>
							<WButton className={DisableSiblingR? 'buttonDisabled' :'viewerRightSib'} onClick={siblingRight} hoverAnimation='lighten'>
								<i className="material-icons">arrow_forward</i>
							</WButton>
						</div> }
					<ul>
						<NavbarOptions
							fetchUser={props.fetchUser} 	auth={auth} 
							setShowCreate={setShowCreate} 	setShowLogin={setShowLogin}
							user={props.user}				setShowUpdate={setShowUpdate}
						/>
					</ul>
				</WNavbar>
			</WLHeader>

			{ mapSelect ?

			!showAccount &&
            <WLMain>

				<div className='yourMapRed'></div>
				<div className='yourMapBlack' style={{color: "white"}}>Your Maps</div>
				<div className='yourMapLeft'>
					{	
						maplist.map((value, index) =>(
						<MapEntry
								value={value} renameMap={renameMap} deleteMap={deleteMap} 
								handleSelectMap={handleSelectMap} newMap={newMap} toggleNewMap={toggleNewMap}
							/>
						))
					}

				</div>

				<div className='yourMapRight'><img src={RedGlobe} className='yourMapGlobe'/>
					<WButton color="red" className='yourMapButton' hoverAnimation='lighten' span='True' onClick={addNewMap} >
						Create New Map
					</WButton>
				</div >

			</WLMain>
			
			: <> {regionSelect ? 
			<Route
			path={"/map/"+currentMap._id}
			name={"map_"+currentMap._id}
			render={() => 
			<RegionSheet map={currentMap} toggleMap={toggleMapSelect} showAccount={showAccount} 
				refetch={refetch} handleSelectRegion={handleSelectRegion} handleChangeRegionSheet={handleChangeRegionSheet} clearTps={clearTps}
				handleDeleteRegionSheet={handleDeleteRegionSheet} handleSort={handleSort} handleAddRegion={handleAddRegion} 
				undo={tpsUndo} redo={tpsRedo} canUndo={props.tps.hasTransactionToUndo()} canRedo={props.tps.hasTransactionToRedo()} />}
			>
			</Route>

			: 
			<Route 
				path={"/map/"+currentMap._id+'/'+currentRegion._id}
				name={"region_"+currentMap._id+'_'+currentRegion._id}
				render={() => 
				<RegionViewer toggleRegion={toggleRegionSelect} parent={currentMap} region={currentRegion} clearTps={clearTps} 
				handleChangeLandmark={handleChangeLandmark} undo={tpsUndo} redo={tpsRedo} handleChangeParent={handleChangeParent} 
				checkSiblingEnable={checkSiblingEnable} canUndo={props.tps.hasTransactionToUndo()} canRedo={props.tps.hasTransactionToRedo()} />}
			>
			</Route>
			
			}
			

			</>}
			
			{
				showAccount && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user}/>)
			}

            </WLayout>
			
    );

}

export default MapSelector;