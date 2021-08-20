FROM cypress/included:5.6.0

WORKDIR /app

ENTRYPOINT [ "sleep", "10000" ]
# ENTRYPOINT ["npx", "cypress", "run", "--config","baseUrl=\"http://php\""]