import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, TextField, Typography, Paper, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CitySelector from '../components/CitySelector';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
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

    if (!city.trim()) {
      setError('Пожалуйста, выберите город');
      return;
    }

    try {
      await register(email, password, phone, role, city.trim());
      navigate('/');
    } catch (err) {
      setError('Ошибка регистрации');
      console.error('Registration failed', err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{ position: 'absolute', top: 16, left: 16 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 120 }} />
      </div>
      
      <Paper 
        elevation={3} 
        style={{ 
          width: '90%',
          maxWidth: 450,
          padding: '32px',
          margin: '16px',
          transform: 'translateY(-20px)'
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom style={{ marginBottom: '24px' }}>
          Регистрация
        </Typography>
        
        {error && (
          <Typography color="error" align="center" style={{ marginBottom: '16px' }}>
            {error}
          </Typography>
        )}
        
        <form 
          onSubmit={handleSubmit} 
          style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%'
          }}
        >
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            style={{ maxWidth: 400 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <TextField
            label="Телефон"
            type="tel"
            fullWidth
            margin="normal"
            style={{ maxWidth: 400 }}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          
          <div style={{ width: '100%', maxWidth: 400, margin: '8px 0' }}>
            <CitySelector
              value={city}
              onChange={setCity}
              placeholder="Выберите ваш город"
            />
          </div>
          
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            style={{ maxWidth: 400 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <TextField
            label="Подтвердите пароль"
            type="password"
            fullWidth
            margin="normal"
            style={{ maxWidth: 400 }}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          
          <FormControl fullWidth margin="normal" style={{ maxWidth: 400 }} required>
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
            fullWidth
            style={{ marginTop: '24px', maxWidth: 400, padding: '8px 0' }}
          >
            Зарегистрироваться
          </Button>
          
          <Button
            fullWidth
            style={{ marginTop: '16px', maxWidth: 400 }}
            onClick={() => navigate('/login')}
          >
            Уже есть аккаунт? Войти
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default RegisterPage;