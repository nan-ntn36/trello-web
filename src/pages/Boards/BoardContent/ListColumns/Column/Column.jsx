import {
  Box,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
} from '@mui/material';
import { Cloud, ContentCut } from '@mui/icons-material';
// import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Divider from '@mui/material/Divider';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import AddCardIcon from '@mui/icons-material/AddCard';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import ListCards from './ListCards/ListCards';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';
import { createNewCardAPI, deleteColumnDetailsAPI, updateColumnDetailsAPI } from '~/apis';
import { cloneDeep } from 'lodash';
import {
  selectCurrentActiveBoard,
  updateCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import { useSelector, useDispatch } from 'react-redux';
import ToggleFocusInput from '~/components/Form/ToggleFocusInput';


function Column({ column }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } });
  const dndKitColumnStyle = {
    // touchAction: "none", // dành cho sensor default Pointersensor
    // dùng Translate không bị bug
    transform: CSS.Translate.toString(transform),
    transition,
    height: '100%',
    opacity: isDragging ? 0.5 : undefined,
  };
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  // card đã được sắp xếp ở component cha cao nhất
  const orderedCards = column.cards;
  const [openNewCardForm, setOpenNewCardForm] = useState(false);
  const toggelOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm);
  const [newCardTitle, setNewCardTitle] = useState('');

  const dispatch = useDispatch();
  const board = useSelector(selectCurrentActiveBoard); // lấy dữ liệu từ redux
  const addNewCard = async () => {
    if (!newCardTitle)
      return toast.error('Please enter Card title', {
        position: 'bottom-right',
      });
    const newCardData = {
      title: newCardTitle,
      columnId: column._id,
    };

    // Gọi api tạo card
    const createCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id,
    });

    // tương tự createColumn
    const newBoard = cloneDeep(board);
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
    // update dữ liệu vào trong store
    dispatch(updateCurrentActiveBoard(newBoard));
    setNewCardTitle('');
    toggelOpenNewCardForm();
  };

  // xử lý xóa  1 column và nhiều card bên trong nó
  const confirmDelete = useConfirm();
  const handleDeleteColumn = () => {
    confirmDelete({
      title: 'Delete Column ?',
      description: 'Bạn có chắc sẽ xóa Column này hay không ?',
      confirmationText: 'Confirm',
      cancellationText: 'Cancel',

      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // cancellationButtonProps: { color: 'inherit' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' },

      // description: 'Vui lòng nhập "OK" để xóa!!',
      // confirmationKeyword: 'OK',
      // Sắp xếp button
      buttonOrder: ['confirm', 'cancel'],
    })
      .then(() => {
        const newBoard = { ...board };
        newBoard.columns = newBoard.columns.filter((c) => column._id !== c._id);
        newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
          (_id) => _id !== column._id
        );
        dispatch(updateCurrentActiveBoard(newBoard));
        deleteColumnDetailsAPI(column._id).then((res) =>
          toast.success(res?.deleteResult)
        );
      })
      .catch(() => {});
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const onUpdateColumnTitle = (newTitle) => {
    // Gọi api xữ lý và update lại dữ liệu trong redux
    updateColumnDetailsAPI(column._id, { title: newTitle }).then(() => {
      const newBoard = cloneDeep(board);
      const updateColumn = newBoard.columns.find(
        (c) => c._id === column._id
      );
      if (updateColumn) updateColumn.title = newTitle
      dispatch(updateCurrentActiveBoard(newBoard));
    })

  }
  // Bọc div bên ngoài để fix bug kéo thả
  return (
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#333643' : '#ebecf0',
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) =>
            `calc(${theme.trelloCustom.boardContentHeight} - ${theme.spacing(
              5
            )})`,
        }}
      >
        {/* Box header */}
        <Box
          sx={{
            height: (theme) => theme.trelloCustom.columnHeaderHeight,
            display: 'flex',
            justifyContent: 'space-between',
            p: 2,
          }}
        >
          {/* <Typography
            variant="h6"
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            {column?.title}
          </Typography> */}
          <ToggleFocusInput value={column?.title} onChangedValue={onUpdateColumnTitle} data-no-dnd="true"/>
          <Box>
            <Tooltip title="More options">
              <KeyboardArrowDownIcon
                id="basic-column-dropdown"
                aria-controls={open ? 'basic-menu-column-dropdown' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
                sx={{ color: 'text.primary', cursor: 'pointer' }}
              />
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-column-dropdown',
              }}
            >
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'success.light',
                    '& .add-card-icon': {
                      color: 'success.light',
                    },
                  },
                }}
                onClick={toggelOpenNewCardForm}
              >
                <ListItemIcon>
                  <AddCardIcon className="add-card-icon" fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopyIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPasteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                sx={{
                  '&:hover': {
                    color: 'warning.dark',
                    '& .delete-forever-icon': {
                      color: 'warning.dark',
                    },
                  },
                }}
                onClick={handleDeleteColumn}
              >
                <ListItemIcon>
                  <DeleteOutlineIcon
                    className="delete-forever-icon"
                    fontSize="small"
                  />
                </ListItemIcon>
                <ListItemText>Delete this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archeive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Box list  */}
        <ListCards cards={orderedCards} />
        {/* Box footer */}
        <Box
          sx={{
            height: (theme) => theme.trelloCustom.columFooterHeight,
            p: 2,
          }}
        >
          {!openNewCardForm ? (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Button
                startIcon={<AddCardIcon fontSize="small" />}
                onClick={toggelOpenNewCardForm}
              >
                Add new card
              </Button>
              <Tooltip title="Drag to move">
                <DragHandleIcon sx={{ cursor: 'pointer' }} />
              </Tooltip>
            </Box>
          ) : (
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <TextField
                label="Enter card title"
                type="text"
                size="small"
                variant="outlined"
                autoFocus
                data-no-dnd="true"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                sx={{
                  '& label': { color: 'text.primary' },
                  '& input': {
                    color: (theme) => theme.palette.primary.main,
                    bgcolor: (theme) =>
                      theme.palette.mode === 'dark' ? '#333643' : 'white',
                  },
                  '& label.Mui-focused': {
                    color: (theme) => theme.palette.primary.main,
                  },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    '&:hover fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: (theme) => theme.palette.primary.main,
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: 1,
                  },
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Button
                  className="interceptor-loading"
                  variant="contained"
                  color="success"
                  size="small"
                  data-no-dnd="true"
                  sx={{
                    boxShadow: 'none',
                    border: '0.5px solid',
                    borderColor: (theme) => theme.palette.success.main,
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.success.main,
                    },
                  }}
                  onClick={addNewCard}
                >
                  Add
                </Button>
                <CloseIcon
                  sx={{
                    color: (theme) => theme.palette.warning.light,
                    cursor: 'pointer',
                  }}
                  fontSize="small"
                  onClick={toggelOpenNewCardForm}
                />
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
}

export default Column;
