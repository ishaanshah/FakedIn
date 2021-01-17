import {
  DocumentType,
  isDocument,
  prop,
  getModelForClass,
  Ref,
} from "@typegoose/typegoose";
import { User } from "./User";

export class Job {
  @prop({ required: true })
  public title!: string;

  @prop({ required: true, ref: "User" })
  public postedBy!: Ref<User>;

  @prop({ required: true, ref: "User" })
  public applicants!: Array<Ref<User>>;

  @prop({ required: true, min: 0 })
  public maxApplicants!: number;

  @prop({ required: true, min: 0 })
  public positions!: number;

  @prop({ required: true })
  public postedOn!: Date;

  @prop({
    required: true,
    validate: {
      validator: function (value: Date) {
        const postedOn = (this as any).postedOn;
        if (postedOn) {
          return value >= postedOn;
        } else {
          return value >= new Date();
        }
      },
      message: "Deadline should be a date in the future",
    },
  })
  public deadline!: Date;

  @prop({
    required: true,
    validate: {
      validator: function (value: Array<string>) {
        return value.length > 0;
      },
      message: "Mention atleast one required skill.",
    },
    type: () => [String],
  })
  public skillsRequired!: Array<string>;

  @prop({ required: true })
  public jobType!: "full" | "part" | "home";

  @prop({ required: true, max: 7, min: 0 })
  public duration!: number;

  @prop({ required: true, min: 0 })
  public salary!: number;

  @prop({ required: true, min: 0, max: 5 })
  public rating!: number;

  public async getPosterDetails(this: DocumentType<Job>) {
    await this.populate("postedBy").execPopulate();

    if (isDocument(this.postedBy)) {
      return {
        email: this.postedBy.email,
        contact: this.postedBy.contact,
        name: this.postedBy.name,
      };
    }
  }

  public getApplicants(this: DocumentType<Job>) {
    return this.populate("applicants");
  }
}

const JobModel = getModelForClass(Job, {
  schemaOptions: { collection: "jobs" },
});
export default JobModel;
