import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Container,
  Alert,
  CircularProgress,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  AppBar,
  Toolbar,
  IconButton as MuiIconButton,
} from '@mui/material';
import { Add, Edit, Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '@mui/material/styles';
import apiClient from '../../api/apiClient';
import type { Service, City } from '../../types';

interface ServiceProfile {
  id: string;
  name: string;
  address: string;
  description?: string;
  city: {
    id: string;
    name: string;
  };
  services: Service[];
}

const ServiceManagementPage = () => {
  const { user, logout } = useAuth();
  const [serviceProfile, setServiceProfile] = useState<ServiceProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [error, setError] = useState('');
  const [cities, setCities] = useState<City[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    description: '',
    cityId: '',
  });
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    loadServiceProfile();
    loadCities();
  }, []);

  const loadCities = async () => {
    try {
      const response = await apiClient.get('/cities');
      setCities(response.data);
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  const loadServiceProfile = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/service-profile');
      setServiceProfile(response.data);
      if (response.data) {
        setFormData({
          name: response.data.name,
          address: response.data.address,
          description: response.data.description || '',
          cityId: response.data.city?.id || '',
        });
      }
    } catch (error) {
      console.error('Failed to load service profile:', error);
      setError('Не удалось загрузить профиль автосервиса');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async () => {
    try {
      await apiClient.post('/service-profile', formData);
      await loadServiceProfile();
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to create service profile:', error);
      setError('Не удалось создать профиль автосервиса');
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await apiClient.patch('/service-profile', formData);
      await loadServiceProfile();
      setOpenDialog(false);
    } catch (error) {
      console.error('Failed to update service profile:', error);
      setError('Не удалось обновить профиль автосервиса');
    }
  };

  const handleAddService = () => {
    navigate('/services/new');
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
      {/* AppBar с кнопкой выхода */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Управление автосервисом
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.email}
              </Typography>
              <MuiIconButton color="inherit" onClick={logout} title="Выйти">
                <Logout />
              </MuiIconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4, paddingTop: '80px' }}>
        <Typography variant="h4" gutterBottom>
          Управление автосервисом
        </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {!serviceProfile ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            У вас еще нет профиля автосервиса
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Создайте профиль, чтобы начать предлагать свои услуги
          </Typography>
          <Button
            variant="contained"
            onClick={() => setOpenDialog(true)}
            startIcon={<Add />}
          >
            Создать профиль
          </Button>
        </Paper>
      ) : (
        <Box display="flex" flexDirection="row" gap={3} flexWrap="wrap">
          <Box flex="1" minWidth={300}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Информация об автосервисе</Typography>
                <IconButton onClick={() => setOpenDialog(true)}>
                  <Edit />
                </IconButton>
              </Box>
              
              <Typography variant="body1" gutterBottom>
                <strong>Название:</strong> {serviceProfile.name}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Адрес:</strong> {serviceProfile.address}
              </Typography>
              <Typography variant="body1" gutterBottom>
                <strong>Город:</strong> {serviceProfile.city?.name}
              </Typography>
              {serviceProfile.description && (
                <Typography variant="body1" gutterBottom>
                  <strong>Описание:</strong> {serviceProfile.description}
                </Typography>
              )}
            </Paper>
          </Box>

          <Box flex="1" minWidth={300}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Услуги ({serviceProfile.services?.length || 0})</Typography>
                <Button
                  variant="contained"
                  onClick={handleAddService}
                  startIcon={<Add />}
                >
                  Добавить услугу
                </Button>
              </Box>

              <List>
                {serviceProfile.services?.map((service) => (
                  <ListItem key={service.id} divider>
                    <ListItemText
                      primary={service.name}
                      secondary={`${service.price} ₽ • ${Math.floor(service.durationMinutes / 60)}ч ${service.durationMinutes % 60}мин`}
                    />
                    <Chip label={service.category?.name} size="small" />
                  </ListItem>
                ))}
                {(!serviceProfile.services || serviceProfile.services.length === 0) && (
                  <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                    Услуги пока не добавлены
                  </Typography>
                )}
              </List>
            </Paper>
          </Box>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {serviceProfile ? 'Редактировать профиль' : 'Создать профиль'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Название автосервиса"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Адрес"
            fullWidth
            variant="outlined"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Описание"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="city-select-label">Город</InputLabel>
            <Select
              labelId="city-select-label"
              value={formData.cityId}
              label="Город"
              onChange={(e) => setFormData({ ...formData, cityId: e.target.value })}
            >
              {cities.map((city) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Отмена</Button>
          <Button
            onClick={serviceProfile ? handleUpdateProfile : handleCreateProfile}
            variant="contained"
          >
            {serviceProfile ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
    </>
  );
};

export default ServiceManagementPage;
