import React, { useState } from 'react';
import { ExampleButton, ExampleImage, ExampleWrapper } from './example';

export default function StyledComponentExample() {
  const [clicked, setClicked] = useState(false);

  const toggleClicked = () => {
    setClicked((state) => !state);
  };

  return (
    <ExampleWrapper>
      <ExampleImage
        src="https://i.guim.co.uk/img/media/20098ae982d6b3ba4d70ede3ef9b8f79ab1205ce/0_0_969_581/master/969.jpg?width=1200&height=900&quality=85&auto=format&fit=crop&s=a368f449b1cc1f37412c07a1bd901fb5"
        alt="example"
      />
      <ExampleButton onClick={toggleClicked} clicked={clicked}>
        Click!
      </ExampleButton>
    </ExampleWrapper>
  );
}
