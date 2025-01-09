const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); // Assuming you are using this plugin

const trainingModeSchema = new mongoose.Schema({
   
    traningModeName:{
        type:Number,
        enum:[1,2,3,4],
        required:true
        /* 
        1 - Google Meet
        2 - Whatsapp
        3 - Zoom
        4 - In-House

        */
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

trainingModeSchema.plugin(aggregatePaginate);

const TrainingMode = mongoose.model('TraningMode', trainingModeSchema);

module.exports = TrainingMode;
