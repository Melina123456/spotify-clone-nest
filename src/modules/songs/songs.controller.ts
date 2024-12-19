import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song.dto';
import { Song } from './entities/song.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateSongDto } from './dto/update-song.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ArtistJwtGuard } from 'src/modules/auth/artists-jwt-guard';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

@Controller('songs')
@ApiTags('songs')
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Post()
  @UseGuards(ArtistJwtGuard)
  @ApiBearerAuth('JWT-auth')
  create(
    @Body() createSongDto: CreateSongDto,
    @Request() request,
  ): Promise<Song> {
    console.log('request.user', request.user);
    return this.songsService.create(createSongDto);
  }

  @Get()
  @ApiOperation({ summary: 'fetch all the songs' })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'give page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'give page size',
  })
  @ApiOkResponse({
    description: 'list of songs found successfully',
    type: CreateSongDto,
    isArray: true,
  })
  @ApiNotFoundResponse({
    description: 'Songs not found',
  })
  @ApiBadRequestResponse({ description: 'Invalid data provided' })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ): Promise<Pagination<Song>> {
    limit = limit > 100 ? 100 : limit;
    return (
      this,
      this.songsService.paginate({
        page,
        limit,
      })
    );
  }

  @Get(':id')
  findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ): Promise<Song> {
    return this.songsService.findOne(id);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.songsService.remove(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateSongDto: UpdateSongDto,
  ): Promise<UpdateResult> {
    return this.songsService.update(id, UpdateSongDto);
  }
}
