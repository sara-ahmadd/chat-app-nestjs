import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from '../providers/cloudinary.provider';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class FilesService {
  constructor(
    @Inject(CLOUDINARY) private cloudinaryProvider: typeof cloudinary,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    options: UploadApiOptions,
  ): Promise<UploadApiResponse> {
    const response = await this.cloudinaryProvider.uploader.upload(
      file.path,
      options,
    );
    return response;
  }
}
