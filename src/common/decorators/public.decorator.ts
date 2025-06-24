import { SetMetadata } from '@nestjs/common';

export function Public() {
  return SetMetadata('isPublic', true);
}
