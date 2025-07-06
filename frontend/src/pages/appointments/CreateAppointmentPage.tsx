import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Stepper, 
  Step, 
  StepLabel,
  Button,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ru } from 'date-fns/locale';
import apiClient from '../../api/apiClient';
import type { Car, Service, Master, TimeSlot } from '../../types';

const steps = ['Выбор услуги', 'Выбор даты и времени', 'Подтверждение'];

const CreateAppointmentPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [cars, setCars] = useState<Car[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [masters, setMasters] = useState<Master[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedCar, setSelectedCar] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedMaster, setSelectedMaster] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [carsRes, servicesRes] = await Promise.all([
          apiClient.get('/garage/cars'),
          apiClient.get('/service')
        ]);
        setCars(carsRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        setError('Не удалось загрузить данные');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedService && selectedDate) {
      const fetchMastersAndSlots = async () => {
        try {
          const [mastersRes, slotsRes] = await Promise.all([
            apiClient.get(`/service/${selectedService}/masters`),
            apiClient.get(`/appointment/slots?serviceId=${selectedService}&date=${selectedDate.toISOString()}`)
          ]);
          setMasters(mastersRes.data);
          setTimeSlots(slotsRes.data);
        } catch (err) {
          setError('Не удалось загрузить доступное время');
        }
      };

      fetchMastersAndSlots();
    }
  }, [selectedService, selectedDate]);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSubmit = async () => {
    try {
      await apiClient.post('/appointment', {
        carId: selectedCar,
        serviceId: selectedService,
        masterId: selectedMaster || null,
        startTime: selectedTime,
        notes
      });
      window.location.href = '/appointments';
    } catch (err) {
      setError('Ошибка при создании записи');
    }
  };

  return (
    <Box sx={{ 
      maxWidth: 'md',
      mx: 'auto',
      mt: 4,
      mb: 4,
      px: 2
    }}>
      <Typography variant="h4" gutterBottom>
        Новая запись в сервис
      </Typography>
      
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        {activeStep === 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Автомобиль</InputLabel>
              <Select
                value={selectedCar}
                label="Автомобиль"
                onChange={(e) => setSelectedCar(e.target.value)}
                required
              >
                {cars.map((car) => (
                  <MenuItem key={car.id} value={car.id}>
                    {car.make} {car.model} ({car.year})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Услуга</InputLabel>
              <Select
                value={selectedService}
                label="Услуга"
                onChange={(e) => setSelectedService(e.target.value)}
                required
              >
                {services.map((service) => (
                  <MenuItem key={service.id} value={service.id}>
                    {service.name} ({service.price} ₽)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}

        {activeStep === 1 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
              <DatePicker
                label="Дата записи"
                value={selectedDate}
                onChange={(newValue) => setSelectedDate(newValue)}
                minDate={new Date()}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>

            {selectedDate && (
              <FormControl fullWidth>
                <InputLabel>Мастер</InputLabel>
                <Select
                  value={selectedMaster}
                  label="Мастер"
                  onChange={(e) => setSelectedMaster(e.target.value)}
                >
                  <MenuItem value="">Любой доступный мастер</MenuItem>
                  {masters.map((master) => (
                    <MenuItem key={master.id} value={master.id}>
                      {master.firstName} {master.lastName} ({master.specialization})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {timeSlots.length > 0 && (
              <FormControl fullWidth>
                <InputLabel>Доступное время</InputLabel>
                <Select
                  value={selectedTime}
                  label="Доступное время"
                  onChange={(e) => setSelectedTime(e.target.value as string)}
                  required
                >
                  {timeSlots.map((slot) => (
                    <MenuItem 
                    key={slot.startTime.toString()}
                    value={slot.startTime.toString()}
                    >
                      {new Date(slot.startTime).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Box>
        )}

        {activeStep === 2 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Typography variant="h6" gutterBottom>Детали записи</Typography>
            
            <Box sx={{ mb: 2 }}>
              <Typography>Услуга: {services.find(s => s.id === selectedService)?.name}</Typography>
              <Typography>Автомобиль: {cars.find(c => c.id === selectedCar)?.make} {cars.find(c => c.id === selectedCar)?.model}</Typography>
              <Typography>Дата: {selectedDate?.toLocaleDateString('ru-RU')}</Typography>
              <Typography>Время: {selectedTime && new Date(selectedTime).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</Typography>
              {selectedMaster && (
                <Typography>Мастер: {masters.find(m => m.id === selectedMaster)?.firstName} {masters.find(m => m.id === selectedMaster)?.lastName}</Typography>
              )}
            </Box>

            <TextField
              label="Примечания"
              multiline
              rows={4}
              fullWidth
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Box>
        )}

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          pt: 2,
          mt: 2
        }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Назад
            </Button>
          )}
          {activeStep < steps.length - 1 ? (
            <Button 
              variant="contained" 
              onClick={handleNext}
              disabled={
                (activeStep === 0 && (!selectedCar || !selectedService)) ||
                (activeStep === 1 && (!selectedDate || !selectedTime))
              }
            >
              Далее
            </Button>
          ) : (
            <Button variant="contained" onClick={handleSubmit}>
              Подтвердить запись
            </Button>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default CreateAppointmentPage;