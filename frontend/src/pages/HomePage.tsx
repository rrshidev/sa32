import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  MenuItem,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { fetchCities } from '../services/cityService';
import type { City } from '../types';

const HomePage = () => {
  const { user, loading, logout } = useAuth();
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  useEffect(() => {
    const loadCities = async () => {
      try {
        const cities = await fetchCities();
        setCities(cities);
      } catch (error) {
        console.error('Failed to load cities:', error);
      }
    };

    loadCities();
  }, []);

  // Перенаправляем пользователей в зависимости от роли (только после загрузки)
  useEffect(() => {
    console.log('HomePage - useEffect triggered:', { loading, user, userRole: user?.role });
    if (!loading && user) {
      if (user.role === 'service') {
        console.log('HomePage - Redirecting service user to /service-management');
        navigate('/service-management');
      }
      // Для клиентов не делаем автоматический редирект - даем выбор на главной странице
    }
  }, [user, loading, navigate]);

  const handleSearch = () => {
    if (selectedCity && selectedDate) {
      const dateAt = selectedDate.toISOString().split('T')[0];
      const dateTo = new Date(selectedDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Находим ID города
      console.log('Selected city:', selectedCity);
      console.log('Available cities:', cities.map(c => ({ id: c.id, name: c.name })));
      const city = cities.find(c => c.name === selectedCity);
      const cityId = city?.id || '';
      console.log('Found city:', city, 'cityId:', cityId);
      
      navigate(`/services?dateAt=${dateAt}&dateTo=${dateTo}&cityId=${cityId}`);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
      {/* AppBar с кнопкой выхода */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Автосервис
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                color="inherit"
                onClick={() => navigate('/client')}
                sx={{ display: { xs: 'none', sm: 'block' } }}
              >
                Личный кабинет
              </Button>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.email}
              </Typography>
              <IconButton color="inherit" onClick={logout} title="Выйти">
                <Logout />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {loading ? (
        <Box
          sx={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)'
          }}
        >
          <CircularProgress size={60} />
        </Box>
      ) : (
        <Box
          sx={{
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(to bottom, #f5f5f5, #e0e0e0)',
            p: isMobile ? 2 : 3,
            boxSizing: 'border-box',
            paddingTop: '64px' // Отступ для AppBar
          }}
        >
        {/* Логотип с адаптивным размером */}
        <Box sx={{
          mb: isMobile ? 4 : 6,
          width: '100%',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <img
            src="/logo.png"
            alt="Логотип автосервиса"
            style={{
              height: isMobile ? 80 : 120,
              maxWidth: '100%',
              objectFit: 'contain'
            }}
          />
        </Box>

        {/* Основной контент с адаптивной шириной */}
        <Container
          maxWidth="sm"
          sx={{
            width: '100%',
            maxWidth: '600px !important', // Фиксируем максимальную ширину
            px: isMobile ? 2 : 3
          }}
        >
          <Stack spacing={isMobile ? 3 : 4} alignItems="center">
            {/* Адаптивный заголовок */}
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              component="h1"
              sx={{
                fontWeight: 'bold',
                textAlign: 'center',
                color: 'text.primary',
                width: '100%'
              }}
            >
              Запись в автосервис
            </Typography>

            {/* Форма выбора с адаптивными отступами */}
            <Stack spacing={isMobile ? 2 : 3} width="100%">
              <TextField
                select
                label="Выберите город"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                fullWidth
                variant="outlined"
                size={isMobile ? 'small' : 'medium'}
              >
                {cities.map((city) => (
                  <MenuItem key={city.id} value={city.name}>
                    {city.name}
                  </MenuItem>
                ))}
              </TextField>

              <DatePicker
                label="Выберите дату"
                value={selectedDate}
                onChange={setSelectedDate}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: isMobile ? 'small' : 'medium'
                  }
                }}
              />

              <Button
                variant="contained"
                size={isMobile ? 'medium' : 'large'}
                fullWidth
                disabled={!selectedCity || !selectedDate}
                onClick={handleSearch}
                sx={{
                  py: isMobile ? 1 : 1.5,
                  fontSize: isMobile ? '1rem' : '1.1rem',
                  fontWeight: 'bold',
                  mt: isMobile ? 1 : 0
                }}
              >
                Найти автосервисы
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
      )}
    </LocalizationProvider>
  );
};

export default HomePage;
