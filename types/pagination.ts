export type OnPageChangeFnType = (offset: number, limit: number) => void;

export interface LaunchResponseType {
  currentPage?: number;
  totalItems?: number;
  limit?: number;
  onPageChange?: OnPageChangeFnType;
  buttonClass?: string;
};