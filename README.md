# Psyjaciele - Dog Incident Reporting App

A web application for reporting and tracking dog-related incidents in Warsaw. This app allows users to report incidents, view them on a map, and help keep the community's pets safe.

## Features

- Interactive map showing incident locations
- Report form for submitting new incidents
- List view of recent reports
- Helpful rating system for reports
- Mobile-responsive design
- User authentication (register, login)
- Admin dashboard for approving/rejecting reports
- RESTful API with JWT authentication

## Technologies Used

### Frontend
- React 19
- TypeScript
- Material-UI v6
- Leaflet Maps
- Vite

### Backend
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- MongoDB (local or Atlas)

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_URL=http://localhost:5000/api
```

Create a `.env` file in the backend directory with the following variables:

```
PORT=5000
MONGODB_URI=mongodb+srv://your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here
ADMIN_PASSWORD=your_admin_password_here
NODE_ENV=development
```

### Installation

1. Clone the repository
   ```
   git clone https://github.com/kasperwebster/DogApp.git
   cd DogApp
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd ../DogAppServer
   npm install
   ```

4. Start both servers (from the DogApp directory)
   ```
   ./start-dev.sh
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Deployment

The app is automatically deployed to GitHub Pages when changes are pushed to the main branch.

Visit the live app: https://kasperwebster.github.io/DogApp/

### Backend Deployment

To deploy the backend to production:

1. Build the TypeScript code:
   ```
   cd ../DogAppServer
   npm run build
   ```

2. Start the production server:
   ```
   npm start
   ```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Powered by Social WiFi
