## serving files statically

## FRONTEND - form

- after setting the folder to serve files statically on the backend,

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

## formData()

- note the use of formData() by react-router-6
- when you use formData() to submit your form content, content-type for headers is set automatically by formData()
- The data object is obtained from request.formData(), which is most likely a FormData object. When sending data in a POST request, you should either use FormData directly or convert it to a JSON string using JSON.stringify if you want to use 'application/json' as the Content-Type.
- If you intend to send the data as JSON, you should convert the data object to JSON before sending it in the request body

### send as JSONAPI conforming data

-do not try to send a JavaScript object directly as the request body, but to follow the JSON API specification, you need to send a JSON string representing the object in the request body.

- you still need to stringify json object
- on the backend you need to define middleware to handle jsonapi data:

```ts
// Middleware to parse incoming JSON data with JSON API content type
app.use(express.json({ type: 'application/vnd.api+json' }));
```

```ts
export const action = async ({ request }) => {
  const data = await request.formData();

  const formData = new FormData();
  formData.append('username', data.get('username'));
  formData.append('email', data.get('email'));
  formData.append('password', data.get('password'));

  const url = `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_PORT
  }/auth/signup`;

  const jsonData = formDataToJsonApi<UserAttributes>(formData, 'user');

  const result = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/vnd.api+json', // Set the correct content type for JSON API
    },
    body: JSON.stringify(jsonData), // Convert the data to JSON string
  });

  // Handle the response from the server as needed
  // For example, you might parse the JSON response and return it as a result
  const responseData = await result.json();
  return responseData;
};
```

### send as JSON

```js
// Assuming 'data' is a FormData object, convert it to a JSON object
const data = await request.formData();

// Assuming 'data' is a FormData object, convert it to a JSON object
const formDataAsObject = {};
data.forEach((value, key) => {
  formDataAsObject[key] = value;
});

const result = await fetch(
  `${import.meta.env.VITE_BACKEND_URL}:${import.meta.env.VITE_PORT}/auth/login`,
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formDataAsObject), // Convert to JSON string
  }
);
```

### send as formData

- If you prefer to send the FormData object directly, you can set the Content-Type header to 'multipart/form-data', but keep in mind that the server should be able to handle multipart form data.

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
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
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
<!-- example -->
VITE_API_URL=https://example.com/api
```

```js
const apiUrl = import.meta.env.VITE_API_URL;
```

## react-router-dom 6 - getting searchParams

```ts
const url = new URL(request.url);
console.log('url:', url);

const page = url.searchParams.get('page');
console.log('page: ', page);
```
