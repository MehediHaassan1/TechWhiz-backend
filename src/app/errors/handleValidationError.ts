import mongoose from "mongoose";
import { TErrorResponse, TErrorSources } from "../interface/error";

const handleValidationError = (err: mongoose.Error.ValidationError): TErrorResponse => {
  const statusCode = 400;

  const errorSources: TErrorSources = Object.values(err.errors).map(
    (value: mongoose.Error.CastError | mongoose.Error.ValidatorError) => {
      return {
        path: value?.path,
        message: value?.message,
      }
    })
  return {
    statusCode,
    message: 'Validation Error',
    errorSources
  }
}


export default handleValidationError;