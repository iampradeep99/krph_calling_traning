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





const getCountryStateCity = async (req, res) => {
    const response = new ResponseHandler(res);
    const utils = new CommonMethods();

    try {

      let { _id, mode } = req.body;
        let compressResponse;
      let query = { type: mode };
      if (mode === responseElement.STATEMODE) {
        query = { country: mongoose.Types.ObjectId(_id), type: mode }; 
      } else if (mode === responseElement.CITYMODE) {
        query = { state: mongoose.Types.ObjectId(_id), type: mode }; 
      }
      let getData;
      if (mode === responseElement.COUNTRYMODE) {
        getData = await COUNTRY.find(query); 
      } else if (mode === responseElement.STATEMODE) {
        getData = await STATE.find(query); 
      } else if (mode === responseElement.CITYMODE) {
        getData = await CITY.find(query); 
      }
      compressResponse = await utils.GZip(getData);
      return response.Success("Fetched Successfully",compressResponse)
    } catch (err) {
      console.log(err);
      return response.Error(responseElement.SERVERERROR, [])
    }
  };
  

  const getAllLanguages = async(req, res)=>{
    const response = new ResponseHandler(res);
    const utils = new CommonMethods();
    try{
        let {} = req.body;
        let query = {}
        let compressResponse;
    
        let languages = await LANGUAGE.find(query);
        if(languages.length > 0){
            compressResponse = await utils.GZip(languages);
            return response.Success("Language Fetched",compressResponse)
        }else{
            return response.Error("Error in fetched",[])

        }
    }catch(err){
        console.log(err)
        return response.Error(responseElement.SERVERERROR,[])

    }
  }

  const getAllModes = async (req, res)=>{
    const response = new ResponseHandler(res);
    const utils = new CommonMethods();
    try{
        let {} = req.body;
        let query = {}
        let compressResponse;
        let trainingModes = await TRANINGMODE.find(query);
        if(trainingModes.length > 0){
            compressResponse = await utils.GZip(trainingModes);
            return response.Success("Language Fetched",compressResponse)
        }else{
            return response.Error("Error in fetched",[])
        }
    }catch(err){
        return response.Error(responseElement.SERVERERROR,[])

    }
  }

  const getTraningModules = async(req, res)=>{
    const response = new ResponseHandler(res);
    const utils = new CommonMethods();
    try{
        let {} = req.body;
        let query = {}
        let compressResponse;
        let trainingModules = await TRANINGMODULE.find(query);
        if(trainingModules.length > 0){
            compressResponse = await utils.GZip(trainingModules);
            return response.Success("Language Fetched",compressResponse)
        }else{
            return response.Error("Error in fetched",[])
        }

    }catch(err){
        return response.Error(responseElement.SERVERERROR,[])

    }
  }


  const Menu = require('../models/Menu');  
  const SubMenu = require('../models/Submenu');  

  const addMenu = async (req, res) => {
    try {
        const { name, url, order, icon, active } = req.body;

        // Create a new top-level menu
        const newMenu = new Menu({
            name,
            url,
            order: order || 0,
            icon: icon || null,
            active: active !== undefined ? active : true
        });

        // Save the new menu
        await newMenu.save();

        return res.status(201).json({
            message: 'Menu added successfully',
            data: newMenu
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};

const addSubmenu = async (req, res) => {
    try {
        const { menuId } = req.body;  // Get the menuId from the request body
        const { name, url, order, icon, active } = req.body;

        const parentMenu = await Menu.findById(menuId);

        if (!parentMenu) {
            return res.status(400).json({ message: 'Parent menu not found' });
        }

        const newSubMenu = new SubMenu({
            name,
            url,
            parent: menuId,  // Set the parent reference to the parent menu
            order: order || 0,
            icon: icon || null,
            active: active !== undefined ? active : true
        });

        // await newSubMenu.save();

        parentMenu.submenus.push(newSubMenu);

        await parentMenu.save();

        return res.status(201).json({
            message: 'SubMenu added successfully',
            data: newSubMenu
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};


const getMenuWithSubmenus = async (req, res) => {
    try {
        const { menuId } = req.body;

        const menuWithSubmenus = await Menu.aggregate([
            {
                $match: {
                    _id: mongoose.Types.ObjectId(menuId)  
                }
            },
            {
                $lookup: {
                    from: 'submenus',  
                    localField: 'submenus',  
                    foreignField: '_id', 
                    as: 'submenus'  
                }
            }
        ]);

        if (menuWithSubmenus.length === 0) {
            return res.status(404).json({ message: 'Menu not found' });
        }

        return res.status(200).json({
            message: 'Menu fetched successfully',
            data: menuWithSubmenus[0]  
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Server error',
            error: err.message
        });
    }
};



const Profile = require('../models/Profile');  // Assuming the Profile schema is in the 'models' directory

const addProfile = async (req, res) => {
    try {
      const { profileName, profileDescription, insertIPAddress, activeStatus, menuPermission } = req.body;
  
      const existingProfile = await Profile.findOne({ profileName });
      if (existingProfile) {
        return res.status(400).json({ message: 'Profile with this name already exists' });
      }
  
      const newProfile = new Profile({
        profileName,
        profileDescription,
        insertIPAddress,
        activeStatus,
        menuPermission,  
      });
  
      const savedProfile = await newProfile.save();
  
      return res.status(201).json({
        message: 'Profile created successfully',
        profile: savedProfile,
      });
  
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Server error, could not create profile' });
    }
  };

  
  








module.exports = {getCountryStateCity,getAllLanguages,getAllModes,getTraningModules,addMenu,addSubmenu, getMenuWithSubmenus,addProfile};
