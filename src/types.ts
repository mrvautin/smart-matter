export type MatterOptions = {
  type?: string;
  file?: string;
}

export type Matter = {
  matter?: string;
  hash?: string;
  dateObject?: Date;
  dateISO?: string;
  date?: string;
  lastupdated?: Date;
  title?: string;
  content?: string;
  file?: string;
  error?: string;
  empty: boolean;
  permalink: string;
  tags: string;
}