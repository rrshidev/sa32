import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Chip,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

interface Booking {
  id: string;
  bookingDate: string;
  status: string;
  clientComment?: string;
  service: {
    id: string;
    name: string;
    description: string;
  };
  serviceProvider: {
    id: string;
    email: string;
    phone: string;
    serviceProfile: {
      name: string;
      address: string;
      city: {
        name: string;
      };
    };
  };
}

const ClientBookingsPageFinal = () => {
  const navigate = useNavigate();
  
  // Используем useRef вместо useState для избежания проблем
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const response = await apiClient.get('/booking/client');
        setBookings(response.data);
      } catch (error) {
        setError('Не удалось загрузить записи');
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Подтверждена';
      case 'pending': return 'Ожидает подтверждения';
      case 'cancelled': return 'Отменена';
      default: return status;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Навигация */}
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
      {bookings.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            У вас пока нет записей
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {bookings.map((booking) => (
            <Paper key={booking.id} sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" sx={{ flex: 1 }}>
                  {booking.service.name}
                </Typography>
                <Chip 
                  label={getStatusText(booking.status)}
                  color={getStatusColor(booking.status) as any}
                  size="small"
                />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Автосервис:</strong> {booking.serviceProvider.serviceProfile.name}
              </Typography>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>Адрес:</strong> {booking.serviceProvider.serviceProfile.address}, {booking.serviceProvider.serviceProfile.city.name}
              </Typography>
              
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Дата:</strong> {new Date(booking.bookingDate).toLocaleString('ru-RU')}
              </Typography>
              
              {booking.clientComment && (
                <Typography variant="body2" color="text.secondary">
                  <strong>Комментарий:</strong> {booking.clientComment}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ClientBookingsPageFinal;
