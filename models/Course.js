const { Schema, model } = require("mongoose");

const schema = new Schema({
    title:{type: String, required: true},
    description: {type: String, required: true},
    imgUrl: {type: String, required: true},
    duration: {type: String, required: true},
    createdAt: {type: Date, default: Date.now},
    enrolls: [{type: Schema.Types.ObjectId, ref: "User"}],
    owner: {type: Schema.Types.ObjectId, ref: "User", required: true}
});


module.exports = model("Course", schema);