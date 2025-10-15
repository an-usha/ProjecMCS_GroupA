const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const bodyParser = require("body-parser");
const homerouter = require("./routes/home");
const errorRouter = require("./routes/errorRoute");
const authRouter = require("./routes/authRoute");
const apimsRouter = require("./routes/apimsRoute");
const lienRequestRoute = require("./routes/lienRequestRoute");
const cardBlockRoute = require("./routes/cardBlockRoute");
const userInfoRoute= require("./routes/userInfoRoute");
const missedCallListRoute= require("./routes/missedCallListRoute");

const { checkAPIKey, verifyToken } = require("./middleware/auth");
const logger = require("./middleware/logger");

const app = express();

//Setting up ENV in our project
require("dotenv").config();

//load data from DB on scheduled basis
require ("./config/loadDataFromDB");

//CORS (Cross-Origin Resource Sharing middleware)
app.use(cors());

// app.use(cors({
//   origin: 'https://callcenteradmin.ctznbank.com', // Replace with your specific domain
//   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//   optionsSuccessStatus: 204,
// }));

//global middlewares
app.use(morgan("dev"));
app.use(logger);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(homerouter);
app.use("/api/auth", authRouter);
app.use("/api/apims", verifyToken, apimsRouter);
app.use("/api/lein", verifyToken, lienRequestRoute);
app.use("/api/card", verifyToken, cardBlockRoute);
app.use("/api/user", verifyToken, userInfoRoute);
app.use("/api/missedCall", verifyToken, missedCallListRoute);


//app.use("/api/apims", apimsRouter);
app.use(errorRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
