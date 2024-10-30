import { Container } from '@mui/material';
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
} from '~/apis';
import { generatePlaceholder } from '~/utils/formats';
import { isEmpty } from 'lodash';
function Board() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    const boardId = '671ef64bf8baf6e103a25c5c';
    fetchBoardDetailsAPI(boardId).then((board) => {
      board.columns.forEach((column) => {
        if (isEmpty(column.cards)) {
          // xử lý kéo thả khi column rỗng
          column.cards = [generatePlaceholder(column)];
          column.cardOrderIds = [generatePlaceholder(column)._id];
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
    newBoard.columnOrderIds.push(createNewColumn._id);
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
      updateColumn.cards.push(createCard);
      updateColumn.cardOrderIds.push(createCard._id);
    }
    setBoard(newBoard);
  };

  const moveColumns = async (dndOrderedColumns) => {
    const dndOrderedColumnIds = dndOrderedColumns.map((c) => c._id);
    const newBoard = { ...board };
    newBoard.columns = dndOrderedColumns;
    newBoard.columnOrderIds = dndOrderedColumnIds;
    setBoard(newBoard);
    // gọi api update board
    await updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnIds,
    });
  };

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
      />
    </Container>
  );
}

export default Board;
