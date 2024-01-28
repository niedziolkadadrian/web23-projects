const asyncHandler = require("express-async-handler")

const index = (req, res) => {
    res.render('index');
};

module.exports = { index }