import mongoose from "mongoose";

const contentBlockSchema = new mongoose.Schema(
  {
    pageSlug: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    sectionKey: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      trim: true,
      default: ""
    },
    subtitle: {
      type: String,
      trim: true,
      default: ""
    },
    description: {
      type: String,
      trim: true,
      default: ""
    },
    imageUrl: {
      type: String,
      trim: true,
      default: ""
    },
    cards: {
      type: [mongoose.Schema.Types.Mixed],
      default: []
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Published"
    }
  },
  { timestamps: true }
);

contentBlockSchema.index({ pageSlug: 1, sectionKey: 1 }, { unique: true });

const ContentBlock = mongoose.model("ContentBlock", contentBlockSchema);

export default ContentBlock;
