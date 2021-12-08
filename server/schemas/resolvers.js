const { AuthenticationError } = require("apollo-server-express");
const { User, Picture, Favorite, Comment } = require("../models");
const { signToken, checkToken } = require("../utils/auth");

const resolvers = {
  Query: {
    getMe: async (parent, args, { authorization }) => {
    console.log(authorization)
        const user = checkToken(authorization);
    console.log(user)
      if (user) {
        const foundUser = await User.findOne({
          _id: user._id,
        }).populate("savedBooks")
        console.log(foundUser)
        return foundUser;
      }
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("No user found with this email address");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },

    addUser: async (parent, { username, email, password }) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user);
      return { token, user };
    },

    saveBook: async (parent, args, { authorization }) => {
      const user = checkToken(authorization);
      if (user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      }
    },

    removeBook: async (parent, args, { authorization }) => {
      const user = checkToken(authorization);
      if (user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
        return updatedUser
      }
     
    },
  },
};

module.exports = resolvers;
