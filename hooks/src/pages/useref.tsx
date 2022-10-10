import { useState, useRef, createRef, useEffect } from 'react';

// 看useRef和createRef的效果
// export default function UseRefDemoa() {
//   const [renderIndex, setRenderIndex] = useState(1);
//   const refFromUseRef = useRef<number | null>(null);
//   const refFromCreateRef: any = createRef<HTMLDivElement>();
//   if (!refFromUseRef.current) {
//     refFromUseRef.current = renderIndex;
//   }
//   if (!refFromCreateRef.current) {
//     refFromCreateRef.current = renderIndex;
//   }
//   return (
//     <div ref={refFromCreateRef} className="demoa">
//       <div className="item_title">当前的index是: {renderIndex}</div>
//       <div className="item_title">
//         使用useRef来获取renderIndex:{refFromUseRef.current}
//       </div>
//       <div className="item_title">
//         使用createRef来获取renderIndex:{refFromCreateRef.current}
//       </div>
//       <button
//         style={{ marginLeft: 0 }}
//         onClick={() => setRenderIndex((prev) => prev + 1)}
//       >
//         点击让renderIndex加1
//       </button>
//     </div>
//   );
// }

// useRef拿上一个值
export default function UseRefDemod() {
  const [renderIndex, setRenderIndex] = useState(1);
  const ref = useRef<number | null>(null);
  useEffect(() => {
    ref.current = renderIndex;
  });

  return (
    <div className="demoa">
      <span className="item_title">当前的index是: {renderIndex}</span>
      <span className="item_title">上一个index是: {ref.current}</span>
      <button
        style={{ marginLeft: 0 }}
        onClick={() => setRenderIndex((prev) => prev + 1)}
      >
        点击让renderIndex加1
      </button>
    </div>
  );
}
