const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    content:   { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    blogId:    { type: Schema.Types.ObjectId, ref: "Blog", required: true },
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
