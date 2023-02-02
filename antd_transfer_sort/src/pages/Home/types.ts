export interface DataType {
  key: string;
  name: string;
  index: number;
  title?: string;
}

export interface TableProps {
  data: DataType[];
  cb?: (keyArr: DataType[]) => void;
}

import type { TransferItem, TransferProps } from 'antd/es/transfer';
import type { ColumnsType } from 'antd/es/table/interface';

export interface TableTransferProps extends TransferProps<TransferItem> {
  dataSource: DataType[];
  leftColumns: ColumnsType<DataType>;
  rightColumns: ColumnsType<DataType>;
  direction: string;
}
