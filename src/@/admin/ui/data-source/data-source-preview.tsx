import { useStore } from "effector-react";
import { useEffect } from "react"

import { Div, FloatButton } from "~/@/common/style/styled-component-style"

import { clearDataSourcePreview, onPreviewDataSource } from "../../models/data-source-model";
import { $adminMap } from "~/@/common/admin-map-preview/admin-map.model";
import AdminMap from "~/@/common/admin-map-preview/admin-map";

export default function DataSourcePreview({ selectedRowsData }: { selectedRowsData: any }) {
  const map = useStore($adminMap);

  useEffect(() => {
    if (!map) return;
    onPreviewDataSource(selectedRowsData);
  }, [selectedRowsData, map])

  useEffect(() => clearDataSourcePreview, []);

  return <Div $height="calc(100vh - 10.7rem)">
    <AdminMap />
  </Div>
}