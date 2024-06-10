const asyncHandler = require("../Middleware/async");
const Replicate = require("replicate");
const replicate = new Replicate();
const SavedImages = require("../Models/images");
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const saveImageLocally = async (imageUrl, filename) => {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imagePath = path.join(__dirname, '../public/images', filename);
    fs.writeFileSync(imagePath, response.data);
    return imagePath;
};

exports.Generate = asyncHandler(async (req, res, next) => {
    const { userId, base64StringImage, inputText } = req.body;
    const image = `data:application/octet-stream;base64,${base64StringImage}`;
    const input = {
        image: image,
        prompt: inputText
    };

    const output = await replicate.run("adirik/interior-design:76604baddc85b1b4616e1c6475eca080da339c8875bd4996705440484a6eac38", { input });
    const output2 = await replicate.run("agilley/controlnet-hough:854e8727697a057c525cdb45ab037f64ecca770a1769cc52287c2e56472a247b", { input });

    // Save images locally
    const imageFilename1 = `${uuidv4()}.png`;
    const imageFilename2 = `${uuidv4()}.png`;

    const localImagePath1 = await saveImageLocally(output, imageFilename1);
    const localImagePath2 = await saveImageLocally(output2[1], imageFilename2);

    // Construct server URLs
    const serverUrl1 = `${req.protocol}://${req.get('host')}/images/${imageFilename1}`;
    const serverUrl2 = `${req.protocol}://${req.get('host')}/images/${imageFilename2}`;

    const GeneratedImage1 = await SavedImages.create({
        userId: userId,
        ImageUrl: serverUrl1,
        Feedback: ""
    });

    const GeneratedImage2 = await SavedImages.create({
        userId: userId,
        ImageUrl: serverUrl2,
        Feedback: ""
    });

    return res.status(200).json({
        success: true,
        output: [GeneratedImage1, GeneratedImage2],
        message: "Images generated and saved successfully",
    });
});

exports.getImagesByUser = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;

    const images = await SavedImages.find({ userId: userId });

    if (!images) {
        return res.status(404).json({
            success: false,
            message: "No images found for this user"
        });
    }

    return res.status(200).json({
        success: true,
        images: images
    });
});

// Update feedback for an image
exports.feedbackbyUser =  asyncHandler(async (req, res, next) => {
    const { imageId, feedback } = req.body;
    console.log(imageId,feedback)
    const image = await SavedImages.findByIdAndUpdate(imageId, { Feedback: feedback }, { new: true });

    if (!image) {
        return res.status(404).json({ success: false, message: 'Image not found' });
    }

    res.status(200).json({
        success: true,
        data: "image"
    });
});

exports.DeleteImage = asyncHandler(async (req, res, next) => {
    const imageId = req.params.imageId;
  
    const image = await SavedImages.findById(imageId);
    console.log(image);
    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found" });
    }
  
    // Extract the file name from the ImageUrl
    const imageUrl = image.ImageUrl;
    const imagePath = path.join(__dirname, '../public', imageUrl.replace(req.protocol + '://' + req.get('host') + '/', ''));
  
    // Delete the image record from the database
    await SavedImages.deleteOne({ _id: imageId });
  
    // Delete the image file from the local file system
    fs.unlink(imagePath, (err) => {
      if (err) {
        console.error(`Failed to delete image file: ${err.message}`);
        return res.status(500).json({
          success: false,
          message: "Failed to delete image file",
        });
      }

      res.status(200).json({
        success: true,
        message: "Image deleted successfully",
      });
    });
});