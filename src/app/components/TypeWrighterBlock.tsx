'use client';

import Typewriter from 'typewriter-effect';

export default function TypewriterBlock() {
  return (
    <div style={{ fontSize: '2rem', marginTop: '2rem' }}>
      <Typewriter
        options={{
          strings: ['Hello World', 'This is typed.'],
          autoStart: true,
          loop: true,
        }}
      />
    </div>
  );
}