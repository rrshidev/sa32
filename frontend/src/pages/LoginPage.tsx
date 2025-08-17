import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button, TextField, Typography, Paper } from '@mui/material';

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
          transform: 'translateY(-20px)' // небольшой сдвиг вверх для логотипа
        }}
      >
        <Typography variant="h5" component="h1" align="center" gutterBottom style={{ marginBottom: '24px' }}>
          Вход в систему
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
            label="Пароль"
            type="password"
            fullWidth
            margin="normal"
            style={{ maxWidth: 400 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            style={{ marginTop: '24px', maxWidth: 400, padding: '8px 0' }}
          >
            Войти
          </Button>
          
          <Button
            fullWidth
            style={{ marginTop: '16px', maxWidth: 400 }}
            onClick={() => navigate('/register')}
          >
            Нет аккаунта? Зарегистрироваться
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default LoginPage;