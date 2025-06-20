const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  let { searchQuery, searchCountry, category } = req.query;
  let query = {};

  // Handle search by title or description
  if (searchQuery) {
    query.$or = [
      { title: { $regex: searchQuery, $options: "i" } },
      { description: { $regex: searchQuery, $options: "i" } },
      { location: { $regex: searchQuery, $options: "i" } },
    ];
  }

  // Handle search by country
  if (searchCountry) {
    query.country = { $regex: searchCountry, $options: "i" };
  }

  // Handle category filter
  if (category) {
    query.category = category;
  }

  const allListings = await Listing.find(query);
  res.render("listings/index.ejs", {
    allListings,
    searchQuery,
    searchCountry,
    category,
  });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
        select: "username",
      },
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
  let url = req.file.path;
  let filename = req.file.filename;
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not exist!");
    return res.redirect("/listings");
  }
  let originalImageUrl = listing.image?.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload");
  res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};

module.exports.categoryListings = async (req, res) => {
  const { category } = req.params;
  const allListings = await Listing.find({ category });
  res.render("listings/index.ejs", { allListings, category });

  try {
    const allListings = await Listing.find(query).sort({ createdAt: -1 });

    res.render("listings/index", {
      allListings,
      searchQuery, // Make sure this is passed
      searchCountry, // Make sure this is passed
      category,
      minPrice,
      maxPrice,
    });
  } catch (err) {
    // Error handling
  }
};
