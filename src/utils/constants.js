let apiRoot = '';
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:3694';
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = '';
}

export const API_ROOT = apiRoot;
// export const API_ROOT = 'https://trello-api-boqq.onrender.com';
export const DEFAULT_PAGE = 1;
export const DEFAULT_ITEMS_PER_PAGE = 12;

export const CARD_MEMBER_ACTION = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
};
