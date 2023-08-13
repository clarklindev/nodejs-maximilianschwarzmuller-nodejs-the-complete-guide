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
    import.meta.env.VITE_BACKEND_PORT
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
  `${import.meta.env.VITE_BACKEND_URL}:${
    import.meta.env.VITE_BACKEND_PORT
  }/auth/login`,
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
  import.meta.env.VITE_BACKEND_PORT
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

---

# AUTHENTICATION: HTTP-only cookie (PREFERRED)

```ts
// on the server
const token = await jwt.sign(saveInToken, process.env.JWT_SECRET!, {
  expiresIn: '1h',
});

res.cookie('token', token, { httpOnly: true, secure: true });
res.send('Login successful');
```

- then all you do is check for token presence checkLoggedIn()

```ts
// Function to check if the token cookie is present
function checkLoggedIn() {
  const cookies = document.cookie;
  const cookieArray = cookies.split('; ');
  const tokenCookie = cookieArray.find((cookie) => cookie.startsWith('token='));
  if (tokenCookie) {
    // Token cookie is present, user is logged in
    return true;
  } else {
    // Token cookie is not present, user is not logged in
    return false;
  }
}

// Usage example
if (checkLoggedIn()) {
  // User is logged in, show the logout button
} else {
  // User is not logged in, show the login button
}
```

### getting this http-only cookie (on BACKEND)

In most backend frameworks or libraries, the token will be available in the HTTP request headers under the "Cookie" header. The exact way to access it will depend on your backend technology. Since you mentioned using Express.js in a previous code snippet, I'll provide an example of how you can access the token on the backend using Express.js:

```ts
// Assuming you have the 'express' library installed and the server is already set up

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token; // way to Access the 'token' cookie value if using http-only cookie
  console.log('validate token: ', token);

  if (token) {
    // Now you have the JWT token, and you can proceed to validate and use it as needed.
    return res.json({ loggedIn: true });
  } else {
    // Handle the case when the token is not present in the request.
    return res.json({ loggedIn: false });
  }
};
```

OR

- check if the token is expired, you need to extract the token from the HTTP-only cookie, decode it to access its payload, and then compare the expiration time (exp) with the current time on the frontend

```ts
function getCookie(name) {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function isTokenExpired(token) {
  if (!token) return true;

  const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding the token payload
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  return decodedToken.exp < currentTime; // Comparing expiration time with current time
}

//usage
const token = getCookie('token');
if (!isTokenExpired(token)) {
  // Token is not expired, user is logged in
  // Show the logout button or perform other actions for a logged-in user
} else {
  // Token is expired or not present, user is not logged in
  // Show the login button or perform other actions for a logged-out user
}
```

---

# AUTHENTICATION: working with JWT (NOTE: REPLACED WITH HTTP-only cookie \*see above)

- so with JWT you have to manage token expiration

```ts
// Assume token is the JWT token received from the server
localStorage.setItem('token', token);
```

### using JWT token

```ts
// Check if the token is present and not expired
const token = localStorage.getItem('token');
if (token) {
  // Token is present, check if it's expired
  const decodedToken = jwt.decode(token);
  const currentTime = Date.now() / 1000;
  if (decodedToken.exp > currentTime) {
    // Token is not expired, user is logged in
    // You can update the UI here to show the logout button
  } else {
    // Token is expired, user is not logged in
    // You might want to remove the token from storage in this case
    localStorage.removeItem('token');
  }
}

const isLoggedIn = /* Check if the user is logged in based on the token */;
if (isLoggedIn) {
  // Show logout button
} else {
  // Show login button
}
```

```ts
const token = getCookie('token');
if (!isTokenExpired(token)) {
  // Token is not expired, user is logged in
  // Show the logout button or perform other actions for a logged-in user
} else {
  // Token is expired or not present, user is not logged in
  // Show the login button or perform other actions for a logged-out user
}

// Clear the token from storage on logout
localStorage.removeItem('token');
```

### crossroads for state

- you can choose between using custom hooks or context/state management like redux.
- i initially went with auth context but im switching to custom hooks because it seems cleaner
