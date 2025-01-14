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


const getAllTrainingInfo = async (req, res) => {
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
                $lookup: {
                    from: "languages",           
                    localField: "trainingLanguage", 
                    foreignField: "_id",           
                    as: "trainingLanguage"      
                }
            },
            {
                $project: {
                    trainingScheduledDate: 1,  // Include this field
                    trainingLanguage: {        // Include only specific fields from the trainingLanguage
                        $arrayElemAt: ["$trainingLanguage", 0]  // Extract first item from array returned by lookup
                    }
                }
            },
            {
                $project: {
                    trainingScheduledDate: 1,  // Include this field
                    "trainingLanguage._id": 1, // Include only _id of the trainingLanguage
                    "trainingLanguage.name": 1 // Include other fields you want from the trainingLanguage, e.g., "name"
                }
            }
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

const moment = require('moment'); 

const allTraning = async (req, res) => {
    const response = new ResponseHandler(res);
    const utils = new CommonMethods();
    try {
        const { startDate, endDate, page = 1, limit = 10 } = req.body;
        let matchCondition = {};

        if (startDate && endDate) {
            matchCondition.trainingScheduledDate = {
                $gte: moment(startDate).startOf('day').toDate(),
                $lte: moment(endDate).endOf('day').toDate()
            };
        } else if (startDate) {
            matchCondition.trainingScheduledDate = { 
                $gte: moment(startDate).startOf('day').toDate() 
            };
        } else if (endDate) {
            matchCondition.trainingScheduledDate = { 
                $lte: moment(endDate).endOf('day').toDate() 
            };
        }
        let query = [
            {
                $match: matchCondition
            },
            {
                $lookup: {
                    from: "users",
                    localField: "agents.agentId",
                    foreignField: "_id",
                    as: "agents"
                }
            },
            {
                $lookup: {
                    from: "languages",
                    localField: "trainingLanguage",
                    foreignField: "_id",
                    as: "trainingLanguage"
                }
            },
            {
                $unwind: {
                    path: "$trainingLanguage",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "traningmodes",
                    localField: "trainingMode",
                    foreignField: "_id",
                    as: "trainingMode"
                }
            },
            {
                $unwind: {
                    path: "$trainingMode",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "traningmodules",
                    localField: "trainingModule",
                    foreignField: "_id",
                    as: "trainingModule"
                }
            },
            {
                $unwind: {
                    path: "$trainingModule",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    agents: 1,
                    trainingLanguage: {
                        languageName: "$trainingLanguage.languageName"
                    },
                    trainingScheduledDate: 1,
                    trainingStartTime: 1,
                    trainingEndTime: 1,
                    trainingMode: {
                        traningModeName: "$trainingMode.traningModeName"
                    },
                    trainingLink: 1
                }
            }
        ];

        const data = await TRANING.aggregate(query);
        if(data.length > 0){
            const compressResponse = await utils.GZip(data);
            response.Success(responseElement.TRANINGFETCHED, compressResponse);
        }else{
            response.Success(responseElement.TRANINGNOTFOUND, []);
        }

        // res.status(200).json(data);

    } catch (err) {
   console.log(err)
        return response.Error(responseElement.SERVERERROR, []);

    }
};



module.exports = { create,allTraning };
