import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'live_url',
})
export class LiveUrl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({
    default: true,
    name: 'is_active',
  })
  isActive: boolean;
}
