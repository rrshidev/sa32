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
import type { Service, ServiceProfile } from '../../types';

interface ServiceWithProfile extends Service {
  serviceProfile: ServiceProfile & { city?: { id: string; name: string } };
}

const ServiceListPage = () => {
  const [services, setServices] = useState<ServiceWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const dateAt = searchParams.get('dateAt');
  const dateTo = searchParams.get('dateTo');
  const cityId = searchParams.get('cityId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const servicesRes = await apiClient.get('/services', {
          params: {
            dateAt,
            dateTo,
            cityId
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
  }, [dateAt, dateTo, cityId]);

  // Группируем услуги по автосервисам
  const servicesByProfile = services.reduce((acc, service) => {
    const profileId = service.serviceProfile.id;
    if (!acc[profileId]) {
      acc[profileId] = {
        profile: service.serviceProfile,
        services: []
      };
    }
    acc[profileId].services.push(service);
    return acc;
  }, {} as Record<string, { profile: ServiceWithProfile['serviceProfile']; services: Service[] }>);

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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {Object.values(servicesByProfile).map(({ profile, services }) => (
            <Card key={profile.id}>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    {profile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {profile.address}
                  </Typography>
                  {profile.city && (
                    <Chip
                      label={profile.city.name}
                      size="small"
                      color="primary"
                      sx={{ mt: 1 }}
                    />
                  )}
                </Box>

                <Typography variant="subtitle1" gutterBottom>
                  Услуги ({services.length}):
                </Typography>

                <Box sx={{
                  display: 'grid',
                  gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'repeat(2, 1fr)',
                    md: 'repeat(3, 1fr)'
                  },
                  gap: 2
                }}>
                  {services.map((service) => (
                    <Card
                      key={service.id}
                      variant="outlined"
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column'
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1
                        }}>
                          <Typography variant="subtitle2">
                            {service.name}
                          </Typography>
                          {service.category && (
                            <Chip
                              label={service.category.name}
                              size="small"
                              color="secondary"
                            />
                          )}
                        </Box>

                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {service.description || 'Описание отсутствует'}
                        </Typography>

                        <Box sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mt: 'auto'
                        }}>
                          <Typography variant="body1" fontWeight="bold">
                            {service.price} ₽
                          </Typography>
                          <Typography variant="body2">
                            {Math.floor(service.durationMinutes / 60)}ч {service.durationMinutes % 60}мин
                          </Typography>
                        </Box>
                      </CardContent>

                      <Box sx={{ p: 1, pt: 0 }}>
                        <Button
                          component={Link}
                          to={`/appointments/new?serviceId=${service.id}`}
                          variant="contained"
                          size="small"
                          fullWidth
                        >
                          Записаться
                        </Button>
                      </Box>
                    </Card>
                  ))}
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ServiceListPage;
