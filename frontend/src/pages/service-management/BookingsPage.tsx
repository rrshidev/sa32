import { useState, useEffect } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Button,
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Alert, CircularProgress, IconButton,
  AppBar, Toolbar,
} from '@mui/material';
import { ArrowBack, Check, Close } from '@mui/icons-material';
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
  client: {
    id: string;
    email: string;
    phone?: string;
    clientProfile?: {
      firstName: string;
      lastName: string;
    };
  };
  service: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
  };
}

const BookingsPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await apiClient.get('/booking/service-provider');
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setError('Не удалось загрузить записи');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (bookingId: string) => {
    setActionLoading(true);
    try {
      await apiClient.patch(`/booking/${bookingId}/status`, {
        status: BookingStatus.CONFIRMED,
      });
      await loadBookings();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Не удалось подтвердить запись');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedBooking) return;
    setActionLoading(true);
    try {
      await apiClient.patch(`/booking/${selectedBooking.id}/status`, {
        status: BookingStatus.REJECTED,
        rejectionReason: rejectionReason || undefined,
      });
      setOpenRejectDialog(false);
      setRejectionReason('');
      setSelectedBooking(null);
      await loadBookings();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Не удалось отклонить запись');
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
      case BookingStatus.CANCELLED: return 'Отменена клиентом';
      case BookingStatus.COMPLETED: return 'Выполнена';
      case BookingStatus.REJECTED: return 'Отклонена';
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
          <IconButton color="inherit" onClick={() => navigate('/service-management')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Записи на услуги
          </Typography>
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

        <Paper sx={{ p: 3 }}>
          <Typography variant="h4" gutterBottom>
            Управление записями
          </Typography>

          {bookings.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              У вас пока нет записей
            </Typography>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Клиент</TableCell>
                    <TableCell>Услуга</TableCell>
                    <TableCell>Дата и время</TableCell>
                    <TableCell>Статус</TableCell>
                    <TableCell>Комментарий</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {booking.client.clientProfile 
                              ? `${booking.client.clientProfile.firstName} ${booking.client.clientProfile.lastName}`
                              : booking.client.email
                            }
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.client.email}
                          </Typography>
                          {booking.client.phone && (
                            <Typography variant="caption" color="text.secondary" display="block">
                              {booking.client.phone}
                            </Typography>
                          )}
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
                        {new Date(booking.bookingDate).toLocaleString('ru-RU')}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusText(booking.status)}
                          color={getStatusColor(booking.status) as any}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {booking.clientComment ? (
                          <Typography variant="body2" sx={{ maxWidth: 200 }}>
                            {booking.clientComment}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            Нет комментария
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          {booking.status === BookingStatus.PENDING && (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                color="success"
                                startIcon={<Check />}
                                onClick={() => handleConfirm(booking.id)}
                                disabled={actionLoading}
                              >
                                Подтвердить
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                startIcon={<Close />}
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setOpenRejectDialog(true);
                                }}
                                disabled={actionLoading}
                              >
                                Отклонить
                              </Button>
                            </>
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

        <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Отклонить запись</DialogTitle>
          <DialogContent>
            <TextField
              label="Причина отклонения"
              multiline
              rows={3}
              fullWidth
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenRejectDialog(false)}>Отмена</Button>
            <Button
              onClick={handleReject}
              variant="contained"
              color="error"
              disabled={actionLoading}
            >
              Отклонить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default BookingsPage;
