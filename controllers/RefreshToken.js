import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    console.log("===========REFRESH TOKEN===========");
    console.log(refreshToken);
    console.log("===========END REFRESH TOKEN===========");
    if (!refreshToken) return res.sendStatus(401);
    const user = await User.findAll({
      where: {
        refresh_token: refreshToken,
      },
    });
    if (!user[0]) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const userId = user[0].id;
        const email = user[0].email;
        const name = user[0].name;
        const accessToken = jwt.sign(
          { userId, email, name },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "60s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
    console.log("failed refresh token");
  }
};
