import { NextFunction, Request, Response } from 'express';

import multer from 'multer';

import Product from '../models/product';
import DateHelper from '../helpers/DateHelper';

import validate from '../validators/validate';

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
    // error, store
    cb(null, true);
  } else {
    // error, do not store
    cb(null, false);
  }
};

//Mongoose selective retrieval - tells mongoose which props to retrieve (selective) or which not to retrieve
//Product.find().select('title price -_id'); //return title, price, not _id

//using populate() it can retrieve full object on the prop that is using a ref by using a prop as reference
//const products = await Product.find().populate('userId');
//selective retrieval also works for .populate
//const products = await Product.find().populate('userId', 'name'); //returns ALWAYS _id unless specified not to, and "name"
export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await Product.find();

    //temp hardcoding because above uses session.. and that is different for REST API

    res.status(200).json({ message: 'fetched posts!', products });
  } catch (err: any) {
    console.log(err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prodId = req.params.productId;
  try {
    const product = await Product.findById(prodId);
    res.status(200).json({ product });
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: err });
  }
};

//addProduct should receive an upload image
export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validationSchema = {
    title: {
      presence: true,
      type: 'string',
      length: {
        minimum: 3,
      },
    },
    price: {
      floatWithTwoDecimals: true,
    },
    description: {
      length: {
        minimum: 3,
        maximum: 20,
      },
    },
  };

  //multer saves file to physical storage
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('upload')(
    req,
    res,
    // callback
    (error) => {
      if (error) {
        // Handle Multer error
        console.error(error);
        // Return an error response
        return res.status(500).json({ error: 'File upload failed' });
      }

      //validate
      const validationErrors = validate(req.body, validationSchema);

      if (validationErrors) {
        // Handle validation errors
        console.log(validationErrors);
        return res.status(500).json({ validationErrors: validationErrors });
      }

      console.log('req.file: ', req.file);

      console.log('Validation passed');

      const title = req.body.title;
      const price = req.body.price;
      const description = req.body.description;
      const file = req.file!;

      try {
        const createProduct = async () => {
          //Mongoose - pass an object to Product - eg... { title (refers to title from schema) : title (refers to req.body.title) }
          const product = new Product({
            title: title,
            price: price,
            description: description,
            imageUrl: file.path,
            userId: '649cfd00d2d73557bd21c294', //or with mongoose: you can reference the entire object req.user and mongoose will get the ._id from there.
          });
          const result = await product.save();

          res.status(200).json({ status: 'PRODUCT CREATED', product: result });
        };
        createProduct();
      } catch (err: any) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    }
  );
};

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const prodId = req.params.productId;
  const title = req.body.title;
  const price = req.body.price;
  const file = req.file!;
  const description = req.body.description;

  // try {
  //   const product = await Product.findById(prodId);

  //   //check if loggedin user is allowed to edit product
  //   if (req.session) {
  //     if (
  //       product?.userId.toString() !== req.session.user?._id.toString() ||
  //       product === null
  //     ) {
  //       //redirect away or return status message
  //       return res.json({ status: 'user not allowed to edit product' });
  //     }
  //   }

  //   if (product) {
  //     product.title = updatedTitle;
  //     product.price = updatedPrice;
  //     product.description = updatedDesc;

  // if (image) {
  //     product.imageUrl = image.path;
  // }
  //     const result = await product.save();
  //     res.json({ status: 'PRODUCT EDITED', result });
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.json({ error: err });
  // }
};

export const deleteAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    //TODO- need to add authentication test

    const result = await Product.deleteMany({});
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const prodId = req.params.productId;
  // try {
  //   if (req.session) {
  //     const result = await Product.deleteOne({
  //       _id: prodId,
  //       userId: req.session.user._id, //extra check that the product.userId must be the same the req.user._id (loggedin user's id)
  //     });
  //     res.status(200).json({ status: 'PRODUCT DELETED', result });
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ error: err });
  // }
};
