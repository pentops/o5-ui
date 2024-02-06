export interface KeyBase {
  service: string;
  scope: string;
  entity?: 'list' | 'detail';
}
