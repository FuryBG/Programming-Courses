const productService = require("../services/product");

module.exports = () => {
    return (req, res, next) => {
        req.storage = {
            create,
            getAll: productService.getAll,
            getById: productService.getById,
            del: productService.del,
            edit: productService.edit,
            enroll: productService.enroll
        };


        next();


        async function create(data) {
            let check = await productService.checkByTitle(data.title);
            if(check.length != 0) {
                throw new Error("Product already exist!");
            };
            await productService.create(data);
        };
    };
}