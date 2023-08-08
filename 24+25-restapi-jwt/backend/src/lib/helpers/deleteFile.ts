import fs from 'fs';

export const deleteFile = (filepath) => {
  fs.unlink(filepath, (err) => {
    if (err) {
      throw err;
    }
  });
};
