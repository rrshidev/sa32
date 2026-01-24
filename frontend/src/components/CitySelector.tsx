import { useState, useEffect } from 'react';
import {
  TextField,
  Box,
  Typography,
  Chip,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import apiClient from '../api/apiClient';
import { RUSSIA_CITIES } from '../data/russia-cities';

interface City {
  id: string;
  name: string;
  country: string;
  hasUsers: boolean;
  hasServices: boolean;
  serviceCount?: number;
  clientCount?: number;
}

interface CitySelectorProps {
  value: string;
  onChange: (city: string, cityData?: City) => void;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  placeholder?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onChange,
  label = 'Город',
  error,
  helperText,
  placeholder = 'Введите название вашего города...',
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [availableCities, setAvailableCities] = useState<City[]>([]);
  const [detectedCountry, setDetectedCountry] = useState<string>('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Определение страны по геолокации
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async () => {
          // Здесь можно добавить API для определения страны по координатам
          // Пока используем Россию по умолчанию
          setDetectedCountry('RU');
        },
        () => {
          setDetectedCountry('RU');
        }
      );
    }
  }, []);

  // Загрузка доступных городов из API
  useEffect(() => {
    loadAvailableCities();
  }, []);

  const loadAvailableCities = async () => {
    try {
      console.log('CitySelector - Loading available cities...');
      const cities = await apiClient.get('/cities');
      console.log('CitySelector - Cities loaded:', cities.data);
      setAvailableCities(cities.data);
    } catch (error) {
      console.error('Failed to load cities:', error);
    }
  };

  const validateCity = async (cityName: string) => {
    if (!cityName.trim()) return;

    setIsValidating(true);
    setValidationError('');

    try {
      // Проверяем и регистрируем город через наш API
      const response = await apiClient.post('/cities/validate-and-register', {
        cityName: cityName.trim(),
        countryCode: detectedCountry
      });

      if (response.data.isValid && response.data.registered) {
        // Город успешно зарегистрирован
        console.log(`Город ${cityName.trim()} успешно зарегистрирован`);
        
        // Перезагружаем список доступных городов
        await loadAvailableCities();
        
        onChange(cityName.trim());
      } else {
        setValidationError('Город не найден. Проверьте правильность написания.');
      }
    } catch (error) {
      console.error('City validation failed:', error);
      setValidationError('Не удалось проверить город. Попробуйте позже.');
    } finally {
      setIsValidating(false);
    }
  };

  // Объединяем доступные города и полный список России
  const allOptions = [
    ...availableCities.map(city => city.name),
    ...RUSSIA_CITIES
  ];

  const handleInputChange = (_event: any, newInputValue: string) => {
    setInputValue(newInputValue);
    setValidationError('');
  };

  const handleCitySelect = (_event: any, newValue: string | null) => {
    if (newValue) {
      setInputValue(newValue);
      onChange(newValue.trim());
      
      // Валидация в фоне, только если город не из списка
      if (!availableCities.some(city => city.name.toLowerCase() === newValue.toLowerCase())) {
        validateCity(newValue);
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      
      <Autocomplete
        freeSolo
        options={allOptions}
        value={value}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleCitySelect}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            error={!!error || !!validationError}
            helperText={error || validationError || helperText}
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {isValidating ? <CircularProgress size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        renderOption={(props, option) => {
          const isAvailable = availableCities.some(city => city.name === option);
          const cityData = availableCities.find(city => city.name === option);
          
          return (
            <li {...props}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body2">{option}</Typography>
                {cityData && (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {cityData.hasUsers && (
                      <Chip label="👥" size="small" title="Есть пользователи" />
                    )}
                    {cityData.hasServices && (
                      <Chip label="🔧" size="small" title="Есть сервисы" />
                    )}
                  </Box>
                )}
                {isAvailable && !cityData && (
                  <Chip label="✓" size="small" title="Доступен" />
                )}
              </Box>
            </li>
          );
        }}
        noOptionsText="Начните вводить название города..."
      />

      {detectedCountry && (
        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          Определена страна: {detectedCountry === 'RU' ? 'Россия' : detectedCountry}
        </Typography>
      )}
    </Box>
  );
};

export default CitySelector;
