## PureComponent
- PureComponent是一个组件，如果某一个组件继承自该组件，则该组件的shouldComponentUpdate会进行优化，对属性和状态进行浅比较，对属性和状态惊醒浅比较，如果相等则不会重新渲染
- 浅比较state，必须要用class形式。hooks形式：React.memo()
- React.PureComponent中的shouldComponentUpdate()       将跳过所有子组件树的prop更新，所以子组件也必须确保都是纯组件

### 示例
```jsx
// 父组件
import React, { Component, PureComponent } from 'react';
import MemoFunc from './memo';
 
export default class PuComponent extends PureComponent {
    readonly state;
    constructor(props: any) {
        super(props);
        this.state = {
            count: 0,
            obj: {
                num: 0,
            },
        };
    }
    changeCount = () => {
        this.setState({
            count: 100,
        });
    };
    changeObjNum = () => {
        this.setState({
            obj: {
                num: 100,
            },
        });
    };
    render() {
        console.log('render');
        const {
            count,
            obj: { num },
        } = this.state;
        return (
            <div>
                <h3>PureComponent</h3>
                <button onClick={this.changeCount}>{count}</button>
                <button onClick={this.changeObjNum}>{num}</button>
                <MemoFunc num={num} />
 
                {/*传入一个多层的obj*/}
                {/*<MemoFunc  num={this.state} />*/}
            </div>
        );
    }
}
 
// 子组件。父组件传入num作为子组件的props，然后看效果
import * as React from 'react';
 
const MemoFunc = (props: any) => {
    console.log('render memo');
    return <div>{props.num}</div>;
 
    // 传入一个多层的obj
    // return  <div>{props?.obj?.num}</div>; 
};
 
export default React.memo(MemoFunc);
```

### PureComponent修改state的效果
  - 父组件
    - PureComponent会进行浅比较，如果state.count变了后会触发render，但是第二次点击count按钮时，不会再次触发了
    - num按钮因为是obj，浅比较只比较一层，导致无法确认内部是否改变，最后每次点击都会触发render
  - 子组件
    - count不会导致子组件打印"render        memo"
    - num第一次接收到了100的值后会触发render，后续点击num的值不变，所以不会再触发render，也就是不会打印log了
    - 如果父组件传入的是父组件的整个状态结构，那props超出浅比较的层级，会反复render的

### Component修改state的效果
  - 父组件
    - 不做浅比较，点击就render，然后打印log
  - 子组件
    - 父非Pure子Pure
      - 效果同父组件效果
    - 父非Pure子非Pure
      - 每次点击全量组件都会render，性能问题明显

### Function Component怎么写PureComponent
使用React.memo()制作纯组件
```jsx
//　以task函数组件为例
function Task(props)  {
   console.log("task render");
   return <li  className={props.isFinish ? "isfinish" : ""}>{props.name}</li>;
}

Task.propTypes = {
   isFinish: PropTypes.bool,
   name: PropTypes.string
};

export default React.memo(Task);

// memo其实就是一个高阶组件
/* function Memo(Comp){
     return class MemoWrap extends  PureComponent {
          render(){ 
              return <Comp  {...this.props}/> 
          }
     }
}
*/
```

### 注意
- 进行的是浅比较
  1. 为了效率，应该尽量使用PureComponent
  2. 要求不要改动之前的状态，永远是创建心得状态覆盖之前的状态（Immutable,不可变对象）
  3. 有一个第三方js库，Immutable.js，专门用于制作不可变对象
 
## React hooks

### useEffect
  - 隔离副作用
  - useEffect(()=>{},       [])，只会在组件mount时执行一次
  - 第一个参数是func，不能使用async，如果使用会报warning
  - 只有某个变量更新后，需要重新执行useEffect的情况，才需要将该变量添加到useEffect的依赖数组中
  - 不建议依赖数组里放props

### useCallback
- 特点：
  - useCallback和React.memo必须结合使用，否则白用！子组件是memo，父组件是使用useCallback
  - useCallback第一个参数是一个函数，返回一个       memoized 回调函数
  - 只有当第二个参数也就是依赖项发生变化的情况下，memoized       回调函数才会更新，否则将会指向同一块内存区域。 这种情况通常用在子组件中，比如把memoized       回调函数传给子组件后，子组件就可以通过shouldComponentUpdate或者React.memo来避免不必要的更新。
  - 使用上要注意，一个父组件，多个子组件，如：A，B两个组件，B组中传入父组件的时间handler函数，并对handler函数包一层useCallback，这样A组件更新时不会影响B组件更新，只有B组件点击事件发生时才会触发A，B两个组件更新 

