export interface ClientProtocolExport {
  Version: number;
  Protocols: Record<string, ClientProtocol>;
  Sessions: ClientSession[];
  SessionElements: ClientSessionElement[];
}

export interface ClientBatteryExport {
  Type: string;
  Name: string;
  Description: string;
  Version: number;
  Stages: ClientStage[];
}

export interface ClientProtocol {
  Name: string;
  Sessions: number[];
}

export interface ClientSession {
  Id: number;
  Elements: number[];
}

export type ClientSessionElement = ClientBatteryElement | ClientEndElement;

export interface ClientBatteryElement {
  Id: number;
  Type: "Battery";
  Battery: string;
}

export interface ClientEndElement {
  Id: number;
  Type: "End";
  Instructions: string;
  Lockout: number;
  ShowQuitButton: boolean;
  Password: string;
}

export type ClientStagePrecursor =
  | { Type: "None" }
  | { Type: "Script Conditional"; Script: string };

export interface ClientStage {
  Type: string;
  StageLabel?: string;
  "Stage Precursor"?: ClientStagePrecursor;
  [key: string]: unknown;
}
