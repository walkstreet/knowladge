import { useState, useRef, createRef, useEffect, useMemo } from 'react';

export default function WithMemo() {
  const [count, setCount] = useState(1);
  const [val, setValue] = useState('');
  const expensive: number = useMemo(() => {
    // 加入此处是一段大量运算的逻辑，实现了只有依赖项count变化时才会重新触发。达到了性能优化的目的
    console.log('执行了');
    let sum = 0;
    for (let i = 0; i < count * 100; i++) {
      sum += i;
    }

    // 重点：return value
    return sum;
  }, [count]);

  return (
    <div>
      <h4>
        {count}-{val}-{expensive}
      </h4>
      <div>
        <button onClick={() => setCount(count + 1)}>+c1</button>
        <input value={val} onChange={(event) => setValue(event.target.value)} />
      </div>
    </div>
  );
}
