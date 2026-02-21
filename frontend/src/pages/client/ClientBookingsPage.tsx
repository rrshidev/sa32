import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
  Chip,
  Divider,
} from '@mui/material';
import { ArrowBack, Cancel, Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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

const ClientBookingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      console.log('ClientBookingsPage - Starting to load bookings...');
      const response = await apiClient.get('/booking/client');
      console.log('ClientBookingsPage - Bookings loaded:', response.data);
      setBookings(response.data);
      console.log('ClientBookingsPage - State updated with bookings');
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError('Не удалось загрузить записи');
    } finally {
      console.log('ClientBookingsPage - Loading finished');
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!selectedBooking) return;

    try {
      await apiClient.patch(`/booking/${selectedBooking.id}`, {
        status: 'cancelled',
      });
      setBookings(bookings.map(b =>
        b.id === selectedBooking.id
          ? { ...b, status: 'cancelled' }
          : b
      ));
      setCancelDialogOpen(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      setError('Не удалось отменить запись');
    }
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    console.log('ClientBookingsPage - Still loading...');
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  console.log('ClientBookingsPage - About to render, bookings count:', bookings.length);
  console.log('ClientBookingsPage - Bookings data:', bookings);

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
                <Cancel />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, paddingTop: '80px' }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" gutterBottom>
            Мои записи
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Всего записей: {bookings.length}
          </Typography>
        </Paper>

        {bookings.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              У вас пока нет записей
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Найдите подходящие услуги и запишитесь на посещение автосервиса
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/')}
            >
              Найти услуги
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {bookings.map((booking, index) => {
              console.log(`ClientBookingsPage - Rendering booking ${index}:`, booking);

              // Безопасная проверка данных
              if (!booking || !booking.service || !booking.serviceProvider) {
                console.error('ClientBookingsPage - Invalid booking data:', booking);
                return null;
              }

              return (
                <Card key={booking.id} elevation={2}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom>
                          {booking.service?.name || 'Неизвестная услуга'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {booking.service?.description || 'Нет описания'}
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusText(booking.status)}
                        color={getStatusColor(booking.status) as any}
                        size="small"
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Автосервис:</strong> {booking.serviceProvider?.serviceProfile?.name || 'Неизвестный автосервис'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Адрес:</strong> {booking.serviceProvider?.serviceProfile?.address || 'Адрес не указан'}, {booking.serviceProvider?.serviceProfile?.city?.name || 'Город не указан'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        <strong>Дата и время:</strong> {formatDate(booking.bookingDate)}
                      </Typography>
                      {booking.clientComment && (
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Комментарий:</strong> {booking.clientComment}
                        </Typography>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      {booking.status !== 'cancelled' && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => {
                            setSelectedBooking(booking);
                            setCancelDialogOpen(true);
                          }}
                        >
                          Отменить
                        </Button>
                      )}
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Edit />}
                        disabled // Пока не реализовано
                      >
                        Изменить
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              );
            })}
          </Box>
        )}

        {/* Диалог подтверждения отмены */}
        <Dialog open={cancelDialogOpen} onClose={() => setCancelDialogOpen(false)}>
          <DialogTitle>Отмена записи</DialogTitle>
          <DialogContent>
            <Typography>
              Вы уверены, что хотите отменить запись на услугу "{selectedBooking?.service.name}"?
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Дата: {selectedBooking && formatDate(selectedBooking.bookingDate)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setCancelDialogOpen(false)}>
              Назад
            </Button>
            <Button
              onClick={handleCancelBooking}
              color="error"
              variant="contained"
            >
              Отменить запись
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default ClientBookingsPage;
