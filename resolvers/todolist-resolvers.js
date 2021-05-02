const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
const Sorting = require('../utils/sorting')

// The underscore param, "_", is a wildcard that can represent any value;
// here it is a stand-in for the parent parameter, which can be read about in
// the Apollo Server documentation regarding resolvers

module.exports = {
	Query: {
		

		getAllMaps: async (_, __, { req }) => {
			const _id = new ObjectId(req.userId);
			if(!_id) { return([])};
			const map = await Map.find({owner: _id});
			if(map) {
				return (map);
			}
		},
	},
	Mutation: {
		addMap: async(_, args) =>{
			const { map } = args;
			const objectId = new ObjectId();
			const {id, name, owner, region} = map;
			const newMap = new Map({
				_id: objectId,
				name: name,
				owner: owner,
				region: region,
			});
			const updated = await newMap.save();
			if(updated){
				return newMap;
			}
			
		},

		
		// renameMap: async(_, args) =>{
		// 	const {newName, _id} = args;
		// 	const id = new ObjectId(_id);
		// 	const updated = await Map.updateOne({_id: id}, {})
		// }
	}
}