const Photo = require("../models/Photo");
const fs = require("fs");

exports.getAllPhoto = async (req, res) => {
    const photos = await Photo.find({});
    res.render("index", {
        photos,
    });
};

exports.getPhoto = async (req, res) => {
    const photo = await Photo.findById(req.params.id);
    res.render("photo", {
        photo,
    });
};

exports.createPhoto = async (req, res) => {
    const uploadedDir = __dirname + "/../public/uploads";

    if (!fs.existsSync(uploadedDir)) {
        fs.mkdirSync(uploadedDir);
    }

    const uploadedImage = req.files.image;
    const uploadedPath = __dirname + "/../public/uploads/" + uploadedImage.name;

    uploadedImage.mv(uploadedPath, async () => {
        await Photo.create({
            ...req.body,
            image: "/uploads/" + uploadedImage.name,
        });
        res.redirect("/");
    });
};

exports.updatePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    photo.title = req.body.title;
    photo.description = req.body.description;
    photo.save();
    res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
    const photo = await Photo.findOne({ _id: req.params.id });
    const deletedImage = __dirname + "/../public" + photo.image;
    fs.unlinkSync(deletedImage);
    await Photo.findByIdAndRemove(req.params.id);
    res.redirect("/");
};
