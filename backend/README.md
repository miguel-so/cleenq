# CleenQ Backend

The backend uses [Prisma](https://www.prisma.io/) with a MySQL datasource.

## Requirements

- Node.js 20+
- A running MySQL 8.0+ instance

## Environment Setup

1. Copy `.env.example` to `.env` and update the connection string:

   ```bash
   cp env.example .env
   ```

   ```dotenv
   DATABASE_URL="mysql://<user>:<password>@<host>:3306/cleenq"
   ```

2. Install dependencies.

   ```bash
   npm install
   ```

3. Create the database (if it does not already exist):

   ```sql
   CREATE DATABASE IF NOT EXISTS cleenq CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

4. Apply the Prisma schema to MySQL and generate the client:

   ```bash
   npm run prisma:migrate -- --name init
   npm run prisma:seed
   ```

   > Alternatively, for local development you can push the schema without migrations:
   >
   > ```bash
   > npm run prisma:push
   > ```

5. Start the development server.

   ```bash
   npm run dev
   ```

## Notes

- The Prisma client has already been generated against MySQL. Re-run `npm run prisma:generate` any time the schema changes.
- Existing data from PostgreSQL is not migrated automatically. To carry data forward you will need to export from PostgreSQL and import into MySQL using your preferred tooling.

