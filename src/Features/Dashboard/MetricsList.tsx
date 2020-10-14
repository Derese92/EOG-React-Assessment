import React, { useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { useQuery } from 'urql';
import { Chip, FormControl, Input, InputLabel, LinearProgress, MenuItem, Select, useTheme } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import { IState } from '../../store';
import { actions } from './reducer';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: '5% 25%',
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
      maxWidth: 300,
    },
    chips: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    chip: {
      margin: 2,
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
  }),
);


const query = `query{
    getMetrics
  }
  `;

function MetricsList() {
  const dispatch = useDispatch();
  const { metricsList, selectedMetric } = useSelector((state: IState) => state.metrics);
  const classes = useStyles();
  const theme = useTheme();

  const [result] = useQuery({
    query,
  });
  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      console.log(error);
    }
    if (data) {
      // console.log(data);
      const { getMetrics } = data;
      dispatch(actions.metricsDataReceived(getMetrics));
    }
  }, [dispatch, data, error]);
  if (fetching) return <LinearProgress />;

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(actions.storeMetricsSelected(event.target.value));
  };

  function getStyles(metric: string, metricsList: string[], theme: Theme) {
    return {
      fontWeight:
        metricsList.indexOf(metric) === -1 ? theme.typography.fontWeightRegular : theme.typography.fontWeightMedium,
    };
  }

  return (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-controlled-open-select-label">Select metrics</InputLabel>
        <Select
          labelId="demo-mutiple-chip-label"
          id="demo-mutiple-chip"
          multiple
          onChange={handleChange}
          value={selectedMetric}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {(selected as string[]).map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
        >
          {metricsList.map((list, index) => (
            <MenuItem key={index} value={list} style={getStyles(list, metricsList, theme)}>
              {list}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );
}

export default MetricsList;
