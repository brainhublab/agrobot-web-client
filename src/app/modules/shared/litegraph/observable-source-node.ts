// tslint:disable: space-before-function-paren only-arrow-functions

import { LiteGraph } from 'litegraph.js';
import { Observable } from 'rxjs';


export const registerLGObservableSourceNode = (dataObservable: Observable<string>) => {

  function LGObservableSourceNode() {
    this.size = [60, 20];
    this.addOutput('out', 0);
    this.addOutput('received', LiteGraph.EVENT);
    this.properties = {
    };
    this._dataSubscription = null;
    this._last_received_data = '';
  }

  LGObservableSourceNode.title = 'MQTT';
  LGObservableSourceNode.desc = 'Receive data using mqtt protocol';

  LGObservableSourceNode.prototype.onPropertyChanged = function (name, value) {
    this.subscribeToData();
  };

  LGObservableSourceNode.prototype.onExecute = function () {
    if (!this._dataSubscription) {
      this.subscribeToData();
      return;
    }

    this.setOutputData(0, this._last_received_data);
    this.setOutputData(1, this._last_received_data);

    if (this.boxcolor == '#AFA') {
      this.boxcolor = '#6C6';
    }
  };

  LGObservableSourceNode.prototype.subscribeToData = function () {
    const that = this;
    this._dataSubscription = dataObservable.subscribe(data => {
      that.boxcolor = '#AFA';
      that.triggerSlot(0, data);
      that._last_received_data = data;
    });
  };

  LiteGraph.registerNodeType('source/observable', LGObservableSourceNode as any);

}
