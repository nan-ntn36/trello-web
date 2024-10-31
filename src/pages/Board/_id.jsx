import { Box, Container, Typography } from '@mui/material';
import AppBar from '~/components/AppBar/AppBar';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';
// import { mockData } from '~/apis/mock-data';

import { useEffect, useState } from 'react';
import {
  fetchBoardDetailsAPI,
  createNewCardAPI,
  createNewColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDiffentColumnAPI,
  deleteColumnDetailsAPI,
} from '~/apis';
import { generatePlaceholder } from '~/utils/formats';
import { isEmpty } from 'lodash';
import { mapOrder } from '~/utils/sort';
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify';
function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = '671ef64bf8baf6e103a25c5c';
    fetchBoardDetailsAPI(boardId).then((board) => {
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
      setBoard(board);
    });
  }, []);

  // Func có nhiệm vụ gọi API tạo mới column
  const createNewColumn = async (newColumnData) => {
    const createColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    // khi tạo column mới thì chưa có card, cần xử lý vấn đề kéo thả khi card rỗng
    createColumn.cards = [generatePlaceholder(createColumn)];
    createColumn.cardOrderIds = [generatePlaceholder(createColumn)._id];

    const newBoard = { ...board };
    newBoard.columns.push(createColumn);
    newBoard.columnOrderIds.push(createColumn._id);
    setBoard(newBoard);
  };

  // Func có nhiệm vụ gọi API tạo mới card
  const createNewCard = async (newCardData) => {
    const createCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    const newBoard = { ...board };
    const updateColumn = newBoard.columns.find(
      (column) => column._id === createCard.columnId
    );
    if (updateColumn) {
      // nếu column rổng
      if (updateColumn.cards.some((card) => card.FE_PlaceholderCard)) {
        updateColumn.cards = [createCard];
        updateColumn.cardOrderIds = [createCard._id];
      } else {
        updateColumn.cards.push(createCard);
        updateColumn.cardOrderIds.push(createCard._id);
      }
    }
    setBoard(newBoard);
  };
  // khi nào gọi api mà cần hứng kết quả mới cần async và await

  // xữ lý kéo thả column
  const moveColumns = (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    setBoard(newBoard);
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
    const newBoard = { ...board };
    const updateColumn = newBoard.columns.find(
      (column) => column._id === colmnId
    );
    if (updateColumn) {
      updateColumn.cards = dndOrderedCard;
      updateColumn.cardOrderIds = dndOrderedCardIds;
    }
    setBoard(newBoard);
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
    setBoard(newBoard);

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

  // Xử xóa 1 column và card bên trong nó
  const deleteColumnDetails = (columnId) => {
    const newBoard = { ...board };
    newBoard.columns = newBoard.columns.filter(
      (column) => columnId !== column._id
    );
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    );
    setBoard(newBoard);
    deleteColumnDetailsAPI(columnId).then((res) =>
      toast.success(res?.deleteResult)
    );
  };

  if (!board)
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh',
        }}
      >
        <CircularProgress />
        <Typography>Loadding Board.......</Typography>
      </Box>
    );

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        movecardInTheSameColumn={movecardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  );
}

export default Board;
