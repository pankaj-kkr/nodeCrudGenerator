const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { Email: username },
      include: User.associations.role,
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ data: user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });
    const refreshToken = jwt.sign(
      { data: user },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      }
    );

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
    });

    res.status(200).json({
      user,
      accessToken: token,
      refreshToken: refreshToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const refreshToken = async (req, res) => {
  const refreshToken = req?.cookies?.refreshToken;

  if (!refreshToken) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (!payload) {
      return res.status(403).json({ message: 'Invalid / Expired Token' });
    }

    const user = await User.findByPk(payload.data.id);

    if (user.refreshToken !== refreshToken)
      return res.status(403).json({ message: 'Forbidden' });

    const token = jwt.sign({ data: user }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: '1h',
    });
    const newRefreshToken = jwt.sign(
      { data: user },
      process.env.REFRESH_TOKEN_SECRET,
      {
        expiresIn: '7d',
      }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
    });

    res.status(200).json({
      user,
      accessToken: token,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    res.status(403).json({ message: error.message + 'Invalid refresh token' });
  }
};

const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findByPk(payload.userId);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
    });
    res.sendStatus(204);
  } catch (error) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
    });
    res.status(403).json({ message: 'Error logging out' + error.message });
  }
};

module.exports = { login, refreshToken, logout };
