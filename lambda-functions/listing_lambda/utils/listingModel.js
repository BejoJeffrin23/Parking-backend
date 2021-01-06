const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const Long = mongoose.Schema.Types.Long;

const markerSchema = new mongoose.Schema({
  type: {
    type: String, // Don't do `{ location: { type: String } }`
    enum: ['Point'], // 'location.type' must be 'Point'
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const locationDetailsSchema = new mongoose.Schema({
  listingType: {
    type: String,
    // required: true,
  },
  propertyType: {
    type: String,
    // required: true,
  },

  propertyName: {
    type: String,
    // required: true,
  },
  country: {
    type: String,
    // required: true,
  },
  address: {
    type: String,
    // required: true,
  },
  unitNum: {
    type: Number,
  },
  city: {
    type: String,
    // required: true,
  },
  state: {
    type: String,
    // required: true,
  },
  postalCode: {
    type: String,
    // required: true,
  },
  code: {
    type: String,
    // required: true,
  },
  phone: {
    type: String,
    // required: true,
  },
  marker: {
    type: markerSchema,
    // required: true,
  },
  streetViewImages: [String],
  parkingEntranceImages: [String],
  parkingSpaceImages: [String],
  features: [String],
});

const spaceLabelSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  largestSize: {
    type: String,
    required: true,
  },
  isBooked: {
    type: Boolean,
    default: false,
  },
});

const heightSchema = new mongoose.Schema({
  value: {
    type: Number,
    // required: true,
  },
  unit: {
    type: String,
    required: true,
  },
});

const spaceDetailsSchema = new mongoose.Schema({
  parkingSpaceType: {
    type: String,
    // required: true,
  },
  qtyOfSpaces: {
    type: String,
    // required: true,
  },
  heightRestriction: {
    type: Boolean,
    required: true,
  },
  height1: {
    type: heightSchema,
  },
  height2: {
    type: heightSchema,
  },
  sameSizeSpaces: {
    type: Boolean,
    required: true,
  },
  largestSize: {
    type: String,
  },
  motorcycle: {
    type: Boolean,
    required: true,
  },
  compact: {
    type: Boolean,
    required: true,
  },
  midsized: {
    type: Boolean,
    required: true,
  },
  large: {
    type: Boolean,
    required: true,
  },
  oversized: {
    type: Boolean,
    required: true,
  },
  motorcycleSpaces: {
    type: Number,
  },
  compactSpaces: {
    type: Number,
  },
  midsizedSpaces: {
    type: Number,
  },
  largeSpaces: {
    type: Number,
  },
  oversizedSpaces: {
    type: Number,
  },
  isLabelled: {
    type: Boolean,
  },
  spaceLabels: [spaceLabelSchema],
  aboutSpace: {
    type: String,
    // required: true,
  },
  accessInstructions: {
    type: String,
    // required: true,
  },
});

const timeDurationSchema = new mongoose.Schema({
  value: {
    type: Long,
    // required: true,
  },
  unit: {
    type: String,
    required: true,
  },
});

const daySchema = new mongoose.Schema({
  isActive: {
    type: Boolean,
    required: true,
  },
  startHour: {
    type: Number,
  },
  startMinute: {
    type: Number,
  },
  endHour: {
    type: Number,
  },
  endMinute: {
    type: Number,
  },
});

const customTimeSchema = new mongoose.Schema({
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
});

const spaceAvailableSchema = new mongoose.Schema({
  monday: {
    type: daySchema,
    required: true,
  },
  tuesday: {
    type: daySchema,
    required: true,
  },
  wednesday: {
    type: daySchema,
    required: true,
  },
  thursday: {
    type: daySchema,
    required: true,
  },
  friday: {
    type: daySchema,
    required: true,
  },
  saturday: {
    type: daySchema,
    required: true,
  },
  sunday: {
    type: daySchema,
    required: true,
  },
  scheduleType: {
    type: String,
    // required: true,
  },
  customTimeRange: [customTimeSchema],
  hasNoticeTime: {
    type: Boolean,
    required: true,
  },
  noticeTime: {
    type: timeDurationSchema,
    required: true,
  },
  advanceBookingTime: {
    type: timeDurationSchema,
    required: true,
  },
  minTime: {
    type: timeDurationSchema,
    required: true,
  },
  maxTime: {
    type: timeDurationSchema,
    required: true,
  },
  instantBooking: {
    type: Boolean,
    required: true,
  },
});

const pricingRatesSchema = new mongoose.Schema({
  perHourRate: {
    type: Number,
    // required: true,
  },
  perDayRate: {
    type: Number,
    // required: true,
  },
  perWeekRate: {
    type: Number,
    // required: true,
  },
  perMonthRate: {
    type: Number,
    // required: true,
  },
});

const pricingDetailsSchema = new mongoose.Schema({
  pricingType: {
    type: String,
    // required: true,
  },
  pricingRates: {
    type: pricingRatesSchema,
    required: true,
  },
});

const listingSchema = new mongoose.Schema({
  thumbnail: String,
  ownerId: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  ownerEmail: {
    type: String,
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
  locationDetails: {
    type: locationDetailsSchema,
    required: true,
  },
  spaceDetails: {
    type: spaceDetailsSchema,
    required: true,
  },
  spaceAvailable: {
    type: spaceAvailableSchema,
    required: true,
  },
  pricingDetails: {
    type: pricingDetailsSchema,
    required: true,
  },
  location: {
    type: markerSchema,
  },
  bookings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'reviews',
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

listingSchema.index({ location: '2dsphere' });

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;
