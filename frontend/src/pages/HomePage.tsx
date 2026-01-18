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
  useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import { fetchCities } from '../services/cityService';
import type { City } from '../types';

const HomePage = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const loadCities = async () => {
      const cities = await fetchCities();
      setCities(cities);
    };

    loadCities();
  }, []);

  // Перенаправляем автосервис на страницу управления
  useEffect(() => {
    if (user && user.role === 'service') {
      navigate('/service-management');
    }
  }, [user, navigate]);

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
          boxSizing: 'border-box'
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
    </LocalizationProvider>
  );
};

export default HomePage;
