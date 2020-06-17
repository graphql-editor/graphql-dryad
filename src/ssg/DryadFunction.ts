import { Parser, TreeToTS } from 'graphql-zeus';

export interface DryadFunctionProps {
  schema: string;
  url: string;
  js: string;
  build?: boolean;
}

export interface DryadFunctionFunction {
  (): Promise<{
    body: string;
    script?: string;
    globals: Record<string, any>;
  }>;
}
function useDynamic<T extends string>(
  v: Record<T, T extends keyof typeof window ? 'Value is reserved!' : any>,
) {
  return v;
}

useDynamic({
  loca: '',
});

export const DryadDeclarations = `
// Define custom element by passing its class to this function. It will be available in your static site. Remember to make everything used from outside element useDynamic
declare const useCustomElement: <T>(classDefinition:T) => void
// Declare variables/functions/objects that will be available dynamically in your static site
declare const useDynamic: <T extends string>(functions:Record<T, T extends keyof typeof window ? 'Value is reserved!' : any>) => void;
declare const useAfterRender: <T>(functions:{
  [P in keyof T]:T[P]
}) => void;
`;
export const DryadFunction = async ({
  build,
  schema,
  url,
  js,
}: DryadFunctionProps) => {
  const graphqlTree = Parser.parse(schema);
  const functions = TreeToTS.javascript(
    graphqlTree,
    'browser',
    url,
  ).javascript.replace(/export /gm, '');
  const isMatching = js.match(/return/);
  if (!isMatching) {
    throw new Error('Cannot find return');
  }
  const functionBody = [functions, js].join('\n');
  const useFunctionCode = `
    const replacedElements = []
    const makeid = (length) => {
      var result = '';
      var characters = 'snowdoglamasheeprainwind';
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
      }
      return result;
    };
    function isRegistered(name) {
      return document.createElement(name).constructor !== HTMLElement
    }
    function registerNewName(name) {
      const newNameTry = name+makeid(6)
      if(isRegistered(newNameTry)){
        return registerNewName(name)
      }
      return newNameTry
    }
    const upperCamelCaseToSnakeCase = (value) => {
      return (
        value
          .replace(/^([A-Z])/, ($1) => $1.toLowerCase())
          .replace(/([A-Z])/g, ($1) => '-' + $1.toLowerCase())
      );
    };
    const useCustomElement = (elementClass) => {
      const componentName = upperCamelCaseToSnakeCase(elementClass.name)
      const customNewName = registerNewName(componentName)
      replacedElements.push([componentName,customNewName])
      customElements.define(customNewName,elementClass)
    }
    let dynamicsO = {}
    const useDynamic = (e) => {
      dynamicsO = {...dynamicsO,...e}
    }
    `;
  const useFunctionCodeBuild = `
    const classesAdded = []
    let dynamicsO = {}
    const upperCamelCaseToSnakeCase = (value) => {
      return (
        value
          .replace(/^([A-Z])/, ($1) => $1.toLowerCase())
          .replace(/([A-Z])/g, ($1) => '-' + $1.toLowerCase())
      );
    };
    const useDynamic = (e) => {
      dynamicsO = {...dynamicsO,...e}
    }
    const useCustomElement = (elementClass) => {
      classesAdded.push(elementClass)
    }`;
  const r = new Function(
    `return new Promise((resolve) => {
        ${build ? useFunctionCodeBuild : useFunctionCode}
      const dryadFunction = async () => {
        ${functionBody}
      }
      dryadFunction().then(b => {
        let script
        let newBody = b
        ${
          build
            ? `
            if(classesAdded.length > 0){
              script = classesAdded.map(c => c.toString()).join("\\n")
              classesAdded.forEach(c => {
                const componentName = upperCamelCaseToSnakeCase(c.name)
                script += "\\n"
                script += \`\\customElements.define("\${componentName}",\${c.name})\`
              })
            }
            const strfns = JSON.parse(JSON.stringify(dynamicsO, function(key, val) {
              if (typeof val === 'function') {
                return  val + '';
              }
              return val
            }))
            Object.keys(strfns).forEach( s => {
              script += "\\n"
              const value = typeof strfns[s] === 'string' ? strfns[s] : JSON.stringify(strfns[s])
              script += "const "+s+" = "+value
            })
            `
            : `
            const strfns = JSON.parse(JSON.stringify(dynamicsO, function(key, val) {
              if (typeof val === 'function') {
                return  val + '';
              }
              return val
            }))
            Object.keys(strfns).forEach( s => {
              script += "\\n"
              const value = typeof strfns[s] === 'string' ? strfns[s] : JSON.stringify(strfns[s])
              script += "window."+s+" = "+value
            })
            if(replacedElements.length > 0){
          replacedElements.forEach(r =>{
            newBody = newBody.replaceAll(r[0],r[1])
          })
        }`
        }
        resolve({
          body:newBody,
          script,
        })
      })
    })`,
  ) as DryadFunctionFunction;
  const result = await r();
  if (typeof result.body !== 'string') {
    throw new Error('Js has to return string');
  }
  return result;
};
