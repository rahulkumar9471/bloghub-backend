const cloudinary = require('../cloud');
const Blog = require('../models/blog');
const { sendError } = require('../utils/helper');


exports.uploadBlogPdf = async (req, res) => {
    const { file } = req;

    if (!file) return sendError(res, "PDF file is Missing!");

    try {

        const pdfResponse = await cloudinary.uploader.upload(file.path, { resource_type: 'pdf' });

        res.json(pdfResponse);
        
    } catch (error) {
        console.error("Error in upload Blog Pdf ", error.message);
        return sendError(res, "Internal Server Error", 500);
    }
}