# GraphQL Dryad

First GraphQL data-driven react framework

![carbon.png](carbon.png)

```jsx
const Dryads = () => {
  return (
    <div>
      <Dryad.Detail.Card
        Attack
        Children
        Defense
        dryad={{
          Attack: 3,
          Children: 2,
          Defense: 4,
        }}
      />
    </div>
  );
};

```