### useMemo
- 特点：
  - 纯函数，返回了memoized的值
  - 如果没有提供依赖项数组，useMemo       在每次渲染时都会计算新的值
  - 不要在这个函数内部执行与渲染无关的操作，如：副作用useEffect
  - 只针对某个依赖参数进行view层更新，避免高开销的计算
  - 看demo方便理解

### 重点：
- useCallback(fn,  deps) === useMemo(() => fn, deps))
useRef(useRef和createRef) 
- 两者是有区别的：
  - useRef 在 react hook 中的作用,       正如官网说的, 它像一个变量, 类似于 this , 它就像一个盒子, 你可以存放任何东西.
  - createRef 每次渲染都会返回一个新的引用，而 useRef 每次都会返回相同的引用(persist)。
- 其中关键点在于：
  - useRef获取引用是实时的，createRef获取引用是不变的，再举个例子来加深理解。
- 总结：
  - createRef类似一个obj，使用时只是一种引用关系，并且不会在函数重新执行后改变引用
  - useRef可以拿到上一个值。原理先要理解hooks的生命周期。

### 方便理解

```jsx
// 这个类似useRef，每次点击事件触发，都会重新渲染组件，并拿到点击当时的值
const handleClick = (renderIndex) => {
    setTimeout(() => {
        alert(renderIndex)
    }, 3000)
}
let renderIndex = 1;
handleClick(renderIndex);
renderIndex = 2;
handleClick(renderIndex);
renderIndex = 3;
handleClick(renderIndex);
renderIndex = 4;
renderIndex = 5;
renderIndex = 6;
 
// 这个类似createRef，实时拿到最新的值
let obj = {};
obj.renderIndex = 0;
const handleClick = () => {
    setTimeout(() => {
        alert(obj.renderIndex)
    }, 3000)
}
obj.renderIndex = 1;
handleClick(obj.renderIndex);
obj.renderIndex = 2;
handleClick(obj.renderIndex);
obj.renderIndex = 3;
handleClick(obj.renderIndex);
obj.renderIndex = 4;
obj.renderIndex = 5;
obj.renderIndex = 6;
```

### useRef为啥可以拿到上一次值？

- 首先理解一下React-Hooks的生命周期：
  - 函数组件被调用 -> 执行代码 ->根据return的JSX渲染DOM ->  执行useEffect -> 函数组件被重新调用 -> 执行代码 -> 根据return的JSX重新渲染DOM ->  执行useEffect。（循环往复）
  - 接下来拆解一下：
- 第一次UseRefDemod被执行，参数renderIndex为1，ref.current先是undefined  （因为这时useEffect还没有被调用），然后根据return的JSX，渲染DOM，页面上被渲染出ref.current的值 ->  undefined，接着 useEffect被调用，此时ref 的current值被赋值，也就是1。
- 第二次UseRefDemod执行，参数renderIndex为2，ref.current先是undefined，然后return  JSX渲染DOM，页面上本渲染出的ref.current为1（此时还没有被赋值）,接着useEffect调用，此时ref.current才会被赋值为2，但是已经渲染出来了，不会再变的，页面上就还是上一次的1，也就是上一次的值。
- 总结一下为什么用useRef能拿到上一次的值：
  1. useRef保持引用不变；
  2. 函数式组件的声明周期决定，jsx的渲染比useEffect早；
  3. 手动修改ref.current并不会触发组件的重新渲染；
- 用处：
  1. 替代shouldComponentUpdate生命周期，自定义一个hooks
  2. 用在定时器

```jsx
import { useRef, useEffect } from 'react'

const usePrevious = (value) => {
    const ref = useRef();
    useEffect(() => {
        ref.current = value;
    }, value);
    return ref.current;
} 
```

### 自定义hooks

- 举例：输入框输入值后调用接口，包含loading和error捕获
```jsx
function useHackerNewsApi= () => {
    const [data, setData] =  useState({ hits: [] });
    const [url, setUrl] =  useState(
        'http://localhost/api/v1/search?query=redux'
    );
    const [isLoading,  setIsLoading] = useState(false);
    const [isError, setIsError]  = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setIsError(false);
            setIsLoading(true);
            try {
                const result = await axios(url);
                setData(result.data);
            } catch (error) {
                setIsError(true);
            }
             setIsLoading(false);
       };
        fetchData();
    },  [url]);
 
    const doFetch = (url) => {
        setUrl(url);
    };
    return { data, isLoading, isError, doFetch };
}
 
function App() {
    const [query, setQuery] =  useState('redux');
    const { data, isLoading,  isError, doFetch } = useHackerNewsApi();
    return (
        <Fragment>       ...     </Fragment>
    );
}
```

- 总结：自定义hooks仅限封装逻辑，导出必要参数
再次总结
  - memo是组件级别的节省开销
  - useMemo和useCallback分别是变量级别和函数级别节省开销
  - useRef.current可以取上一次值
  - createRef.current可以实时取值
