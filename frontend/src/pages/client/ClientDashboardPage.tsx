import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
  Avatar,
  Chip,
} from '@mui/material';
import { 
  CalendarToday, 
  DirectionsCar, 
  Person, 
  Logout,
  ArrowBack,
  History
} from '@mui/icons-material';
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
    };
  };
}

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
}

const ClientDashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeBookings, setActiveBookings] = useState<Booking[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Загружаем активные записи
      const bookingsResponse = await apiClient.get('/booking/client');
      const active = bookingsResponse.data.filter((b: Booking) => 
        b.status === 'pending' || b.status === 'confirmed'
      );
      setActiveBookings(active);

      // Загружаем автомобили
      const carsResponse = await apiClient.get('/cars');
      setCars(carsResponse.data);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setError('Не удалось загрузить данные');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'success';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Ожидает подтверждения';
      case 'confirmed': return 'Подтверждена';
      default: return status;
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
          <IconButton color="inherit" onClick={() => navigate('/')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Личный кабинет
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
                <Logout />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, paddingTop: '80px' }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Приветствие */}
        <Paper sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <Box display="flex" alignItems="center" gap={3}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'white', color: 'primary.main' }}>
              <Person sx={{ fontSize: 32 }} />
            </Avatar>
            <Box>
              <Typography variant="h4" gutterBottom>
                Добро пожаловать!
              </Typography>
              <Typography variant="body1">
                {user?.email}
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Статистика */}
        <Box sx={{ display: 'flex', gap: 3, mb: 3, flexWrap: 'wrap' }}>
          <Box sx={{ flex: '1 1 300px' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <CalendarToday color="primary" />
                  <Box>
                    <Typography variant="h4" color="primary">
                      {activeBookings.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Активных записей
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
          <Box sx={{ flex: '1 1 300px' }}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2}>
                  <DirectionsCar color="primary" />
                  <Box>
                    <Typography variant="h4" color="primary">
                      {cars.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Автомобилей
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>

        {/* Быстрые действия */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Быстрые действия
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              sx={{ flex: '1 1 200px' }}
              startIcon={<CalendarToday />}
              onClick={() => navigate('/client/bookings')}
            >
              Мои записи
            </Button>
            <Button
              variant="contained"
              sx={{ flex: '1 1 200px' }}
              startIcon={<DirectionsCar />}
              onClick={() => navigate('/garage')}
            >
              Мой гараж
            </Button>
            <Button
              variant="outlined"
              sx={{ flex: '1 1 200px' }}
              startIcon={<Person />}
              onClick={() => navigate('/profile')}
            >
              Профиль
            </Button>
            <Button
              variant="outlined"
              sx={{ flex: '1 1 200px' }}
              startIcon={<History />}
              onClick={() => navigate('/')}
            >
              Найти услуги
            </Button>
          </Box>
        </Paper>

        {/* Ближайшие записи */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Ближайшие записи</Typography>
            <Button
              variant="text"
              onClick={() => navigate('/client/bookings')}
            >
              Все записи
            </Button>
          </Box>

          {activeBookings.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              У вас нет активных записей
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {activeBookings.slice(0, 3).map((booking) => (
                <Card key={booking.id} variant="outlined">
                  <CardContent sx={{ py: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {booking.service.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {booking.service.serviceProfile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(booking.bookingDate)}
                        </Typography>
                      </Box>
                      <Chip
                        label={getStatusText(booking.status)}
                        color={getStatusColor(booking.status) as any}
                        size="small"
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {activeBookings.length > 3 && (
                <Button
                  variant="text"
                  onClick={() => navigate('/bookings')}
                  sx={{ alignSelf: 'center' }}
                >
                  Показать все ({activeBookings.length} записей)
                </Button>
              )}
            </Box>
          )}
        </Paper>

        {/* Мои автомобили */}
        <Paper sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Мои автомобили</Typography>
            <Button
              variant="text"
              onClick={() => navigate('/garage')}
            >
              Управление гаражом
            </Button>
          </Box>

          {cars.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              У вас пока нет добавленных автомобилей
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {cars.slice(0, 3).map((car) => (
                <Card key={car.id} variant="outlined">
                  <CardContent sx={{ py: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {car.make} {car.model}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Год: {car.year}
                        </Typography>
                      </Box>
                      <DirectionsCar color="action" />
                    </Box>
                  </CardContent>
                </Card>
              ))}
              {cars.length > 3 && (
                <Button
                  variant="text"
                  onClick={() => navigate('/garage')}
                  sx={{ alignSelf: 'center' }}
                >
                  Показать все ({cars.length} автомобилей)
                </Button>
              )}
            </Box>
          )}
        </Paper>
      </Box>
    </>
  );
};

export default ClientDashboardPage;
