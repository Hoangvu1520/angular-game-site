import crypto from "crypto";

export const sha256 = (input: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(input);
  return hash.digest("hex");
};

export const checkTypeValueUser = (string: string): string | undefined => {
  const isEmail = (input: string): boolean => {
    const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
  };

  const isPhoneNumber = (input: string): boolean => {
    const phoneRegex: RegExp = /^[0-9]{10}$/;
    return phoneRegex.test(input);
  };

  if (isEmail(string)) {
    return "email";
  } else if (isPhoneNumber(string)) {
    return "phone";
  } else {
    return undefined;
  }
};