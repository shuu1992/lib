import { createSlice } from '@reduxjs/toolkit';
// types
import { GlobalProps } from '@type/global';
import dayjs from 'dayjs';
// initial state
export const initialState: GlobalProps = {
  online: 0,
  register: 0,
  bet_real: 0,
  bet_total: 0,
  payoff: 0,
  sysTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  loading: false,
};

// ==============================|| SLICE - MENU ||============================== //
const global = createSlice({
  name: 'global',
  initialState,
  reducers: {
    actionSystime(state, action) {
      state.sysTime = action.payload.sysTime;
    },
    actionTopinfo(state, action) {
      state.online = action.payload.online;
      state.register = action.payload.register;
      state.bet_real = action.payload.bet_real;
      state.bet_total = action.payload.bet_total;
      state.payoff = action.payload.payoff;
    },
    actionLoading(state, action) {
      state.loading = action.payload;
    },
  },
});

export default global.reducer;

export const { actionSystime, actionTopinfo, actionLoading } = global.actions;
