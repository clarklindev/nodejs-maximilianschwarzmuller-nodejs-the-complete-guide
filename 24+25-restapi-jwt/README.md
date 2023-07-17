This folder covers the following sections from Udemy course:
https://www.udemy.com/course/nodejs-the-complete-guide

13. Working with mongoose

14. Sessions & cookies

15. adding authentication

16. sending emails

17. advanced authentication

18. Validation

---

## serving files statically

- on the backend, you can set a folder to serve static files

```js
app.use(express.static(path.join(__dirname, '../', 'public')));
```

## Multer for form handling of image upload

- install multer on backend
- on frontend, the form

## FRONTEND - form

```js
import { Form, redirect } from 'react-router-dom';
<Form
  method='post'
  encType='multipart/form-data'
  action='/testing/upload'
  className={styles.form}
>
  <div className={styles['form-control']}>
    <label htmlFor='name'>name</label>
    <input name='name' />
  </div>

  <div className={styles['form-control']}>
    <label htmlFor='upload'>upload</label>
    <input name='upload' type='file' />
  </div>

  <button type='submit'>submit</button>
</Form>;
```

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
- app.use(multer().single('image')); //the param name .single('<param>') MUST be the same as name on form input for upload
- when using the "multipart/form-data" content type for sending data in an HTTP request, you typically need to use the FormData object to construct and send the request body. The FormData object is a built-in JavaScript object that provides a convenient way to serialize form data and create the necessary format for the "multipart/form-data" content type

## FRONTEND

```js
// you would send from frontend like this:

const data = await request.formData(); //form data received from form post.

const url = `${import.meta.env.VITE_BACKEND_URL}:${
  import.meta.env.VITE_PORT
}/testing/upload`;

// //send post request
const result = await fetch(url, {
  method: 'POST',
  body: data,
});
```

## BACKEND - route handler

- then on the receiving backend route, you get access the req.body and req.file

```js
console.log('req.body:', req.body);
console.log('req.file:', req.file);
```

---

## .env variables in VITE

- .env.development
- .env.production

### WHAT TO DO TO GET .ENV variables WORKING USING VITE:

update vite.config.js to include build:{ target:'es2020'} etc..

```js
// viteconfig.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
  },

  // include this to get import.meta.env working in the code (see below)
  build: {
    target: 'es2020', // Set the target to ES2020 or newer
    polyfillDynamicImport: false, // Disable dynamic import polyfill if necessary
  },
});
```

- access env variables by: import.meta.env
- The 'import.meta' meta-property is only allowed when the '--module' option is 'es2020', 'es2022', 'esnext', 'system', 'node16', or 'nodenext'
- environment variables prefixed with `VITE_` are exposed to your application by default. Variables without the `VITE_` prefix are not exposed to the application and are only available in the build process.

```.env
VITE_API_URL=https://example.com/api
```

```js
const apiUrl = import.meta.env.VITE_API_URL;
```
