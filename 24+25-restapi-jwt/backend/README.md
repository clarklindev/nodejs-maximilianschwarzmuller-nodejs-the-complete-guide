# captain-refactor

- This is a mentorship project where I learn, expand, revise and correct habbits of backend development under mentorship from Tech Principal Developer @captainmike

## express/typescript

- [how to setup node](https://blog.logrocket.com/how-to-set-up-node-typescript-express/)

- install and initialize dotenv in app.js
- test apis with postman
- add .env to .gitignore

## .env

- to send emails, you can use a service provider like sendgrid, i am using gmail (but this should be used only for small scale projects)
- note gmail password:
- using nodemailer

### using gmail to send email (working)

- using an app password = https://myaccount.google.com/apppasswords
- then under security-> 2 factor auth
- you generate a password to bypass 2factor auth, save in .env GMAIL_PASS=""

- https://stackoverflow.com/questions/60701936/error-invalid-login-application-specific-password-required/60718806#60718806

```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
```

## development build

- use eslint (.eslintrc.json) to show where errors / console.log()s are during development

```shell
npm run lint:fix
```

## production build

- dist/ folder is excluded from repository
- building the project 'npm run build' leaves the console.log()'s from codebase intact
- removes console.logs() with babel plugin: babel-plugin-transform-remove-console specified ini .babelrc
- package.json script:

```shell
npm run build
npm run removelogs
```

## routes

- "contacts/" requires mongodb access details:
  - project: captainrefactor
  - user: clarkcookie

## CRUD / REST API setup (contacts/)

- mongodb/mongoose
- mongo atlas db

---

## mongodb/mongoose connection

- use mongo atlas - create user account, db, allow ip
- dont forget to configure .env with mongodb username/password
- connection string: <GET THIS FROM MONGODB ATLAS>
- use atlas node 2.12.2 connection url \*if 5.5 doesnt work

```js
// const mongoose = require('mongoose'); //commonjs
import mongoose from 'mongoose'; //esmodule

mongoose.connect(`mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mongodbURL`);
```

- mongodb schemas (inside /models) dont need "\_id" added, this is added automatically
- with model created... pass an object to Product - eg... { title (refers to title from schema) : title (refers to req.body.title) }

```js
import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

// commonjs
// module.exports = mongoose.model('Product', productSchema);

// esmodules
const model = mongoose.model('Product', productSchema);
export default model;
```

## how are collections made with Mongoose?

- mongoose takes your model name eg. Product,
  - turns it to all lowercase
  - makes it plural form
  - so "Product" becomes "products"

## Mongoose GET

- Product.find() returns the actual products (not like mongodb which returns a cursor to products)

## Mongoose .populate() to get full object data using a field

```js
//here it only returns a the id string as part of what is stored in Product
const products = await Product.find();

//using populate() it can retrieve full object on the prop that is using a ref by using a prop as reference
const products = await Product.find().populate('userId');

//sometimes to get a prmise from .populate you need to call  .execPopulate();
const products = await Product.find().populate('userId').execPopulate();
```

## pulling data from only an id string via .\_doc

- via .\_doc then spread the return into an object

```js
// shop.js
const products = user.cart.items.map((i) => {
  return { quantity: i.quantity, product: { ...i.productId._doc } };
});
```

## Mongoose selective retrieval

- tells mongoose which props to retrieve (selective) or which not to retrieve

```js
Product.find().select('title price -_id'); //return title, price, not _id

//selective retrieval also works for .populate
const products = await Product.find().populate('userId', 'name'); //returns ALWAYS _id unless specified not to, and "name"
```

## Create

- create a default user if no users exist
- then go to mongodb atlas and copy userid and paste in app.js as middleware to use a default user in requests

```js
// app.js
app.use(async (req, res, next) => {
  try {
    const user = await User.findById('648d9b2926121ba0bf431eed');
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    throw err;
  }
});

let user = await User.findOne();
if (!user) {
  user = new User({
    name: 'Max',
    email: 'max@test.com',
    cart: { items: [] },
  });
  await user.save();
}
```

## <!----------------------------------------------------------------------------------------->

## <!----------------------------------------------------------------------------------------->

# backend - mongodb - no mongoose

- using express (built ontop of node)
- from tutorial by maximilianschwarzmuller - nodejs-the-complete-guide: https://github.com/clarklindev/tutorial-maximilianschwarzmuller-nodejs.git
  - a copy of 10-backend-mongodb-no-mongoose/

### install mongodb

- use mongo atlas - create user account, db, allow ip

- project: NODEJS-THE-COMPLETE-GUIDE-BACKEND-MONGODB-NO-MONGOOSE
- connection string: mongodb+srv://clarkcookie:<password>@cluster0.g7sijtf.mongodb.net/?retryWrites=true&w=majority

- db collections: orders, products, users

- test with postman
- dont forget to configure .env with mongodb username/password

```
npm i mongodb
```

- install and initialize dotenv in app.js
- externalize username/password into .env
- add .env to .gitignore


### install body-parser \*DEPRECATED

- note: since express 4.16 it is not necessary to import body-parser

#### NEW METHOD

```js
import express, { Express } from 'express';

app.use(express.json()); //parse incoming requests for json data
app.use(express.urlencoded({ extended: true })); //form data
```

#### OLD METHOD

```shell
npm i body-parser
```

```js
app.use(bodyParser.json()); //get data from form - by parsing the body of the
app.use(bodyParser.urlencoded({ extended: false }));
```

## mongodb id

- ids are strings stored using ObjectId() type

```js
const query = { _id: new mongodb.ObjectId(productId) };
```

## users - logged in user

- User is created in app.js
- initially code fakes logged in user until authentication lessons
- in mongodb create a 'users' collection
- in our app.js we create a reference to userId and set it in the middleware req.user = user;
- then when we add something we have access to this via headers
- using postman to add a product will add the user who added product (userId)

## gotchas

mongodb uses '.\_id' as opposed to '.id'

---

## Routes

see "backend/routes/"

### route protection

- using middleware to protect routes (see middleware/is-auth.js)
- add middleware function to routes - the execution goes, left to right (ie isAuth executes before adminController.addProduct)

```js
// middleware:
//is-auth.js
module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
  next();
};
```

```js
const isAuth = require('../middleware/is-auth');

router.post('/add-product', isAuth, adminController.addProduct);
```

## CSRF (Cross Site Request Forgery)

- prevent malicious code execution which uses valid session (eg link in email to use your credentials), then gain access to your api's
- OPENAI:
  Cross-Site Request Forgery (CSRF) protection is primarily required when you have a server-side component handling user requests, such as when using traditional server-rendered web applications or APIs. If you're not using server-side rendering and your application is entirely client-side, the need for CSRF tokens may not be as critical.

### prevent CSRF with CSRF token

- how does it work?

- want to prevent your sessions being stolen,
- csurf is a package for node/express which generates a csrf token.

- a new token is generated for every request
- can be embedded onto pages/forms that do something to change users state - then on backend we check if there is the valid token.
- it uses the session (default) to store the token
- add after session()
- Typically, res.locals is used within server-side rendering frameworks to pass variables to templates or views during the rendering process.
- use middleware, store in res.locals like:
  - res.locals.isAuthenticated = req.session.isLoggedIn;
  - res.locals.csrfToken = req.csrfToken();
- NOTE: for POST req - need to add to form input (hidden) giving access to csrfToken

```
<input type="hidden" name="_csrf" value={${csrfToken}}>
```

```shell
npm i csurf
```

```js
const csrf = require('csurf');
const csrfProtection = csrf(); //middleware

app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
...

//SERVER SIDE RENDER...for every request - set local variables to pass into views

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

```

---

### session / cookie

read notes - authentication - cookies and sessions (authentication).md

# Cookies / Sessions

## Session

- with sessions - session is created, cookie stores hashed ID of session - server can confirm id stored in cookie relates to something in db
- session shares information accross all requests of the same user.
- cookie lasts the session while browser tab is open
- session data is stored in memory but should be stored in db (express-session) can store using connect-mongodb-session (for production build)

```
npm i express-session connect-mongodb-session

```

- session should then be initialzed as early middleware
- secret - used to hash - long string.
- resave:false - session saved only when something changed in session
- saveUninitialized:false - the session cookie will not be set on the browser unless the session is modified

```js
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI =  `mongodb://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@<somemongodb given db url>`,

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions',
});

