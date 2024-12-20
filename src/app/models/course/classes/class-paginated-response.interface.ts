import { ClassResponseDto } from "./class-response.interface";

export interface ClassPaginatedResponse {
    classes: ClassResponseDto[];
    totalCount: number;
}