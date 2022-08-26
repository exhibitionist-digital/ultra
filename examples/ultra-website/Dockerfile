FROM denoland/deno:1.25.0
EXPOSE 8000
WORKDIR /app
COPY . /app
RUN deno task build
WORKDIR /app/.ultra
CMD ["deno", "task", "start"]