//app.js
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
```

### Session cookie - identifying the session

set cookie on session - accessed via controllers using "req.session."

```js
//in the controllers
exports.login = (req, res, next) => {
  req.session.isLoggedIn = true; //sets the cookie via session
};
```

<!-- ------------------------------------------------------------------------------ -->

## Cookie

- cookies are not safe!!! can be used but it is not safe as they can be manipulated in browser tools via hardcoding cookie values
- setting cookies manually (chrome dev tools => Application=> Storage => cookies)
- ALTERNATIVE to storing cookies on backend is using sessions (stored on backend in db or in memory) - client tells server which session he belongs

- Secure - cookie set only when using https url
- HttpOnly - cookie cant be accessed via client side javascript to read cookie values
- resave -
  determines whether the session should be saved to the session store even if the session was not modified during the request. By setting resave to false, you are indicating that the session should not be saved if it was not modified. This can help optimize performance by avoiding unnecessary writes to the session store.

- saveUninitialized -
  determines whether a new, uninitialized session should be saved to the session store. An uninitialized session is a session that is new but hasn't been modified yet. By setting saveUninitialized to false, you are indicating that uninitialized sessions should not be saved. This can be useful to save storage space and reduce the number of unnecessary session objects in the session store.

In summary, by setting resave and saveUninitialized to false, you are optimizing the session middleware to only save the session if it has been modified and to skip saving uninitialized sessions. This can improve performance and efficiency.

- set a cookie in header response like:

<!-- how to set/get a cookie -->

```js
//set
exports.postLogin = (req, res, next) => {
  // res.setHeader('Set-Cookie', 'loggedIn=true; Secure'); //cookie is only set with https connections
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly'); //cookie cant be accessed via clientside javascript
  res.setHeader('Set-Cookie', 'loggedIn=true');

  res.redirect('/');
};

