const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const fileUpload = require("express-fileupload");
const methodOverride = require("method-override");

const path = require("path");

const photoController = require("./controllers/photoController");
const pageController = require("./controllers/pageController");

const app = express();

// CONNECT TO DB
mongoose.connect("mongodb://127.0.0.1:27017/test");

// TEMPLATE ENGINE
app.set("view engine", "ejs");

// MIDDLEWARES
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(methodOverride("_method", { methods: ["POST", "GET"] })); // tag a is simulated like delete request

// ROUTES
app.get("/", photoController.getAllPhoto);

app.get("/photos/:id", photoController.getPhoto);

app.post("/photos", photoController.createPhoto);

app.put("/photos/:id", photoController.updatePhoto);

app.delete("/photos/:id", photoController.deletePhoto);

app.get("/about", pageController.getAboutPage);

app.get("/add", pageController.getAddPage);

app.get("/photos/edit/:id", pageController.getEdit);

const port = 3000;

app.listen(port, () => {
    console.log(`sunucu ${port} portunda başlatildi.`);
});
