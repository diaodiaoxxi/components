
export interface MenuInfo {
  uuid: string;  // 菜单唯一序列号
  title: string;  // 菜单显示名称
  children?: MenuInfo[]; // 子级菜单项列表，目前只支持包含自身在内，层级深度为3层
  favourItemList: MenuInfo[]; // 菜谱菜单侧边栏第一级菜单项下，收藏的子级菜单项列表
  isCanFavour: boolean; // 是否为可收藏项
}

// appSystemList
export interface SystemInfo {
  uuid: string;  // 子系统唯一序列号
  title: string;  // 子系统显示名称
  children: MenuInfo[];
}


