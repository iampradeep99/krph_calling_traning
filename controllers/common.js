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








module.exports = {getCountryStateCity,getAllLanguages,getAllModes,getTraningModules};
