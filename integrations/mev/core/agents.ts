export class MEVAgent {
  constructor(public name: string) {}
}
export class LiquidationAgent extends MEVAgent { constructor() { super('LiquidationAgent'); } }
export class ArbitrageAgent extends MEVAgent { constructor() { super('ArbitrageAgent'); } }
export class KeeperAgent extends MEVAgent { constructor() { super('KeeperAgent'); } }
export class PriceCorrectionAgent extends MEVAgent { constructor() { super('PriceCorrectionAgent'); } }
export class BackrunAgent extends MEVAgent { constructor() { super('BackrunAgent'); } }
export class FundingAgent extends MEVAgent { constructor() { super('FundingAgent'); } }
export class RelayAgent extends MEVAgent { constructor() { super('RelayAgent'); } }
export class OracleAgent extends MEVAgent { constructor() { super('OracleAgent'); } }
