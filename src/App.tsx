import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

interface IState {
  data: ServerRespond[],
  showGraph: boolean,  // Added showGraph property
}

class App extends Component<{}, IState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      data: [],
      showGraph: false,  // Initialize showGraph to false
    };
  }

  getDataFromServer() {
    this.setState({ showGraph: true });  // Show the graph when streaming starts
    const interval = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        this.setState({ data: [...this.state.data, ...serverResponds] });
      });
    }, 100);
  }

  renderGraph() {
    if (this.state.showGraph) {  // Render graph only if showGraph is true
      return (<Graph data={this.state.data}/>);
    }
    return null;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button
            className="btn btn-primary Stream-button"
            onClick={() => this.getDataFromServer()}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
