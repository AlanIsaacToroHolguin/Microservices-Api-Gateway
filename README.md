# 🧩 Microservices API Gateway (by Alan Isaac Toro Holguín)

This project is an **enhanced and extended version** of the original repository [GuilloBurgos/microservicio_api_gateway](https://github.com/GuilloBurgos/microservicio_api_gateway).

It demonstrates a **microservices architecture** built with an **API Gateway** that centralizes communication between independent services — such as the **Users Service** and **Products Service** — and a **React-based Frontend**.  
This version includes full frontend integration, service configuration improvements, and several optimizations for scalability and maintainability.

---

## 🚀 Main Technologies

- **Node.js** (API Gateway)
- **Express.js**
- **MySQL / MariaDB**
- **React + Vite**
- **TailwindCSS**
- **Docker (optional)**

---

## 🧱 Project Structure
```
├── api-gateway/ # Central gateway that routes requests to microservices
├── products-service/ # Handles product-related operations
├── users-service/ # Manages user authentication and data
└── Frontend/ # React + Vite frontend consuming the gateway API
```


---

## ⚙️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/AlanIsaacToroHolguin/Microservices-Api-Gateway.git
cd Microservices-Api-Gateway
```
### 📦 Install Dependencies

Run the following command inside each folder (`api-gateway`, `users-service`, `products-service`, and `Frontend/Frontend`):

```bash
npm install

# API Gateway
cd api-gateway
node index.js
http://localhost:3000

# Users Service
cd users-service
node index.js
http://localhost:3001

# Products Service
cd products-service
node index.js
http://localhost:3002

# Frontend
cd Frontend/Frontend
npm run dev
The frontend will run on http://localhost:5173
               
```

