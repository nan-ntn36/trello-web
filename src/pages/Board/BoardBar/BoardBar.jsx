import { Avatar, AvatarGroup, Box, Button, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VpnLockIcon from '@mui/icons-material/VpnLock';
import AddToDriveIcon from '@mui/icons-material/AddToDrive';
import BoltIcon from '@mui/icons-material/Bolt';
import FilterListIcon from '@mui/icons-material/FilterList';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { capitalizeFirstLetter } from '~/utils/formats';

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
        <Chip
          sx={MENU_STYLE}
          icon={<DashboardIcon />}
          onClick={() => alert('test')}
          label={board?.title}
        />
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
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&;hover': {
              borderColor: 'white',
            },
          }}
        >
          Invite
        </Button>
        <AvatarGroup
          max={4}
          sx={{
            gap: '10px',
            '& .MuiAvatar-root': {
              width: '35px',
              height: '35px',
              fontSize: '16px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#a4b0de' },
            },
          }}
        >
          <Tooltip title="nav">
            <Avatar
              alt="Remy Sharp"
              src="https://cdn.pixabay.com/photo/2017/06/12/16/35/bharat-2396074_640.jpg"
            />
          </Tooltip>
          <Tooltip title="nav">
            <Avatar
              alt="Remy Sharp"
              src="https://cdn.pixabay.com/photo/2017/06/12/16/35/bharat-2396074_640.jpg"
            />
          </Tooltip>
          <Tooltip title="nav">
            <Avatar
              alt="Remy Sharp"
              src="https://cdn.pixabay.com/photo/2017/06/12/16/35/bharat-2396074_640.jpg"
            />
          </Tooltip>
          <Tooltip title="nav">
            <Avatar
              alt="Remy Sharp"
              src="https://cdn.pixabay.com/photo/2017/06/12/16/35/bharat-2396074_640.jpg"
            />
          </Tooltip>
          <Tooltip title="nav">
            <Avatar
              alt="Remy Sharp"
              src="https://cdn.pixabay.com/photo/2017/06/12/16/35/bharat-2396074_640.jpg"
            />
          </Tooltip>
        </AvatarGroup>
      </Box>
    </Box>
  );
}

export default BoardBar;
