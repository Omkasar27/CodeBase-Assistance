import mongoose from "mongoose";

const techStackSchema = new mongoose.Schema(
  {
    languages: { type: [String], default: [] },
    frameworks: { type: [String], default: [] },
    packageManagers: { type: [String], default: [] },
  },
  { _id: false }
);

const moduleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    path: { type: String, required: true },
    purpose: { type: String, default: "" },
    importantFiles: { type: [String], default: [] },
  },
  { _id: false }
);
const apiRouteSchema = new mongoose.Schema(
  {
    method: { type: String, required: true },
    path: { type: String, required: true },
    controller: { type: String, default: "" },
    authRequired: { type: Boolean, default: false },
    description: { type: String, default: "" },
  },
  { _id: false }
);

const roadmapStepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    relatedModules: { type: [String], default: [] },
  },
  { _id: false }
);


const healthMetricsSchema = new mongoose.Schema(
  {
    largestModules: {
      type: [{ path: String, fileCount: Number, _id: false }],
      default: [],
    },
    complexityHotspots: {
      type: [{ path: String, fileCount: Number, _id: false }],
      default: [],
    },
    configFiles: { type: [String], default: [] },
    todoCount: { type: Number, default: 0 },
    hasReadme: { type: Boolean, default: false },
  },
  { _id: false }
);


    


const repositoryInsightSchema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
      unique: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "analyzing", "completed", "failed"],
      default: "pending",
    },
    error: { type: String, default: null },
    summary: { type: String, default: null },
    techStack: { type: techStackSchema, default: () => ({}) },
    architectureOverview: { type: String, default: null },
    modules: { type: [moduleSchema], default: [] },
    apiRoutes: { type: [apiRouteSchema], default: [] },
    learningRoadmap: { type: [roadmapStepSchema], default: [] },
    healthMetrics: { type: healthMetricsSchema, default: () => ({}) },
  },
  { timestamps: true }
);


const RepositoryInsight = mongoose.model("RepositoryInsight", repositoryInsightSchema);

export default RepositoryInsight;