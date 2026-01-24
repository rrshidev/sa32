import { Box, Typography } from '@mui/material';

const ClientBookingsPageMinimal = () => {
  console.log('ClientBookingsPageMinimal - Component rendered');
  
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">Мои записи - Минимальная версия</Typography>
      <Typography>Если видите этот текст, то компонент загружается!</Typography>
    </Box>
  );
};

export default ClientBookingsPageMinimal;
