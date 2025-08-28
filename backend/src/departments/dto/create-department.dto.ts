import { IsNotEmpty } from "class-validator";
import { UniqueDepName } from "../validators/uniqieName.decorator";

export class CreateDepartmentDto {
  @IsNotEmpty()
  @UniqueDepName()
  name: string;
}
