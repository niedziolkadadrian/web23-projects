const express = require("express");
const dotenv = require("dotenv").config();
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection");

connectDb();
const app = express();

const port = 8080;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(express.json());
app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use('/', require("./routes/mvcRoutes"));
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Express app on port ${port}`);
});