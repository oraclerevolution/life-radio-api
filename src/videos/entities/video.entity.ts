import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'videos',
})
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ytb_url: string;

  @Column({
    default: true,
    nullable: true,
  })
  status: boolean;

  @Column()
  title: string;
}
