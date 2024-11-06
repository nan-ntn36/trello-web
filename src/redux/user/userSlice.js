import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizeAxiosInstance from '~/utils/authorizeAxios';
import { API_ROOT } from '~/utils/constants';

// khỏi tạo giá trị State trong redux
const initialState = {
  currentUser: null,
};

//Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng middleware createAsyncThunk đi kèm với extraReducers
export const loginUserApi = createAsyncThunk(
  'user/loginUserApi',
  async (data) => {
    const response = await authorizeAxiosInstance.post(
      `${API_ROOT}/v1/users/login/`,
      data
    );
    return response.data;
  }
);

// khởi tạo một slice trong kho lưu trử redux
export const userSlice = createSlice({
  name: 'user',
  initialState,
  //  nơi xữ lý dữ liệu đồng bộ
  reducers: {},
  //ExtraReducers: nơi xữ lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(loginUserApi.fulfilled, (state, action) => {
      //action.payload chính là response.data trả về ở trên
      const user = action.payload;
      state.currentUser = user;
    });
  },
});
// actions là nơi dành cho các component bên dưới goi bằng dispatch() tới nó để cập nhật lại dữ liệu thong qua reducer(đồng bộ)
// actions sẽ được tạo theo từng function trong reducers -> thằng action này được tự động tạo theo tên của reducer.
// export const {} = userSlice.actions;

// selectors:là nơi dành cho các component bên dưới gọi bằng hook useSelector() để lấy dữ liệu trong redux
export const selectCurrentUser = (state) => {
  //user là name -> đến thằng reducer
  return state.user.currentUser;
};

//cái file này tên là activeBoardSlice Nhưng chúng ta export một thứ tên là reducer
// export default activeBoardSlice.reducer;
export const userReducer = userSlice.reducer;
