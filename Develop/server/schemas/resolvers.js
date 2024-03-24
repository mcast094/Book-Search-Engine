// const {AuthenicationError} = require("apollo-server-express4");
const { signToken } = require("../utils/auth");
const { User } = require("../models");

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({_id: context.user._id}).select(
                    "-__v -password"
                );
                return userData;
            }
            throw new AuthenicationError("Not logged in");
        },
    },
    Mutation: {
        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return {token, user};
        },
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user) {
                throw new AuthenicationError("Incorrect credentials");
            }
            const correctPw = await user.isCorrectPassword(password);
            if(!correctPw) {
                throw new AuthenicationError("Incorrect password");
            }

            const token = signToken(user);
            return{ token, user };
        },
        saveBook: async (parent, { bookData }, context) => {
            if (context.user){
                const updatedUser = await User.findByIdAndUpdate(
                    {_id: context.user._id},
                    {$push: {savedBooks: bookData}},
                    {new: true}
                );
                return updatedUser;
            }
            throw new AuthenicationError("You need to be logged in!");
        },
        removeBook: async (parent, {bookID}, context) => {
            if(context.user) {
                const updatedUser = await User.findOneAndDelete(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookID}}},
                    {new: true}
                );
                return updatedUser;
            }
            throw new AuthenicationError("You need to be logged in!");
        },
    },
};
module.exports = resolvers;