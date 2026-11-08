// using multer libarary
const multer = require('multer')
const upload = multer({
    // where the multer puts the uploaded file: in the computer's RAM (only the resized version using sharp)
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // max 5MB
    },
    // cb: callback: means accept ot reject
    // fileFilter: runs before the img gets accepted or rejected
    fileFilter: (req, file, cb)=>{
        if(file.mimetype.startsWith("image/")){
            cb(null, true)
        }
        else {
            cb(new Error('Only image files are allowed'))
        }
    }
})

module.exports = upload