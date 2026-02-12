# Use official Python base image
FROM python:3.10-slim

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt /Backend/app/

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy your application files
COPY . /app

# Expose the port your app runs on
EXPOSE 80

# Command to run your FastAPI app
CMD ["uvicorn", "agent:app", "--host", "0.0.0.0", "--port", "80"]