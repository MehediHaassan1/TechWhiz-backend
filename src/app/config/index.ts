import dotenv from 'dotenv';

dotenv.config();


export default {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    db_url: process.env.DB_URL,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_access_secret_expires_in: process.env.JWT_ACCESS_SECRET_EXPIRES_IN,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_refresh_secret_expires_in: process.env.JWT_REFRESH_SECRET_EXPIRES_IN,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    Store_id: process.env.STORE_ID,
    SIGNATURE_KEY: process.env.SIGNATURE_KEY,
    PAYMENT_URL: process.env.PAYMENT_URL,
    VERIFY_URL: process.env.VERIFY_URL,
    FrontEnd_URL: process.env.FrontEnd_URL,
    Backend_URL: process.env.Backend_URL,
}