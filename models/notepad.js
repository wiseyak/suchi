var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NoteSchema = new Schema({
    content: { type: String, required: true },
    notepad_id: { type: String },
    complete:{ type: Boolean, required: true }
});
var NotePadSchema = new Schema({
    name: { type: String, required: true },
    date_created: { type: Date, required: true },
    date_updated: { type: Date, required: true },
    pinned: { type: Boolean },
    user_id: { type: String },
    active:{ type: Boolean, required: true },
    note: [NoteSchema]
});

module.exports = mongoose.model('NotePad', NotePadSchema);
