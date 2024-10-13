import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostService } from "./post.service";
import AppError from "../../errors/AppError";
import { PostFilterOptions } from "./post.interface";


const createPost = catchAsync(async (req, res) => {
  const data = req.body;
  const result = await PostService.createPostIntoDB(data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Post created successfully!",
    data: result
  });
})

const getPosts = catchAsync(async (req, res) => {
  const { category, search, isPopular, isRandom, page = 1, limit = 10 } = req.query;

  const result = await PostService.getPostsFromDB({
    category: category as string,
    search: search as string,
    isPopular: isPopular === "true",
    isRandom: isRandom === "true",
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: isPopular === "true"
      ? "Popular Posts fetched successfully!"
      : "Posts fetched successfully!",
    data: result,
  });
});

const getPostById = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const result = await PostService.getPostByIdFromDB(postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts fetched successfully!",
    data: result
  });
})


const updatePost = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const data = req.body;
  const result = await PostService.updatePostIntoDB(postId, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts updated successfully!",
    data: result
  });
})

const deletePost = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const result = await PostService.deletePostFromDB(postId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts updated successfully!",
    data: result
  });
})

const commentPost = catchAsync(async (req, res) => {
  const postId = req.params.postId;
  const data = req.body;
  const result = await PostService.commentPostIntoDB(postId, data);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment successfully!",
    data: result
  });
})

const commentDelete = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params;
  const result = await PostService.commentDeleteFromDB(postId, commentId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully!",
    data: result
  });
})

const commentUpdate = catchAsync(async (req, res) => {
  const { postId, commentId } = req.params;
  const { content } = req.body;
  const result = await PostService.commentUpdateIntoDB(postId, commentId, content);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Comment deleted successfully!",
    data: result
  });
})

const votePost = catchAsync(async (req, res) => {
  const { postId } = req.params;
  const { action } = req.body;
  const voterEmail = req.user.email

  console.log({ postId, action })

  if (!['upvote', 'downvote'].includes(action)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid action');
  }

  const result = await PostService.votePostIntoDB(postId, action, voterEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Post ${action}d successfully!`,
    data: result
  });
});


const myPosts = catchAsync(async (req, res) => {
  const userEmail = req.user.email;
  const options: PostFilterOptions = {
    search: req.query.search as string || undefined,
    sortBy: req.query.sortBy as string || 'createdAt',
    sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'desc',
    page: req.query.page ? parseInt(req.query.page as string) : 1,
    limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    category: req.query.category as string || undefined,
  };
  const result = await PostService.myPostsFromDB(userEmail, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `Posts fetched successfully!`,
    data: result
  });
});


export const PostController = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  commentPost,
  commentDelete,
  commentUpdate,
  votePost,
  myPosts,
}