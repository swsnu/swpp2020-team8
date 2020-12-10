import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { PostItemWrapper } from '../../styles';

export default function LoadingList() {
  const loadingList = [...Array(5)].map((_, index) => (
    // eslint-disable-next-line react/no-array-index-key
    <PostItemWrapper key={`loading-${index}`} className="skeleton-list">
      <Skeleton
        id="skeleton-circle"
        variant="circle"
        width={26}
        height={26}
        style={{ opacity: '0.8', margin: '4px 0' }}
      />
      <Skeleton
        id="skeleton-wave"
        animation="wave"
        variant="rect"
        height={88}
        style={{ opacity: '0.8', margin: '8px 0' }}
      />
    </PostItemWrapper>
  ));

  return <div>{loadingList}</div>;
}
