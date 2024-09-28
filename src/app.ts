import express, { Application, Request, Response } from 'express'
import errorHandlerWithParams from './app/middleware/globalError';
import notFoundHandlerWithParams from './app/middleware/notFound';
import router from './app/routes';
const app: Application = express()


// parser
app.use(express.json());


// global route
app.use('/api/v1', router)

app.get('/', (req: Request, res: Response) => {
  res.send('Server is running smoothly!')
})


// global error handler
app.use(errorHandlerWithParams);

// not found route
app.use(notFoundHandlerWithParams);

export default app;