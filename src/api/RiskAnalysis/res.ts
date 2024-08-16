export interface IResInfo {
  id: number;
  action?: number;
}

export interface IResAnalyze {
  avg_total: number;
  banker_count: number;
  banker_total: number;
  bet_count: number;
  bet_total: number;
  game_count: number;
  lose_avg: number;
  lose_count: number;
  lose_total: number;
  payoff: number;
  player_count: number;
  player_total: number;
  win_avg: number;
  win_count: number;
  win_total: number;
}
