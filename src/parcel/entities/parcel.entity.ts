import { User } from 'src/users/entities/user.entity';
import { Column, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

@Entity()
export class Parcel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;
  @Column()
  weight: number;
  @Column()
  destinationAddress: string;
  @Column()
  recipientId?: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  @Column()
  status: string;
  @ManyToOne(() => User, (user) => user.parcels)
  @JoinColumn({ name: 'senderId' })
  sender: User;
  @Column()
  senderId: number;
  @ManyToOne(() => User, (user) => user.deliveries, { nullable: true })
  @JoinColumn({ name: 'courierId' })
  courier: User;
}
