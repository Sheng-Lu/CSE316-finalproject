import React, { useState } 	from 'react';
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

import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';
import RegionSheet          from './RegionSheet';


const MapSelector = (props) =>{
    const auth = props.user === null ? false : true;
	const [showLogin, toggleShowLogin] 		= useState(false);
	const [showCreate, toggleShowCreate] 	= useState(false);
	const [showAccount, toggleShowAccount]	= useState(false);

	const [AddMap] 				= useMutation(mutations.ADD_MAP);
	const [RenameMap] 			= useMutation(mutations.RENAME_MAP);
	const [DeleteMap]			= useMutation(mutations.DELETE_MAP);
	const [mapSelect, toggleMapSelect] = useState(true);
	const [currentRegion, setCurrentRegion] = useState({})
    let history = useHistory();

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
		setCurrentRegion(region)
		history.push("/map/"+region.name);
	}

    return(
        <WLayout wLayout="header">
			<WLHeader>
				<WNavbar color="colored">
					<ul>
						<WNavItem>
							<Logo className='logo' toggleMap={toggleMapSelect} mapSelect={mapSelect} />
						</WNavItem>
					</ul>
					<ul>
						{mapSelect ? <div></div> 
						:<div className="navRegionName" >{currentRegion.name}</div>  }
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

			{mapSelect ?

			!showAccount &&
            <WLMain>

				<div className='yourMapRed'></div>
				<div className='yourMapBlack' style={{color: "white"}}>Your Maps</div>
				<div className='yourMapLeft'>
					{	
						maplist.map((value, index) =>(
						<MapEntry
								value={value} renameMap={renameMap} deleteMap={deleteMap} handleSelectMap={handleSelectMap}
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
			
			: <>
			<Route
			path={"/map/"+currentRegion.name}
			name={"map_"+currentRegion.name}
			render={() => 
			<RegionSheet map={currentRegion} toggleMap={toggleMapSelect} showAccount={showAccount} />}
			>
			</Route></>}
			

			{
				showAccount && (<UpdateAccount fetchUser={props.fetchUser} setShowUpdate={setShowUpdate} user={props.user}/>)
			}

            </WLayout>
			
    );

}

export default MapSelector;