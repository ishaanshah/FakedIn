import {
  prop,
  Ref,
  getModelForClass,
  DocumentType,
  isDocument,
  index,
} from "@typegoose/typegoose";
import { Job } from "./Job";
import { User } from "./User";

@index({ applicant: 1, job: 1 }, { unique: true })
export class Application {
  @prop({ required: true, ref: "User" })
  public applicant!: Ref<User>;

  @prop({ required: true, ref: "Job" })
  public job!: Ref<Job>;

  @prop({ required: true, maxlength: 250 })
  public sop!: string;

  @prop({ required: true, default: () => new Date() })
  public appliedOn?: Date;

  @prop({ required: true, default: "applied" })
  public status?:
    | "applied"
    | "shortlisted"
    | "rejected"
    | "accepted"
    | "inactive";

  public async getApplicantDetails(this: DocumentType<Application>) {
    await this.populate("applicant").execPopulate();

    if (isDocument(this.applicant)) {
      return {
        name: this.applicant.name,
        education: this.applicant.education,
        skills: this.applicant.skills,
        rating: this.applicant.rating,
      };
    }
  }

  public async getJobDetails(this: DocumentType<Application>) {
    await this.populate("job").execPopulate();

    if (isDocument(this.job)) {
      return {
        postedBy: this.job.postedBy,
      };
    }
  }
}

const ApplicationModel = getModelForClass(Application, {
  schemaOptions: {
    collection: "applications",
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
});
export default ApplicationModel;
