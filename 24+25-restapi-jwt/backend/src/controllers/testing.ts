import { Request, Response, NextFunction } from 'express';
import DateHelper from '../global/helpers/DateHelper';
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

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    // store
    cb(null, true);
  } else {
    // do not store
    cb(null, false);
  }
};

export const upload = (req: Request, res: Response, next: NextFunction) => {
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('upload')(
    req,
    res,
    (error) => {
      if (error) {
        // Handle Multer error
        console.error(error);
        // Return an error response
        return res.status(500).json({ error: 'File upload failed' });
      }
      console.log('req.body:', req.body);
      console.log('req.file:', req.file);
      // Continue with next middleware or send response
      return res.status(200).json({ status: 'success' });
    }
  );
};
