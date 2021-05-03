import React from 'react';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';

const Logo = (props) => {

    let history = useHistory();
    const handleReturnHome = () =>{
        if(!props.mapSelect && props.regionSelect && props.auth){
            props.toggleMap(true);
            history.push("/map");
        }
    }

    return (
        <div className='logo' style={{color: "orange"}} onClick={handleReturnHome} style={ !props.mapSelect ? {cursor:"pointer"} : {}} >
            The World Data Mapper
        </div>
    );
};

export default Logo;