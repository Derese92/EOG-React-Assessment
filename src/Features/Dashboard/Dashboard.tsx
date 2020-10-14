import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { createClient, Provider } from 'urql';
import MetricsList from './MetricsList';
import MetricsChart from './MetricsChart';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      margin: '10% 10%',
    },
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});

export default () => {
  const classes = useStyles();
  return (
    <Provider value={client}>
      <Card className={classes.card}>
        <CardContent>
          <MetricsList />
          <MetricsChart />
        </CardContent>
      </Card>
    </Provider>
  );
};
