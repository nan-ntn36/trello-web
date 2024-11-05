/* eslint-disable no-console */
import Box from '@mui/material/Box';
import Column from './Column/Column';
import Button from '@mui/material/Button';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import { TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { createNewColumnAPI } from '~/apis';
import { generatePlaceholder } from '~/utils/formats';
import { cloneDeep } from 'lodash';
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import { useSelector, useDispatch } from 'react-redux';

function ListColumns({ columns }) {
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false);
  const toggelOpenNewColumnForm = () =>
    setOpenNewColumnForm(!openNewColumnForm);
  const [newColumnTitle, setNewColumnTitle] = useState('');
  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard); // lấy dữ liệu từ redux

  const addNewColumn = async () => {
    if (!newColumnTitle) return toast.error('Please enter column title');

    const newColumnData = {
      title: newColumnTitle,
    };

    // Gọi Api tạo mới column
    const createColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id,
    });

    // khi tạo column mới thì chưa có card, cần xử lý vấn đề kéo thả khi card rỗng
    createColumn.cards = [generatePlaceholder(createColumn)];
    createColumn.cardOrderIds = [generatePlaceholder(createColumn)._id];

    /**
   Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone ra giá trị newboard nhưng bản chất của spread  operator là shallow copy/clone,
   nên dính phải rules Immutability trong redux toolkit không dùng được hàm push, cách đơn giản nhất lúc này là chúng ta dùng Deep Copy/Clone trong toàn bộ cái Board.
   */

    //  Cách 1 dùng thư viện
    // const newBoard = { ...board };
    const newBoard = cloneDeep(board);
    newBoard.columns.push(createColumn);
    newBoard.columnOrderIds.push(createColumn._id);
    // Cách 2: dùng spreed operator và concat để nối 2 mảng lại với nhau
    /**
     * const newBoard = {...board}
     * newBoard.columns = newBoard.columns.concat([createColumn])
     * newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createColumn._id])
     */
    // cập nhât dữ liệu vào trong redux store
    dispatch(updateCurrentActiveBoard(newBoard));
    setNewColumnTitle('');
    toggelOpenNewColumnForm();
  };

  // SortableContext chỉ nhận [] mới có animation
  return (
    <SortableContext
      items={columns?.map((c) => c._id)}
      strategy={horizontalListSortingStrategy}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: 'inherit',
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          '&::-webkit-scrollbar-track': { m: 2 },
        }}
      >
        {columns?.map((column) => (
          <Column key={column._id} column={column} />
        ))}

        {/* box add new column */}
        {!openNewColumnForm ? (
          <Box
            onClick={toggelOpenNewColumnForm}
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              m: 2,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
            }}
          >
            <Button
              startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1,
              }}
            >
              Add new column
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              minWidth: '250px',
              maxWidth: '250px',
              mx: 2,
              p: 1,
              borderRadius: '6px',
              height: 'fit-content',
              bgcolor: '#ffffff3d',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}
          >
            <TextField
              label="Enter column title"
              type="text"
              size="small"
              variant="outlined"
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: 'white' },
                  '&.Mui-focused fieldset': { borderColor: 'white' },
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button
                className="interceptor-loading"
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': { bgcolor: (theme) => theme.palette.success.main },
                }}
                onClick={addNewColumn}
              >
                Add column
              </Button>
              <CloseIcon
                sx={{
                  color: 'white',
                  cursor: 'pointer',
                }}
                fontSize="small"
                onClick={toggelOpenNewColumnForm}
              />
            </Box>
          </Box>
        )}
      </Box>
    </SortableContext>
  );
}

export default ListColumns;
