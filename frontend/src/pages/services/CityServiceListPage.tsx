import { useState, useEffect } from 'react';
import {
  Typography,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { fetchCities } from '../../services/cityService';
import type { Service, City } from '../../types';
import './CityServiceListPage.css';
import logo from '../../../public/logo.png';

const CityServiceListPage = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();
  const dateAt = searchParams.get('dateAt');
  const dateTo = searchParams.get('dateTo');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const citiesRes = await fetchCities();
        setCities(citiesRes);
      } catch {
        setError('Не удалось загрузить список городов');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      if (selectedCity && dateAt && dateTo) {
        try {
          setLoading(true);
          const servicesRes = await apiClient.get('/service', {
            params: {
              cityId: selectedCity,
              dateAt,
              dateTo
            }
          });
          setServices(servicesRes.data);
        } catch {
          setError('Не удалось загрузить список услуг');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchServices();
  }, [selectedCity, dateAt, dateTo]);

  const handleCityChange = (event: React.ChangeEvent<{ value: unknown }> | (Event & { target: { value: string; name: string; }; })) => {
    setSelectedCity(event.target.value as string);
  };

  return (
    <div className="page-container">
      <div className="header">
        <img src={logo} alt="Logo" className="logo" />
        <Typography variant="h4" className="title">
          Доступные автосервисы
        </Typography>
      </div>

      <FormControl fullWidth className="city-select">
        <InputLabel>Город</InputLabel>
        <Select
          value={selectedCity || ''}
          onChange={handleCityChange}
          label="Город"
        >
          {cities.map((city) => (
            <MenuItem key={city.id} value={city.id}>
              {city.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {error && (
        <Alert severity="error" className="city-select">
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <div className="service-grid">
          {services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card-header">
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
              </div>
              <div className="service-card-body">

                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description || 'Описание отсутствует'}
                </Typography>

                <div className="service-card-footer">
                  <Typography variant="h6">
                    {service.price} ₽
                  </Typography>
                  <Typography variant="body2">
                    {Math.floor(service.durationMinutes / 60)} ч {service.durationMinutes % 60} мин
                  </Typography>
                  <Button
                    component="a"
                    href={`/appointments/new?serviceId=${service.id}`}
                    variant="contained"
                    fullWidth
                  >
                    Записаться
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CityServiceListPage;
