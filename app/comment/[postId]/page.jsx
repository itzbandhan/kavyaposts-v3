'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { ArrowLeft, Send } from 'lucide-react';

const CommentPage = ({ params }) => {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/prompt/${params.postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
    } catch (error) {
      console.error('Failed to fetch post:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comment/post/${params.postId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      const data = await response.json();
      setComments(data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !session?.user) {
      alert('Please sign in to comment');
      return;
    }


  const handleDeleteComment = async (commentId) => {
    const confirmDelete = confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/comment/id/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchComments(); // Refresh the list
      } else {
        const errorText = await response.text();
        alert("Failed to delete comment: " + errorText);
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Error deleting comment. Please try again.");
    }
  };

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/comment/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          postId: params.postId, 
          content: newComment 
        }),
      });

      if (response.ok) {
        setNewComment('');
        fetchComments(); // Refresh comments
      } else {
        const errorData = await response.text();
        alert(`Failed to post comment: ${errorData}`);
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [params.postId]);

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = confirm("Are you sure you want to delete this comment?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`/api/comment/id/${commentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchComments(); // Refresh the list
      } else {
        const errorText = await response.text();
        alert("Failed to delete comment: " + errorText);
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert("Error deleting comment. Please try again.");
    }
  };


  if (isLoading) {
    return (
      <div className="flex-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex-center min-h-screen">
        <p className="text-xl">Post not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Back
        </button>
        <h1 className="text-2xl font-bold">Comments</h1>
      </div>

      {/* Post */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={post.creator.image}
            alt="user_image"
            width={40}
            height={40}
            className="rounded-full object-contain"
          />
          <div>
            <h3 className="font-semibold text-gray-900">{post.creator.username}</h3>
            <p className="text-sm text-gray-500">{post.creator.email}</p>
          </div>
        </div>
        <p className="text-gray-700 mb-3">{post.prompt}</p>
        <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
          {post.tag}
        </span>
      </div>

      {/* Comment form */}
      {session?.user ? (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add a comment</h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Write your comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onKeyPress={(e) => e.key === 'Enter' && !isSubmitting && handleSubmitComment()}
              disabled={isSubmitting}
            />
            <button
              onClick={handleSubmitComment}
              disabled={isSubmitting || !newComment.trim()}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send size={16} />
              {isSubmitting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-800">Please sign in to add comments.</p>
        </div>
      )}

      {/* Comments list */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">
          Comments ({comments.length})
        </h3>
        {comments.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment._id} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start gap-3">
                  <Image
                    src={comment.user.image}
                    alt="user_image"
                    width={32}
                    height={32}
                    className="rounded-full object-contain"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-gray-900">{comment.user.username}</span>{session?.user?.email === comment.user.email && (<button onClick={() => handleDeleteComment(comment._id)} className="text-red-500 text-xs ml-2 hover:underline">Delete</button>)}
                      <span className="text-xs text-gray-500">{comment.user.email}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentPage; 