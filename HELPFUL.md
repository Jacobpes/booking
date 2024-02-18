# Help file for reference

We use postgresql.

## To run postgresql and gofiber

```bash
    docker-compose up -d
```

Then you can open the browser and go to `http://localhost:5050/` to see the database.

## Take the ip from the container

```bash
    docker ps
```

Then you can take the container id and use the following command to take the ip address.

```bash
    docker inspect <container_id>
```

for example:

```bash
    docker inspect 3046 | grep -i "ipaddress"
```

## To run the application

```bash
    go run main.go
```

## To test in postman

```bash
    http://localhost:8080/api/bookings
```

In body put the following json, after selecting json type:

```json
    {
        "massager_id": "1",
        "client_name": "John Doe",
        "client_email": "johndoe@example.com",
        "client_phone": "1234567890",
        "booking_time": "2024-03-01T15:00:00Z",
        "service_type": "Full Body Massage",
        "notes": "Allergic to certain oils",
        "age": 30,
        "gender": "Male",
        "remind_by_email": true,
        "remind_by_phone": false,
        "discount_code": "FIRSTTIME",
        "original_price": 100.00,
        "discount_amount": 10.00,
        "final_price": 90.00
    }
```
