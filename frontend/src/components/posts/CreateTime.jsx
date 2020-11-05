import React from 'react';
import styled from 'styled-components';
import { getCreatedTime } from '../../utils/dateTimeHelpers';

const TimeWrapper = styled.div`
  text-align: center;
  color: #bbb;
  font-size: 12px;
  position: absolute;
  left: 50%;
  bottom: 20px;
`;

export default function CreateTime({ createdTime }) {
  return <TimeWrapper>{getCreatedTime(createdTime)}</TimeWrapper>;
}
