const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const morgan = require("morgan");
const dotenv = require("dotenv");
const cors = require('cors')
const Replicate = require("replicate");

///App 
const app = express();

//port
const port = process.env.PORT || 5000; 

// Serve static files from the "public" directory
app.use('/images', express.static(path.join(__dirname, 'public/images')));
app.use(express.static(path.join(__dirname, "client", "build")))

//Config //env variable
dotenv.config({ path: "./Config/config.env" }); 

//cors
app.use(cors());

// DB Connection
const connectDB = require('./Config/db')
connectDB();

//Body Parsing
// app.use(express.json());
app.use(bodyParser.json({ limit: "100mb" }))
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

///Routes Import 
const user = require('./Routes/User')
const GenerateImages = require("./Routes/GenerateImage")

///Middleware
app.use("/api/v1/auth",user);
app.use("/api/v1/images",GenerateImages)

// Handle React routing, return all requests to React app
app.all("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

// Environment Setup
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

const server = app.listen(port, () => {
    console.log(
      `App running in ${process.env.NODE_ENV} listening on port ${port}`
    );
  });
  
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
  server.close(() => process.exit(1));
});