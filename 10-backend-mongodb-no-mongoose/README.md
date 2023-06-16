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
