import { model, Schema } from "mongoose";


const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const postSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['Web', 'Software Engineering', 'AI', 'ML', 'VR', 'Others'],
    required: true,
  },
  tags: {
    type: [String],
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  upVotes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  downVotes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      default: [],
    },
  ],
  comments: [commentSchema],
  status: {
    type: String,
    enum: ['Draft', 'Published'],
    default: 'Draft',
  },
  pdfVersion: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });


postSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

postSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});


const Post = model('Post', postSchema);


export default Post;
