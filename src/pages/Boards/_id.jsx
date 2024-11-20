import { Container } from '@mui/material';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
// import { mockData } from '~/apis/mock-data';

import { useEffect } from 'react';
import {
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDiffentColumnAPI,
} from '~/apis';
import { cloneDeep } from 'lodash';
import {
  fetchBoardDetailsAPI,
  updateCurrentActiveBoard,
  selectCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import { useDispatch, useSelector } from 'react-redux';

import { useParams } from 'react-router-dom';
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpiner';
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard';

function Board() {
  const dispatch = useDispatch();
  // const [board, setBoard] = useState(null);
  const board = useSelector(selectCurrentActiveBoard); // lấy dữ liệu từ redux
  const { boardId } = useParams();

  useEffect(() => {
    // call APi, đưa sang extrareducer của redux
    dispatch(fetchBoardDetailsAPI(boardId)); // dữ liệu đang năm ở state
  }, [dispatch, boardId]);

  // khi nào gọi api mà cần hứng kết quả mới cần async và await

  // xữ lý kéo thả column
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((c) => c._id);
    // thằng này không lỗi vì chúng ta không dùng push mà gán lại toàn bộ mãng bằng 1 mãng mới
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    dispatch(updateCurrentActiveBoard(newBoard));
    // gọi api update board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnIds,
    });
  };

  //xữ lý kéo thả Card trong cùng 1 column, thì cập nhật cardOrderIds
  const movecardInTheSameColumn = (
    dndOrderedCard,
    dndOrderedCardIds,
    colmnId
  ) => {
    // const newBoard = { ...board };
    const newBoard = cloneDeep(board);
    const updateColumn = newBoard.columns.find(
      (column) => column._id === colmnId
    );
    if (updateColumn) {
      updateColumn.cards = dndOrderedCard;
      updateColumn.cardOrderIds = dndOrderedCardIds;
    }
    dispatch(updateCurrentActiveBoard(newBoard));
    updateColumnDetailsAPI(colmnId, {
      cardOrderIds: dndOrderedCardIds,
    });
  };
  // duy chuyển card sang column khác
  //1. Cập nhật mảng cardOrderIds của column ban đầu chứa nó (hiểu bản chát là xóa cái _id của card ra khỏi mảng)
  //2. Cập nhât mảng cardOrderIds của column tiếp theo (hiểu bản chát là thêm cái _id của card vào mảng)
  //3. Cập nhât lại trường columnId mới của card đã kéo

  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    // update chuẩn dữ liệu state board
    const dndOrderedColumnIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    dispatch(updateCurrentActiveBoard(newBoard));

    // xữ lý vấn đề khi kéo card cuối cùng ra khỏi column, column rõng sẽ có -placeholder-card, cần xóa nó đi trước khi gửi đi dữ liệu lên back end
    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds;

    if (prevCardOrderIds[0].includes('-placeholder-card'))
      prevCardOrderIds = [];
    // gọi api xữ lý phia BE
    moveCardToDiffentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds: prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds,
    });
  };

  if (!board) return <PageLoadingSpinner caption="Loading...." />;

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* modal active card, check đóng mở dựa theo điều kiện có tồn tại State isShowModalActiveCard lưu trong Redux hay không thì mới render. mỗi thời điểm chỉ tòn tại cái modal card đang active */}
      <ActiveCard/>
      {/* Các thành phần còn lại của Boards details */}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumns={moveColumns}
        movecardInTheSameColumn={movecardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
      />
    </Container>
  );
}

export default Board;
