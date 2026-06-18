export type DataSourceCategory = 'school' | 'additional';

export type DataSourceBadgeItem = {
  id: string;
  raw: string;
  name: string;
  description?: string;
  url?: string;
  collectionYear?: number;
  category: DataSourceCategory;
  clickable: boolean;
};

export type DataSourceGroups = {
  school: DataSourceBadgeItem[];
  additional: DataSourceBadgeItem[];
};
