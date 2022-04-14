const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwtSecret = 'mysecret';

const saltRounds = 10;

const register = async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = bcrypt.hashSync(password, saltRounds)

    const createdUser = await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword
        }
    });
    delete createdUser.password
    res.json({ data: createdUser });
};

const login = async (req, res) => {
    const { username, password } = req.body;

    const foundUser = await prisma.user.findFirst({
        where: {
            username: username
        }
    });

    if (!foundUser) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const passwordsMatch = bcrypt.compareSync(password, foundUser.password);

    if (!passwordsMatch) {
        return res.status(401).json({ error: 'Invalid username or password.' });
    }

    const token = jwt.sign({username: username}, jwtSecret);

    res.json({ data: token });
};

module.exports = {
    register,
    login
};