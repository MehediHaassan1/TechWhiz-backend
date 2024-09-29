import { Types } from 'mongoose';

export interface IComment {
  user: Types.ObjectId;
  content: string;
}

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  content: string;
  author: Types.ObjectId;
  category: 'Web' | 'Software Engineering' | 'AI' | 'ML' | 'VR' | "Others";
  tags?: string[];
  isPremium: boolean;
  upVotes: number;
  downVotes: number;
  comments: IComment[];
  images?: string[];
  createdAt: Date;
  updatedAt?: Date;
  status: 'Draft' | 'Published';
  pdfVersion?: string;
  isDeleted: boolean;
}
