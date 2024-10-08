import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IPost, IComment } from "./post.interface";
import Post from "./post.model";
import User from "../user/user.model";

const createPostIntoDB = async (postData: IPost) => {
  const result = await Post.create(postData)
  return result;
};

const getPostsFromDB = async () => {
  const result = await Post.find()
    .populate("author")
    .populate("comments.user")
    .sort("-createdAt");
  return result;
};

const getPostByIdFromDB = async (postId: string) => {
  const post = await Post.findById(postId).populate("author").populate("comments.user")
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'No post found!')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post deleted')
  }

  return post;
};

const updatePostIntoDB = async (postId: string, payload: Partial<IPost>) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'No post found!')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post deleted')
  }

  const result = await Post.findByIdAndUpdate(
    postId,
    payload,
    { new: true, runValidators: true }
  )

  return result;
};


const deletePostFromDB = async (postId: string) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'No post found!')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post deleted')
  }

  const result = await Post.findByIdAndUpdate(
    postId,
    { isDeleted: true },
    { new: true, runValidators: true }
  )

  return result;
};

const commentPostIntoDB = async (postId: string, payload: IComment) => {
  const post = await Post.findById(postId)
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'No post found!')
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post deleted')
  }

  const result = await Post.findByIdAndUpdate(
    postId,
    { $addToSet: { comments: payload } },
    { new: true, runValidators: true }
  )

  return result;
}


const commentDeleteFromDB = async (postId: string, commentId: string) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'No post found!');
  }
  if (post.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post deleted');
  }

  const commentExists = post.comments.some(comment => comment._id.toString() === commentId);
  if (!commentExists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found in this post!');
  }
  const updatedPost = await Post.findByIdAndUpdate(
    postId,
    { $pull: { comments: { _id: commentId } } },
    { new: true, runValidators: true }
  );

  return updatedPost;
}


const commentUpdateIntoDB = async (
  postId: string,
  commentId: string,
  newComment: string
) => {


  const post = await Post.findById(postId);
  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'No post found!');
  }

  if (post.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post has been deleted');
  }

  const commentIndex = post.comments.findIndex(comment => comment._id.toString() === commentId);
  if (commentIndex === -1) {
    throw new AppError(httpStatus.NOT_FOUND, 'Comment not found in this post!');
  }

  if (typeof newComment !== 'string') {
    throw new AppError(httpStatus.BAD_REQUEST, 'New comment content must be a string');
  }


  post.comments[commentIndex].content = newComment;

  const updatedPost = await post.save();
  return updatedPost;
}

const votePostIntoDB = async (
  postId: string,
  action: 'upvote' | 'downvote',
  voterEmail: string,
) => {
  const voter = await User.isUserExists(voterEmail);
  if (!voter) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }

  if (voter?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User Deleted!');
  }

  if (voter?.status === 'block') {
    throw new AppError(httpStatus.NOT_FOUND, 'User Blocked!');
  }

  const post = await Post.findById(postId);

  if (!post) {
    throw new AppError(httpStatus.NOT_FOUND, 'No post found!');
  }

  if (post.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post has been deleted');
  }

  const updateOperations: any = {};

  if (action === 'upvote') {
    if (post.upVotes.includes(voter._id)) {
      updateOperations.$pull = { upVotes: voter._id };
    } else {
      updateOperations.$addToSet = { upVotes: voter._id };
      updateOperations.$pull = { downVotes: voter._id };
    }
  } else if (action === 'downvote') {
    if (post.downVotes.includes(voter._id)) {
      updateOperations.$pull = { downVotes: voter._id };
    } else {
      updateOperations.$addToSet = { downVotes: voter._id };
      updateOperations.$pull = { upVotes: voter._id };
    }
  }

  const updatedPost = await Post.findByIdAndUpdate(postId, updateOperations, {
    new: true,
  });

  return updatedPost;
};



const myPostsFromDB = async (userEmail: string) => {
  const user = await User.isUserExists(userEmail);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User deleted!")
  }
  if (user?.status === "block") {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!')
  }
  const userId = user?._id.toString();

  const result = await Post.find({ author: userId, isDeleted: false })
    .populate('author')
    .sort("-createdAt");


  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Post not found!');
  }

  return result;
}


export const PostService = {
  createPostIntoDB,
  getPostsFromDB,
  getPostByIdFromDB,
  updatePostIntoDB,
  deletePostFromDB,
  commentPostIntoDB,
  commentDeleteFromDB,
  commentUpdateIntoDB,
  votePostIntoDB,
  myPostsFromDB,
}