import { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Container,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/apiClient';

interface ServiceCategory {
  id: string;
  name: string;
}

interface CreateServiceData {
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  categoryId: string;
}

const CreateServicePage = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState<CreateServiceData>({
    name: '',
    description: '',
    price: 1000,
    durationMinutes: 60,
    categoryId: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/service-categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      setError('Не удалось загрузить категории услуг');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.categoryId) {
      setError('Выберите категорию услуги');
      return;
    }

    try {
      setSubmitting(true);
      await apiClient.post('/services', formData);
      navigate('/service-management');
    } catch (error) {
      console.error('Failed to create service:', error);
      setError('Не удалось создать услугу');
    } finally {
      setSubmitting(false);
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
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Добавление новой услуги
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Название услуги"
            fullWidth
            variant="outlined"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            sx={{ mb: 3 }}
          />

          <TextField
            label="Описание"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Категория услуги</InputLabel>
            <Select
              value={formData.categoryId}
              label="Категория услуги"
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Цена (₽)"
            type="number"
            fullWidth
            variant="outlined"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            required
            inputProps={{ min: 0 }}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography gutterBottom>
              Длительность: {Math.floor(formData.durationMinutes / 60)}ч {formData.durationMinutes % 60}мин
            </Typography>
            <Slider
              value={formData.durationMinutes}
              onChange={(_, value) => setFormData({ ...formData, durationMinutes: value as number })}
              min={15}
              max={480}
              step={15}
              marks={[
                { value: 15, label: '15 мин' },
                { value: 60, label: '1 час' },
                { value: 120, label: '2 часа' },
                { value: 240, label: '4 часа' },
                { value: 480, label: '8 часов' },
              ]}
              valueLabelDisplay="auto"
            />
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              fullWidth
            >
              {submitting ? 'Создание...' : 'Создать услугу'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/service-management')}
              fullWidth
            >
              Отмена
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateServicePage;
