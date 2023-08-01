import React from 'react';
import { Cell, Graph } from '@antv/x6';
import type { Edge, Node } from '@antv/x6';
import { Dnd } from '@antv/x6-plugin-dnd';
import { Snapline } from '@antv/x6-plugin-snapline';
import { Selection } from '@antv/x6-plugin-selection';
import { register } from '@antv/x6-react-shape';
import { Dropdown, MenuProps } from 'antd';

interface NodeStatus {
  id: string;
  status: 'default' | 'success' | 'failed' | 'running';
  label?: string;
}

export default class Example extends React.Component {
  public graph!: Graph;
  private container!: HTMLDivElement;
  private dndContainer!: HTMLDivElement;
  private dnd!: Dnd;
  AlgoNode: any;
  curCell: any;

  componentDidMount() {
    // 画布元素注册
    const image = {
      logo: 'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ',
      success:
        'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ',
      failed:
        'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ',
      running:
        'https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*t8fURKfgSOgAAAAAAAAAAAAAARQnAQ',
    };

    const AlgoNode = (this.AlgoNode = (props: { node: Node }) => {
      const { node } = props;
      const data = node?.getData() as NodeStatus;
      let { label: nodeLabel, status = 'success' } = data;

      // 修改节点名称
      const renameNode = (node: Node) => {
        const data = node?.getData() as NodeStatus;
        node.setProp('data', { label: 'ABC', status });
        console.log(node);
      };

      // 删除节点
      const deleteNode = (node: Node) => {
        this.graph.removeCell(node);
      };

      const items: MenuProps['items'] = [
        {
          label: <div onClick={() => renameNode(node)}>重命名</div>,
          key: '1',
        },
        {
          label: <div onClick={() => deleteNode(node)}>删除节点</div>,
          key: '2',
        },
      ];

      return (
        <Dropdown menu={{ items }} trigger={['contextMenu']}>
          <div className={`node ${status}`}>
            <img src={image.logo} alt="logo" />
            <span className="label">{nodeLabel}</span>
            <span className="status">
              {status === 'success' && (
                <img src={image.success} alt="success" />
              )}
              {status === 'failed' && <img src={image.failed} alt="failed" />}
              {status === 'running' && (
                <img src={image.running} alt="running" />
              )}
            </span>
          </div>
        </Dropdown>
      );
    });

    register({
      shape: 'dag-node',
      width: 180,
      height: 36,
      component: AlgoNode,
      ports: {
        groups: {
          top: {
            position: 'top',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#C2C8D5',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
          bottom: {
            position: 'bottom',
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: '#C2C8D5',
                strokeWidth: 1,
                fill: '#fff',
              },
            },
          },
        },
      },
    });

    Graph.registerEdge(
      'dag-edge',
      {
        inherit: 'edge',
        attrs: {
          line: {
            stroke: '#C2C8D5',
            strokeWidth: 1,
            targetMarker: 'block',
          },
        },
      },
      true
    );

    // 画布初始化
    const graph: Graph = new Graph({
      container: this.container,
      background: {
        color: '#F2F7FA',
      },
      grid: {
        visible: true,
        type: 'doubleMesh',
        args: [
          {
            color: '#eee', // 主网格线颜色
            thickness: 1, // 主网格线宽度
          },
          {
            color: '#ddd', // 次网格线颜色
            thickness: 1, // 次网格线宽度
            factor: 4, // 主次网格线间隔
          },
        ],
      },
      panning: {
        enabled: true,
        eventTypes: ['leftMouseDown', 'mouseWheel'],
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
        factor: 1.1,
        maxScale: 1.5,
        minScale: 0.5,
      },
      highlighting: {
        magnetAdsorbed: {
          name: 'stroke',
          args: {
            attrs: {
              fill: '#fff',
              stroke: '#31d0c6',
              strokeWidth: 4,
            },
          },
        },
      },
      connecting: {
        snap: true,
        allowBlank: false,
        allowLoop: false,
        allowNode: false,
        highlight: true,
        router: 'manhattan',
        connector: 'rounded',
        connectionPoint: 'anchor',
        anchor: 'center',
        validateMagnet({ magnet }) {
          return magnet.getAttribute('port-group') !== 'top';
        },
        createEdge() {
          return graph.createEdge({
            shape: 'dag-edge',
            attrs: {
              line: {
                strokeDasharray: '5 5',
              },
            },
            zIndex: -1,
          });
        },
      },
      autoResize: true,
    });

    graph.use(
      new Snapline({
        enabled: true,
        sharp: true,
      })
    );

    graph.centerContent();

    this.dnd = new Dnd({
      target: graph,
      scaled: false,
      dndContainer: this.dndContainer,
    });

    // 插件init
    graph.use(
      new Snapline({
        enabled: true,
        sharp: true,
      })
    );

    graph.use(
      new Selection({
        multiple: true,
        rubberEdge: true,
        rubberNode: true,
        modifiers: 'shift',
        rubberband: true,
      })
    );

    // 各类事件
    graph.on('edge:connected', ({ edge }: { edge: Edge }) => {
      edge.attr({
        line: {
          strokeDasharray: '',
        },
      });
    });

    graph.on('cell:click', ({ e, cell }: { e: Event; cell: Cell }) => {
      e.stopPropagation();
      this.curCell && this.curCell.removeTools();
      this.curCell = cell;
      if (cell.isNode()) {
        cell.addTools([
          {
            name: 'boundary',
            args: {
              attrs: {
                fill: '#7c68fc',
                stroke: '#333',
                'stroke-width': 1,
                'fill-opacity': 0.2,
              },
            },
          },
          {
            name: 'button-remove',
            args: {
              x: 0,
              y: 0,
              offset: { x: 10, y: 10 },
            },
          },
        ]);
      } else {
        cell.addTools([
          {
            name: 'button-remove',
            args: {
              x: 0,
              y: 0,
              offset: { x: 10, y: 10 },
            },
          },
        ]);
      }
    });

    graph.on('blank:click', ({ cell }: { cell: Cell }) => {
      this.curCell && this.curCell.removeTools();
    });

    graph.on('node:dblclick', ({ cell }: { cell: Cell }) => {
      console.log(cell);
    });

    // 属性赋值
    this.graph = graph;
  }

  // 画布回显
  public init = (data: Cell.Metadata[]) => {
    const cells: Cell[] = [];
    data.forEach((item) => {
      if (item.shape === 'dag-node') {
        cells.push(this.graph.createNode(item));
      } else {
        cells.push(this.graph.createEdge(item));
      }
    });
    this.graph.resetCells(cells);
  };

  startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget;
    const node = this.graph.createNode({
      shape: 'dag-node',
      data: {
        label: '读数据',
        status: 'success',
      },
      ports: [
        {
          id: '1-1',
          group: 'bottom',
        },
      ],
    });

    this.dnd.start(node, e.nativeEvent as any);
  };

  refContainer = (container: HTMLDivElement) => {
    this.container = container;
  };

  dndContainerRef = (container: HTMLDivElement) => {
    this.dndContainer = container;
  };

  render() {
    return (
      <div className="dnd-app">
        <div className="dnd-wrap" ref={this.dndContainerRef}>
          <div onMouseDown={this.startDrag}>Demo</div>
        </div>

        <div className="app-content" ref={this.refContainer} />
      </div>
    );
  }
}
