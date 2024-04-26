import { ReplayPlaylist } from 'src/replay-playlist/entities/replay-playlist.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'replay',
})
export class Replay {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titre: string;

  @Column()
  audio: string;

  @Column()
  duration: string;

  @Column()
  image: string;

  @ManyToOne(() => ReplayPlaylist, (playlist) => playlist.id)
  playlist: ReplayPlaylist;
}
