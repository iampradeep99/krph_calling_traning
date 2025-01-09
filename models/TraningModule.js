const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); // Assuming you are using this plugin

const trainingModuleSchema = new mongoose.Schema({
   
    moduleName:{
        type:String,
        required:true
    },
    moduleCode:{
        type:String,
        required:true
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

trainingModuleSchema.plugin(aggregatePaginate);

const TrainingModule = mongoose.model('TraningModule', trainingModuleSchema);

module.exports = TrainingModule;
