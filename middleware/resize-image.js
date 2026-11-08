// sharp: image library
const sharp = require("sharp")
// path: builds file paths that work on any OS
const path = require("path")

const resizeImage = async (req, res, next)=>{
    if(!req.file){
        return next()
    }

    // makes a unique file name
    const filename = Date.now() + ".jpg"

    // starts sharp on raw bytes in memory
    await sharp(req.file.buffer)
    // sharp methods
    .rotate()
    // resizes the image
    .resize(800, 800, {fit: "cover"})
    // keeps files small
    .jpeg({quality: 85})
    // saves results to the disk
    .toFile(path.join(__dirname, "../public/uploads", filename))
    
    req.file.filename = filename
    next()
}

module.exports = resizeImage