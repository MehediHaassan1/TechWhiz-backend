import { Types } from "mongoose";

export interface IPayment {
  user: Types.ObjectId,
  packageName: string;
  packagePrice: number;
  trxID: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'completed' | "failed"
}