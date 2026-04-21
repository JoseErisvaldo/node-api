export function notFound(req, res, next) {
  const error = new Error(`Rota ${req.originalUrl} não encontrada`);
  error.status = 404;
  next(error);
}

export default function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "Erro interno do servidor",
    details: err.details || null,
  });
}
