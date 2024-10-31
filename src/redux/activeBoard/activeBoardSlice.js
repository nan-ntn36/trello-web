import { createSlice } from '@reduxjs/toolkit';

// khỏi tạo giá trị State trong redux
const initialState = {
  currentActiveBoard: null,
};

// khởi tạo một slice trong kho lưu trử redux
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  //  nơi xữ lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      // action.payload là chuẩn đặt tên nhận dữ liệu vào reducers ở đây chúng ta gán nó ra một biến có nghĩa hơn
      const fullBoard = action.payload;
      //   xữ lý dữ liệu

      //Update dữ liệu currentActiveBoard

      state.currentActiveBoard = fullBoard;
    },
  },
});

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard } = activeBoardSlice.actions;

export default activeBoardSlice.reducer;
