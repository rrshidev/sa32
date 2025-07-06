import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider
} from '@mui/material';
import apiClient from '../api/apiClient';
import { type Appointment, type Car } from '../types';

const DashboardPage = () => {
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedAppointments: 0,
    pendingAppointments: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [appointmentsRes, carsRes] = await Promise.all([
          apiClient.get('/appointment?limit=3&sort=startTime:asc'),
          apiClient.get('/garage/cars')
        ]);

        setUpcomingAppointments(appointmentsRes.data);
        setCars(carsRes.data);

        const statsRes = await apiClient.get('/appointment/stats');
        setStats(statsRes.data);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Мой автосервис
      </Typography>
      
      {/* Основной контейнер с flex-разметкой */}
      <Box sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        flexWrap: 'wrap',
        gap: 3,
        mb: 3
      }}>
        {/* Блок статистики */}
        <Box sx={{ 
          flex: 1,
          minWidth: { xs: '100%', md: '300px', lg: '350px' }
        }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Статистика записей
              </Typography>
              <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: 2
              }}>
                <Paper sx={{ p: 2, textAlign: 'center', flex: 1 }}>
                  <Typography variant="h5">{stats.totalAppointments}</Typography>
                  <Typography variant="body2">Всего</Typography>
                </Paper>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  flex: 1,
                  bgcolor: 'success.light' 
                }}>
                  <Typography variant="h5">{stats.completedAppointments}</Typography>
                  <Typography variant="body2">Завершено</Typography>
                </Paper>
                <Paper sx={{ 
                  p: 2, 
                  textAlign: 'center', 
                  flex: 1,
                  bgcolor: 'warning.light' 
                }}>
                  <Typography variant="h5">{stats.pendingAppointments}</Typography>
                  <Typography variant="body2">Ожидает</Typography>
                </Paper>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Блок автомобилей */}
        <Box sx={{ 
          flex: 1,
          minWidth: { xs: '100%', md: '300px', lg: '350px' }
        }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Мои автомобили ({cars.length})
              </Typography>
              <List dense>
                {cars.map((car) => (
                  <ListItem key={car.id}>
                    <ListItemText
                      primary={`${car.make} ${car.model} (${car.year})`}
                      secondary={`VIN: ${car.vin || 'не указан'}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>

        {/* Блок записей */}
        <Box sx={{ 
          flex: 1,
          minWidth: { xs: '100%', md: '300px', lg: '350px' }
        }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Ближайшие записи
              </Typography>
              {upcomingAppointments.length > 0 ? (
                <List>
                  {upcomingAppointments.map((appointment) => (
                    <Box key={appointment.id}>
                      <ListItem alignItems="flex-start">
                        <ListItemText
                          primary={appointment.service?.name}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                display="block"
                              >
                                {formatDate(appointment.startTime.toString())} в {formatTime(appointment.startTime.toString())}
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                              >
                                {appointment.car?.make} {appointment.car?.model}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider component="li" />
                    </Box>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Нет предстоящих записей
                </Typography>
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardPage;