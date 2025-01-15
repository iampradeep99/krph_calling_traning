const User = require('../models/User');
const ResponseHandler = require('../constant/common');
const CommonMethods = require("../utils/utilities");
const bcrypt = require('bcryptjs');
const responseElement = require('../constant/constantElements')
const mongoose = require('mongoose');
const { request } = require('../app');
const STATE = require('../models/State')
const COUNTRY = require('../models/Country')
const CITY = require('../models/City')
const LANGUAGE = require('../models/Language')
const TRANINGMODULE = require('../models/TraningModule')
const TRANINGMODE = require('../models/TraningMode')
const PROFILE = require('../models/Profile')




const assignProfile = async(req, res)=>{
    const response = new ResponseHandler(res);
    const utils = new CommonMethods();
    try{
        let {profile_id, userId} = req.body;
        if(!profile_id){
            return response.Error("Profile Id is not found", []);
        }
         if(!userId){
            return response.Error("User Id is not found", []);
            
         }

         let assignProfile = await User.findOneAndUpdate({_id:userId},{$set:{assignedProfile:profile_id}},{new:true})
         
         if(assignProfile){
            const compressResponse = await utils.GZip([assignProfile]);
             return response.Success("Profile assigned successfully", compressResponse);
         }else{
            const compressResponse = await utils.GZip([]);
             return response.Error("Error in assigning profile", compressResponse);
         }


    }catch(err){
        console.log(err);
        return response.Error("Server Error", []);

    }
}

const assignPermissionToProfile = async (req, res) => {
    const response = new ResponseHandler(res);
    const utils = new CommonMethods();
    try {
        const { menuId, profileId } = req.body;

        if (!profileId) {
            return response.Error("Profile Id is not found", []);
        }

        if (!menuId) {
            return response.Error("Menu Id is not found", []);
        }

        const menuIds = Array.isArray(menuId) ? menuId : [menuId];

        const updatedProfile = await PROFILE.findOneAndUpdate(
            { _id: profileId },
            { $addToSet: { menuPermission: { $each: menuIds } } }, 
            { new: true } 
        );

        if (updatedProfile) {
            const compressResponse = await utils.GZip([updatedProfile]);

            return response.Success("Permissions assigned successfully", compressResponse);
        } else {
            const compressResponse = await utils.GZip([]);

            return response.Error("Profile not found", compressResponse);
        }
    } catch (err) {
        console.log(err);
        return response.Error("Server error", []);
    }
};









module.exports = {
    assignProfile,
    assignPermissionToProfile
}