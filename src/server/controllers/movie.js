const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const jwtSecret = "mysecret";

const getAllMovies = async (req, res) => {
  const movies = await prisma.movie.findMany();

  res.json({ data: movies });
};

const checkValidJWT = (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }

  const token = authorization.replace("Bearer ", "");
  if (!token) {
    res.status(401).json({ error: "unauthorized" });
    return false;
  }

  console.log("token", token);

  try {
    jwt.verify(token, jwtSecret);
  } catch (err) {
    console.error("error validating jwt", err);
    res.status(401).json({ error: "unauthorized" });
    return false;
  }
  return true;
};

const createMovie = async (req, res) => {
  const { title, description, runtimeMins } = req.body;
  if (!checkValidJWT(req, res)) {
    return;
  }

  const createdMovie = await prisma.movie.create({
    data: {
      title,
      description,
      runtimeMins,
    },
  });

  res.json({ data: createdMovie });
};

module.exports = {
  getAllMovies,
  createMovie,
};
