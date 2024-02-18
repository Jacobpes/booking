# Use the official Golang image to create a build artifact.
FROM golang AS builder

# Set the Current Working Directory inside the container.
WORKDIR /app

# Copy go mod and sum files.
COPY go.mod go.sum ./

# Download all dependencies.
RUN go mod download

# Copy the source from the current directory to the Working Directory inside the container.
COPY . .

# Build the Go app.
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64
RUN go build -o main .

# Start a new stage from scratch.
FROM alpine:latest

WORKDIR /root/

# Copy the Pre-built binary file from the previous stage.
COPY --from=builder /app/main .
COPY --from=builder /app/.env .

# Ensure the binary is executable
RUN chmod +x main

# Command to run the executable.
CMD ["./main"]
