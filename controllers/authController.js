import { User } from "../models/user.js";
import  verificationEmail   from "../utils/verificationEmail.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { Child } from "../models/child.js";
dotenv.config();

// ki user yaamel register nhotolo fi ProfilePhoto taswira par defaut esmha default.png w baad ki yaamel login ibadel wahdo
export async function register(req, res) {
  const { FirstName, LastName, Email, Password,BuildId } = req.body;

  if (!(Email && Password && FirstName && LastName)) {
    res.status(400).send("All fields are required");
  }

  const oldUser = await User.findOne({ Email });
  if (oldUser) {
    return res.status(409).send("User already exists");
  }
  // Generate an OTP for email verification
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  let NewUser = new User({
    FirstName,
    LastName,
    BuildId,
    Email: Email.toLowerCase(),
    Password: await bcrypt.hash(Password, 10),
    ProfilePhoto: `${req.protocol}://${req.get("host")}${process.env.IMGURL
      }/default.png`,
    OTP: otp
  });

  User.create(NewUser)
    .then((docs) => {
      res.status(201).json(docs)
      verificationEmail(docs.Email, "Email verification", otp);
  
     

    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

//Verify email 
export async function emailVerification(req, res) {
  const { Email, OTP } = req.body;

  const user = await User.findOne({ Email: Email });

  if (!user) {
    return res.status(400).send('User not found');
  }

  if (user.OTP !== OTP) {
    return res.status(400).send('Invalid OTP');
  }

  // Mark user email as verified
  user.Verified = true;
  user.OTP = undefined;
  await user.save();

  res.status(200).send('Your email has been verified');
}


export async function login(req, res) {
  const { Email, Password } = req.body;
  
  if (!(Email && Password)) {
    res.status(400).send("All fields are required");
  }

  const user = await User.findOne({ Email: req.body.Email.toLowerCase() });

  if (user) {
    if (await bcrypt.compare(Password, user.Password)) {
      const newToken = await jwt.sign({ id: user._id }, process.env.TOKENKEY, {
        expiresIn: "4d",
      });
      user.Token = newToken;
      user
        .updateOne({ _id: user._id, Token: newToken })
        .then(async (docs) => {
          const childList = [];
    
          for (const child of user.Children) {
            try {
              const foundChild = await Child.findById(child._id);
              if (foundChild) {
                childList.push(foundChild);
              }
            } catch (error) {
              console.log(error);
            }
          }
          res.status(200).json({ "Token":newToken,
        "Verified":user.Verified,
      "FirstName":user.FirstName,
    "LastName":user.LastName,
    "Email":user.Email,
    "ChildList":childList,
  "ProfilePhoto":user.ProfilePhoto});
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ error: err });
        });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } else {
    res.status(404).send("Unexistant user");
  }
}

export async function logout(req, res) {
  const user = await User.findById(req.id)
  if (user.Token == null) {
    res.status(500).json({ error: "User already logged out" });
  }
  else {
    await User.findOneAndUpdate(
      { _id: req.id },
      {
        Token: null,
      }
    )
      .then((docs) => {
        res.status(200).json({ "message": "Logout successful" });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

}
