//this will only work if server response DOES'NT include httpOnly
export const clearToken = () => {
  const pastDate = new Date('Thu, 01 Jan 1970 00:00:00 UTC').toUTCString();
  document.cookie = `token=; expires=${pastDate}; path=/;`;
};
