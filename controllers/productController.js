const router = require("express").Router();
const { isUser } = require("../middlewares/guards");

router.get("/", async(req, res) => {
    let allCourses = await req.storage.getAll(req.query);
    if(req.user) {
        res.render("user-home.hbs", {all: allCourses});
    }else { 
        allCourses.map(x => x.enrollsCount = x.enrolls.length);
        let sorted = allCourses.sort((a, b) => b.enrollsCount - a.enrollsCount);
        res.render("guest-home.hbs", {all: sorted});
    };
});

router.get("/edit/:id", isUser(), async(req, res) => {
    let currItem = await req.storage.getById(req.params.id);
    res.render("edit-course.hbs", currItem);
});

router.post("/edit/:id", isUser(), async(req, res) => {
    let errors = [];
    try {
        if(req.body.title.length < 4) {
            errors.push("Title is too short!");
        }
        if(req.body.description.length < 20) {
            errors.push("Description is too short!");
        }
        if(!req.body.imgUrl.startsWith("http://") && !req.body.imgUrl.startsWith("https://")) {
        errors.push("Img url is not valid!");
        };
        if(errors.length > 0) {
            throw new Error(errors.join("\n"));
        };
        await req.storage.edit(req.params.id, req.body);
        res.redirect(`/details/${req.params.id}`);
    }catch(err) {
        res.render("edit-course.hbs", {errors: err.message.split("\n")});
    };
});

router.get("/enroll/:id", isUser(), async(req, res) => {
    await req.storage.enroll(req.params.id, req.user._id);
    res.redirect(`/details/${req.params.id}`);
});

router.get("/details/:id", async(req, res) => {
    const currItem = await req.storage.getById(req.params.id);
    const enrolled = currItem.enrolls.find(x => x._id == req.user._id);

    if(req.user._id == currItem.owner) {
        currItem.isOwner = true;
    }
    if(enrolled) {
        currItem.isEnrolled = true;
    }
    res.render("course-details.hbs", currItem);
});

router.get("/create", isUser(), (req, res) => {
    res.render("create-course.hbs");
});

router.post("/create", isUser(), async(req, res) => {
    let errors = [];
    try {
        if(req.body.title.length < 4) {
            errors.push("Title is too short!");
        }
        if(req.body.description.length < 20) {
            errors.push("Description is too short!");
        }
        if(!req.body.imgUrl.startsWith("http://") && !req.body.imgUrl.startsWith("https://")) {
        errors.push("Img url is not valid!");
        };
        if(errors.length > 0) {
            throw new Error(errors.join("\n"));
        };
        req.body.owner = req.user._id;
        await req.storage.create(req.body);
        res.redirect("/");
    }catch(err) {
        res.render("create-course.hbs", {errors: err.message.split("\n")});
    };
});



module.exports = router;