import React, { FunctionComponent } from 'react';

export interface TargetURLBarProps {
  url: string;
  onChange: (url: string) => void;
}

export const TargetURLBar: FunctionComponent<TargetURLBarProps> = ({ url, onChange }) => {
  return (
    <div style={{ flex: 1, alignSelf: 'stretch' }}>
      <input
        type="text"
        value={url}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
};
