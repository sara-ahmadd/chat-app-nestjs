import { Global, Module } from '@nestjs/common';
import { Cloudinary } from './fileCloudServices/cloudinary.provider';

@Global()
@Module({
  providers: [Cloudinary],
  exports: [Cloudinary],
})
export class CloudinaryModule {}
