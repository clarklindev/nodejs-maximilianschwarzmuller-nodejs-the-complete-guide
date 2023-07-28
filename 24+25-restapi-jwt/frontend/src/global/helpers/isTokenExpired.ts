//using getCookie() to get the cookie and token from cookie, you can check if token is still valid

export const isTokenExpired = (token) => {
  if (!token) return true;

  const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decoding the token payload
  const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

  return decodedToken.exp < currentTime; // Comparing expiration time with current time
};
