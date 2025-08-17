import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, Container, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'client' | 'service'>('client');
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await register(email, password, phone, role);
      navigate('/');
    } catch (err) {
      setError('Ошибка регистрации');
      console.error('Registration failed', err);
    }
  };

  return (
<Container maxWidth="xs" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 120 }} />
      </Box>
      <Paper elevation={3} sx={{ p: 4, mt: 8, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" component="h1" align="center" gutterBottom>
          Регистрация
        </Typography>
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <TextField
            label="Email"
            type="email"
            sx={{ width: '80%', margin: 'normal', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Телефон"
            type="tel"
            sx={{ width: '80%', margin: 'normal', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <TextField
            label="Пароль"
            type="password"
            sx={{ width: '80%', margin: 'normal', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Подтвердите пароль"
            type="password"
            sx={{ width: '80%', margin: 'normal', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <FormControl sx={{ width: '80%', margin: 'normal' }} required>
            <InputLabel>Тип аккаунта</InputLabel>
            <Select
              value={role}
              label="Тип аккаунта"
              onChange={(e) => setRole(e.target.value as 'client' | 'service')}
            >
              <MenuItem value="client">Клиент</MenuItem>
              <MenuItem value="service">Автосервис</MenuItem>
            </Select>
          </FormControl>
          <Button
            type="submit"
            variant="contained"
            sx={{ width: '80%', mt: 3 }}
          >
            Зарегистрироваться
          </Button>
          <Button
            sx={{ width: '80%', mt: 2 }}
            onClick={() => navigate('/login')}
          >
            Уже есть аккаунт? Войти
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default RegisterPage;
