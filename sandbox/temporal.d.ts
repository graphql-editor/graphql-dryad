type Func = (props: { name: string; value: string; className: string }) => string;
declare const dryad: {
  Company: {
    name: Func;
  };
};
