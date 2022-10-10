import * as React from 'react';

const MemoFunc = (props: any) => {
  console.log('render memo');
  return <div>{props.num}</div>;
  // return <div>{props?.obj?.num}</div>;
};

export default React.memo(MemoFunc);