// get
exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie').split(';')[1].trim().split('=')[1];
};
```

## destroy() session

```js
exports.postLogout = async (req, res, next) => {
  // clear session
  // callback with potential error as prop
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};
```

---

# authentication in nodejs

## CREATE USER - SIGNUP

```shell
npm i bcryptjs
```

```js
const bcrypt = require('bcryptjs');

exports.postSignup = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  try {
    const user = await User.findOne({ email: email });
    if (user) {
      return res.json({ status: 'FAIL', data: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 12); //12 is the salt (rounds of hashing to be applied (12) is a secure number)
    const newUser = new User({
      email,
      password: hashedPassword,
      cart: { items: [] },
    });
    await newUser.save();
    res.json({ status: 'OK', data: 'successfully created new user' });
  } catch (err) {
    console.log(err);
  }
};
```

## LOGIN USER

- take password entered in form and let bcrypt "hash" it and see if it will equal the stored hash value

```js
const user = await User.findOne({ email: email });
if (!user) {
  return res.json({ error: 'user does not exist' });
}

try {
  const result = await bcrypt.compare(password, user.password); //compare password user entered..
  //the result of compare() is a promise where it returns 'true' if equal and 'false' if not equal.
  if (result) {
    req.session.isLoggedIn = true;
    req.session.user = user;

    return req.session.save((err) => {
      console.log(err);
      //ensure session was created before redirect()
      // res.redirect('/');
      res.json({ status: 'LOGGED IN', done: true });
    });
  }
  res.json({ status: 'ERROR', message: 'incorrect credentials' });
} catch (err) {
  console.log(err);
}
```

## using gmail to send email (working recommended)

- using an app password = https://myaccount.google.com/apppasswords
- then under security-> 2 factor auth
- you generate a password to bypass 2factor auth, save in .env

- https://stackoverflow.com/questions/60701936/error-invalid-login-application-specific-password-required/60718806#60718806

```js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});
```

## AWS - ses

- aws offers FREE simple emailing service which allows 60k outbound emails a month

https://aws.amazon.com/ses/pricing/

## Sendgrid to send emails

- on Sendgrids website...

```js
//template code

// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
// javascript;
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: 'test@example.com', // Change to your recipient
  from: 'test@example.com', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};
sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error(error);
  });
```

### tutorial: nodejs-maximilianschwarzmuller-nodejs-the-complete-guide

- section 16: sending emails uses:
  - nodemailer
  - nodemailer-sendgrid-transport

```js
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: 'API_KEY',
    },
  })
);

...
// then use
transporter.sendMail({to:"WHO"});

```

## password reset

- nodejs crypto library

```js
const crypto = require('crypto');

//callback with error or buffer
crypto.randomBytes(32, (err, buffer) => {
  if (err) {
    return res.redirect('/reset');
  }
});
```

---

## steps for api's

1. create new user (signup) since no user exists in db

/auth/signup

2. then you can do login things

/auth/login (GET) - checks if you are logged-in
/auth/login (POST) - actually logs in
/auth/login (GET) - verify you are logged in after logging in

/auth/logout (POST) - logs out

3. CLIENT-SIDE: so the user forgot their password and now wants to reset.. they click forgot password link

- lands on page requesting email address... then user types in email and clicks SEND!

4. /auth/reset (POST)

- this is after user enters email in form and sends the form.
- the email enterered receives a reset email if user with matching exists
- in the email is a link (with a token)
- resetToken and resetTokenExpiration is added for user..

5. CLIENT-SIDE:

- user click on link in email
- user lands on a page with only a "enter new password" and send button

6. /reset/:token (POST)

- url has token
- params.body has .password
- on BACKEND we ensure there is a user with this token thats passed in AND the token is still valid
- if there is a user, we encrypt the new password and save user updates.
- reset resetToken and resetTokenExperiration
- now user can log in with new password

---

## validation

- you want to validate (non-get) routes. ie (routes that post something)

### validate.js (preferred)

i prefer validation with validatejs

### Express-Validator (course suggested)

- using express validator - https://express-validator.github.io/docs/guides/getting-started
- express-validator is a wrapper around validator.js
- then to add validation to a route, you can add extra middleware
- check takes a form field "name" or array of field names to check
- and then you can call a bunch of methods on the check() eg. isEmail()
- then in the controller, you can call the other part of the middleware which gets the results of any errors in validationResult and stores it in errors const which we define.

- validationResult() function from the express-validator library is used to obtain the validation errors that might have been added to the req object during the execution of the validation middleware.
- When you execute the validation middleware functions, such as body('title').isString().isLength({ min: 3 }).trim(), they internally check the corresponding field (in this case, title) in the request body for validation. If a validation error occurs, the middleware function adds the error to the req object.

```shell
npm install express-validator
```

```js
// routes/auth.js
const { check } = require('express-validator/check');
router.post('/signup', check('email').isEmail(), authController.postSignup);
```

```js
//controllers/auth.js
const { validationResult } = require('express-validator/check');

exports.postSignup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json(error: errors.array()[0].msg);
  }
};
```

## serving files statically

- on the backend, you can set a folder to serve static files

```js
app.use(express.static(path.join(__dirname, '../', 'public')));
```

## Multer for form handling of image upload

- install multer on backend
- on frontend, the form

## Backend - main.tsx

- multer is middleware to handle multipart/form-data
- if you use {storage:} you can configure an object which takes "destination" and "filename"
- multer.diskStorage configuration, when you set the destination as 'images', it specifies that uploaded files will be saved in the images folder relative to the current working directory. As long as the folder exists, multer will be able to access and save the uploaded files to that location.
- note you cant use .ISOString() as filename because it contains ':' chars
- you can add a filter to accept only certain filetypes with 'fileFilter', and a callback that returns true to accept / or returns false to deny file.

```js
// BACKEND - index.tsx

const fileStorage = multer.diskStorage({
  //call callback once done with set up, 1st param pass null if no error
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  //call callback once done with set up, 1st param pass null if no error
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + ' - ' + file.originalname); //file.filename is only assigned if you're not setting it, here it wont automatically generate a name for you because we are setting fileStorage filename.
  },
});

