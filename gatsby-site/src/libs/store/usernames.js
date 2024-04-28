

   // To store the username
export const storeUsername = (username) => {
  localStorage.setItem('poemPaintUsername', username);
};

// To retrieve the username
export const retrieveUsername = () => {
  return localStorage.getItem('poemPaintUsername') || '';
};