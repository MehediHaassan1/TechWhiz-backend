import express, { Application, Request, Response } from 'express'
import router from './app/routes';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './app/middleware/globalError';
import notFound from './app/middleware/notFound';
import cors from "cors";
const app: Application = express()


// parser
app.use(cors({
  origin: ['https://tech-whiz-frontend.vercel.app', 'http://localhost:3000',],
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

// global route
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running smoothly!')
})


// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;