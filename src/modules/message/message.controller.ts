import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './../../common/decorators/user.decorator';
import { UpdateMsgDto } from './dtos/updateMessage.dto';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Delete('delete_msg')
  async deleteMessage(
    @Body() body: { messageId: string },
    @User('_id') currentUserId: string,
  ) {
    return this.messageService.deleteMessage(body.messageId, currentUserId);
  }

  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('msgImage'))
  async updateMessage(
    @Body() body: UpdateMsgDto,
    @Param('id') messageId: string,
    @User('_id') currentUserId: string,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.messageService.updateMsg(messageId, body, currentUserId, file);
  }
}
