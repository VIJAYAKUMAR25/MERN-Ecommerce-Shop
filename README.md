
`#<img src="frontend/src/assets/logo.png" alt="Logo" width="100">`



# MERN Stack E-Commerce Project

Welcome to our MERN (MongoDB, Express.js, React.js, Node.js) Stack E-Commerce Project repository! This project is a full-stack e-commerce website built using the MERN stack, allowing users to browse products, add them to the cart, and complete the checkout process.

## Overview

Our project aims to provide a comprehensive e-commerce solution with the following features:

### Frontend:

Built using React.js to create a dynamic and interactive user interface. Allows users to view products, add them to the cart, and proceed to checkout. Implements responsive design for optimal user experience across devices.

### Backend:

Developed using Node.js and Express.js to handle server-side logic and API requests. Utilizes MongoDB as the database to store product information, user data, and cart details. Implements RESTful APIs for various functionalities such as adding products, updating cart items, and user authentication.

### Authentication:

Implements user authentication and authorization using JWT (JSON Web Tokens). Allows users to register, login, and logout securely.

### Admin Panel:

Provides an admin panel for managing products, categories, and user orders. Allows admins to add new products, update existing ones, and view order details.

## Project Structure

### frontend:

Contains the frontend React.js application.

- **src**: Source code for the frontend application.
  - **components**: Reusable UI components.
  - **pages**: Individual pages/components for different sections of the website.
  - **context**: Context providers for managing global state.
  - **assets**: Static assets such as images and icons.
- **public**: Public assets and HTML files.

### backend:

Contains the backend Node.js and Express.js application.

- **routes**: Express routes for handling API requests.
- **controllers**: Controller functions for handling business logic.
- **models**: Mongoose models for defining MongoDB schemas.
- **middleware**: Middleware functions for handling authentication, error handling, etc.
- **config**: Configuration files for environment variables, database connection, etc.
- **server.js**: Main entry point for the backend application.

## Getting Started

To run the project locally, follow these steps:


#Happy Coding!!

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the frontend directory: `cd frontend`
3. Install frontend dependencies: `npm install`
4. Start the frontend development server: `npm start`
5. Open your browser and visit [http://localhost:3000](http://localhost:3000) to view the frontend application.
6. Repeat steps 2-5 for the backend directory to run the backend server.
