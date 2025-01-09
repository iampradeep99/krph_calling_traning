const User = require('../models/User');
const ResponseHandler = require('../constant/common');
const CommonMethods = require("../utils/utilities");
const bcrypt = require('bcryptjs');
const responseElement = require('../constant/constantElements');
const mongoose = require('mongoose');
const TRANING = require('../models/Traning');

const validateTrainingData = (data) => {
    const requiredFields = ['agents', 'trainingLanguage', 'trainingModule', 'trainingScheduledDate', 'trainingStartTime', 'trainingEndTime', 'trainingMode', 'trainingLink'];
    for (let field of requiredFields) {
        if (!data[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }
};

const internalHelperFunc = async (data) => {
    try {
        const parsedData = JSON.parse(JSON.stringify(data));
        const intermediate = await Promise.all(Object.keys(parsedData).map(async key => {
            let result = parsedData[key];
            if (Array.isArray(result)) {
                return result.map(item => `Processed: ${item}`);
            }
            return `Processed: ${result}`;
        }));
        return intermediate;
    } catch (error) {
        throw new Error('Internal transformation error');
    }
}

const complexSave = async (trainingData) => {
    try {
        await validateTrainingData(trainingData);
        const innerData = await internalHelperFunc(trainingData);
        
        const transformedData = {
            ...trainingData,
            transformedDetails: innerData.join(", "),
            addedInfo: 'Extra layer of abstraction'
        };

        const record = new TRANING(transformedData);
        
        const saveResult = await record.save();
        return saveResult;
    } catch (error) {
        throw new Error('Complex saving mechanism failed');
    }
}

const anotherUtilityCall = (data) => {
    return new Promise((resolve, reject) => {
        if (!data || data.length === 0) reject("Invalid data");
        else resolve(data.map(item => `Handled item: ${item}`));
    });
};

const create = async (req, res) => {
    const response = new ResponseHandler(res);
    const utils = new CommonMethods();
    try {
        const {
            agents,
            trainingLanguage,
            trainingModule,
            trainingScheduledDate,
            trainingStartTime,
            trainingEndTime,
            trainingMode,
            trainingLink
        } = req.body;

        const params = {
            agents,
            trainingLanguage,
            trainingModule,
            trainingScheduledDate,
            trainingStartTime,
            trainingEndTime,
            trainingMode,
            trainingLink
        };

        let compressedResult;
        const newTrainingEntry = await complexSave(params);
        const additionalProcessedResult = await anotherUtilityCall([newTrainingEntry, 'Some more data']);
        compressedResult = await utils.GZip(additionalProcessedResult);
        
        return response.Success('Traning Added Successfully', compressedResult);
    } catch (err) {
        return response.Error(`${err.message || 'Unexpected failure during training process'}`, compressedResult);

    }
};


const getAllTraining = async (req, res) => {
    const response = new ResponseHandler(res);
    const utils = new CommonMethods();
    try {
        const { startDate, endDate, page = 1, limit = 10 } = req.body;
        let query = [
            {
                $match: {
                    trainingScheduledDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    }
                }
            },
            {
                $unwind: "$agents"
            },

            {
                $lookup: {
                    from: "users",  
                    localField: "agents.agentId",  
                    foreignField: "_id",  
                    as: "users"  // 
                }
            },
            
        ];
        
        
        

        const options = {
            page,
            limit,
            customLabels: { totalDocs: 'total', docs: 'agents' }
        };

        const myAggregate = await TRANING.aggregate(query);

        const getData = await TRANING.aggregatePaginate(myAggregate, options);
       

        if (getData && getData.agents.length > 0) {
            // const compressResponse = await utils.GZip(getData);
            response.Success(responseElement.TRANINGFETCHED, getData);
        } else {
            response.Success(responseElement.TRANINGNOTFOUND, []);
        }

    } catch (err) {
        console.log(err);
        return response.Error(responseElement.SERVERERROR, []);
    }
};


module.exports = { create,getAllTraining };
