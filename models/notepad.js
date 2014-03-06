var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NotePad = new Schema({
    name: { type: String, required: true },
    date_created: { type: Date, required: true },
    date_updated: { type: Date, required: true },
    pinned: { type: Boolean },
    user_id: { type: String },
    active:{ type: Boolean, required: true }
});

module.exports = mongoose.model('NotePad', NotePad);
