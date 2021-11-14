import { Typography, Link, List, ListItem } from '@material-ui/core';
import lenders from 'constants/lenders';
import { NextPage } from 'next';

const HomePage: NextPage = () => {
  return (
    <>
      <Typography variant="h5" component="h5">
        fe-react-chg-ts
      </Typography>
      <List>
        {lenders.map((lender) => (
          <ListItem key={lender.name}>
            <Link data-testid={lender.slug} href={`/${lender.slug}`}>
              {lender.name}
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default HomePage;
