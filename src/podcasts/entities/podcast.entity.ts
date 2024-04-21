import { PodcastsPlaylist } from 'src/podcasts-playlist/entities/podcasts-playlist.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'podcasts',
})
export class Podcasts {
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

  @ManyToOne(() => PodcastsPlaylist, (playlist) => playlist.id)
  playlist: PodcastsPlaylist;
}
