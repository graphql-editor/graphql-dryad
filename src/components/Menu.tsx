import React from 'react';
interface MenuProps {
  categories: {
    name: string;
    description: string;
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
        fontSize: 10,
        width: 160,
        padding: 10,
        zIndex: 10,
        top: 20,
      }}
    >
      {categories.map((c) => (
        <div
          title={c.description}
          key={c.name}
          style={{ textAlign: 'left', cursor: 'pointer', margin: 5 }}
          onClick={c.onClick}
        >
          {c.name}
        </div>
      ))}
    </div>
  );
};
