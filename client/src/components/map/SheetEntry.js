import React, { useState } from 'react';
import { WButton, WInput, WRow, WCol, WNavItem} from 'wt-frontend';
import { BrowserRouter, Switch, Route, Redirect, useHistory } from 'react-router-dom';

const SheetEntry = (props) => {

    return(
        <div>
            {props.region.name}
        </div>
    )
}

export default SheetEntry