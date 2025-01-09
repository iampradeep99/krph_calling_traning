const mongoose = require('mongoose');
const aggregatePaginate = require('mongoose-aggregate-paginate-v2'); // Assuming you are using this plugin

const languageSchema = new mongoose.Schema({
   
    languageName:{
        type:String,
        required:true
    },
    languageCode:{
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

languageSchema.plugin(aggregatePaginate);

const Language = mongoose.model('Language', languageSchema);

module.exports = Language;
