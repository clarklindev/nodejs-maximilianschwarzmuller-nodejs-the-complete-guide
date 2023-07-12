import { Request, Response, NextFunction } from 'express';
import DateHelper from '../helpers/DateHelper';
import multer from 'multer';

const fileStorage = multer.diskStorage({
  //call callback once done with set up, 1st param pass null in no error
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  //call callback once done with set up, 1st param pass null in no error
  filename: (req, file, cb) => {
    cb(
      null,
      DateHelper.filenameFriendlyDate(new Date()) + '__' + file.originalname
    ); //file.filename is the new name multer gives
  },
});

export const Upload = (req: Request, res: Response, next: NextFunction) => {
  multer({ storage: fileStorage }).single('upload')(req, res, (error) => {
    if (error) {
      // Handle Multer error
      console.error(error);
      // Return an error response
      return res.status(500).json({ error: 'File upload failed' });
    }
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
    // Continue with next middleware or send response
    next();
    res.status(200).json({ status: 'success' });
  });
};
