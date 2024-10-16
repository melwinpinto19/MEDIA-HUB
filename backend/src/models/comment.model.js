import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },

    video: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video", // Referencing the 'videos' collection
      required: true,
      index: 1,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Referencing the 'users' collection
      required: true,
      index: 1,
    },
  },
  {
    timestamps: true, // Automatically handles createdAt and updatedAt fields
  }
);

commentSchema.plugin(mongooseAggregatePaginate);

const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
