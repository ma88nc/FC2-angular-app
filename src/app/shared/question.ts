import { Tag } from "../shared/tag";

export class Question {
/*     Domain: number;
    QuestionID: string;
    TitleDescription: string;
    QuestionText: string;
    Answer: string;
    HasImage: boolean;
    ImagePath: string; */
    domainId: number;
    questionId: string;
    titleId: number;
    titleDescription: string;
    questionText: string;
    answer: string;
    hasImage: boolean;
    imagePath: string;
    isActive: boolean;
    reference: string;
    dateAdded: Date;
    timeMultiplier: number;
    questionTags: Tag[];
}