import React from 'react';
import styled from 'styled-components';
import { getCreatedTime } from '../../utils/dateTimeHelpers';

const TimeWrapper = styled.div`
  text-align: center;
  color: #bbb;
  font-size: 12px;
`;

export default function CreateTime({ createdTime }) {
  return <TimeWrapper>{getCreatedTime(createdTime)}</TimeWrapper>;
}
