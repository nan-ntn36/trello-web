import { Box, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import { capitalizeFirstLetter } from '~/utils/formats';
import BoardUserGroup from './BoardUserGroup';
import InviteBoardUser from './InviteBoardUser';

const MENU_STYLE = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '& .MuiSvgIcon-root': {
    color: 'white',
  },
  '&:hover': {
    bgcolor: 'primary.50',
  },
};

function BoardBar({ board }) {
  return (
    <Box
      px={2}
      sx={{
        height: (theme) => theme.trelloCustom.boardBarHeight,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        overflowX: 'auto',
        gap: 2,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#34495e' : '#1976d2',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLE}
            icon={<DashboardIcon />}
            onClick={() => alert('test')}
            label={board?.title}
          />
        </Tooltip>
        <Chip
          sx={MENU_STYLE}
          icon={<VpnLockIcon />}
          onClick={() => alert('test')}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />
        <Chip
          sx={MENU_STYLE}
          icon={<AddToDriveIcon />}
          onClick={() => alert('test')}
          label="Add to Google Driver"
        />
        <Chip
          sx={MENU_STYLE}
          icon={<BoltIcon />}
          onClick={() => alert('test')}
          label="Automation"
        />
        <Chip
          sx={MENU_STYLE}
          icon={<FilterListIcon />}
          onClick={() => alert('test')}
          label="Filters"
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Xử lý mời user vào làm thành viên của Board */}
        <InviteBoardUser boardId={board?._id} />
        {/* Xữ lý hiển thị danh sách thành viên của board  */}
        <BoardUserGroup boardUsers={board?.FE_allUsers} />
      </Box>
    </Box>
  );
}

export default BoardBar;
