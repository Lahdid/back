import mongoose from "mongoose";
const { Schema } = mongoose;

const childSchema = new Schema(
  {
    Name: {
      type: String
    },
    BuildId: {
      type: String,
    },
    Linked: {
      type: Boolean,
      default:false,
    },
    Status: { type:String

    },
    SafeZonePoint1:{ 
      type: mongoose.Schema.Types.Number
    },
    SafeZonePoint2:{ 
      type: mongoose.Schema.Types.Number
    },
    SafeZonePoint3:{ 
      type: mongoose.Schema.Types.Number
    },
    SafeZonePoint4:{ 
      type: mongoose.Schema.Types.Number
    },
    Parents: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    }],
    applications:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:'application'
    }]
  },
  {
    timestamps: true,
  }
);

const Child = mongoose.model("child", childSchema);

export { Child };
