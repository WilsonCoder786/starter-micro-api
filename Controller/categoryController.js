const categoryModel = require("../Model/categoryModel");
const subCategoryModel = require("../Model/subCategoryModel");
const userModel = require("../Model/userModel");
const { validateCategory } = require("../Validator/categoryValidate");
const { validateSubCategory } = require("../Validator/subCategoryValidate");
const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');


exports.createCategory = async (req, res) => {
    // try {

    const validationResult = validateCategory(req.body);

    if (validationResult) {
        console.error('Validation error:', validationResult.message);
        return res.json({ message: validationResult.message });

    }

    const checkAdmin = await userModel.findById(req.userId)
    if (checkAdmin.userType == "admin") {

        if (req.file == undefined) {

            return res.status(401).json({ message: 'Select Category Pic' });
        }

        const folderName = 'category';
        const qualityLevel = 'auto:low';

        const bufferStream = cloudinary.uploader.upload_stream(
            { folder: folderName, resource_type: 'auto', quality: qualityLevel },
            (error, result) => {
                if (error) {
                    return res.status(500).json({ error: 'Failed to upload image to Cloudinary' });
                }


                // Add the Cloudinary URL to your category data
                const catAdd = categoryModel({ ...req.body, categoryImage: result.secure_url });
                catAdd.save();

                return res.status(409).json({ message: 'Add New Category', data: catAdd });
            }
        );

        // Convert the Buffer to a ReadableStream
        bufferStream.end(req.file.buffer);
    }
    else {
        return res.status(400).json({ error: 'Please Login as Admin' });
    }

    // }
    // catch (e) {
    //     console.log(e)
    //     return res.status(409).json({ error: e });
    // }
}

exports.createSubCategory = async (req, res) => {
    try {

        const { id } = req.params
        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({ message: 'Invalid Category ID' });
        }
        else {

            let checkCategory = await categoryModel.findById(id)

            if (checkCategory) {
                const validationResult = validateSubCategory(req.body);

                if (validationResult) {
                    console.error('Validation error:', validationResult.message);
                    return res.json({ message: validationResult.message });

                }
                const checkAdmin = await userModel.findById(req.userId)
                if (checkAdmin.userType == "admin") {

                    req.body.categoryId = id

                    var subCatAdd = subCategoryModel(req.body)
                    await subCatAdd.save()

                    checkCategory.sub_category.push(subCatAdd._id)
                    await checkCategory.save();

                    return res.status(200).json({ message: 'Add New Sub Category', data: subCatAdd });
                }
                else {
                    return res.status(400).json({ error: 'Please Login as Admin' });
                }
            }
            else {
                return res.status(400).json({ error: 'Category Not Found' });
            }
        }

    }
    catch (e) {
        console.log(e)
        return res.status(409).json({ error: 'Error' });
    }
}

exports.viewCategory = async (req, res) => {
    // try {
    const checkAdmin = await userModel.findById(req.userId)
    if (checkAdmin.userType == "admin") {
        let category = await categoryModel.find({}).populate("sub_category")
        return res.status(200).json({ message: 'View All Category', data: category });
    }
    else {
        return res.status(400).json({ error: 'Please Login as Admin' });
    }


    // }
    // catch(e){
    //     return res.status(409).json({ error: 'Error' });
    // }

}

// exports.createSubCategory1 = async (req, res) => {
//     try {

//         const validationResult = validateCategory(req.body);

//         if (validationResult) {
//             console.error('Validation error:', validationResult.message);
//             return res.json({ message: validationResult.message });

//         }

//         const checkAdmin = await userModel.findById(req.userId)
//         if (checkAdmin.userType == "admin") {

//             var subCatAdd = subCategoryModel(req.body)
//             await subCatAdd.save()

//             return res.status(200).json({ message: 'Add New Category', data: subCatAdd });
//         }
//         else {
//             return res.status(400).json({ error: 'Please Login as Admin' });
//         }

//     }
//     catch (e) {
//         console.log(e)
//         return res.status(409).json({ error: 'Email is already registered.' });
//     }
// }
// Zubair11$%^