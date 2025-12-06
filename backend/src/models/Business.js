const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Business owner is required']
  },
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Business description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Business category is required'],
    enum: [
      'healthcare',
      'beauty',
      'fitness',
      'automotive',
      'home_services',
      'education',
      'consulting',
      'food_service',
      'retail',
      'other'
    ]
  },
  subcategory: String,
  logo: {
    type: String,
    default: ''
  },
  images: [{
    url: String,
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  contact: {
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      match: [/^\+?[1-9]\d{1,14}$/, 'Please provide a valid phone number']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email'
      ]
    },
    website: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String
    }
  },
  address: {
    street: {
      type: String,
      required: [true, 'Street address is required']
    },
    city: {
      type: String,
      required: [true, 'City is required']
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    country: {
      type: String,
      required: [true, 'Country is required'],
      default: 'Kenya'
    },
    zipCode: String,
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required']
      }
    }
  },
  operatingHours: {
    monday: {
      isOpen: { type: Boolean, default: true },
      open: String,
      close: String,
      breaks: [{
        start: String,
        end: String
      }]
    },
    tuesday: {
      isOpen: { type: Boolean, default: true },
      open: String,
      close: String,
      breaks: [{
        start: String,
        end: String
      }]
    },
    wednesday: {
      isOpen: { type: Boolean, default: true },
      open: String,
      close: String,
      breaks: [{
        start: String,
        end: String
      }]
    },
    thursday: {
      isOpen: { type: Boolean, default: true },
      open: String,
      close: String,
      breaks: [{
        start: String,
        end: String
      }]
    },
    friday: {
      isOpen: { type: Boolean, default: true },
      open: String,
      close: String,
      breaks: [{
        start: String,
        end: String
      }]
    },
    saturday: {
      isOpen: { type: Boolean, default: false },
      open: String,
      close: String,
      breaks: [{
        start: String,
        end: String
      }]
    },
    sunday: {
      isOpen: { type: Boolean, default: false },
      open: String,
      close: String,
      breaks: [{
        start: String,
        end: String
      }]
    }
  },
  services: [{
    name: {
      type: String,
      required: true
    },
    description: String,
    duration: {
      type: Number,
      required: true // in minutes
    },
    price: {
      type: Number,
      required: true
    },
    category: String,
    isActive: {
      type: Boolean,
      default: true
    },
    preparationTime: {
      type: Number,
      default: 0 // in minutes
    },
    cleanupTime: {
      type: Number,
      default: 0 // in minutes
    },
    maxAdvanceBooking: {
      type: Number,
      default: 30 // in days
    },
    minAdvanceBooking: {
      type: Number,
      default: 1 // in hours
    },
    cancellationPolicy: {
      type: String,
      enum: ['flexible', 'moderate', 'strict'],
      default: 'moderate'
    },
    requiresDeposit: {
      type: Boolean,
      default: false
    },
    depositPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  }],
  staff: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    role: {
      type: String,
      enum: ['owner', 'manager', 'staff'],
      default: 'staff'
    },
    services: [String],
    isActive: {
      type: Boolean,
      default: true
    },
    permissions: {
      canManageAppointments: {
        type: Boolean,
        default: true
      },
      canManageStaff: {
        type: Boolean,
        default: false
      },
      canViewReports: {
        type: Boolean,
        default: true
      }
    }
  }],
  settings: {
    bookingSettings: {
      advanceBookingLimit: {
        type: Number,
        default: 30 // in days
      },
      cancellationDeadline: {
        type: Number,
        default: 24 // in hours
      },
      reschedulingAllowed: {
        type: Boolean,
        default: true
      },
      autoConfirmBookings: {
        type: Boolean,
        default: false
      },
      requireApproval: {
        type: Boolean,
        default: true
      },
      maxAppointmentsPerDay: {
        type: Number,
        default: -1 // -1 means unlimited
      }
    },
    notificationSettings: {
      emailNotifications: {
        type: Boolean,
        default: true
      },
      smsNotifications: {
        type: Boolean,
        default: false
      },
      pushNotifications: {
        type: Boolean,
        default: true
      },
      reminderSettings: {
        send24HourReminder: {
          type: Boolean,
          default: true
        },
        send1HourReminder: {
          type: Boolean,
          default: false
        },
        send15MinuteReminder: {
          type: Boolean,
          default: false
        }
      }
    },
    paymentSettings: {
      acceptedMethods: [{
        type: String,
        enum: ['cash', 'card', 'mobile_money', 'bank_transfer']
      }],
      requireDeposit: {
        type: Boolean,
        default: false
      },
      depositPercentage: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
      },
      currency: {
        type: String,
        default: 'KES'
      }
    }
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected'],
    default: 'pending'
  },
  verification: {
    isVerified: {
      type: Boolean,
      default: false
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    documents: [{
      type: String,
      url: String,
      uploadedAt: Date
    }]
  },
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      5: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      1: { type: Number, default: 0 }
    }
  },
  stats: {
    totalAppointments: {
      type: Number,
      default: 0
    },
    totalCustomers: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    averageRating: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
businessSchema.index({ owner: 1 });
businessSchema.index({ category: 1 });
businessSchema.index({ status: 1 });
businessSchema.index({ 'address.city': 1 });
businessSchema.index({ 'address.coordinates': '2dsphere' });
businessSchema.index({ 'ratings.average': -1 });

// Virtual for full address
businessSchema.virtual('fullAddress').get(function() {
  const addr = this.address;
  return `${addr.street}, ${addr.city}, ${addr.state}, ${addr.country}`;
});

// Virtual for primary image
businessSchema.virtual('primaryImage').get(function() {
  const primaryImg = this.images.find(img => img.isPrimary);
  return primaryImg ? primaryImg.url : (this.images[0] ? this.images[0].url : '');
});

// Method to check if business is open at a specific time
businessSchema.methods.isOpenAt = function(date) {
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayName = dayNames[date.getDay()];
  const daySchedule = this.operatingHours[dayName];
  
  if (!daySchedule.isOpen) return false;
  
  const time = date.toTimeString().slice(0, 5); // HH:MM format
  const openTime = daySchedule.open;
  const closeTime = daySchedule.close;
  
  if (time < openTime || time > closeTime) return false;
  
  // Check if time falls within break periods
  for (const break of daySchedule.breaks) {
    if (time >= break.start && time <= break.end) {
      return false;
    }
  }
  
  return true;
};

// Method to get active services
businessSchema.methods.getActiveServices = function() {
  return this.services.filter(service => service.isActive);
};

module.exports = mongoose.model('Business', businessSchema);