import { Buffer } from 'buffer';
import { v4 as uuid } from 'uuid';

export function base64ToMulterFile(
  base64: string,
  filename = 'image.png',
): Express.Multer.File {
  const [meta, data] = base64.split(',');
  const mimeMatch = meta.match(/data:(.*);base64/);
  const mimetype = mimeMatch ? mimeMatch[1] : 'application/octet-stream';

  const buffer = Buffer.from(data, 'base64');

  const multerFile: Express.Multer.File = {
    fieldname: 'file',
    originalname: filename,
    encoding: '7bit',
    mimetype,
    size: buffer.length,
    buffer,
    destination: '',
    filename: uuid() + '-' + filename,
    path: '',
    stream: null as any, // optional, not needed unless you're piping
  };

  return multerFile;
}
