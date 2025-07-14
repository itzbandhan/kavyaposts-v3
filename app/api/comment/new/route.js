import { connectToDB } from '@/utils/database';
import Comment from '@/models/comment';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';

export const POST = async (req) => {
  const session = await getServerSession({ req, ...authOptions });
  if (!session?.user?.id) return new Response('Unauthorized', { status: 401 });

  const { postId, content } = await req.json();

  try {
    await connectToDB();

    const comment = await Comment.create({
      post: postId,
      user: session.user.id,
      content,
    });

    return new Response(JSON.stringify(comment), { status: 201 });
  } catch (err) {
    return new Response('Error creating comment', { status: 500 });
  }
};
