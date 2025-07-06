import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Alert,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import type { Service, ServiceCategory } from '../../types';

const ServicesPage = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesRes, servicesRes] = await Promise.all([
          apiClient.get('/service/categories'),
          apiClient.get('/service')
        ]);
        setCategories(categoriesRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        setError('Не удалось загрузить список услуг');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const filteredServices = activeTab === 0 
    ? services 
    : services.filter(service => service.category?.id === categories[activeTab - 1]?.id);

  return (
    <Box sx={{ 
      maxWidth: 'lg',
      mx: 'auto',
      py: 4,
      px: 2
    }}>
      <Typography variant="h4" gutterBottom>
        Услуги автосервиса
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Все услуги" />
          {categories.map((category) => (
            <Tab key={category.id} label={category.name} />
          ))}
        </Tabs>
      </Paper>

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)'
          },
          gap: 3
        }}>
          {filteredServices.map((service) => (
            <Card 
              key={service.id} 
              sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column' 
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 1 
                }}>
                  <Typography variant="h6" component="h3">
                    {service.name}
                  </Typography>
                  {service.category && (
                    <Chip 
                      label={service.category.name} 
                      size="small" 
                      color="primary"
                    />
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description || 'Описание отсутствует'}
                </Typography>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mt: 'auto' 
                }}>
                  <Typography variant="h6">
                    {service.price} ₽
                  </Typography>
                  <Typography variant="body2">
                    {Math.floor(service.durationMinutes / 60)} ч {service.durationMinutes % 60} мин
                  </Typography>
                </Box>
              </CardContent>
              
              <Box sx={{ p: 2 }}>
                <Button
                  component={Link}
                  to={`/appointments/new?serviceId=${service.id}`}
                  variant="contained"
                  fullWidth
                >
                  Записаться
                </Button>
              </Box>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ServicesPage;