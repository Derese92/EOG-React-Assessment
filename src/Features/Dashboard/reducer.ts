import { createSlice } from 'redux-starter-kit';

const initialState = {
  metricsList: [],
  selectedMetric: [],
  currentTime: Date.now(),
  selectedMetricValues: [],
};
const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    metricsDataReceived: (state, action) => {
      state.metricsList = action.payload;
    },
    storeMetricsSelected: (state, action) => {
      // console.log(action.payload);
      state.selectedMetric = action.payload;
      state.currentTime = Date.now() - 180000;
    },
    storeselectedMetricValues: (state, action) => {
      state.selectedMetricValues = action.payload;
    },
  },
});

export const reducer = slice.reducer;
export const actions = slice.actions;
