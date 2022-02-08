const Course = require("../models/Course");


async function getAll(query) {
    let search = {};
    if(query.title) {
        search = {title: {$regex: `${query.title}`, $options: "i"}};
    };
    const allCourses = await Course.find(search).sort({createdAt: 1}).lean();
    return allCourses;
};
async function getById(id) {
    const currItem = await Course.findById(id).populate("enrolls").lean();
    return currItem;
};
async function create(data) {
    let newItem = new Course(data);
    await newItem.save();
};
async function del(id) {
    await Course.findOneAndDelete({_id: id});
};
async function edit(id, data) {
    let oldItem = await Course.findById(id);
    let newItem = Object.assign(oldItem, data);
    await newItem.save();
};
async function checkByTitle(title) {
    let existing = await Course.find({title: title});
    return existing;
};

async function enroll(id, userId) {
    let currItem = await Course.findById(id);
    currItem.enrolls.push(userId);
    await currItem.save();
};





module.exports = {
    getAll,
    getById,
    create,
    del,
    edit,
    checkByTitle,
    enroll
};