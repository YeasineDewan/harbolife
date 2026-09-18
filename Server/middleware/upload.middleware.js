import multer from "multer";
import sharp from "sharp";

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only images allowed"));
        }
        cb(null, true);
    },
});


export const uploadSingle = (fieldName = "image") => upload.single(fieldName);

export const processImage = (options = {}) => async (req, res, next) => {
    if (!req.file) return next();

    const { width, height, quality = 80 } = options;

    // size before processing
    const beforeSize = req.file.buffer.length;
    console.log("Image size before processing:", (beforeSize / 1024).toFixed(2), "KB");

    let sharpInstance = sharp(req.file.buffer);

    if (width || height) {
        sharpInstance = sharpInstance.resize(width, height, {
            fit: "cover",
            withoutEnlargement: true,
        });
    }

    const processedBuffer = await sharpInstance.webp({ quality }).toBuffer();

    // size after processing
    const afterSize = processedBuffer.length;
    console.log("Image size after processing:", (afterSize / 1024).toFixed(2), "KB");

    console.log("Compression saved:", ((beforeSize - afterSize) / 1024).toFixed(2), "KB");

    req.file.buffer = processedBuffer;
    req.file.mimetype = "image/webp";

    next();
};