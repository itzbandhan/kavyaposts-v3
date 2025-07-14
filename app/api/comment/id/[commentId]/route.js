import { connectToDB } from '@/utils/database';
import Comment from '@/models/comment';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../auth/[...nextauth]/route';

export const PATCH = async (req, { params }) => {
  const session = await getServerSession({ req, ...authOptions });
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const { content } = await req.json();

  try {
    await connectToDB();

    const comment = await Comment.findById(params.commentId);
    if (!comment) return new Response('Comment not found', { status: 404 });

    if (comment.user.toString() !== session.user.id)
      return new Response('Forbidden', { status: 403 });

    comment.content = content;
    await comment.save();

    return new Response(JSON.stringify(comment), { status: 200 });
  } catch (err) {
    return new Response('Error updating comment', { status: 500 });
  }
};

export const DELETE = async (req, { params }) => {
  const session = await getServerSession({ req, ...authOptions });
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  try {
    await connectToDB();

    const comment = await Comment.findById(params.commentId);
    if (!comment) return new Response('Comment not found', { status: 404 });

    if (comment.user.toString() !== session.user.id)
      return new Response('Forbidden', { status: 403 });

    await comment.deleteOne();

    return new Response('Comment deleted', { status: 200 });
  } catch (err) {
    return new Response('Error deleting comment', { status: 500 });
  }
};
