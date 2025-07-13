import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from '../providers/fileCloudServices/cloudinary.provider';
import {
  v2 as Cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class FilesService {
  constructor(
    @Inject(CLOUDINARY) private cloudinaryProvider: typeof Cloudinary,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    return new Promise((res, rej) => {
      this.cloudinaryProvider.uploader
        .upload_stream(options, (error, result) => {
          if (error) rej(error);
          else if (result) res(result);
          else rej(new Error('Upload failed: result is undefined'));
        })
        .end(file.buffer);
    });
  }
}
