import * as crypto from 'crypto';

export enum MeshEventType {
  NODE_JOINED = 'NODE_JOINED',
  NODE_LEFT = 'NODE_LEFT',
  WORKFLOW_STARTED = 'WORKFLOW_STARTED',
  WORKFLOW_COMPLETED = 'WORKFLOW_COMPLETED',
  PROOF_AGGREGATED = 'PROOF_AGGREGATED',
  SECURITY_INCIDENT = 'SECURITY_INCIDENT'
}

export interface MeshEvent {
  eventId: string;
  timestamp: number;
  nodeId: string;
  eventType: MeshEventType;
  payload: any;
  payloadHash: string;
}

export class MeshEventJournal {
  private events: MeshEvent[] = [];

  public appendEvent(nodeId: string, eventType: MeshEventType, payload: any): MeshEvent {
    const timestamp = Date.now();
    const payloadString = JSON.stringify(payload);
    const payloadHash = crypto.createHash('sha256').update(payloadString).digest('hex');
    const eventId = `${timestamp}-${nodeId}-${eventType}-${crypto.randomBytes(4).toString('hex')}`;

    const event: MeshEvent = {
      eventId,
      timestamp,
      nodeId,
      eventType,
      payload,
      payloadHash
    };

    this.events.push(event);
    return event;
  }

  public getEvents(filter?: (e: MeshEvent) => boolean): MeshEvent[] {
    if (filter) return this.events.filter(filter);
    return [...this.events];
  }

  public validateEvent(event: MeshEvent): boolean {
    const computedHash = crypto.createHash('sha256').update(JSON.stringify(event.payload)).digest('hex');
    return computedHash === event.payloadHash;
  }
}
