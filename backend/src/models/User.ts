import {
  DocumentType,
  pre,
  prop,
  index,
  getModelForClass,
  Ref,
} from "@typegoose/typegoose";
import { Job } from "./Job";
import bcrypt from "bcrypt";
import { Application } from "./Application";

class Education {
  @prop({ required: true })
  public institutionName!: string;

  @prop({ required: true, min: 0 })
  public startYear!: number;

  @prop({
    validate: {
      validator: function (endYear: number) {
        const entry = this as any;
        if (entry.startYear) {
          return !!(endYear >= entry.startYear);
        }
        return true;
      },
      message: "End year should be smaller than start year.",
    },
    min: 0,
  })
  public endYear?: number;
}

@index({ email: 1 }, { unique: true })
@pre<User>("save", async function (next) {
  // Don't rehash the password if it's not updated
  if (!this.isModified("password")) {
    return next();
  }
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

  @prop({ required: true, minlength: 8 })
  public password!: string;

  @prop({
    required: function () {
      return (this as any).userType === "applicant";
    },
    validate: {
      validator: function (value: Array<Education>) {
        if ((this as any).userType === "applicant") {
          return value.length > 0;
        }
        return true;
      },
      message: "You should have atleast one education entry.",
    },
    type: () => [Education],
  })
  public education?: Array<Education>;

  @prop({
    required: function () {
      return (this as any).userType === "applicant";
    },
    validate: {
      validator: function (value: Array<string>) {
        if ((this as any).userType === "applicant") {
          return value.length > 0;
        }
        return true;
      },
      message: "Mention atleast one skill.",
    },
    type: () => [String],
  })
  public skills?: Array<string>;

  public resume?: string;

  @prop({
    required: function () {
      return (this as any).userType === "recruiter";
    },
  })
  public bio?: string;

  @prop({
    required: function () {
      return (this as any).userType === "recruiter";
    },
    minlength: 10,
  })
  public contact?: string;

  @prop({ required: true, default: 0, min: 0, max: 5 })
  public rating?: number;

  @prop({ ref: "Application", foreignField: "applicant", localField: "_id" })
  public applications?: Array<Ref<Application>>;

  @prop({ ref: "Job", foreignField: "postedBy", localField: "_id" })
  public jobsPosted?: Array<Ref<Job>>;

  public async isPasswordValid(this: DocumentType<User>, password: string) {
    return await bcrypt.compare(password, this.password);
  }

  public async getJobsPosted(this: DocumentType<User>) {
    await this.populate("jobsPosted").execPopulate();
    return this.jobsPosted;
  }

  public async getAppliedJobs(this: DocumentType<User>) {
    await this.populate("applications").execPopulate();
    return this.applications;
  }
}

const UserModel = getModelForClass(User, {
  schemaOptions: { collection: "users" },
});
export default UserModel;
