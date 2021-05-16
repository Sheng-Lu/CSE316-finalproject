import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteMap = (props) => {

    const handleDelete = async () => {
        props.delete(props.mapId);
        props.setDelete(false);
    }

    return (
        <WModal className="delete-modal" cover="true" visible={props.deleteMapConfirm} >
            <WMHeader  className="modal-header" onClose={() => props.setDelete(false)}>
                Delete Map?
			</WMHeader >

            <WMMain>
                <WButton className="modal-button cancel-button" onClick={() => props.setDelete(false)} wType="texted">
                    Cancel
				</WButton>
                <label className="col-spacer">&nbsp;</label>
                <WButton className="modal-button" onClick={handleDelete} clickAnimation="ripple-light" hoverAnimation="darken" shape="rounded" color="danger">
                    Delete
				</WButton>
            </WMMain>

        </WModal >
    );
}

export default DeleteMap;