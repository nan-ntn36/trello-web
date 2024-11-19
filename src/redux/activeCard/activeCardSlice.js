import { createSlice } from '@reduxjs/toolkit';

// khỏi tạo giá trị State trong redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
};


// khởi tạo một slice trong kho lưu trử redux
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  //  nơi xữ lý dữ liệu đồng bộ
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true;
    },
    clearAndeHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null;
      state.isShowModalActiveCard = false;
    },
    updateCurrentActiveCard : (state, action) => {
      const fullCard = action.payload;
      state.currentActiveCard = fullCard;
    }
  },
  //ExtraReducers: nơi xữ lý dữ liệu bất đồng bộ
  // eslint-disable-next-line no-unused-vars
  extraReducers: (builder) => {
  },
});
// actions là nơi dành cho các component bên dưới goi bằng dispatch() tới nó để cập nhật lại dữ liệu thong qua reducer(đồng bộ)
// actions sẽ được tạo theo từng function trong reducers -> thằng action này được tự động tạo theo tên của reducer.
export const { clearAndeHideCurrentActiveCard, updateCurrentActiveCard, showModalActiveCard } = activeCardSlice.actions;

// selectors:là nơi dành cho các component bên dưới gọi bằng hook useSelector() để lấy dữ liệu trong redux
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard;
};

export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard;
};
//cái file này tên là activeBoardSlice Nhưng chúng ta export một thứ tên là reducer
// export default activeBoardSlice.reducer;
export const activeCardReducer = activeCardSlice.reducer;
