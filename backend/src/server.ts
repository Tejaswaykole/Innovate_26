import app from './app';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode.`);
});

// Force event loop to stay alive just in case
setInterval(() => {
  // Keep alive
}, 1000 * 60 * 60);
