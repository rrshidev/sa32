import { useState, useEffect } from 'react';
import {
  Typography,
  Card,
  CardContent,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import type { Service } from '../../types';

const ServiceListPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const dateAt = searchParams.get('dateAt');
  const dateTo = searchParams.get('dateTo');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const servicesRes = await apiClient.get('/service', {
          params: {
            dateAt,
            dateTo
          }
        });
        setServices(servicesRes.data);
      } catch (error) {
        setError('Не удалось загрузить список услуг');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (dateAt && dateTo) {
      fetchData();
    } else {
      setError('Пожалуйста, выберите дату и время');
    }
  }, [dateAt, dateTo]);

  return (
    <Box sx={{
      maxWidth: 'lg',
      mx: 'auto',
      py: 4,
      px: 2
    }}>
      <Typography variant="h4" gutterBottom>
        Доступные автосервисы
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

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
          {services.map((service) => (
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

export default ServiceListPage;
