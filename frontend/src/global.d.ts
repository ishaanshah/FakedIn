declare type User = {
  userType: "applicant" | "recruiter" | "unknown";
  name: string;
  email: string;
  education?: Array<{
    institutionName: string;
    startYear: number;
    endYear?: number;
  }>;
  skills?: Array<string>;
  bio?: string;
  contact?: string;
};
