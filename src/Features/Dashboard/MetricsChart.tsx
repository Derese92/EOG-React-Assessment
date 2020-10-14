import React, { useEffect } from 'react';
import Plot from 'react-plotly.js';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { useQuery } from 'urql';
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
`;

const selectedMetricStyle = {
  justifyContent: 'center',
  display: 'flex',
};

const useStyles = makeStyles({
  root: {
    minWidth: 120,
    width: 120,
    marginRight: 5,
  },
  title: {
    fontSize: 14,
  },
});

function MetricsChart() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { selectedMetricValues, selectedMetric, currentTime } = useSelector((state: IState) => state.metrics);
  const [result] = useQuery({
    query,
    variables: {
      input: selectedMetric.map(metric => ({ metricName: metric, after: currentTime })),
    },
  });
  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) console.error(error);
    if (data) {
      //  console.log(data);
      const { getMultipleMeasurements } = data;
      // console.log(getMultipleMeasurements);
      dispatch(actions.storeselectedMetricValues(getMultipleMeasurements));
    }
  }, [dispatch, data, error]);
  if (fetching) return <LinearProgress />;
  if (selectedMetric.length === 0) return <h2>Select metrics and charts will display here</h2>;

  return (
    <div>
      <div style={selectedMetricStyle}>
        {selectedMetricValues.map((list: any, index) => (
          <Card key={index} className={classes.root} variant="outlined">
            <CardContent>
              <Typography className={classes.title}>
                {list['measurements'][list['measurements'].length - 1].metric}
              </Typography>
              <Typography className={classes.title}>
                {list['measurements'][list['measurements'].length - 1].value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <Plot
        data={selectedMetricValues.map((list: any) => ({
          x: list['measurements'].map((list: { at: number }) => list.at),
          y: list['measurements'].map((list: { value: number }) => list.value),
          type: 'scatter',
          mode: 'lines',
          hovertemplate: `
          %{x} <br>
          <b>%{text.metric}</b>: %{y}
          
          `,
          text: list.measurements,
        }))}

        layout={{
          height: 500,
          width: 700,
          title: 'Metrics Chart',
          xaxis: {
            type: 'date',
          },
          yaxis: {
            autorange: true,
            type: 'linear',
          },
        }}
      />
    </div>
  );
}

export default MetricsChart;
