const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    url: {
        type: String,
        required: true
    },
    submenus: [],
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

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
