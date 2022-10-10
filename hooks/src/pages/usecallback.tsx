import React, { useState, memo, useCallback } from 'react';

const B: React.FC<any> = ({ onClick, name }) => {
  console.log('B渲染---------------');
  return <div onClick={onClick}>{name}</div>;
};

const MemoB = memo(B);

const A: React.FC<any> = ({ onClick, name }) => {
  console.log('A渲染-------------');
  return <div onClick={onClick}>{name}</div>;
};

export default function Comp() {
  const [dataA, setDataA] = useState(0);
  const [dataB, setDataB] = useState(0);

  const onClickA = () => {
    setDataA((pre) => pre + 1);
  };

  const onClickB = useCallback(() => {
    setDataB((pre) => pre + 1);
  }, []);

  return (
    <div>
      <A onClick={onClickA} name={`组件A：${dataA}`} />
      <MemoB onClick={onClickB} name={`组件B：${dataB}`} />
    </div>
  );
}
