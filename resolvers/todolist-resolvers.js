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
		getMapById : async (_, args) => {
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const map = await Map.findOne({_id: objectId});
			if(map) return map;
			else return ({});
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
			return;
		},

		renameMap: async(_, args) =>{
			const {_id, newName} = args;
			const id = new ObjectId(_id);
			const updated = await Map.updateOne({_id: id}, {name: newName})
			if(updated) return newName;
			else return "";
		},

		deleteMap: async(_, args) =>{
			const { _id } = args;
			const objectId = new ObjectId(_id);
			const deleted = await Map.deleteOne({_id: objectId});
			if(deleted) return true;
			else return false;
		},

		addRegion: async(_, args) =>{
			const {_id, region, index} = args;
			const mapId = new ObjectId(_id);
			const objectId = new ObjectId();
			const found = await Map.findOne({_id: mapId});
			if(region._id === '') region._id = objectId;
			let regList = found.region;

			if(index < 0) regList.push(region);
			else regList.splice(index, 0, region);
			// regList.push(region);

			const updated = await Map.updateOne({_id: mapId}, {region: regList});
			if(updated) return (region._id);
			else return "not";
		},

		updateRegionSheetField: async (_, args) =>{
			const { _id, regionId, field} = args;
			let { value } = args
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let region = found.region;

			region.map(region =>{
				if(region._id.toString() === regionId){
					region[field] = value;
				}
			});

			const updated = await Map.updateOne({_id: mapId}, { region: region });
			if(updated) return (region);
			else return (found.region);
		},

		deleteSheetRegion: async (_, args) => {
			const  { _id, regionId } = args;
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let region = found.region;

			region = region.filter(item => item._id.toString() !== regionId);

			const updated = await Map.updateOne({_id: mapId}, { region: region })
			if(updated) return (region);
			else return (found.region);
		},

		sortRegion: async (_, args) => {
			const {_id, criteria, increasing} = args;
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let region = found.region;
			
			region.sort(function(item1, item2){
				let negate = -1
				if (!increasing) {
					negate = 1;
				}
				let value1 = item1[criteria];
				let value2 = item2[criteria];
				if (value1 < value2) {
					return -1 * negate;
				}
				else if (value1 === value2) {
					return 0;
				}
				else {
					return 1 * negate;
				}
			})

			const updated = await Map.updateOne({_id: mapId}, { region: region })
			if(updated) return (region);
			else return (found.region);
		},

		updateLandmark: async (_, args) =>{
			const { _id, regionId} = args;
			let { value } = args
			const mapId = new ObjectId(_id);
			const found = await Map.findOne({_id: mapId});
			let region = found.region;

			region.map(region =>{
				if(region._id.toString() === regionId){
					region.landmarks = value;
				}
			});
			
			const updated = await Map.updateOne({_id: mapId}, { region: region });
			if(updated) return (region);
			else return (found.region);
		}
	}
}