import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import authorizeAxiosInstance from '~/utils/authorizeAxios';
import { isEmpty } from 'lodash';
import { API_ROOT } from '~/utils/constants';
import { generatePlaceholder } from '~/utils/formats';
import { mapOrder } from '~/utils/sort';

// khỏi tạo giá trị State trong redux
const initialState = {
  currentActiveBoard: null,
};

//Các hành động gọi API (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng middleware createAsyncThunk đi kèm với extraReducers
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizeAxiosInstance.get(
      `${API_ROOT}/v1/boards/${boardId}`
    );
    return response.data;
  }
);

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
    // truyền cái card
    updateCardInBoard: (state, action) => {

      const incomingCard = action.payload;
      const column = state.currentActiveBoard.columns.find(i => i._id === incomingCard.columnId)
      if (column) {
        const card = column.cards.find(i => i._id === incomingCard._id)
        if (card) {
          // card.title = incomingCard.title ,cách 1
          // card['title'] = incomingCard['title']
          Object.keys(incomingCard).forEach(key => {
            card[key] = incomingCard[key]
          })
        }
      }
    }
  },
  //ExtraReducers: nơi xữ lý dữ liệu bất đồng bộ
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      //action.payload chính là response.data trả về ở trên
      let board = action.payload;

      // thành viên trong board là gộp lại từ owner và member
      board.FE_allUsers = board.owners.concat(board.members)
      // sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id');

      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          // xử lý kéo thả khi column rỗng
          column.cards = [generatePlaceholder(column)];
          column.cardOrderIds = [generatePlaceholder(column)._id];
        } else {
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id');
        }
      });

      state.currentActiveBoard = board;
    });
  },
});
// actions là nơi dành cho các component bên dưới goi bằng dispatch() tới nó để cập nhật lại dữ liệu thong qua reducer(đồng bộ)
// actions sẽ được tạo theo từng function trong reducers -> thằng action này được tự động tạo theo tên của reducer.
export const { updateCurrentActiveBoard, updateCardInBoard } = activeBoardSlice.actions;

// selectors:là nơi dành cho các component bên dưới gọi bằng hook useSelector() để lấy dữ liệu trong redux
export const selectCurrentActiveBoard = (state) => {
  //actvieBoard là name -> đến thằng reducer
  return state.activeBoard.currentActiveBoard;
};

//cái file này tên là activeBoardSlice Nhưng chúng ta export một thứ tên là reducer
// export default activeBoardSlice.reducer;

export const activeBoardReducer = activeBoardSlice.reducer;
