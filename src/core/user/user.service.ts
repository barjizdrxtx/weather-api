import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./user.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {

  constructor(

    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }


  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ email }).exec();
  }
}



