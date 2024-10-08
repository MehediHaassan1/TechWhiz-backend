import { Types } from 'mongoose';

export interface IComment {
  user: Types.ObjectId;
  content: string;
}

export interface IPost {
  _id: Types.ObjectId;
  title: string;
  thumbnail: string;
  description: string;
  content: string;
  author: Types.ObjectId;
  category: 'Web' | 'Software Engineering' | 'AI' | 'ML' | 'VR' | "Others";
  isPremium: boolean;
  upVotes: Types.ObjectId[];
  downVotes: Types.ObjectId[];
  comments: IComment[];
  status: 'Draft' | 'Published';
  pdfVersion?: string;
  isDeleted: boolean;
}
