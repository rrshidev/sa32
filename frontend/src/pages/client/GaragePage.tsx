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
  TextField,
  Alert,
  CircularProgress,
  IconButton,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ArrowBack, Add, Delete } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/apiClient';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage?: number;
  createdAt: string;
}

interface MaintenanceRecord {
  id: string;
  date: string;
  mileage: number;
  description: string;
  carId: string;
  createdAt: string;
}

const GaragePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openCarDialog, setOpenCarDialog] = useState(false);
  const [openMaintenanceDialog, setOpenMaintenanceDialog] = useState(false);
  const [carFormData, setCarFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    vin: '',
    mileage: '',
  });
  const [maintenanceFormData, setMaintenanceFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mileage: '',
    description: '',
  });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      const response = await apiClient.get('/cars');
      setCars(response.data);
    } catch (error) {
      console.error('Failed to load cars:', error);
      setError('Не удалось загрузить автомобили');
    } finally {
      setLoading(false);
    }
  };

  const loadMaintenanceRecords = async (carId: string) => {
    try {
      const response = await apiClient.get(`/cars/${carId}/maintenance`);
      setMaintenanceRecords(response.data);
    } catch (error) {
      console.error('Failed to load maintenance records:', error);
    }
  };

  const handleAddCar = async () => {
    setActionLoading(true);
    try {
      await apiClient.post('/cars', {
        ...carFormData,
        year: carFormData.year,
        mileage: carFormData.mileage ? parseInt(carFormData.mileage) : undefined,
      });
      setOpenCarDialog(false);
      setCarFormData({
        make: '',
        model: '',
        year: new Date().getFullYear(),
        vin: '',
        mileage: '',
      });
      await loadCars();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Не удалось добавить автомобиль');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddMaintenanceRecord = async () => {
    if (!selectedCar) return;

    setActionLoading(true);
    try {
      await apiClient.post(`/cars/${selectedCar.id}/maintenance`, {
        date: maintenanceFormData.date,
        mileage: parseInt(maintenanceFormData.mileage),
        description: maintenanceFormData.description,
      });
      setOpenMaintenanceDialog(false);
      setMaintenanceFormData({
        date: new Date().toISOString().split('T')[0],
        mileage: '',
        description: '',
      });
      await loadMaintenanceRecords(selectedCar.id);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Не удалось добавить запись');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCar = async (carId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот автомобиль?')) return;

    try {
      await apiClient.delete(`/cars/${carId}`);
      await loadCars();
      if (selectedCar?.id === carId) {
        setSelectedCar(null);
        setMaintenanceRecords([]);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Не удалось удалить автомобиль');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ru-RU');
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
          <IconButton color="inherit" onClick={() => navigate('/client')} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Мой гараж
          </Typography>
          {user && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.email}
              </Typography>
              <IconButton color="inherit" onClick={logout} title="Выйти">
                <Delete />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 3, paddingTop: '80px' }}>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Список автомобилей */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h5">Мои автомобили ({cars.length})</Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setOpenCarDialog(true)}
            >
              Добавить автомобиль
            </Button>
          </Box>

          {cars.length === 0 ? (
            <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
              У вас пока нет добавленных автомобилей
            </Typography>
          ) : (
            <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
              {cars.map((car) => (
                <Card
                  key={car.id}
                  sx={{ 
                    cursor: 'pointer',
                    border: selectedCar?.id === car.id ? 2 : 1,
                    borderColor: selectedCar?.id === car.id ? 'primary.main' : 'grey.300'
                  }}
                  onClick={() => {
                    setSelectedCar(car);
                    loadMaintenanceRecords(car.id);
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {car.make} {car.model}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Год: {car.year}
                    </Typography>
                    {car.mileage && (
                      <Typography variant="body2" color="text.secondary">
                        Пробег: {car.mileage.toLocaleString()} км
                      </Typography>
                    )}
                    {car.vin && (
                      <Typography variant="caption" color="text.secondary">
                        VIN: {car.vin}
                      </Typography>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCar(car.id);
                        }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </Paper>

        {/* История обслуживания выбранного автомобиля */}
        {selectedCar && (
          <Paper sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h5">
                История обслуживания: {selectedCar.make} {selectedCar.model}
              </Typography>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => setOpenMaintenanceDialog(true)}
              >
                Добавить запись
              </Button>
            </Box>

            {maintenanceRecords.length === 0 ? (
              <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                Нет записей об обслуживании
              </Typography>
            ) : (
              <List>
                {maintenanceRecords.map((record) => (
                  <ListItem key={record.id} divider>
                    <ListItemText
                      primary={
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {formatDate(record.date)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Пробег: {record.mileage.toLocaleString()} км
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Typography variant="body2" sx={{ mt: 1 }}>
                          {record.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        )}

        {/* Dialog добавления автомобиля */}
        <Dialog open={openCarDialog} onClose={() => setOpenCarDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Добавить автомобиль</DialogTitle>
          <DialogContent>
            <TextField
              label="Марка"
              fullWidth
              value={carFormData.make}
              onChange={(e) => setCarFormData({ ...carFormData, make: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Модель"
              fullWidth
              value={carFormData.model}
              onChange={(e) => setCarFormData({ ...carFormData, model: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Год выпуска"
              type="number"
              fullWidth
              value={carFormData.year}
              onChange={(e) => setCarFormData({ ...carFormData, year: parseInt(e.target.value) })}
              sx={{ mb: 2 }}
              inputProps={{ min: 1900, max: new Date().getFullYear() + 1 }}
            />
            <TextField
              label="Пробег (км)"
              type="number"
              fullWidth
              value={carFormData.mileage}
              onChange={(e) => setCarFormData({ ...carFormData, mileage: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="VIN-номер (необязательно)"
              fullWidth
              value={carFormData.vin}
              onChange={(e) => setCarFormData({ ...carFormData, vin: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCarDialog(false)}>Отмена</Button>
            <Button
              onClick={handleAddCar}
              variant="contained"
              disabled={!carFormData.make || !carFormData.model || actionLoading}
            >
              Добавить
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog добавления записи об обслуживании */}
        <Dialog open={openMaintenanceDialog} onClose={() => setOpenMaintenanceDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Добавить запись об обслуживании</DialogTitle>
          <DialogContent>
            <TextField
              label="Дата"
              type="date"
              fullWidth
              value={maintenanceFormData.date}
              onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, date: e.target.value })}
              sx={{ mb: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Пробег (км)"
              type="number"
              fullWidth
              value={maintenanceFormData.mileage}
              onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, mileage: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              label="Описание работ"
              multiline
              rows={4}
              fullWidth
              value={maintenanceFormData.description}
              onChange={(e) => setMaintenanceFormData({ ...maintenanceFormData, description: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenMaintenanceDialog(false)}>Отмена</Button>
            <Button
              onClick={handleAddMaintenanceRecord}
              variant="contained"
              disabled={!maintenanceFormData.date || !maintenanceFormData.mileage || !maintenanceFormData.description || actionLoading}
            >
              Добавить
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default GaragePage;
