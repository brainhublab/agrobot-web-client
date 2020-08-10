import { serializedLGraph, SerializedLGraphNode, LGraphNode, SerializedLGraphGroup } from 'litegraph.js';

type SerializedGraphLink = [number, number, number, number, number, string];

export type SerializedGraph =
  serializedLGraph<SerializedLGraphNode<LGraphNode>, SerializedGraphLink, SerializedLGraphGroup>;


