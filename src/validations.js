import { ReasonPhrases } from "http-status-codes";
import validator from "validator";

export function isValidNewUser(User) {
    const errors = [];

    if (!User.FirstName) {
        errors.push("You need a name");
    }

    if (!User.LastName) {
        errors.push("You need a last name");
    }

    if (!User.email) {
        errors.push("You need an email");
    } else if (!validator.isEmail(User.email)) {
        errors.push("User email is not valid");
    }

    // Phone number is not mandatory
    if (User.phone && !validator.isMobilePhone(User.phone, ["pt-BR"])) {
        errors.push("User phone number is not valid!");
    }

    if (!User.password) {
        errors.push("You need a password");
    }

    if (!User.confirmpassword) {
        errors.push("You need to confirm your password");
    }

    if (errors.length > 0) {
        return {
            error: ReasonPhrases.UNPROCESSABLE_ENTITY,
            msg: errors.join(", ")
        };
    }

    return true;
}
