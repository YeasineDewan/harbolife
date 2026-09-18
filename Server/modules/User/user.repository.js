import User from "./user.model.js";

export const UserRepository = {
  findById: async (id) => {
    return await User.findById(id);
  },

  findByIdWithoutSensitiveData: async (id) => {
    return await User.findById(id).select("-password -__v").lean();
  },

  findProfileById: async (id) => {
    return await User.findById(id)
      .select("-password -__v -is_deleted -is_active")
      .lean();
  },

  updateById: async (id, updateData) => {
    return await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true },
    )
      .select("-password -__v -is_deleted")
      .lean();
  },

  findEmailInUseByOthers: async (email, currentUserId) => {
    return await User.findOne({
      email,
      _id: { $ne: currentUserId },
      is_deleted: false,
    }).lean();
  },

  saveUser: async (userDoc) => {
    return await userDoc.save();
  },

  createUser: async (userData) => {
    const user = new User(userData);
    return await user.save();
  },

  findUsersPaginated: async (filter, skip, limitNum, sortObj) => {
    return await User.find(filter)
      .select("-password -__v -is_deleted")
      .sort(sortObj)
      .skip(skip)
      .limit(limitNum)
      .lean();
  },

  countUsers: async (filter) => {
    return await User.countDocuments(filter);
  },

  findCouriers: async () => {
    return await User.find({ role: "courier", is_deleted: false })
      .select("name _id")
      .lean();
  },

  findMatchingUsers: async (regex) => {
    return await User.find({ name: regex }).select("_id");
  },
  findUsersByIds: async (userIds, selectFields) => {
    return await User.find({ _id: { $in: userIds } }, selectFields);
  },

  findCourierById: async (courierId) => {
    return await User.findOne({
      _id: courierId,
      role: "courier",
      is_deleted: false,
    });
  },

  findUserForAuth: async (id) => {
    return await User.findById(id).select("-password -refresh_token").lean();
  },

  findByEmail: async (email) => {
    return await User.findOne({ email, is_deleted: false }).select("+password");
  },
  
  findByEmailWithPassword: async (email) => {
    return await User.findOne({ email, is_deleted: false }).select("+password");
  },
};
