import { MenuOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { arrayMoveImmutable } from 'array-move';
import React, { useEffect, useState } from 'react';
import type { SortableContainerProps, SortEnd } from 'react-sortable-hoc';
import {
  SortableContainer,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';

import type { DataType, TableProps } from './types';

import './index.less';

const DragHandle = SortableHandle(() => (
  <MenuOutlined style={{ cursor: 'grab', color: '#999' }} />
));

const columns: ColumnsType<DataType> = [
  {
    title: 'Name',
    dataIndex: 'name',
    className: 'drag-visible',
  },
  {
    title: 'Sort',
    dataIndex: 'sort',
    width: 30,
    className: 'drag-visible',
    render: () => <DragHandle />,
  },
];

const SortableItem = SortableElement(
  (props: React.HTMLAttributes<HTMLTableRowElement>) => <tr {...props} />,
);
const SortableBody = SortableContainer(
  (props: React.HTMLAttributes<HTMLTableSectionElement>) => (
    <tbody {...props} />
  ),
);

const DragTable: React.FC<TableProps> = ({ data, cb, ...restProps }) => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    setDataSource([...data]);
  }, []);

  const onSortEnd = ({ oldIndex, newIndex }: SortEnd) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        dataSource.slice(),
        oldIndex,
        newIndex,
      ).filter((el: DataType) => !!el);
      setDataSource(newData);
      if (cb) cb(newData);
    }
  };

  const DraggableContainer = (props: SortableContainerProps) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow: React.FC<any> = ({ ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex(
      (x) => x.key === restProps['data-row-key'],
    );
    return <SortableItem index={index} {...restProps} />;
  };

  return (
    <Table
      pagination={false}
      dataSource={dataSource.length !== 0 ? dataSource : data}
      columns={columns}
      components={{
        body: {
          wrapper: DraggableContainer,
          row: DraggableBodyRow,
        },
      }}
      {...restProps}
    />
  );
};

export default DragTable;
