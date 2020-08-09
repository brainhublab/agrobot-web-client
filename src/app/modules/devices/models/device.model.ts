import { DeviceConfiguration } from './device-configuration.model';
import { serializedLGraph, SerializedLGraphNode, LGraphNode, SerializedLGraphGroup } from 'litegraph.js';

type SerializedGraphLink = [number, number, number, number, number, string];

export type SerializedGraph =
  serializedLGraph<SerializedLGraphNode<LGraphNode>, SerializedGraphLink, SerializedLGraphGroup>;


export interface Device {
  id: number;
  // tslint:disable-next-line: variable-name
  mac_addr?: string;
  name: string;
  description?: string;
  configuration?: DeviceConfiguration;
  // tslint:disable-next-line: variable-name
  serialized_graph?: string; // JSON.string of SerializedGraph;
  subscribers?: Array<string>;
}
