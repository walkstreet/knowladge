import { Button, Table, Transfer } from 'antd';
import type { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import {
  TransferDirection,
  TransferItem,
  TransferListProps,
} from 'antd/es/transfer';
import difference from 'lodash/difference';
import React, { useState } from 'react';

import DragTable from './table';

import type { DataType, TableTransferProps } from './types';

const mockData: DataType[] = Array.from({ length: 20 }).map((_, i) => ({
  key: i.toString() as string,
  name: `Category ${i.toString()}`,
  index: i,
}));

const originTargetKeys: string[] | (() => string[]) = [];

const tableColumns: ColumnsType<DataType> = [
  {
    dataIndex: 'name',
    title: 'Name',
  },
];

const TransferAdmin: React.FC = () => {
  const [targetKeys, setTargetKeys] = useState<string[]>(originTargetKeys);

  const onChange = (nextTargetKeys: string[]) => {
    setTargetKeys(nextTargetKeys);
  };

  const renderFooter = (
    _: TransferListProps<any>,
    {
      direction,
    }: {
      direction: TransferDirection;
      [keyName: string]: TransferDirection;
    },
  ) =>
    direction === 'right' && (
      <Button block type="link" onClick={() => alert('11')}>
        Add new category
      </Button>
    );

  // Customize Table Transfer
  const TableTransfer = ({
    leftColumns,
    rightColumns,
    ...restProps
  }: TableTransferProps) => (
    <Transfer {...restProps} titles={['', 'Sort']} footer={renderFooter}>
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys: listSelectedKeys,
      }) => {
        const columns = direction === 'left' ? leftColumns : rightColumns;

        const onRowHandler = ({ key }) => ({
          onClick: () => {
            onItemSelect(
              key as string,
              !listSelectedKeys.includes(key as string),
            );
          },
        });

        const rowSelection: TableRowSelection<TransferItem> = {
          onSelectAll(selected, selectedRows) {
            const treeSelectedKeys = selectedRows
              .filter((item) => !item.disabled)
              .map(({ key }) => key);
            const diffKeys = selected
              ? difference(treeSelectedKeys, listSelectedKeys)
              : difference(listSelectedKeys, treeSelectedKeys);
            onItemSelectAll(diffKeys as string[], selected);
          },
          onSelect({ key }, selected) {
            onItemSelect(key as string, selected);
          },
          selectedRowKeys: listSelectedKeys,
        };

        if (direction === 'left') {
          return (
            <Table
              size="small"
              pagination={false}
              dataSource={filteredItems}
              rowSelection={rowSelection}
              columns={columns}
              onRow={onRowHandler}
            />
          );
        }
        return (
          <DragTable
            pagination={false}
            data={filteredItems}
            rowSelection={rowSelection}
            rowKey="key"
            onRow={onRowHandler}
            cb={(keyArr) => {
              console.log(keyArr);
            }}
          />
        );
      }}
    </Transfer>
  );

  return (
    <>
      <TableTransfer
        dataSource={mockData}
        targetKeys={targetKeys}
        onChange={onChange}
        leftColumns={tableColumns}
        rightColumns={tableColumns}
      />
    </>
  );
};

export default TransferAdmin;
