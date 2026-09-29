import { Body, Controller, Delete, Get, Param, Post, Query, Sse, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer'
import { extname } from 'path'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { ChatService } from './chat.service'
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard'
import { CurrentUser } from '../common/decorators/current-user.decorator'
import { AuthenticatedUser } from '../common/types/authenticated-user.type'

@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService, private readonly jwt: JwtService, private readonly config: ConfigService) {}

  @Get('contacts') @UseGuards(JwtAuthGuard)
  contacts(@CurrentUser() user: AuthenticatedUser) { return this.chat.contacts(user.userId) }

  @Get('conversations') @UseGuards(JwtAuthGuard)
  conversations(@CurrentUser() user: AuthenticatedUser) { return this.chat.listConversations(user.userId) }

  @Post('conversations') @UseGuards(JwtAuthGuard)
  createConversation(@CurrentUser() user: AuthenticatedUser, @Body('userId') otherUserId: string) { return this.chat.createConversation(user.userId, otherUserId) }

  @Get('conversations/:id/messages') @UseGuards(JwtAuthGuard)
  messages(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) { return this.chat.getMessages(id, user.userId) }

  @Post('conversations/:id/messages') @UseGuards(JwtAuthGuard)
  send(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser, @Body() body: { text?: string; attachmentUrl?: string; attachmentType?: string }) {
    return this.chat.send(id, user.userId, body.text, body.attachmentUrl, body.attachmentType)
  }

  @Delete('messages/:id') @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) { return this.chat.removeMessage(id, user.userId) }

  @Post('upload') @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: diskStorage({ destination: './uploads', filename: (_req, file, cb) => cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(file.originalname)}`) }), limits: { fileSize: 8 * 1024 * 1024 } }))
  upload(@UploadedFile() file: any) {
    return { url: `/uploads/${file.filename}`, type: file.mimetype.startsWith('image/') ? 'image' : 'file', name: file.originalname }
  }

  @Sse('events')
  events(@Query('token') token: string) {
    const payload = this.jwt.verify(token, { secret: this.config.get<string>('jwt.accessSecret') })
    return this.chat.streamFor(payload.sub)
  }
}
