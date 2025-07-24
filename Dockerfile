FROM  artilleryio/artillery:2.0.23

WORKDIR /app

COPY . /app/

# NOTE: `run`으로 시작해야함.
CMD ["run", "playwright-artillery.yml"]