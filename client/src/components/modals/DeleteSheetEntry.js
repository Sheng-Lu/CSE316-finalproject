import React from 'react';

import { WModal, WMHeader, WMMain, WButton } from 'wt-frontend';

const DeleteSheetEntry = (props) => {

    const handleDelete = async () => {
        props.delete();
        props.setDelete(false);
    }

    return (
        <WModal className="delete-modal" cover="true" visible={props.deleteRegionConfirm} >
            <WMHeader  className="modal-header" onClose={() => props.setDelete(false)}>
                Delete Region?
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

export default DeleteSheetEntry;