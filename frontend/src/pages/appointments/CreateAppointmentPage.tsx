import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const CreateAppointmentPage = () => {
  const [formData, setFormData] = useState({
    carId: '',
    serviceId: '',
    startTime: '',
    notes: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Handle appointment creation logic here
      navigate('/appointments');
    } catch (err) {
      setError('Ошибка при создании записи');
    }
  };

  return (
    <Box sx={{ maxWidth: 'md', mx: 'auto', p: 2 }}>
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Создать запись
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Автомобиль</InputLabel>
            <Select
              value={formData.carId}
              label="Автомобиль"
              onChange={(e) => setFormData(prev => ({ ...prev, carId: e.target.value }))}
            >
              <MenuItem value="car1">Toyota Camry (2020)</MenuItem>
              <MenuItem value="car2">Honda Civic (2019)</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Услуга</InputLabel>
            <Select
              value={formData.serviceId}
              label="Услуга"
              onChange={(e) => setFormData(prev => ({ ...prev, serviceId: e.target.value }))}
            >
              <MenuItem value="service1">Замена масла</MenuItem>
              <MenuItem value="service2">Техническое обслуживание</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            label="Дата и время"
            type="datetime-local"
            fullWidth
            margin="normal"
            value={formData.startTime}
            onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <TextField
            label="Примечания"
            multiline
            rows={3}
            fullWidth
            margin="normal"
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
          >
            Создать запись
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateAppointmentPage;