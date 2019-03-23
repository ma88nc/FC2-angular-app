import { Question } from "../shared/question";

export class TestQuestion extends Question
{
    OrderInTest: number;
    UserAnswer: string;
    IsCorrect: boolean;    
}