import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'videos',
})
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ytb_url: string;

  @Column()
  title: string;
}
