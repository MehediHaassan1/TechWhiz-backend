import express from 'express';
import { PostController } from './post.controller';
import validateRequestHandler from '../../middleware/validationRequest';
import { PostValidation } from './post.validation';
import authHandler from '../../middleware/auth';
import { User_Role } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  authHandler(User_Role.user, User_Role.admin),
  validateRequestHandler(PostValidation.createPostValidation),
  PostController.createPost
);



router.get(
  '/',
  PostController.getPosts
);

router.get(
  '/popular-posts',
  PostController.getPopularPosts
)

router.get(
  '/my-posts',
  authHandler(User_Role.user, User_Role.admin),
  PostController.myPosts
)


router.get(
  '/:postId',
  PostController.getPostById
);

router.put(
  '/:postId',
  authHandler(User_Role.user, User_Role.admin),
  validateRequestHandler(PostValidation.updatePostValidation),
  PostController.updatePost
);

router.delete(
  '/:postId',
  authHandler(User_Role.user, User_Role.admin),
  PostController.deletePost
);

router.post(
  '/post-comment/:postId',
  authHandler(User_Role.user, User_Role.admin),
  PostController.commentPost
)

router.delete(
  '/delete-comment/:postId/:commentId',
  authHandler(User_Role.user, User_Role.admin),
  PostController.commentDelete
)

router.put(
  '/update-comment/:postId/:commentId',
  authHandler(User_Role.user, User_Role.admin),
  PostController.commentUpdate
)

router.put(
  '/:postId/vote',
  authHandler(User_Role.user, User_Role.admin),
  PostController.votePost
);


export const PostRoutes = router;
