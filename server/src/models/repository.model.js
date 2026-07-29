import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    githubOwner: { type: String, required: true, trim: true },
    githubRepoName: { type: String, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    url: { type: String, required: true },
    description: { type: String, default: "" },
    defaultBranch: { type: String, required: true },
    language: { type: String, default: null },
    stars: { type: Number, default: 0 },
    isPrivate: { type: Boolean, default: false },
    indexingStatus: {
      type: String,
      enum: ["pending", "indexing", "completed", "failed"],
      default: "pending",
    },
    indexingError: { type: String, default: null },
    filesIndexed: { type: Number, default: 0 },
    chunksIndexed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

repositorySchema.index({ owner: 1, fullName: 1 }, { unique: true });

const Repository = mongoose.model("Repository", repositorySchema);

export default Repository;