import User from "../../userModule/user.model";

// service for get user by email
const getUserByEmail = async(email: string) => {
    return await User.findOne({email});
}

export default {
    getUserByEmail,
}
