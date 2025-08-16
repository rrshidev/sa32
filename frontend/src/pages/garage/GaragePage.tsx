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
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import apiClient from '../../api/apiClient';
import type { Car } from '../../types';

const GaragePage = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCar, setCurrentCar] = useState<Partial<Car> | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/garage/cars');
      setCars(response.data);
    } catch (err) {
      setError('Не удалось загрузить список автомобилей');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAddDialog = () => {
    setCurrentCar({
      make: '',
      model: '',
      year: new Date().getFullYear(),
      vin: '',
      mileage: undefined
    });
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (car: Car) => {
    setCurrentCar(car);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCar(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentCar(prev => ({
      ...prev,
      [name]: name === 'year' || name === 'mileage' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (currentCar?.id) {
        await apiClient.put(`/garage/cars/${currentCar.id}`, currentCar);
      } else {
        await apiClient.post('/garage/cars', currentCar);
      }
      fetchCars();
      handleCloseDialog();
    } catch (err) {
      setError('Ошибка при сохранении автомобиля');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiClient.delete(`/garage/cars/${id}`);
      fetchCars();
    } catch (err) {
      setError('Ошибка при удалении автомобиля');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Мои автомобили</Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />}
          onClick={handleOpenAddDialog}
        >
          Добавить автомобиль
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : cars.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography>У вас пока нет добавленных автомобилей</Typography>
        </Paper>
      ) : (
        <Paper>
          <List>
            {cars.map((car) => (
              <ListItem
                key={car.id}
                secondaryAction={
                  <Box>
                    <IconButton edge="end" onClick={() => handleOpenEditDialog(car)}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(car.id)}>
                      <Delete />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={`${car.make} ${car.model} (${car.year})`}
                  secondary={`VIN: ${car.vin || 'не указан'} | Пробег: ${car.mileage ? `${car.mileage} км` : 'не указан'}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{currentCar?.id ? 'Редактировать автомобиль' : 'Добавить автомобиль'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
            <TextField
              name="make"
              label="Марка"
              value={currentCar?.make || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="model"
              label="Модель"
              value={currentCar?.model || ''}
              onChange={handleInputChange}
              fullWidth
              required
            />
            <TextField
              name="year"
              label="Год выпуска"
              type="number"
              value={currentCar?.year || ''}
              onChange={handleInputChange}
              fullWidth
              required
              inputProps={{ min: 1900, max: new Date().getFullYear() }}
            />
            <TextField
              name="vin"
              label="VIN-код"
              value={currentCar?.vin || ''}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              name="mileage"
              label="Пробег (км)"
              type="number"
              value={currentCar?.mileage || ''}
              onChange={handleInputChange}
              fullWidth
              inputProps={{ min: 0 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GaragePage;