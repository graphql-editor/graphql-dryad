/* CTRL/CMD + space in dryad
to write overrides in
string html templates
inject function format is:

(v:{
    name: string
    value: type of value
    className: class assigned
})
    => string containing html

(v) => 
    `<div>${v.value}</div>` */

dryad = {
  Actor: {
    avatarUrl: (v) => `<img
            class="${v.className}"
             src="${v.value}" />`,
  },
  User: {
    avatarUrl: (v) => `<img
            class="${v.className}"
             src="${v.value}" />`,
  },
};
