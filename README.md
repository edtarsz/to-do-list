# To-Do List

A full-stack task management application to help you organize and manage your daily tasks efficiently.

## Features

- ✅ Add, edit, and delete tasks
- ✅ Mark tasks as complete
- ✅ Organize tasks by custom lists
- ✅ Priority levels (Low, Medium, High)
- ✅ Date and time scheduling
- ✅ Calendar view
- ✅ Filter by date and priority
- ✅ User authentication and authorization
- ✅ Responsive design (Auth, Update User)

## Technologies Used

### Front-End
- Angular 20.0.0
- TypeScript
- TailwindCSS
- GSAP (loading screen)
- RxJS
- Signals

### Back-End
- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Passport

### DevOps
- Docker & Docker Compose
- Nginx

## Project Structure

```
to-do-list/
├── front-end/           # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── main/           # Main application module
│   │   │   ├── global-components/
│   │   │   ├── global-services/
│   │   │   └── models/
│   │   ├── assets/
│   │   └── environments/
│   ├── Dockerfile
│   └── nginx.conf
├── back-end/            # NestJS application
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── tasks/
│   │   │   └── lists/
│   │   └── prisma/
│   ├── prisma/
│   │   └── schema/
│   ├── Dockerfile
│   └── entrypoint.sh
├── docker-compose.yml
├── .env.example
└── README.md
```

## Installation

### Prerequisites
- Node.js (v22.19.0 or higher)
- PostgreSQL (v17.6 or higher)
- Docker & Docker Compose (optional)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/to-do-list.git
cd to-do-list
```

2. Copy the example environment file and configure it:
```bash
cp .env.example .env
```

3. Edit `.env` with your configuration:
```env
# Server Settings
BACK_END_PORT=3000
FRONT_END_PORT=4200

FRONT_END_URL=http://localhost:4200

# Database connection settings
DATABASE_USER=myuser
DATABASE_PASSWORD=mypassword
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=to-do-list

# Authentication settings
JWT_SECRET=your_super_secret_jwt_key
```

## Running the Application

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d

# Stop services
docker-compose down
```

The application will be available at:
- Front-End: http://localhost:4200
- Back-End API: http://localhost:3000

### Option 2: Manual Setup

#### Back-End Setup

1. Navigate to the back-end directory:
```bash
cd back-end
```

2. Install dependencies:
```bash
npm install
```

3. Configure the database:
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Or push schema (development)
npx prisma db push
```

4. Start the development server:
```bash
npm run start:dev
```

The API will be available at: http://localhost:3000

#### Front-End Setup

1. Navigate to the front-end directory:
```bash
cd front-end
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
# or
npm start
```

The application will be available at: http://localhost:4200

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update user profile

### Tasks
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Lists
- `GET /api/lists` - Get all lists
- `POST /api/lists` - Create new list
- `PUT /api/lists/:id` - Update list
- `DELETE /api/lists/:id` - Delete list

## Database Schema

The application uses PostgreSQL with the following main entities:

- **User**: User accounts and authentication
- **Task**: Individual tasks with dates, priorities, and completion status
- **List**: Custom lists to organize tasks

## Building for Production

### Front-End
```bash
cd front-end
npm run build
```

Build artifacts will be stored in `dist/front-end/browser/`

### Back-End
```bash
cd back-end
npm run build
```

Build artifacts will be stored in `dist/`


```bash
cd front-end

# Unit tests
ng test

# E2E tests
ng e2e
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment

The application is configured for deployment with Docker and can be deployed to platforms like:
- Render
- Railway
- DigitalOcean
- AWS
- Heroku

See individual Dockerfiles and docker-compose.yml for deployment configuration.