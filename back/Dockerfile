# Usar una imagen base oficial de Python
FROM python:3.11-slim

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /code

# Copiar el archivo de requerimientos al directorio de trabajo
COPY ./requirements.txt /code/requirements.txt

# Instalar las dependencias necesarias
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copiar el resto de los archivos de tu proyecto al contenedor
COPY app /code/app

# Exponer el puerto en el que correrá la aplicación
EXPOSE 8000

# Definir el comando para iniciar la aplicación
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
