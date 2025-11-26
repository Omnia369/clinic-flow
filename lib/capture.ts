export type CapturedEvent = {
  id: number;
  provider: string;
  ts: string; // ISO timestamp
  headers?: Record<string, string>;
  parsed_body?: any;
  alert_name?: string | null;
  verify_result?: boolean;
  note?: string;
  last_status?: number;
};

let _id = 1;
const _events: CapturedEvent[] = [];

export function addCapturedEvent(ev: Omit<CapturedEvent, 'id' | 'ts'> & { ts?: string }): CapturedEvent {
  const full: CapturedEvent = {
    id: _id++,
    ts: ev.ts || new Date().toISOString(),
    provider: ev.provider,
    headers: ev.headers,
    parsed_body: ev.parsed_body,
    alert_name: ev.alert_name ?? null,
    verify_result: ev.verify_result,
    note: ev.note,
    last_status: ev.last_status,
  };
  _events.push(full);
  return full;
}

export function listCapturedEvents(limit = 200): CapturedEvent[] {
  return _events.slice(-limit).reverse();
}
