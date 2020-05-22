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
  }>;
}

export const DryadFunction = ({
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
    `;
  const useFunctionCodeBuild = `
    const classesAdded = []
    const upperCamelCaseToSnakeCase = (value) => {
      return (
        value
          .replace(/^([A-Z])/, ($1) => $1.toLowerCase())
          .replace(/([A-Z])/g, ($1) => '-' + $1.toLowerCase())
      );
    };
    const useCustomElement = (elementClass) => {
      classesAdded.push(elementClass)
    }`;
  return new Function(
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
            ? `if(classesAdded.length > 0){
              script = classesAdded.map(c => c.toString()).join("\\n")
              classesAdded.forEach(c => {
                const componentName = upperCamelCaseToSnakeCase(c.name)
                console.log(componentName)
                script += \`\\customElements.define("\${componentName}",\${c.name})\`
              })
            }`
            : `
            if(replacedElements.length > 0){
          replacedElements.forEach(r =>{
            newBody = newBody.replaceAll(r[0],r[1])
          })
        }`
        }
        resolve({
          body:newBody,
          script
        })
      })
    })`,
  ) as DryadFunctionFunction;
};
