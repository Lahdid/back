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
      type: String
    },
    SafeZonePoint2:{ 
      type: String
    },
    SafeZonePoint3:{ 
      type: String
    },
    SafeZonePoint4:{ 
      type: String
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
