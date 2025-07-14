'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

const CommentSection = ({ postId }) => {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [editing, setEditing] = useState(null);
  const [editText, setEditText] = useState('');

  const fetchComments = async () => {
    const res = await fetch(`/api/comment/post/${postId}`);
    const data = await res.json();
    console.log("Fetched comments:", data);
    setComments(data);
  };

  const handleSubmit = async () => {
    if (!newComment) return;

    await fetch('/api/comment/new', {
      method: 'POST',
      body: JSON.stringify({ postId, content: newComment }),
    });

    setNewComment('');
    fetchComments();
  };

  const handleDelete = async (id) => {
    await fetch(`/api/comment/id/${id}`, { method: 'DELETE' });
    fetchComments();
  };

  const handleEdit = async (id) => {
    await fetch(`/api/comment/id/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ content: editText }),
    });
    setEditing(null);
    fetchComments();
  };

  useEffect(() => {
    if (postId) fetchComments();
  }, [postId]);

  return (
    <div className="mt-6">
      <div className="flex gap-2 items-center">
        <input
          className="border p-2 rounded w-full"
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
          Post
        </button>
      </div>

      <div className="mt-4 space-y-4">
        {comments.map((c) => (
          <div key={c._id} className="flex items-start gap-3">
            <Image src={c.user.image} alt="pfp" width={30} height={30} className="rounded-full" />
            <div className="w-full">
              <p className="font-semibold">
                {c.user.name} <span className="text-xs text-gray-500">{c.user.email}</span>
              </p>

              {editing === c._id ? (
                <div className="flex gap-2 mt-1">
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="border p-1 rounded w-full"
                  />
                  <button onClick={() => handleEdit(c._id)} className="text-green-600">Save</button>
                  <button onClick={() => setEditing(null)} className="text-gray-600">Cancel</button>
                </div>
              ) : (
                <p>{c.content}</p>
              )}

              {session?.user?.email === c.user.email && (
                <div className="flex gap-3 text-sm mt-1">
                  <button onClick={() => { setEditing(c._id); setEditText(c.content); }} className="text-yellow-600">✏️ Edit</button>
                  <button onClick={() => handleDelete(c._id)} className="text-red-600">❌ Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
