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
        {/*<MemoFunc num={this.state} />*/}
      </div>
    );
  }
}
