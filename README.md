# Thmanyah Backend - Podcast Search API

This project is the backend API implementation for the Thmanyah Full-Stack Developer Assignment. Its primary purpose is to provide a REST API endpoint that searches for podcasts using the iTunes Search API, caches the results in an AWS DynamoDB table, and returns them to the client.

---

### 🚀 **Live Demo & Repositories**

*   **Live Frontend Application:** **[https://thmanyah-frontend-wheat.vercel.app/](https://thmanyah-frontend-wheat.vercel.app/)**
*   **Backend Repository (This Repo):** **[ranibb/thmanyah-api](https://github.com/ranibb/thmanyah-api)**
*   **Frontend Repository:** **[ranibb/thmanyah-frontend](https://github.com/ranibb/thmanyah-frontend)**

---

### ✨ Features & API Endpoint

The application exposes a single, robust API endpoint for searching podcasts.

#### **Endpoint**

`GET /search`

#### **Request Parameter**

*   `term` (string, required): The search term to query for podcasts.
    *   **Example:** `/search?term=فنجان`

#### **Workflow**

1.  The endpoint receives the search `term` as an input.
2.  It makes a live API call to the official iTunes Search API.
3.  The podcast results are then saved (cached) into an AWS DynamoDB table.
4.  The list of podcasts is returned to the client as a JSON response.

#### **Sample Response**
```json
[
    {
        "collectionId": 985515827,
        "artistName": "ثمانية/ thmanyah",
        "collectionName": "فنجان مع عبدالرحمن أبومالح",
        "feedUrl": "https://files.hosting.thmanyah.com/podcasts/89/...",
        "artworkUrl600": "https://is1-ssl.mzstatic.com/.../600x600bb.jpg",
        "genres": ["Society & Culture", "Podcasts"],
        "releaseDate": "2025-06-08T03:00:00Z",
        "trackCount": 350
    },
    ...
]
```

---

### 💻 Technology Stack

| Category      | Technology                                                                                                    |
|---------------|---------------------------------------------------------------------------------------------------------------|
| **Framework** | **NestJS** (with TypeScript)                                                                                  |
| **Database**  | **AWS DynamoDB** (NoSQL)                                                                                      |
| **Deployment**| **AWS Elastic Beanstalk**                                                                                     |
| **Core Tools**| **Axios** (for HTTP requests), **AWS SDK v3**, **`@nestjs/config`** (for environment variables)                 |

---

### 🛠️ Getting Started: Running Locally

To run this project on your local machine, follow these steps.

#### **1. Clone the Repository**
```bash
git clone https://github.com/ranibb/thmanyah-api.git
cd thmanyah-api
```

#### **2. Install Dependencies**
```bash
npm install
```

#### **3. Set Up Environment Variables**
Create a `.env` file in the root of the project. This file is required for the application to run. Copy the contents of `.env.example` (if present) or use the template below.

**`.env` file contents:**
```
# The port for the local development server
PORT=3001

# The base URL for the external API
ITUNES_API_BASE_URL=https://itunes.apple.com

# Your AWS credentials for connecting to DynamoDB
# Ensure the user has DynamoDB read/write permissions
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

#### **4. Run the Development Server**
```bash
npm run start:dev
```
The backend API should now be running on the port you specified (e.g., `http://localhost:3001`).

---

### ☁️ Deployment

This application is designed for and deployed on **AWS Elastic Beanstalk**.

The deployment process involves:
1.  Initializing an Elastic Beanstalk environment using the **EB CLI**.
2.  Creating a production-ready build of the NestJS application.
3.  Configuring the production environment variables (`PORT`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, etc.) directly in the Elastic Beanstalk console for security.
4.  Ensuring the associated IAM user has the necessary permissions for **Elastic Beanstalk**, **S3**, and **DynamoDB**.

---

### 🏗️ Project Structure

The project follows a modular architecture to separate concerns:
*   `src/search/`: Contains the controller and service for the main `/search` endpoint.
*   `src/itunes/`: Contains the service responsible for communicating with the external iTunes API.
*   `src/database/`: Contains the service for interacting with the AWS DynamoDB table.
*   `src/common/`: Contains shared DTOs (Data Transfer Objects) to ensure type safety between modules.