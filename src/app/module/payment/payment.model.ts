import { model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";

const PaymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trxID: { type: String, required: true },
    packageName: { type: String, required: true },
    packagePrice: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
  },
  {
    timestamps: true,
  }
);

const Payment = model<IPayment>('Payment', PaymentSchema);

export default Payment;