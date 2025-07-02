# FinanceTracker Backend API

A robust Node.js/Express backend API for personal finance tracking with PostgreSQL and Prisma ORM.

## 🚀 Features

### Core Functionality
- **User Authentication** - JWT-based auth with refresh tokens
- **Transaction Management** - CRUD operations with filtering and pagination
- **Category Management** - Default and custom categories
- **Financial Reports** - Monthly, yearly, and category-specific reports
- **Data Import/Export** - CSV import and export functionality

### Security & Performance
- **Rate Limiting** - Configurable limits for API protection
- **Input Validation** - Comprehensive request validation
- **Security Headers** - Helmet.js security middleware
- **Password Hashing** - bcrypt with configurable salt rounds
- **CORS Protection** - Configurable origins and methods

### Developer Experience
- **TypeScript Support** - Full type definitions
- **API Documentation** - Built-in endpoint documentation
- **Error Handling** - Comprehensive error management
- **Logging** - Configurable logging with Morgan
- **Database Migrations** - Prisma-based schema management

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: express-validator
- **Testing**: Jest + Supertest
- **Documentation**: Built-in API docs

## 📋 Prerequisites

- Node.js 18.0 or higher
- npm 8.0 or higher
- PostgreSQL 12 or higher
- Git

## 🚀 Quick Start

### 1. Clone and Install
```bash
git clone <repository-url>
cd financetracker-backend
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup
```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with default data
npm run db:seed
```

### 4. Start Development Server
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## 📁 Project Structure

```
├── config/                 # Configuration files
│   ├── config.js          # Main configuration
│   └── database.js        # Database configuration
├── controllers/           # Request controllers
│   ├── authController.js
│   ├── transactionController.js
│   ├── categoryController.js
│   └── reportController.js
├── middleware/            # Custom middleware
│   ├── auth.js           # Authentication middleware
│   ├── validation.js     # Validation middleware
│   └── errorHandler.js   # Error handling
├── models/               # Prisma models (auto-generated)
├── routes/               # API routes
│   ├── auth.js
│   ├── transactions.js
│   ├── categories.js
│   └── reports.js
├── seeds/                # Database seeds
│   └── index.js
├── prisma/              # Prisma configuration
│   ├── schema.prisma    # Database schema
│   └── migrations/      # Migration files
├── uploads/             # File uploads directory
├── logs/                # Application logs
├── app.js              # Main application file
└── package.json
```

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/financetracker"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"

# Security
BCRYPT_SALT_ROUNDS=12
CORS_ORIGINS="http://localhost:5173"
```

### Database Configuration

The application uses PostgreSQL with Prisma ORM. Configure your database connection in the `DATABASE_URL` environment variable.

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication
Most endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

#### Transactions
- `GET /api/transactions` - Get transactions with filtering
- `POST /api/transactions` - Create new transaction
- `GET /api/transactions/:id` - Get single transaction
- `PUT /api/transactions/:id` - Update transaction
- `DELETE /api/transactions/:id` - Delete transaction
- `GET /api/transactions/statistics` - Get statistics
- `POST /api/transactions/import` - Import from CSV

#### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `GET /api/categories/:id` - Get single category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

#### Reports
- `GET /api/reports/monthly` - Monthly report
- `GET /api/reports/yearly` - Yearly report
- `GET /api/reports/category` - Category report
- `POST /api/reports/export` - Export report data

### API Documentation
Visit `http://localhost:3000/api` for complete interactive documentation.

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

## 📊 Database Management

### Migrations
```bash
# Create new migration
npm run db:migrate

# Reset database
npm run db:reset

# Deploy migrations to production
npm run db:deploy
```

### Database Studio
```bash
npm run db:studio
```

### Seeding
```bash
npm run db:seed
```

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Environment Setup
1. Copy `.env.production` to `.env`
2. Update all environment variables for production
3. Set up PostgreSQL database
4. Run migrations: `npm run db:deploy`
5. Start the server: `npm start`

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "start"]
```

## 🔒 Security

### Security Features
- JWT authentication with refresh tokens
- bcrypt password hashing
- Rate limiting for API protection
- CORS configuration
- Input validation and sanitization
- Security headers with Helmet.js
- SQL injection prevention with Prisma

### Security Best Practices
- Use strong JWT secrets (minimum 32 characters)
- Configure appropriate CORS origins
- Enable HTTPS in production
- Regular security updates
- Monitor for suspicious activity

## 📝 Logging

### Log Levels
- **Development**: `debug`, `info`, `warn`, `error`
- **Production**: `warn`, `error`

### Log Files
Logs are written to:
- Console (all environments)
- File: `logs/app.log` (production)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Commit changes: `git commit -am 'Add new feature'`
7. Push to branch: `git push origin feature/new-feature`
8. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Health Check
Check API health: `GET /health`

### Common Issues

**Database Connection Issues**
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists and permissions are correct

**Authentication Issues**
- Verify JWT secrets are set
- Check token expiration
- Ensure proper Authorization header format

**Rate Limiting**
- Check rate limit configuration
- Verify IP address whitelisting
- Adjust limits if needed

### Getting Help
- Check the API documentation at `/api`
- Review error logs in console or log files
- Check database connectivity with `/health` endpoint

## 📊 Monitoring

### Health Checks
- `GET /health` - Comprehensive health check
- `GET /ready` - Kubernetes readiness probe

### Metrics
Enable monitoring in production:
```bash
MONITORING_ENABLED=true
METRICS_ENABLED=true
```

### Performance
- Database query optimization with Prisma
- Request/response compression
- Configurable timeouts
- Connection pooling