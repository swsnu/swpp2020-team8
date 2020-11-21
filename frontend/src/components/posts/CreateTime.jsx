import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getCreatedTime } from '../../utils/dateTimeHelpers';

const TimeWrapper = styled.div`
  text-align: center;
  color: #bbb;
  font-size: 12px;
  left: 50%;
  bottom: 20px;
`;

TimeWrapper.displayName = 'TimeWrapper';

export default function CreateTime({ createdTime }) {
  const [displayTime, setDisplayTime] = useState(getCreatedTime(createdTime));

  useEffect(() => {
    const interval = setInterval(
      () => setDisplayTime(getCreatedTime(createdTime)),
      1000 * 30
    );
    return () => {
      clearInterval(interval);
    };
  }, [createdTime]);
  return <TimeWrapper>{displayTime}</TimeWrapper>;
}
