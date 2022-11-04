FROM denoland/deno:1.27.1 as builder
COPY . /app
WORKDIR /app
RUN deno task build

FROM denoland/deno:1.27.1  
EXPOSE 8000
COPY --from=builder /app/.ultra /app 
WORKDIR /app
CMD ["deno", "task", "start"]