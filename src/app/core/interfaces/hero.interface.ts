export interface Hero {
  id: number;
  name: string;
  image: string;
  team: string;
  description?: string;
  powers?: string[];
  firstAppearance?: number;
  realName?: string;
  rating?: number;
}
