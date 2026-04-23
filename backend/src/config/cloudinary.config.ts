import {config} from '../config/env.config.js';

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: config.cloudinary.cloudName!,
  api_key: config.cloudinary.apiKey!,
  api_secret: config.cloudinary.apiSecret!,
});

export default cloudinary;