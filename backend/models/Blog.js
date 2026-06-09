const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title:         { type: String, required: true },
    body:          { type: String, required: true },
    coverImageURL: { type: String },
    createdBy:     { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = model("Blog", blogSchema);
