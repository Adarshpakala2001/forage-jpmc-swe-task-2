import React, { Component } from 'react';
import { Table } from '@finos/perspective';
import { ServerRespond } from './DataStreamer';
import './Graph.css';

interface IProps {
  data: ServerRespond[],
}

interface PerspectiveViewerElement extends HTMLElement {  // Extend HTMLElement
  load: (table: Table) => void,
  setAttribute: (name: string, value: string) => void,
}

class Graph extends Component<IProps, {}> {
  table: Table | undefined;

  render() {
    return React.createElement('perspective-viewer');
  }

  componentDidMount() {
    const elem = document.getElementsByTagName('perspective-viewer')[0] as PerspectiveViewerElement;

    const schema = {
      stock: 'string',
      top_ask_price: 'float',
      top_bid_price: 'float',
      timestamp: 'date',
    };

    if (window.perspective && window.perspective.worker()) {
      this.table = window.perspective.worker().table(schema);
    }

    if (this.table) {
      elem.load(this.table);
      elem.setAttribute('view', 'y_line');  // Set the graph type to line graph
      elem.setAttribute('column-pivots', '["stock"]');  // Group by stock
      elem.setAttribute('row-pivots', '["timestamp"]');  // Use timestamp as x-axis
      elem.setAttribute('columns', '["top_ask_price"]');  // Use top_ask_price as y-axis
      elem.setAttribute('aggregates', JSON.stringify({
        stock: 'distinct count',
        top_ask_price: 'avg',
        top_bid_price: 'avg',
        timestamp: 'distinct count',
      }));  // Handle duplicates by averaging
    }
  }

  componentDidUpdate() {
    if (this.table) {
      const uniqueData = this.props.data.filter((v, i, a) =>
        a.findIndex(t => (t.timestamp === v.timestamp && t.stock === v.stock)) === i);  // Remove duplicates

      this.table.update(uniqueData.map((el: any) => {
        return {
          stock: el.stock,
          top_ask_price: el.top_ask && el.top_ask.price || 0,
          top_bid_price: el.top_bid && el.top_bid.price || 0,
          timestamp: el.timestamp,
        };
      }));
    }
  }
}

export default Graph;
