const { Schema, model, mongoose } = require("mongoose");

const JournalSchema = new Schema(
  {
    user: {
      type: String,
      ref: "User",
      required: [true, "Journal must belong to a user"],
    },
    title: {
      type: String,
      required: true,
    },
    entry: {
      type: String,
      required: true,
    },
    created_at:{
        type: Date, 
        required: true, 
        default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Journal = model("Journal", JournalSchema);

module.exports = Journal;
