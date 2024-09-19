# GMF DOA Dashboard

## A. Overview
GMF DOA dashboard is an web-based dashboard using NestJS + AngularJS. Main goal of this project is to digitalized all NCR and IOR records and documentations so it's easily accessed by employees.

### B. Functions
- IOR form & records.
- NCR form & records.
- Personnel records.
- Project records and documentations.


## C. System Requirements
- `NestJS` ^10.0.0
- `AngularJS` ^18.0.0
- `Cloud PostgreSQL GCP` 13.15.0 
- `App Engine GCP`


## D. Dependencies
### Frontend Dependencies
Angular:
- `@angular/animations` ^18.1.2
- `@angular/common` ^18.0.0
- `@angular/compiler` ^18.0.0
- `@angular/core` ^18.0.0
- `@angular/forms` ^18.0.0
- `@angular/platform-browser` ^18.0.0
- `@angular/platform-browser-dynamic` ^18.0.0
- `@angular/platform-server` ^18.0.0
- `@angular/router` ^18.0.0
- `@angular/ssr` ^18.0.7

UI & Styling:
- `bootstrap` ^5.3.3
- `bootstrap-icons` ^1.11.3
- `tailwindcss` ^3.4.4
- `autoprefixer` ^10.4.19
- `postcss` ^8.4.39

FontAwesome:
- `@fortawesome/angular-fontawesome` ^0.15.0
- `@fortawesome/fontawesome-free` ^6.6.0
- `@fortawesome/fontawesome-svg-core` ^6.6.0
- `@fortawesome/free-solid-svg-icons` ^6.6.0

Utilities:
- `axios` ^1.7.2
- `jquery` ^3.7.1
- `lodash` ^4.17.21
- `rxjs` ~7.8.0
- `tslib` ^2.3.0
- `xlsx` ^0.18.5
- `zone.js` ~0.14.3

Notifications:
- `ngx-toastr` ^19.0.0

SSR (Server-Side Rendering):
- `express` ^4.18.2
- `jwt-decode` ^4.0.0

### Backend Dependencies
NestJS Core:
- `@nestjs/common` ^10.0.0
- `@nestjs/core` ^10.0.0
- `@nestjs/platform-express` ^10.0.0
- `@nestjs/config` ^3.2.3
- `@nestjs/jwt` ^10.2.0
- `@nestjs/passport` ^10.0.3

Prisma ORM:
- `@prisma/client` ^5.19.0

Authentication:
- `bcrypt` ^5.1.1
- `bcryptjs` ^2.4.3
- `passport` ^0.7.0
- `passport-jwt` ^4.0.1
- `jsonwebtoken` ^9.0.2

Validation & Transformation:
- `class-transformer` ^0.5.1
- `class-validator` ^0.14.1

Utility Libraries:
- `reflect-metadata` ^0.2.0
- `rxjs` ^7.8.1
- `util` ^0.12.5

Development Tools:
- `nodemon` ^3.1.4
- `jest` ^29.5.0
- `eslint` ^8.42.0
- `prettier` ^3.0.0
- `typescript` ^5.1.3
- `supertest` ^7.0.0


## Installation
To install and set up the project locally, follow these steps:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/mikhaelsiallagan/tes-doa-dashboard.git

2. **Navigate to the Project Directory:**
   ```bash
   cd tes-doa-dashboard
   
3. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install   

4. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install

5. **Set Up the Database & .env files:**
   ```bash
   # Environment variables declared in this file are automatically made available to Prisma.
   # See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

   # Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
   # See the documentation for all the connection string options: https://pris.ly/d/connection-strings

   DATABASE_URL= [YOUR DATABASE URL]
   PORT_RUN = [YOUR PORT]
   JWT_EXPIRED = [YOUR JWT EXPIRED TIME]
   JWT_SECRET = [YOUR JWT SECRET]
   USER_EMAIL = [YOUR GCP EMAIL]
   TARGET_FOLDER = [YOUR TARGET FOLDER FOR NCR]
   API_LOCATION = [YOUR GCP JSON CREDENTIALS]
   TEMPLATE_DOCUMENT_IOR= [YOUR IOR TEMPLATE DOCS]
   TARGET_FOLDER_IOR= [YOUR TARGET FOLDER FOR IOR]
   TARGET_FOLDER_NCR = [YOUR TARGET FOLDER FOR NCR]
   TEMPLATE_DOCUMENT_NCR_DGCA = [YOUR NCR DGCA TEMPLATE DOCS]
   TEMPLATE_DOCUMENT_NCR_EASA = [YOUR NCR EASA TEMPLATE DOCS]


6. **Run the Application:**
   - Frontend
     ```bash
     ng serve
   - Backend
     ```bash
     npx prisma generate
     npm run start:dev

## Improvement
- Migrated to Nest & Prisma: Migrated into new high scalability framework and more easy to use.
- Improved authentication method: Implemented Json Web Token (JWT) authentication for better security.
- Expanded reports management: Redesigned NCR and IOR reports procedure including the follow ups, as well as the PDF generation feature.
- Implemented personnel management features: Implemented new personnel management features, consisting of adding entries, listing, searching, as well as editing.
- Improved UI/UX: Improved UI/UX by creating loading animation, and added more pop up notifications on modules previously lacking.

## Future Improvement
- Export PDF feature on Personnel sections
- Development and creating Project Management feature
- Fullstack deployment using HTTPS in Google Cloud Platform
- Fixing the slow process of export PDF features 

## Contributor
| NPM    | Name                        | Major       | University                       | LinkedIn    | Batch       |
|--------|-----------------------------|-------------|--------------------------------- |--------------------------------------------------------------------------------------------------------------| ----------------- |
| M316D4  | Zalfy Putra Rezky          | Teknik Komputer    | Universitas Indonesia            | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/zalfyputra/)  | Batch 4.3 Sesi 1 |
| M322D4KX2261  | Laode Alif Ma'sum Sidrajat Ika   | Teknik Komputer    | Universitas Indonesia          | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/alif5623/) | Batch 4.3 Sesi 1 |
| M322D4KX2261  | Enricco Verindra Putra   | Teknik Komputer    | Universitas Indonesia          | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/enriccoverindra/) | Batch 4.3 Sesi 1 |
| M322D4KX2223  | Jeffri             | Teknik Komputer    | Universitas Indonesia          | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/jeffri22/)  | Batch 4.3 Sesi 2 |
| 2106731491 | Mikhael Morris H. Siallagan | Teknik Komputer     | Universitas Indonesia           | [![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/mikhaelsllgn/)      | Batch 4.3 Sesi 2 |
