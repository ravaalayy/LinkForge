export const errorHandler = (err, req, res, next) => {
  console.error('[Server Error]:', err.message || err);
  res.status(500).json({ error: 'Terjadi kesalahan internal pada server' });
};