let apiRoot = '';
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:3694';
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = 'https://trello-api-boqq.onrender.com';
}

export const API_ROOT = apiRoot;
// export const API_ROOT = 'https://trello-api-boqq.onrender.com';
