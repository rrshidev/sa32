import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
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
} from '@mui/material';
import { ArrowBack, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/apiClient';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

interface Booking {
  id: string;
  bookingDate: string;
  clientComment?: string;
  status: BookingStatus;
  confirmedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  service: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
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
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await apiClient.get('/booking/client');
      console.log('ClientBookingsPage - Raw bookings data:', response.data);
      setBookings(response.data);
      console.log('ClientBookingsPage - Active bookings:', 
        response.data.filter((b: any) => 
          b.status === 'pending' || b.status === 'confirmed'
        )
      );
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError('Не удалось загрузить записи');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!selectedBooking) return;

    setActionLoading(true);
    try {
      await apiClient.patch(`/booking/${selectedBooking.id}/cancel`);
      setOpenCancelDialog(false);
      setSelectedBooking(null);
      await loadBookings();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Не удалось отменить запись');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'warning';
      case BookingStatus.CONFIRMED: return 'success';
      case BookingStatus.CANCELLED: return 'default';
      case BookingStatus.COMPLETED: return 'primary';
      case BookingStatus.REJECTED: return 'error';
      default: return 'default';
    }
  };

  const getStatusText = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'Ожидает подтверждения';
      case BookingStatus.CONFIRMED: return 'Подтверждена';
      case BookingStatus.CANCELLED: return 'Отменена';
      case BookingStatus.COMPLETED: return 'Выполнена';
      case BookingStatus.REJECTED: return 'Отклонена';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU');
  };

  const activeBookings = bookings.filter(b => 
    b.status === BookingStatus.PENDING || b.status === BookingStatus.CONFIRMED
  );
  const pastBookings = bookings.filter(b => 
    b.status === BookingStatus.COMPLETED || b.status === BookingStatus.CANCELLED || b.status === BookingStatus.REJECTED
  );

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
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Активные записи */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h5" gutterBottom color="primary">
            Активные записи ({activeBookings.length})
          </Typography>

          {activeBookings.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              У вас нет активных записей
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Автосервис</TableCell>
                    <TableCell>Услуга</TableCell>
                    <TableCell>Дата и время</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activeBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {booking.service.serviceProfile.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.service.serviceProfile.address}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" display="block">
                            {booking.service.serviceProfile.city.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {booking.service.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.service.price} ₽ • {booking.service.durationMinutes} мин
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {formatDate(booking.bookingDate)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(booking.status)}
                          color={getStatusColor(booking.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {booking.status === BookingStatus.PENDING && (
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<Close />}
                              onClick={() => {
                                setSelectedBooking(booking);
                                setOpenCancelDialog(true);
                              }}
                              disabled={actionLoading}
                            >
                              Отменить
                            </Button>
                          )}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* История записей */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            История записей ({pastBookings.length})
          </Typography>

          {pastBookings.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              У вас пока нет завершенных записей
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Автосервис</TableCell>
                    <TableCell>Услуга</TableCell>
                    <TableCell>Дата и время</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Комментарий</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pastBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {booking.service.serviceProfile.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.service.serviceProfile.address}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {booking.service.name}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {formatDate(booking.bookingDate)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(booking.status)}
                          color={getStatusColor(booking.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {booking.rejectionReason && (
                          <Typography variant="body2" color="error">
                            {booking.rejectionReason}
                          </Typography>
                        )}
                        {booking.clientComment && (
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {booking.clientComment}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>

        {/* Dialog для отмены записи */}
        <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Отменить запись</DialogTitle>
          <DialogContent>
            <Typography variant="body1" gutterBottom>
              Вы уверены, что хотите отменить запись на услугу "{selectedBooking?.service.name}"?
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Это действие нельзя будет отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCancelDialog(false)}>Назад</Button>
            <Button
              onClick={handleCancel}
              variant="contained"
              color="error"
              disabled={actionLoading}
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
