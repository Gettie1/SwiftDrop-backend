export type mail = {
  subject: string;
  recipients: string | string[];
  template: string;
  context: Record<string, any>;
};
