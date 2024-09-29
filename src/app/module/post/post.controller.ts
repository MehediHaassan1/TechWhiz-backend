import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostService } from "./post.service";


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
  const result = await PostService.getPostsFromDB();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Posts fetched successfully!",
    data: result
  });
})

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


export const PostController = {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  commentPost,
  commentDelete,
  commentUpdate,
}