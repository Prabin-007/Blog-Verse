const { createHmac, randomBytes } = require("crypto");
const { Schema, model } = require("mongoose");
const { createTokenForUser } = require("../services/tokenService");

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email:    { type: String, required: true, unique: true },
    salt:     { type: String },
    password: { type: String, required: true },
    profileImageURL: { type: String, default: "/images/default.png" },
    role: { type: String, enum: ["USER", "ADMIN"], default: "USER" },
  },
  { timestamps: true }
);

// FIX: was `next` (reference only) — must be next() to proceed
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = randomBytes(16).toString("hex");
  const hashedPassword = createHmac("sha256", salt)
    .update(this.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found");

  const hash = createHmac("sha256", user.salt).update(password).digest("hex");
  if (hash !== user.password) throw new Error("Incorrect password");

  return createTokenForUser(user);
});

module.exports = model("User", userSchema);
