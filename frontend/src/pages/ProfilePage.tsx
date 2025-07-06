import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Chip
} from '@mui/material';
import { Edit, Save, Cancel } from '@mui/icons-material';
import apiClient from '../api/apiClient';
import type { User, Appointment, Car } from '../types';

const ProfilePage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userRes, appointmentsRes, carsRes] = await Promise.all([
          apiClient.get('/user/me'),
          apiClient.get('/appointment?limit=3'),
          apiClient.get('/garage/cars')
        ]);
        
        setUser(userRes.data);
        setAppointments(appointmentsRes.data);
        setCars(carsRes.data);
        
        setFormData({
          email: userRes.data.email,
          phone: userRes.data.phone || '',
          firstName: userRes.data.clientProfile?.firstName || '',
          lastName: userRes.data.clientProfile?.lastName || ''
        });
      } catch (err) {
        setError('Не удалось загрузить данные профиля');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await apiClient.put('/user/me', formData);
      const userRes = await apiClient.get('/user/me');
      setUser(userRes.data);
      setEditMode(false);
    } catch (err) {
      setError('Ошибка при сохранении данных');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ maxWidth: 'md', mx: 'auto', p: 2 }}>
        <Typography variant="h6">Профиль не найден</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      maxWidth: 'md',
      mx: 'auto',
      p: 2
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography variant="h4">Мой профиль</Typography>
        {editMode ? (
          <Box>
            <Button 
              startIcon={<Cancel />} 
              onClick={() => setEditMode(false)}
              sx={{ mr: 1 }}
            >
              Отмена
            </Button>
            <Button 
              variant="contained" 
              startIcon={<Save />} 
              onClick={handleSave}
            >
              Сохранить
            </Button>
          </Box>
        ) : (
          <Button 
            startIcon={<Edit />} 
            onClick={() => setEditMode(true)}
          >
            Редактировать
          </Button>
        )}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            {user.email.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            {editMode ? (
              <Box sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 2, 
                mb: 2 
              }}>
                <TextField
                  name="firstName"
                  label="Имя"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  size="small"
                />
                <TextField
                  name="lastName"
                  label="Фамилия"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  size="small"
                />
              </Box>
            ) : (
              <Typography variant="h5">
                {user.clientProfile?.firstName} {user.clientProfile?.lastName}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary">
              {user.role === 'client' ? 'Клиент' : 'Сервисный центр'}
            </Typography>
          </Box>
        </Box>

        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2
        }}>
          <TextField
            name="email"
            label="Email"
            value={editMode ? formData.email : user.email}
            onChange={handleInputChange}
            fullWidth
            disabled={!editMode}
            sx={{ mb: 2 }}
          />
          <TextField
            name="phone"
            label="Телефон"
            value={editMode ? formData.phone : user.phone || ''}
            onChange={handleInputChange}
            fullWidth
            disabled={!editMode}
            sx={{ mb: 2 }}
          />
        </Box>
      </Paper>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Мои автомобили" />
          <Tab label="Последние записи" />
        </Tabs>
      </Paper>

      {activeTab === 0 ? (
        <Paper sx={{ p: 2 }}>
          {cars.length === 0 ? (
            <Typography>У вас нет добавленных автомобилей</Typography>
          ) : (
            <List>
              {cars.map((car) => (
                <ListItem key={car.id}>
                  <ListItemText
                    primary={`${car.make} ${car.model} (${car.year})`}
                    secondary={`VIN: ${car.vin || 'не указан'} | Пробег: ${car.mileage || 'не указан'} км`}
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Button 
            variant="outlined" 
            fullWidth
            sx={{ mt: 2 }}
            href="/garage"
          >
            Управление автомобилями
          </Button>
        </Paper>
      ) : (
        <Paper sx={{ p: 2 }}>
          {appointments.length === 0 ? (
            <Typography>У вас нет активных записей</Typography>
          ) : (
            <List>
              {appointments.map((appointment) => (
                <ListItem key={appointment.id}>
                  <ListItemText
                    primary={appointment.service?.name}
                    secondary={
                      <>
                        <Typography component="span" display="block">
                          {new Date(appointment.startTime).toLocaleDateString('ru-RU')} в{' '}
                          {new Date(appointment.startTime).toLocaleTimeString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </Typography>
                        <Typography component="span" variant="body2" color="text.secondary">
                          {appointment.car?.make} {appointment.car?.model} |{' '}
                          <Chip 
                            label={appointment.status} 
                            size="small" 
                            color={
                              appointment.status === 'confirmed' ? 'success' :
                              appointment.status === 'pending' ? 'warning' :
                              appointment.status === 'completed' ? 'primary' : 'default'
                            }
                          />
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
          <Button 
            variant="outlined" 
            fullWidth
            sx={{ mt: 2 }}
            href="/appointments"
          >
            Все мои записи
          </Button>
        </Paper>
      )}
    </Box>
  );
};

export default ProfilePage;