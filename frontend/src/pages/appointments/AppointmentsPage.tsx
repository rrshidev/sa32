import { useEffect, useState } from 'react';
import { 
  Button, 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Chip,
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { type Appointment, AppointmentStatus } from '../../types';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await apiClient.get('/appointment');
        setAppointments(response.data);
      } catch (error) {
        console.error('Failed to fetch appointments', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED:
        return 'success';
      case AppointmentStatus.PENDING:
        return 'warning';
      case AppointmentStatus.COMPLETED:
        return 'primary';
      case AppointmentStatus.CANCELLED:
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatTimeRange = (startTime: Date, endTime: Date) => {
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
  };

  const calculateDuration = (startTime: Date, endTime: Date) => {
    const diffInMinutes = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;
    
    if (hours > 0 && minutes > 0) {
      return `${hours} ч ${minutes} мин`;
    } else if (hours > 0) {
      return `${hours} ч`;
    } else {
      return `${minutes} мин`;
    }
  };

  if (loading) return <Typography>Загрузка...</Typography>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Мои записи
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/appointments/new"
        sx={{ mb: 3 }}
      >
        Новая запись
      </Button>
      
      {appointments.length === 0 ? (
        <Typography variant="body1" sx={{ mt: 2 }}>
          У вас пока нет записей в автосервис
        </Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Дата</TableCell>
                <TableCell>Время</TableCell>
                <TableCell>Длительность</TableCell>
                <TableCell>Услуга</TableCell>
                <TableCell>Автомобиль</TableCell>
                <TableCell>Мастер</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => {
                const start = new Date(appointment.startTime);
                const end = new Date(appointment.endTime);
                
                return (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {formatDate(start)}
                    </TableCell>
                    <TableCell>
                      {formatTimeRange(start, end)}
                    </TableCell>
                    <TableCell>
                      {calculateDuration(start, end)}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography fontWeight="medium">
                          {appointment.service?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.service?.serviceProfile?.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {appointment.car && (
                        <Typography>
                          {appointment.car.make} {appointment.car.model} ({appointment.car.year})
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {appointment.master ? (
                        <Typography>
                          {appointment.master.firstName} {appointment.master.lastName}
                        </Typography>
                      ) : (
                        <Typography color="text.secondary">Не назначен</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default AppointmentsPage;