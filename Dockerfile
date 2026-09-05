FROM python:3.13-slim

# Запрещаем Python писать файлы .pyc и буферизировать логи
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Сразу копируем и ставим пакеты (psycopg2-binary соберется без дебиановских библиотек)
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

COPY . /app/
RUN rm -rf /app/kanban-frontend

CMD ["gunicorn", "--bind", "0.0.0.0:8000", "kanban_board.wsgi:application"]
