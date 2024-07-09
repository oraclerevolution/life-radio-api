import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity({
    name: 'programmes',
})
export class Programme {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    day: string;

    @Column()
    startingHour: string;

    @Column()
    endingHour: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