const fileFilter = (req, file, cb);

app.use(multer({ storage: fileStorage, fileFilter }).single('upload')); //the param name single('<param>') MUST be the same as on form input for upload

// app.use(multer({ dest: 'images' }).single('upload')); //the param name single('<param>') MUST be the same as on form input for upload
```

- if you specify 'dest' and pass something to multer({dest:}), you wont get a buffer result, as multer stores the data in folder

- default app.use(multer()) doesnt receive anything into multer().

---

### multer GOTCHAS

.single('<param>') param MUST be the same as the "upload input's name" on the form

```js
app.use(multer().single('image'));
```

---

- when using the "multipart/form-data" content type for sending data in an HTTP request, you typically need to use the FormData object to construct and send the request body. The FormData object is a built-in JavaScript object that provides a convenient way to serialize form data and create the necessary format for the "multipart/form-data" content type

## BACKEND - route handler

- then on the receiving backend route, you get access the req.body and req.file

```js
console.log('req.body:', req.body);
console.log('req.file:', req.file);
```

## handling FORMS - file upload

- use npm package "multer"
- the format is usually formdata which is handled by bodyparser
  app.use(bodyParser.urlencoded({ extended: false })); //handling <form> post data, "false" - parsing the URL-encoded data with the querystring library or the qs library (when true)
- multer looks for request with enctype="multipart/form-data"

- ### GOTCHAS with Multer
- with multer, there is a callback function. you should put your code that follows inside the callback

```js
multer({ storage: fileStorage, fileFilter: fileFilter }).single('upload')(
    req,
    res,

    // callback
    async (error) => {
      if (error) {
        // Handle Multer error
        console.error(error);
        // Return an error response
        return res.status(500).json({ error: 'File upload failed' });
      }

      const title = req.body.title;
      const price = req.body.price;
      const description = req.body.description;
      const file = req.file!;

      console.log({ title }, { price }, { description }, { file });

      const validateAddProduct = [
        body('title').isString().isLength({ min: 3 }).trim(),
        body('price').isFloat(),
        body('description').isLength({ min: 5, max: 200 }).trim(),
      ];

      const errors = validationResult(validateAddProduct);
      if (!errors.isEmpty()) {
        const error = new Error('Validation failed') as ErrorWithStatus;
        error.statusCode = 422;
        throw error;
      }

      //Mongoose - pass an object to Product - eg... { title (refers to title from schema) : title (refers to req.body.title) }
      const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: file.path,
        userId: '649cfd00d2d73557bd21c294', //or with mongoose: you can reference the entire object req.user and mongoose will get the ._id from there.
      });

      try {
        const result = await product.save();

        res.status(200).json({ status: 'PRODUCT CREATED', product: result });
      } catch (err: any) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    }
  )
```

```js
npm i multer
```

## handling forms

- multer assists with file storage using file system at a location specified while the data from the form (including file locations) should be stored in database
- because it is middleware, it processes incoming multipart/form-data from req and then passes that data after separating the file from the form

## storing images and paths

- it's better to store the image filenames or relative paths in the database and then construct the full path dynamically in your code using the appropriate method for your platform (e.g., path.join in Node.js). This approach ensures portability and better security.
- windows uses "\" and mac uses "/" so its best to use path and join to ensure the path is always created correctly for the os.
- this is always so there is less maintenence when the file path changes.
- note: the solution i went for is not to include the fullpath for imageUrl but rather just save the filename, and
  then use express.static() to create the path

### update on storing images

- note image uploaded names is set on the BACKEND - index.tw with express

```ts
const fileStorage = multer.diskStorage({
  //call callback once done with set up, 1st param pass null - no error
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  //call callback once done with set up, 1st param pass null - no error
  filename: (req, file, cb) => {
    cb(
      null,
      DateHelper.filenameFriendlyDate(new Date()) + '__' + file.originalname //create unique filename
    ); //file.filename is the new name multer gives
  },
});
```

- you should store files with unique file names even if they both have the same image, this is because if you use the same file name as reference for 2 separate db entries, when the one is deleted, the other will lose its reference to the image.

### what i went with...

- with the code below, when you need to access the /images folder, you basically create the file path that starts with /images

```js
const upload = req.file; //thanks to multer middleware, we have access to file and not just text from the form.

