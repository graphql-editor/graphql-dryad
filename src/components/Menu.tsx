import React from 'react';
interface MenuProps {
  categories: {
    name: string;
    onClick: () => void;
  }[];
}
export const Menu = ({ categories }: MenuProps) => {
  return (
    <div
      style={{
        position: 'absolute',
        background: '#000',
        right: -10,
        margin: 10,
        fontSize: 12,
        width: 100,
        padding: `10px 20px 10px 10px`,
        zIndex: 10,
        top: 20,
      }}
    >
      {categories.map((c) => (
        <div key={c.name} style={{ textAlign: 'right', cursor: 'pointer' }} onClick={c.onClick}>
          {c.name}
        </div>
      ))}
    </div>
  );
};
