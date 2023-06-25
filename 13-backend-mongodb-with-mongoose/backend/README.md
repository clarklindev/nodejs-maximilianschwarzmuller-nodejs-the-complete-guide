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

## <!-- -------------------------------------------------------------------------------------------------------------------------- -->

## <!-- -------------------------------------------------------------------------------------------------------------------------- -->

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

```
GET
localhost:3000/
localhost:3000/products/648bc4cb2847b619c52d4414
localhost:3000/admin/products/648bc4cb2847b619c52d4414
localhost:3000/cart
localhost:3000/orders

PUT
http://localhost:3000/admin/edit-product/648bc4cb2847b619c52d4414

DELETE
localhost:3000/admin/products/648bc4cb2847b619c52d4414
localhost:3000/cart-delete-item

POST
localhost:3000/cart
http://localhost:3000/admin/add-product
http://localhost:3000/create-order
```

## session / cookie

read notes - cookies and sessions (auth).md
