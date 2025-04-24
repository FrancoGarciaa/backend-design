import { randomBytes } from "crypto";

export const generateUniqueCode = async () => {
return "TCK-" + randomBytes(4).toString("hex").toUpperCase();
};