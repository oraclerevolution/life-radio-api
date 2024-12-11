import { ActualiteCategory } from 'src/actualite-category/entities/actualite-category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'actualites',
})
export class Actualites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  titre: string;

  @Column()
  contenu: string;

  @Column({ nullable: true })
  image: string;

  @ManyToOne(() => ActualiteCategory, (category) => category.id)
  category: ActualiteCategory;

  @Column({ default: true, nullable: true })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
