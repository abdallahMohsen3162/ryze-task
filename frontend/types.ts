interface PaginationMetadata{
  total: number;
  page: number;
  lastPage: number;
}


interface PaginationResponse<T> {
  data: T[];
  meta: PaginationMetadata;
}


interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hireDate: string;
  department?: Department;
}


interface Department {
  id: number;
  name: string;
}
