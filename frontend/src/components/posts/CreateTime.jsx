import React from 'react';
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
  return <TimeWrapper>{getCreatedTime(createdTime)}</TimeWrapper>;
}
