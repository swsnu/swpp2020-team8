import React from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { PostItemWrapper } from '../../styles';

export default function LoadingItem() {
  return (
    <PostItemWrapper className="skeleton-list">
      <Skeleton
        id="skeleton-circle"
        variant="circle"
        width={40}
        height={40}
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
  );
}
