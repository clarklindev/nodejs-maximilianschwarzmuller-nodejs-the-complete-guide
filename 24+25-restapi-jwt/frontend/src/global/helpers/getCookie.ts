//when using this method to store token on the backend:
// res.cookie('token', token, { httpOnly: true, secure: true });
//on the frontend you can get access to the cookie like so...

export const getCookie = (name) => {
  const value = '; ' + document.cookie;
  const parts = value.split('; ' + name + '=');
  if (parts.length === 2) return parts.pop().split(';').shift();
};
