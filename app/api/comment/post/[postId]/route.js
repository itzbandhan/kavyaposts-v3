import { connectToDB } from '@/utils/database';
import Comment from '@/models/comment';
import User from '@/models/user';

export const GET = async (req, { params }) => {
  try {
    await connectToDB();

    const comments = await Comment.find({ post: params.postId }).populate('user');
    return new Response(JSON.stringify(comments), { status: 200 });
  } catch (err) {
    return new Response('Error fetching comments', { status: 500 });
  }
};
