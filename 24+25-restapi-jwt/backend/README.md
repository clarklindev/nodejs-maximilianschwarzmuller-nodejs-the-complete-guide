# backend mongodb - with mongoose

- update .env from root of project directory
- no need for database.js (mongodb managed)

```js
const mongoose = require('mongoose');

mongoose.connect(
  `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@mongoDB-url`
);
```

- mongodb schemas (inside /models) dont need "\_id" added, this is added automatically
- with model created... pass an object to Product - eg... { title (refers to title from schema) : title (refers to req.body.title) }

```js
const mongoose = require('mongoose');

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

module.exports = mongoose.model('Product', productSchema);
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

### install body-parser

```shell
npm i body-parser
```

```js
app.use(bodyParser.json()); //get data from form - by parsing the body of the
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
  - using express validator - https://express-validator.github.io/docs/guides/getting-started
  - express-validator is a wrapper around validator.js
  - then to add validation to a route, you can add extra middleware
- check takes a form field "name" or array of field names to check
- and then you can call a bunch of methods on the check() eg. isEmail()
- then in the controller, you can call the other part of the middleware which gets the results of any errors in validationResult and stores it in errors const which we define.

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

## handling FORMS - file upload

- use npm package "multer"
- the format is usually formdata which is handled by bodyparser
  app.use(bodyParser.urlencoded({ extended: false })); //handling <form> post data, "false" - parsing the URL-encoded data with the querystring library or the qs library (when true)
- multer looks for request with enctype="multipart/form-data"

```js
npm i multer
```
