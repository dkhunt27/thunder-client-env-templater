export type TemplateVariablesType = {
  name: string;
  data: VariableType[];
};

export type ProcessedVariablesType = {
  _id: string;
  name: string;
  default: boolean;
  sortNum: number;
  created: string;
  modified: string;
  data: VariableType[];
};

export type VariableType = {
  name: string;
  value: string;
};

export type ConfigType = {
  thunderClientEnvironmentFileDir: string;
  awsRegion: string;
  templateFiles: string[];
};
