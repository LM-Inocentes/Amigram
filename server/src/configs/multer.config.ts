import multer from 'multer';

// Set up multer with a custom storage engine and file filter
const upload = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    // Allowed file extensions
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];

    // Get the original name of the file and its extension
    const originalName = file.originalname;
    const fileExtension = originalName.slice(originalName.lastIndexOf('.'));

    // Check if the file has a valid extension
    if (allowedExtensions.includes(fileExtension.toLowerCase())) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export default upload;