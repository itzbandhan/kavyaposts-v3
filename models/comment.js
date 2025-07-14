import { Schema, model, models } from 'mongoose';

const CommentSchema = new Schema({
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Prompt',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Comment = models.Comment || model('Comment', CommentSchema);

export default Comment;
