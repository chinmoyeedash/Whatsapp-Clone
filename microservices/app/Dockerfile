FROM python:3

# install required debian packages
# add any package that is required after `python-dev`, end the line with \
RUN apt-get update && apt-get install -y \
    build-essential \
    python-dev \
&& rm -rf /var/lib/apt/lists/*

# install requirements
COPY src/requirements.txt /tmp/requirements.txt
RUN pip3 install -r /tmp/requirements.txt

# set /app as working directory
WORKDIR /app

# copy current directory to /app
COPY . /app

# run gunicorn server
# port is configured through the gunicorn config file
#CMD ["gunicorn", "--config", "./conf/gunicorn_config.py", "src:app"]
CMD ["gunicorn", "--config", "./conf/gunicorn_config.py", "-k",  "geventwebsocket.gunicorn.workers.GeventWebSocketWorker",  -w 1, "src:app" -b 0.0.0.0:5000 --log-file /gunicorn.log]
