import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import { IPost, IComment, PostFilterOptions } from "./post.interface";
import Post from "./post.model";
import User from "../user/user.model";

const createPostIntoDB = async (postData: IPost) => {
  const result = await Post.create(postData)
  return result;
};

const getPostsFromDB = async (params: {
  category?: string;
  search?: string;
  isPopular?: boolean;
  isRandom?: boolean;
  page: number;
  limit: number;
}) => {
  const { category, search, isPopular, isRandom, page, limit } = params;
  const query: any = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.title = { $regex: search, $options: "i" };
  }

  const skip = (page - 1) * limit;

  const totalItems = await Post.countDocuments(query);

  let posts = await Post.find(query)
    .populate("author")
    .populate("comments.user")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (isPopular) {
    posts = posts.sort((a, b) => b.upVotes.length - a.upVotes.length);
  }

  if (isRandom) {
    let randomPostsCache = null;
    let lastRandomFetch = 0;
    const currentTime = Date.now();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (!randomPostsCache || currentTime - lastRandomFetch >= twentyFourHours) {
      randomPostsCache = posts.sort(() => 0.5 - Math.random());
      lastRandomFetch = currentTime;
    }

    posts = randomPostsCache;
  }

  const totalPages = Math.ceil(totalItems / limit);

  return {
    posts,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  };
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



const myPostsFromDB = async (userEmail: string, options: PostFilterOptions) => {
  const user = await User.isUserExists(userEmail);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, "User deleted!");
  }
  if (user?.status === "block") {
    throw new AppError(httpStatus.BAD_REQUEST, 'User is blocked!');
  }

  const page = options.page || 1;
  const limit = options.limit || 10;
  const skip = (page - 1) * limit;

  const searchFilter = options.search
    ? {
      $or: [
        { title: { $regex: options.search, $options: "i" } },
        { content: { $regex: options.search, $options: "i" } },
      ],
    }
    : {};

  const categoryFilter = options.category ? { category: options.category } : {};

  const result = await Post.find({
    author: user?._id,
    isDeleted: false,
    ...searchFilter,
    ...categoryFilter,
  })
    .populate('author')
    .skip(skip)
    .limit(limit);

  const totalItems = await Post.countDocuments({
    author: user?._id,
    isDeleted: false,
    ...searchFilter,
    ...categoryFilter,
  });

  if (!result.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'Posts not found!');
  }

  const sortField = options.sortBy || "createdAt";
  const sortOrder = options.sortOrder === "asc" ? 1 : -1;

  result.sort((a, b) => {
    const fieldA = a[sortField as keyof typeof a];
    const fieldB = b[sortField as keyof typeof b];

    if (fieldA > fieldB) {
      return sortOrder;
    } else if (fieldA < fieldB) {
      return -1 * sortOrder;
    } else {
      return 0;
    }
  });

  const totalPages = Math.ceil(totalItems / limit);

  return {
    posts: result,
    meta: {
      totalItems,
      totalPages,
      currentPage: page,
      limit,
    },
  };
};



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