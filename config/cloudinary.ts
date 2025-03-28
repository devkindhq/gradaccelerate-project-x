
import Env from '@ioc:Adonis/Core/Env'
import { v2 as Cloudinary } from 'cloudinary'

Cloudinary.config({
  cloud_name: Env.get('CLOUDINARY_CLOUD_NAME'),
  api_key: Env.get('CLOUDINARY_API_KEY'),
  api_secret: Env.get('CLOUDINARY_API_SECRET'),
  secure: true,
})

export default Cloudinary