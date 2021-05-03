const { gql } = require('apollo-server');


const typeDefs = gql `
	
	
	type Map {
		_id: String!
		name: String!
		owner: String!
		region: [Region]
	}
	type Region {
		_id: String!
		name: String!
		capital: String!
		leader: String!
		flag: String!
		landmarks: [String]
	}
	extend type Query {
		getAllMaps: [Map]
		getMapById: Map
	}

	extend type Mutation {
		addMap(map: MapInput!): Map
		renameMap(_id: String!, newName: String!): String
		deleteMap(_id: String!): Boolean
		addRegion(_id: String!, region:RegionInput!): String
	}

	input MapInput{
		_id: String
		name: String
		owner: String
		region: [RegionInput]
	}
	input RegionInput{
		_id: String
		name: String
		capital: String
		leader: String
		flag: String
		landmarks: [String]
	}
`;

module.exports = { typeDefs: typeDefs }