const imageUrl = !upload ? req.body.imageUrl : upload.filename;
```

- and have this in the index.ts file

```ts
app.use('/images', express.static(path.join(__dirname, '../', 'images'))); //serving files as if from root folder but we need /images says we are looking in /images on root
```

### tutorial suggestion

```js

//To ensure that images can be loaded correctly on the frontend, you should also change the logic in the feed.js controller:

//in createPosts, change the imageUrl const:

exports.createPost = (req, res, next) => {
    ...
    const imageUrl = req.file.path.replace("\\" ,"/");
    ...
}
and in updatePost (once we added that later):

exports.updatePost = (req, res, next) => {
    ...
    imageUrl = req.file.path.replace("\\","/");
```

## deleting with postman

- if you delete db image references with postman, dont forget to cleanup the images/ folder on the backend server


---

### Google phone number library

- npm module: google-libphonenumber

https://www.npmjs.com/package/google-libphonenumber

```js
import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
// Get an instance of `PhoneNumberUtil`.
const phoneUtil = PhoneNumberUtil.getInstance();
```

## remove http-only cookies / use JWT tokens

- although http-only cookies make things easier without the need to add content headers with "Authentication":"Bearer token",
  decision to swop them out because they are only good when you use a web browser ie. web based (cookies), and would not work for non-web based calls to the api.
- with JWT tokens, you can achieve stateless authentication using bearer tokens

## vite env variables / vitest testing

- when working with vite, vitest: it has its own mechanism for accessing env variables.
- with vitest, you define your environment variables prepended with "VITE\_" eg. VITE_MONGODB_USER
- then you can use 'import.meta.env.VITE_MONGODB_USER' to access the variable
- so even if you're not using vite, but using vitest, if you have 'VITE\_' prepended to env variables you can read them...and if you dont you can change values directly: import.meta.env.MODE = 'test'
- but process.env. doesnt work..
- import.meta.env.MONGODB_USER doesnt seem to work if your env variable is MONGODB_USER

```.env
VITE_MONGODB_USER="abc"
```

```ts
import.meta.env.VITE_MONGODB_USER;
```

---

## whats the difference between Model<IUser> and Document<IUser>

- In Mongoose, Model<IUser> and Document<IUser> are two different types that serve distinct purposes when working with MongoDB data.

- In summary, Model<IUser> is used to interact with the entire collection, while Document<IUser> is used to interact with individual documents. They have different use cases and provide different levels of access and functionality when working with MongoDB data in a Mongoose application.

- In Mongoose, when you use query methods like .findOneAndDelete(), you typically don't need to call .exec() explicitly. The query methods in Mongoose return a Query object that can be executed by chaining additional methods or by awaiting the query itself.

### Model<IUser>:

Model<IUser> represents the entire collection in the MongoDB database that corresponds to a specific Mongoose model.
It provides methods for performing operations on the collection as a whole, such as querying, creating, updating, and deleting documents.
When you define a Mongoose model, you usually use Model<IUser> to interact with the collection, define static methods, and access the Mongoose model's global methods.
Example:

```ts
import { Document, Model, model, Schema } from 'mongoose';

interface IUser extends Document {
  username: string;
  email: string;
}

const userSchema = new Schema({
  username: String,
  email: String,
});

const UserModel: Model<IUser> = model<IUser>('User', userSchema);

const users: IUser[] = await UserModel.find();
```

### Document<IUser>:

Document<IUser> represents an individual document within a collection.
It provides access to the fields and methods of a specific document, allowing you to manipulate and interact with the data at the document level.
You can use Document<IUser> to access and modify specific document properties, perform validation, and invoke instance methods defined on the Mongoose schema.
Example:

```ts
const user: IUser | null = await UserModel.findOne({ username: 'john' });

if (user) {
  console.log(user.username); // Accessing a document property
  user.email = 'newemail@example.com'; // Modifying a document property
  await user.save(); // Saving changes to the database
}
```
