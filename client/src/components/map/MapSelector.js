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

import { BrowserRouter, Switch, Route, Redirect, useHistory, useLocation } from 'react-router-dom';
import RegionSheet          from './RegionSheet';
import RegionViewer from './RegionViewer';


const MapSelector = (props) =>{
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
	const [currentRegionParent, setCurrentRegionParent] = useState({});
	const [newMap, toggleNewMap]		= useState(false);
    let history = useHistory();
	const location = useLocation();

	const [UpdateRegionSheetField] = useMutation(mutations.UPDATE_REGION_SHEET_FIELD);
	const [DeleteSheetRegion]		= useMutation(mutations.DELETE_SHEET_REGION);
	const [SortRegion]				= useMutation(mutations.SORT_REGION);

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
		setCurrentRegionParent(parent);
		history.push("/map/"+currentMap._id+'/'+region._id);
	}

	const handleChangeRegionSheet = (id, regionId, field, value) =>{
		UpdateRegionSheetField({ variables: { _id: id, regionId:regionId, field: field, value: value}, refetchQueries: [{ query: GET_DB_MAPS }] });
	}

	const handleDeleteRegionSheet = (id, regionId) => {
		DeleteSheetRegion({ variables: { _id: id, regionId:regionId}, refetchQueries: [{ query: GET_DB_MAPS }] });
	}

	const isIncreasing = (regionList, criteria) =>{
		let temp = regionList;
		for(var i=0; i<temp.length-1; i++){
			if(temp[i][criteria] > temp[i+1][criteria])
				return false;
		}
		return true;
	}

	const handleSort = (regionList, criteria) =>{
		// let list = {
		// 	_id: activeList._id,
		// 	id: activeList.id,
		// 	name: activeList.name,
		// 	owner: activeList.owner,
		// 	items: activeList.items,
		// }
		// const id = activeList._id;
		// const increasing = isIncreasing(criteria);
		// let transaction = new SortItems_Transaction(id, criteria, increasing, SortItem, list, UpdateItem);
		// props.tps.addTransaction(transaction);

		const id = currentMap._id
		const increasing = isIncreasing(regionList, criteria);
		console.log(increasing)
		SortRegion({ variables: { _id: id, criteria:criteria, increasing:increasing }, refetchQueries: [{ query: GET_DB_MAPS }] });

	}


    return(
        <WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' toggleMap={toggleMapSelect} mapSelect={mapSelect} 
							regionSelect={regionSelect} auth={auth} toggleRegion={toggleRegionSelect}/>
						</WNavItem>
					</ul>
					<ul>
						{mapSelect ? <div></div> 
						:<div className="navRegionName" >{currentMap.name}</div>  }
					</ul>
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
				refetch={refetch} handleSelectRegion={handleSelectRegion} handleChangeRegionSheet={handleChangeRegionSheet} 
				handleDeleteRegionSheet={handleDeleteRegionSheet} handleSort={handleSort} />}
			>
			</Route>

			: 
			<Route 
				path={"/map/"+currentMap._id+'/'+currentRegion._id}
				name={"region_"+currentMap._id+'_'+currentRegion._id}
				render={() => 
				<RegionViewer toggleRegion={toggleRegionSelect} parent={currentRegionParent} region={currentRegion} />}
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