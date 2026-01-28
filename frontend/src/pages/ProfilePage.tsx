import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Box, Button, Container, TextField, Typography, Paper, InputAdornment, Alert, Snackbar } from '@mui/material';
import { Telegram } from '@mui/icons-material';
import { profileService } from '../services/profileService';
import type { UpdateProfileData } from '../services/profileService';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });
  
  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    telegramId: user?.telegramId || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const updateData: UpdateProfileData = {
        email: formData.email,
        phone: formData.phone,
        telegramId: formData.telegramId,
      };
      
      await profileService.updateProfile(updateData);
      
      setNotification({
        open: true,
        message: 'Профиль успешно обновлен!',
        severity: 'success'
      });
      
      setIsEditing(false);
    } catch (error) {
      setNotification({
        open: true,
        message: 'Ошибка при обновлении профиля',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Профиль
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
          />
          
          <TextField
            label="Телефон"
            type="tel"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!isEditing}
          />
          
          <TextField
            label="Telegram ID"
            type="text"
            fullWidth
            margin="normal"
            value={formData.telegramId}
            onChange={(e) => handleInputChange('telegramId', e.target.value)}
            disabled={!isEditing}
            helperText="Найдите свой Telegram ID у бота @userinfobot"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Telegram color="primary" />
                </InputAdornment>
              ),
            }}
          />
          
          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            {isEditing ? (
              <>
                <Button 
                  type="submit" 
                  variant="contained" 
                  disabled={loading}
                >
                  {loading ? 'Сохранение...' : 'Сохранить'}
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setIsEditing(false)}
                  disabled={loading}
                >
                  Отмена
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={() => setIsEditing(true)}>
                Редактировать
              </Button>
            )}
            
            <Button variant="outlined" color="error" onClick={logout}>
              Выйти
            </Button>
          </Box>
        </Box>
        
        <Snackbar
          open={notification.open}
          autoHideDuration={6000}
          onClose={() => setNotification(prev => ({ ...prev, open: false }))}
        >
          <Alert 
            severity={notification.severity}
            onClose={() => setNotification(prev => ({ ...prev, open: false }))}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default ProfilePage;