const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); // Assuming you are using this plugin

const trainingSchema = new mongoose.Schema({
    agents: [
        { agentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" } }
    ],
    trainingLanguage: {
        type:mongoose.Schema.Types.ObjectId, ref:"Language"
    },
    trainingModule: {
        type:mongoose.Schema.Types.ObjectId, ref:"TraningModule"
    },
    trainingScheduledDate: {
        type: Date,
        required: true
    },
    trainingStartTime: {
        type: Date,
    },
    trainingEndTime: {
        type: Date, 
    },
    trainingMode: {
        type:mongoose.Schema.Types.ObjectId, ref:"TraningMode" 
    },
    trainingLink: {
        type: String, 
    },
    insertDateTime: {
        type: Date,
        default: Date.now,
      },
      updateDateTime: {
        type: Date,
        default: null,
      },
}, { timestamps: true });

trainingSchema.plugin(aggregatePaginate);

const Training = mongoose.model('Training', trainingSchema);

module.exports = Training;
