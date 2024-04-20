# PanthropiaNode

Backend for [Panthropia](https://www.panthropia.com/)

# MEAN Stack Backend

This repository contains the backend code for a MEAN stack application. It is designed to manage interactions between the front end and the database, ensuring efficient data transfer and handling server-side logic.

## Technologies Used

- **Node.js & Express.js**: For handling server-side logic and HTTP requests.
- **MongoDB with Mongoose**: Used for database management. The app connects to MongoDB Atlas for cloud database services.
- **AWS S3**: For storing and retrieving media files.
- **Mailgun**: Integrated for handling outgoing emails.
- **MVC Architecture**: Used to structure the codebase effectively.

## Local Setup

To run this project locally, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/panthropia-backend-public.git

   ```

2. **Create .env file**

```
   ACCESS_KEY_ID= AWS_access_key
   AWS_SECRET_KEY_LOC= AWS_secret_key
   BUCKET_NAME= AWS_S3_bucket_name
   INDEPENDENT_ID= random_object_ID
   DOMAIN= front_end_domain_name
   MAILGUN_KEY= mailgun_api_key
   MONGODB_URI_DEV= mongodb_atlas_connection_string
   SECRET= secret_for_JWT
   SERVER_CERT= server_certificate
   SERVER_KEY= server_secret_key
```

3. **Install Dependencies**

   ```bash
   npm install

   ```

4. **Start the Server**
   ```bash
   node app.js
   ```
