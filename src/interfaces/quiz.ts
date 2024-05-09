export interface Alternative {
  id: string;
  text: string;
}

export interface Question {
  id: string;
  question: string;
  alternatives: Alternative[];
}

export interface Quiz {
  _id: string;
  code: string;
  name: string;
  description: string;
  lauchDate: Date;
  questions: Question[];
}

export interface Answer {
  questionId?: string;
  value: string;
  endTimestamp: number;
  startTimestamp: number;
}
