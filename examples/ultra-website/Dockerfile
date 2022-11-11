FROM denoland/deno:1.27.1 as builder
WORKDIR /app
COPY . /app
RUN deno task build

FROM denoland/deno:1.27.1
EXPOSE 8000
COPY --from=builder /app/.ultra /app 
WORKDIR /app
CMD ["deno", "task", "start"]
