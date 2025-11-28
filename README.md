# AssureHub - Advanced Audit & Consulting Platform

AssureHub is a premier business management platform tailored for audit certification and consulting professionals. It unifies workspace management, compliance tracking, and automated reporting into a single, high-performance application.

## 🚀 Features

- **Dual Workspace System**: Specialized environments for Audit and Consulting workflows.
- **Smart Dashboard**: Real-time analytics, activity tracking, and performance metrics.
- **Compliance Engine**: Built-in support for ISO standards and certification lifecycles.
- **Client Management**: Integrated CRM for managing opportunities, contracts, and intake.
- **Automated Reporting**: One-click generation of audit reports and certificates.
- **Secure Authentication**: Multi-factor authentication (2FA) and role-based access control.

## 🛠️ Technology Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Django, Django REST Framework
- **Database**: PostgreSQL / SQLite
- **Deployment**: Docker, Docker Compose

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.10+
- Docker (optional)

### Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-org/assurehub.git
    cd assurehub
    ```

2.  **Setup Frontend (Assure)**
    ```bash
    cd assure
    npm install
    npm run dev
    ```
    The app will run at `http://localhost:3000`.

3.  **Setup Backend (Centra)**
    ```bash
    cd backend_centra
    pip install -r requirements.txt
    python manage.py migrate
    python manage.py runserver
    ```
    The API will run at `http://localhost:8000`.

## 🐳 Docker Deployment

To build and run the Assure frontend container:

```bash
cd assure
docker build -t assure-app .
docker run -p 3000:3000 assure-app
```

## 📚 Documentation

- [System Explanation](./explanation.md)
- [Design System](./DESIGN_SYSTEM.md)
- [Authentication Flow](./AUTHENTICATION.md)
- [Component Architecture](./COMPONENT_ARCHITECTURE.md)

## 🤝 Contributing

Please read our contributing guidelines before submitting pull requests.

## 📄 License

This project is licensed under the ISC License.
