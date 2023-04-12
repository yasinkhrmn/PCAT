const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
const fileUpload = require("express-fileupload");

const path = require("path");
const fs = require("fs");

const Photo = require("./models/Photo");

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

// ROUTES
app.get("/", async (req, res) => {
    const photos = await Photo.find({});
    res.render("index", {
        photos,
    });
});

app.get("/photos/:id", async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render("photo", {
        photo,
    });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.get("/add", (req, res) => {
    res.render("add");
});

app.post("/photos", async (req, res) => {
    const uploadedDir = "public/uploads";

    if (!fs.existsSync(uploadedDir)) {
        fs.mkdirSync(uploadedDir);
    }

    const uploadedImage = req.files.image;
    const uploadedPath = __dirname + "/public/uploads/" + uploadedImage.name;

    uploadedImage.mv(uploadedPath, async () => {
        await Photo.create({
            ...req.body,
            image: "/uploads/" + uploadedImage.name,
        });
        res.redirect("/");
    });
});

const port = 3000;

app.listen(port, () => {
    console.log(`sunucu ${port} portunda başlatildi.`);
});
