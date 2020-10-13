
import React, { useEffect } from 'react';



import Plot from 'react-plotly.js';

import { useQuery} from 'urql';
import { LinearProgress } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import { actions } from './reducer';

const query = `
query($input: [MeasurementQuery]){
  getMultipleMeasurements(input:$input){
    measurements{
      metric
      at
      value
      unit
    }
    }
}

`

function MetricsChart(){
    const dispatch = useDispatch();
    const { selectedMetricValues,selectedMetric,currentTime } = useSelector((state: IState) => state.metrics);

    const [result] = useQuery({
        query,
        variables: {
          input: selectedMetric.map(metric=>({metricName:metric,after:currentTime}))
        },
      });
      const { fetching, data, error } = result;

      useEffect(()=>{
          if(error) console.error(error);
          if(data) {
        //  console.log(data);
            const {getMultipleMeasurements} = data
            // console.log(getMultipleMeasurements);
            dispatch(actions.storeselectedMetricValues(getMultipleMeasurements))
          }
      },[dispatch,data, error])
    if (fetching) return <LinearProgress />;
    if(selectedMetric.length===0) return <h2>Select metrics and charts will display here</h2>

      return <><Plot
      data={selectedMetricValues.map((list:any)=>(
        {
          x: list['measurements'].map((list:{at:number})=>list.at),
          y: list['measurements'].map((list:{value:number})=>list.value),
          type: 'scatter',
          mode: 'lines',
          hovertemplate:`
          %{x} <br>
          <b>%{text.metric}</b>: %{y}
          
          `,
        text:list.measurements
        }
       
      ))}
      layout={{width: 700, height: 500,  
        title: "selectedMetric",
      xaxis: {
        type: 'date'
      },
      yaxis: {
        autorange: true,
       
        type: 'linear'
      }}}
    />
    </>


}

export default MetricsChart