import express, { Application, Request, Response } from 'express'
import globalErrorHandler from './app/middleware/globalError';
import notFound from './app/middleware/notFound';
const app: Application = express()


// parser
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
  res.send('Server is running smoothly!')
})


// global error handler
app.use(globalErrorHandler);

// not found route
app.use(notFound);

export default app;