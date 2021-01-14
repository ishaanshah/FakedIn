import {
  DocumentType,
  pre,
  prop,
  index,
  getModelForClass,
} from "@typegoose/typegoose";
import * as bcrypt from "bcrypt";

@index({ email: 1 }, { unique: true })
@pre<User>("save", async function (next) {
  // Hash the password
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  next();
})
export class User {
  @prop({ required: true })
  public userType!: "recruiter" | "applicant" | "unknown";

  @prop({ required: true })
  public name!: string;

  @prop({ required: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @prop()
  public profilePhoto?: string;

  @prop()
  public skills?: Array<string>;

  @prop()
  public resume?: string;

  @prop()
  public bio?: string;

  public async isPasswordValid(this: DocumentType<User>, password: string) {
    return await bcrypt.compare(password, this.password);
  }
}

const UserModel = getModelForClass(User, {
  schemaOptions: { collection: "users" },
});
export default UserModel;
