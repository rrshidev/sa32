import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, Container, TextField, Typography, Paper } from '@mui/material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Неверные учетные данные');
      console.error('Login failed', err);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100%',
        p: 2
      }}
    >
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <img src="/logo.png" alt="Logo" style={{ height: 120 }} />
      </Box>
      
      <Paper 
        elevation={3} 
        sx={{ 
          p: 4, 
          width: '100%',
          maxWidth: 450,
          margin: 'auto' // Добавляем margin auto для центрирования
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom sx={{ mb: 3 }}>
          Вход в систему
        </Typography>
        
        {error && (
          <Typography color="error" align="center" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        
        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          sx={{ 
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
            sx={{ maxWidth: 400 }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <TextField
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            sx={{ maxWidth: 400 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, maxWidth: 400, py: 1.5 }}
          >
            Войти
          </Button>
          
          <Button
            fullWidth
            sx={{ mt: 2, maxWidth: 400 }}
            onClick={() => navigate('/register')}
          >
            Нет аккаунта? Зарегистрироваться
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;