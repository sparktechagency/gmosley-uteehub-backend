import mongoose from 'mongoose';

export const teamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    position: {
      type: String,
      require: true,
    },
  },
  {
    timestamps: true,
  },
);

const Team = mongoose.model('team', teamSchema);
export default Team;
