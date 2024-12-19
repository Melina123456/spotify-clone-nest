import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Song } from '../songs/entities/song.entity';
import { User } from '../users/entities/user.entity';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  //Each playlist will have multiple songs

  @OneToMany(() => Song, (song) => song.playList)
  songs: Song[];

  //  Many playlist can belong to a single unique user

  @ManyToOne(() => User, (user) => user.playLists)
  user: User;
}
