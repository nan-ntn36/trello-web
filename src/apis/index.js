import { toast } from 'react-toastify';
import authorizeAxiosInstance from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';

// board api
export const createNewBoarAPI = async (newBoardData) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/boards`,
    newBoardData
  );
  toast.success('Board create successfully!');

  return response.data;
};

export const fetchBoardsApi = async (searchPath) => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/boards${searchPath}`
  );

  return response.data;
};

export const fetchBoardDetailsAPI = async (boardId) => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/boards/${boardId}`
  );
  return response.data;
};

export const updateBoardDetailsAPI = async (boardId, updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/${boardId}`,
    updateData
  );
  return response.data;
};

export const moveCardToDiffentColumnAPI = async (updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/boards/suports/moving_card`,
    updateData
  );
  return response.data;
};

// column api

export const createNewColumnAPI = async (newColumnData) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/columns`,
    newColumnData
  );

  return response.data;
};

export const updateColumnDetailsAPI = async (columnId, updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/columns/${columnId}`,
    updateData
  );
  return response.data;
};

export const deleteColumnDetailsAPI = async (columnId) => {
  const response = await authorizeAxiosInstance.delete(
    `${API_ROOT}/v1/columns/${columnId}`
  );
  return response.data;
};
// card api
export const createNewCardAPI = async (newCardData) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/cards`,
    newCardData
  );

  return response.data;
};

export const updateCardDetailsAPI = async (cardId, updateData) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/cards/${cardId}`,
    updateData
  );
  return response.data;
};
// User
export const registerUserApi = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/users/register`,
    data
  );
  toast.success(
    'Account created success! Please check email verify you account befor logging in!',
    { theme: 'colored' }
  );

  return response.data;
};

export const verifyUserApi = async (data) => {
  const response = await authorizeAxiosInstance.put(
    `${API_ROOT}/v1/users/verify`,
    data
  );
  toast.success('Account verify success!', { theme: 'colored' });

  return response.data;
};

export const refreshTokenApi = async () => {
  const response = await authorizeAxiosInstance.get(
    `${API_ROOT}/v1/users/refresh_token`
  );

  return response.data;
};

export const inviteUseToBoardApi = async (data) => {
  const response = await authorizeAxiosInstance.post(
    `${API_ROOT}/v1/invitations/board`,
    data
  );

  toast.success('User invited to board successfully');
  return response.data;
};
