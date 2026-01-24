import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
  Button,
} from '@mui/material';
import { ArrowBack, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/apiClient';

interface Booking {
  id: string;
  bookingDate: string;
  status: string;
  service: {
    name: string;
    serviceProfile: {
      name: string;
      address: string;
      city: {
        name: string;
      };
    };
  };
}

const ClientBookingsPageSimple = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await apiClient.get('/booking/client');
      console.log('ClientBookingsPageSimple - Raw bookings data:', response.data);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError('Не удалось загрузить записи');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate('/client')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Мои записи
          </Typography>
          <Button
            color="inherit"
            onClick={() => navigate('/')}
            sx={{ mr: 2, display: { xs: 'none', sm: 'block' } }}
          >
            Главная страница
          </Button>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.email}
              </Typography>
              <IconButton color="inherit" onClick={logout} title="Выйти">
                <Close />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, paddingTop: '80px' }}>
        {error && <Typography color="error" sx={{ mb: 3 }}>{error}</Typography>}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Все записи ({bookings.length})
          </Typography>

          {bookings.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              У вас пока нет записей
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {bookings.map((booking) => (
                <Paper key={booking.id} sx={{ p: 2 }}>
                  <Typography variant="h6">{booking.service.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.service.serviceProfile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {booking.service.serviceProfile.address}, {booking.service.serviceProfile.city.name}
                  </Typography>
                  <Typography variant="body2">
                    Дата: {new Date(booking.bookingDate).toLocaleString('ru-RU')}
                  </Typography>
                  <Typography variant="body2">
                    Статус: {booking.status}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default ClientBookingsPageSimple;
