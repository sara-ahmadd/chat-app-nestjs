import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY = 'CLOUDINARY';

export const Cloudinary = {
  provide: CLOUDINARY,
  useFactory: (configService: ConfigService) => {
    cloudinary.config({
      cloud_name: configService.get('CLOUD_NAME'),
      api_key: configService.get('CLOUD_API_KEY'),
      api_secret: configService.get('CLOUD_API_SECRET'),
    });
    return cloudinary;
  },
  inject: [ConfigService],
};
