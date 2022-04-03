export interface HierarchyData<T> {
  data: T;
  level: number;
  state: "collapsed" | "expanded";
  hasChild: boolean;
}
