import { Request, Response, NextFunction } from 'express';
import multer from 'multer'; //handling of upload form files

import DateHelper from '../helpers/DateHelper';

//'images' - name of folder to store files
const fileStorage = (folder: string) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder); //call callback once done with set up, 1st param pass null - no error
    },
    filename: (req, file, cb) => {
      //call callback once done with set up, 1st param pass null - no error
      cb(
        null,
        DateHelper.filenameFriendlyUTCDate(new Date(Date.now())) + '__' + file.originalname, //create unique filename
      ); //file.filename is the new name multer gives
    },
  });
};

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    // *props (error, store)
    cb(null, true);
  } else {
    // *props (error, do not store)
    cb(null, false);
  }
};

// handling of multi-part form data
//multer() returns a middleware (req, res, (error)=>{})
//note: 'upload' corresponds to form element name for input that contains the file being uploaded.
//inputFieldName - name of the input on the form that is handling the file upload
export const initMulter = (folder: string, inputFieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    multer({
      storage: fileStorage(folder),
      fileFilter: fileFilter,
    }).single(inputFieldName)(req, res, (error) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'File upload failed' });
      }
      // Continue with next middleware or send response
      next();
    });
  };
};
