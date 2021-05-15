import { gql } from "@apollo/client";

export const LOGIN = gql`
	mutation Login($email: String!, $password: String!) {
		login(email: $email, password: $password) {
			email 
			_id
			firstName
			lastName
			password
			initials
		}
	}
`;

export const REGISTER = gql`
	mutation Register($email: String!, $password: String!, $firstName: String!, $lastName: String!) {
		register(email: $email, password: $password, firstName: $firstName, lastName: $lastName) {
			email
			password
			firstName
			lastName
		}
	}
`;

export const UPDATE = gql`
mutation Update($email: String!, $password: String!, $firstName: String!, $lastName: String!, $oldEmail: String!) {
	update(email: $email, password: $password, firstName: $firstName, lastName: $lastName, oldEmail: $oldEmail) {
		email
		password
		firstName
		lastName
	}
}
`;

export const LOGOUT = gql`
	mutation Logout {
		logout 
	}
`;

export const ADD_MAP = gql`
mutation AddMap($map: MapInput!) {
	addMap(map: $map){
		_id
		name
		owner
		region{
			_id
			name
			capital
			leader
			flag
			landmarks
		}
	}
}
`;

export const RENAME_MAP =  gql`
mutation RenameMap($_id: String!, $newName: String!) {
	renameMap(_id: $_id, newName: $newName)
}
`;

export const DELETE_MAP = gql`
	mutation DeleteMap($_id: String!) {
		deleteMap(_id: $_id)
	}
`;

export const ADD_REGION = gql`
mutation AddRegion($_id: String!, $region: RegionInput!, $index: Int!) {
	addRegion(_id: $_id, region: $region, index: $index)
}
`;

export const UPDATE_REGION_SHEET_FIELD = gql`
	mutation UpdateRegionSheetField($_id: String!, $regionId: String!, $field: String!, $value: String!) {
		updateRegionSheetField(_id: $_id, regionId: $regionId, field: $field, value: $value) {
			_id
			name
			capital
			leader
			flag
			landmarks
		}
	}
`;

export const UPDATE_LANDMARK = gql`
	mutation UpdateLandmark($_id: String!, $regionId: String!, $field: String!, $value: [String]) {
		updateLandmark(_id: $_id, regionId: $regionId, field: $field, value: $value) {
			_id
			name
			capital
			leader
			flag
			landmarks
		}
	}
`;

export const DELETE_SHEET_REGION = gql`
	mutation DeleteSheetRegion($_id: String!, $regionId: String!) {
		deleteSheetRegion(_id: $_id, regionId: $regionId) {
			_id
			name
			capital
			leader
			flag
			landmarks
		}
	}
`;

export const SORT_REGION = gql`
	mutation SortRegion($_id: String!, $criteria: String!, $increasing: Boolean!){
		sortRegion(_id: $_id, criteria: $criteria, increasing: $increasing) {
			_id
			name
			capital
			leader
			flag
			landmarks
		}
	}
`;