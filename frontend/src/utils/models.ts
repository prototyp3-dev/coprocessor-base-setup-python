export interface IPrize {
  nTreasures?: bigint;
  challengeId?: `0x${string}`;
  escaped: boolean;
  moves: bigint;
  movesLeft: bigint;
  prize: bigint;
  score: bigint;
  timestamp: bigint;
  user: `0x${string}`;
}

export interface IChallenge {
  challengeId?: `0x${string}`;
  start: bigint;
  end: bigint;
  totalPrize: bigint;
  nPrizes: bigint;
  finalized: boolean;
  creator: `0x${string}`;
  prizes?: IPrize[];
}
