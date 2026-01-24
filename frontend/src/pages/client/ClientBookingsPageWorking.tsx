import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
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

const ClientBookingsPageWorking = () => {
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
      console.log('ClientBookingsPageWorking - Bookings loaded:', response.data);
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError('Не удалось загрузить записи');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    console.log('ClientBookingsPageWorking - Still loading...');
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  console.log('ClientBookingsPageWorking - About to render, bookings count:', bookings.length);

  return (
    <Box sx={{ p: 3, bgcolor: 'red', minHeight: '100vh' }}>
      <Typography variant="h4" color="white">
        DEBUG: ClientBookingsPageWorking rendered!
      </Typography>
      
      {/* Кнопка назад */}
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/client')}
        sx={{ mb: 3 }}
      >
        Назад в личный кабинет
      </Button>

      {/* Заголовок */}
      <Typography variant="h4" gutterBottom>
        Мои записи
      </Typography>

      {/* Ошибка */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Список записей */}
      <Typography variant="h6" gutterBottom>
        Все записи ({bookings.length})
      </Typography>

      {bookings.length === 0 ? (
        <Box sx={{ 
          p: 4, 
          textAlign: 'center', 
          bgcolor: 'grey.100',
          borderRadius: 2
        }}>
          <Typography variant="body1" color="text.secondary">
            У вас пока нет записей
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {bookings.map((booking) => (
            <Box
              key={booking.id}
              sx={{
                p: 3,
                border: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                bgcolor: 'background.paper'
              }}
            >
              <Typography variant="h6" gutterBottom>
                {booking.service.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Автосервис: {booking.service.serviceProfile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Адрес: {booking.service.serviceProfile.address}, {booking.service.serviceProfile.city.name}
              </Typography>
              <Typography variant="body2" gutterBottom>
                Дата: {new Date(booking.bookingDate).toLocaleString('ru-RU')}
              </Typography>
              <Box sx={{ display: 'inline-block' }}>
                <Typography
                  variant="body2"
                  sx={{
                    px: 2,
                    py: 1,
                    bgcolor: booking.status === 'confirmed' ? 'success.light' : 
                             booking.status === 'pending' ? 'warning.light' : 
                             'grey.200',
                    borderRadius: 1,
                    fontWeight: 'bold'
                  }}
                >
                  Статус: {booking.status === 'confirmed' ? 'Подтверждена' :
                           booking.status === 'pending' ? 'Ожидает' : booking.status}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ClientBookingsPageWorking;
