import { reducer as weatherReducer } from '../Features/Weather/reducer';
import { reducer as metricsReducer } from '../Features/Dashboard/reducer';


export default {
  weather: weatherReducer,
  metrics:metricsReducer
};
