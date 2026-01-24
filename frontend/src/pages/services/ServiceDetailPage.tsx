import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Container,
  CircularProgress,
  Chip,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  AppBar,
  Toolbar,
  IconButton,
} from '@mui/material';
import { ArrowBack, CalendarToday } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/apiClient';
import type { Service } from '../../types';

interface ServiceDetail extends Service {
  serviceProfile: {
    id: string;
    name: string;
    address: string;
    city: {
      id: string;
      name: string;
      country: string;
      hasUsers: boolean;
      hasServices: boolean;
    };
    createdAt: Date;
  };
}

const ServiceDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openBookingDialog, setOpenBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [comment, setComment] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (id) {
      loadService(id);
    }
  }, [id]);

  const loadService = async (serviceId: string) => {
    try {
      const response = await apiClient.get(`/services/${serviceId}`);
      setService(response.data);
    } catch (error) {
      console.error('Failed to load service:', error);
      setError('Не удалось загрузить информацию об услуге');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      setError('Выберите дату записи');
      return;
    }

    setBookingLoading(true);
    setError('');

    try {
      await apiClient.post('/booking', {
        serviceId: service?.id,
        bookingDate: selectedDate,
        clientComment: comment || undefined,
      });

      setBookingSuccess(true);
      setOpenBookingDialog(false);
      setSelectedDate('');
      setComment('');
      
      // Редирект в личный кабинет после успешной записи
      setTimeout(() => {
        navigate('/client');
      }, 2000);
    } catch (error: any) {
      console.error('Failed to create booking:', error);
      setError(error.response?.data?.message || 'Не удалось создать запись');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!service) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">{error || 'Услуга не найдена'}</Alert>
      </Container>
    );
  }

  return (
    <>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" onClick={() => navigate(-1)} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Детали услуги
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.email}
              </Typography>
              <IconButton color="inherit" onClick={logout} title="Выйти">
                <CalendarToday />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4, paddingTop: '80px' }}>
        {bookingSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            Запись успешно создана! Ожидайте подтверждения от автосервиса.
            <br />
            <small>Через 2 секунды вы будете перенаправлены в личный кабинет...</small>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            {service.name}
          </Typography>

          <Typography variant="h6" color="primary" gutterBottom>
            {service.price} ₽
          </Typography>

          <Typography variant="body1" paragraph>
            {service.description}
          </Typography>

          <Box sx={{ mb: 2 }}>
            <Chip label={`${service.durationMinutes} минут`} size="small" />
          </Box>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Автосервис
          </Typography>

          <Typography variant="body1" gutterBottom>
            {service.serviceProfile.name}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {service.serviceProfile.address}
          </Typography>

          <Typography variant="body2" color="text.secondary" gutterBottom>
            {service.serviceProfile.city.name}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {service.availableDates && service.availableDates.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Доступные даты
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {service.availableDates.map((date: string) => (
                  <Chip
                    key={date}
                    label={new Date(date).toLocaleDateString('ru-RU')}
                    variant="outlined"
                    size="small"
                  />
                ))}
              </Box>
            </Box>
          )}

          {user?.role === 'client' && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={() => setOpenBookingDialog(true)}
              sx={{ mt: 3 }}
            >
              Записаться на услугу
            </Button>
          )}
        </Paper>

        {/* Dialog для записи */}
        <Dialog open={openBookingDialog} onClose={() => setOpenBookingDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Запись на услугу</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              {service.name} - {service.price} ₽
            </Typography>
            
            <TextField
              label="Дата и время записи"
              type="datetime-local"
              fullWidth
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: new Date().toISOString().slice(0, 16),
              }}
            />

            <TextField
              label="Комментарий (необязательно)"
              multiline
              rows={3}
              fullWidth
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenBookingDialog(false)}>Отмена</Button>
            <Button
              onClick={handleBooking}
              variant="contained"
              disabled={!selectedDate || bookingLoading}
            >
              {bookingLoading ? <CircularProgress size={20} /> : 'Записаться'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default ServiceDetailPage;
