import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Parcel } from 'src/parcel/entities/parcel.entity';
import { Profile } from 'src/profile/entities/profile.entity';
import {
  Column,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entity } from 'typeorm/decorator/entity/Entity';

export enum Role {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
  COURIER = 'courier',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  password: string;
  @Column()
  email: string;
  @Column({ type: 'enum', enum: Role, default: Role.CUSTOMER })
  role: Role;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
  @OneToOne(() => Profile, (profile) => profile.user)
  @JoinColumn({ name: 'profileId' })
  profile: Profile;
  @Column({ nullable: true })
  profileId: number;
  @OneToMany(() => Parcel, (parcel) => parcel.sender)
  parcels: Parcel[];
  @OneToMany(() => Parcel, (parcel) => parcel.courier)
  deliveries: Parcel[];
  @OneToMany(() => Feedback, (feedback) => feedback.sender)
  sentFeedback: Feedback[];
  @OneToMany(() => Feedback, (feedback) => feedback.courier)
  receivedFeedback: Feedback[];
}
