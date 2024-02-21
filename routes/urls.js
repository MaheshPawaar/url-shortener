import express from 'express';
import { nanoid } from 'nanoid';
import Url from '../models/Url.js';
import { validateUrl } from '../utils/utils.js';
import dotenv from 'dotenv';
dotenv.config({ path: '../config/.env' });
const router = express.Router();

// Short URL Generator
router.post('/short', async (req, res) => {
  const { originalUrl } = req.body;
  const base = process.env.BASE;

  const urlId = nanoid();

  // Validate original URL
  if (validateUrl(originalUrl)) {
    try {
      let url = await Url.findOne({ originalUrl });
      if (url) {
        // send url
        res.json(url);
      } else {
        // if url is not found, create short url and save to db
        const shortUrl = `${base}/${urlId}`;

        url = new Url({
          originalUrl,
          shortUrl,
          urlId,
          date: new Date(),
        });

        await url.save();
        res.json(url);
      }
    } catch (error) {
      console.log(error);
      res.status(500).json('Server Error');
    }
  } else {
    res.status(400).json('Invalid Original URL');
  }
});

export default router;
