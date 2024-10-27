import ModeSelect from '~/components/ModeSelect/ModeSelect';
import Box from '@mui/material/Box';
import AppsIcon from '@mui/icons-material/Apps';
import TrelloIcon from '~/assets/mdi--trello.svg?react';
import SvgIcon from '@mui/material/SvgIcon';
import {
  Badge,
  Button,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import Workspaces from './Menus/Workspaces';
import Recent from './Menus/Recent';
import Starred from './Menus/Starred';
import Stemplates from './Menus/Stemplates';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Profile from './Menus/Profiles';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

function AppBar() {
  const [searchValue, setSearchValue] = useState('');
  return (
    <Box
      px={2}
      sx={{
        width: '100%',
        height: (theme) => theme.trelloCustom.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        overflowX: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <AppsIcon sx={{ color: 'white' }} />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <SvgIcon
            component={TrelloIcon}
            inheritViewBox
            fontSize="small"
            sx={{ color: 'white' }}
          />
          <Typography
            variant="span"
            sx={{
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            Trello
          </Typography>
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <Workspaces />
          <Recent />
          <Starred />
          <Stemplates />
          <Button
            variant="outlined"
            startIcon={<LibraryAddIcon />}
            sx={{
              color: 'white',
              border: 'none',
              '&:hover': { border: 'none' },
            }}
          >
            Create
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <TextField
          id="outlined-search"
          label="Search.."
          type="search"
          size="small"
          sx={{
            minWidth: '120px',
            maxWidth: '170px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' },
            },
          }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <CloseIcon
                sx={{
                  color: searchValue ? 'white' : 'transparent',
                  cursor: 'pointer',
                }}
                fontSize="small"
                onClick={() => setSearchValue('')}
              />
            ),
          }}
        />
        <ModeSelect />
        <Tooltip title="Notifycation">
          <Badge color="warning" variant="dot" sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon sx={{ color: 'white' }} />
          </Badge>
        </Tooltip>
        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ color: 'white' }} />
        </Tooltip>
        <Profile />
      </Box>
    </Box>
  );
}

export default AppBar;
