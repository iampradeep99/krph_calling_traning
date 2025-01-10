const mongoose = require('mongoose');

const subMenuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',  // Reference to the parent Menu
        required: true
    },
    order: {
        type: Number,
        default: 0
    },
    icon: {
        type: String,
        default: null
    },
    active: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const SubMenu = mongoose.model('SubMenu', subMenuSchema);

module.exports = SubMenu;
