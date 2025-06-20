const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    url: String,
    filename: String,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"],
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true,
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    enum: [
      "mountains",
      "arctic",
      "farms",
      "deserts",
      "Castles",
      "Camping",
      "Farms",
      "Arctic",
    ],
  },
  country: {
    type: String,
    required: [true, "Country is required"],
    trim: true,
    enum: [
      "India",
      "America",
      "England",
      "China",
      "United States",
      "United Kingdom",
      "Canada",
      "Australia",
      "France",
      "Germany",
      "Italy",
      "Spain",
      "Japan",
      "Thailand",
      "Brazil",
      "Mexico",
      "Portugal",
      "Greece",
      "Turkey",
      "Egypt",
      "South Africa",
      "New Zealand",
      "Switzerland",
    ],
    default: "India",
  },
});

// Delete all reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing?.reviews?.length) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

module.exports = mongoose.model("Listing", listingSchema);
