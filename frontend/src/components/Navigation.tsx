import { Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Navigation = () => {
  const { user, logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Автосервис
        </Typography>
        {user && (
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button color="inherit" component={RouterLink} to="/appointments">
              Записи
            </Button>
            <Button color="inherit" component={RouterLink} to="/garage">
              Гараж
            </Button>
            <Button color="inherit" component={RouterLink} to="/services">
              Услуги
            </Button>
            <Button color="inherit" component={RouterLink} to="/profile">
              Профиль
            </Button>
            <Button color="inherit" onClick={logout}>
              Выйти
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;