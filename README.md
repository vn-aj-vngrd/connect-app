# Connect App

Welcome! This guide will help you get started with setting up the project and running it on your local machine.

## Prerequisites

Make sure you have the following prerequisites installed on your system:

- Docker (version >= 20.0.0)
- docker-compose (version >= 1.25.0)
- dotnet-ef (version >= 6.0.0)

## Installation

1. Clone the repository to your local machine using git and https method:

   ```bash
   git clone https://github.com/vn-aj-vngrd/connect-app.git
   ```

2. Change into the project's directory:

   ```bash
   cd connect-app
   ```

## Preparation

1. Starting with backend preparation, let's modify the AppHost located in "backend/appsettings.json" and change it to your local IP address. To identify your local IP address, run the following command:

   ```bash
   ipconfig
   ```

2. Run the following commands in the backend directory:

   ```bash
   cd backend
   dotnet ef database update
   ```

   The commands above will setup the database and the initial migration.

3. Now in the frontend side, let's modify the NEXT_PUBLIC_API_URL environment variable located in "frontend/.env.production" and change it to your local IP address.

## Build

In the root directory of the project, run this command to start building the docker image.

```bash
docker-compose up -d --build
```

## Run

Open your browser and go to http://<your_local_ip_address>:3000 to see the app running.
