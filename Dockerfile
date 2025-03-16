FROM python:3.9-slim

WORKDIR /app

# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && apt-get clean

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Default environment variables - will be overridden by docker-compose
ENV PORT=5002
ENV HOST=0.0.0.0
ENV PYTHONUNBUFFERED=1
ENV DEBUG=false

EXPOSE 5002

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:$PORT/api/health || exit 1

CMD ["python", "app.py"]