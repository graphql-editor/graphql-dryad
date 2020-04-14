import React, { useState, useEffect } from 'react';
import DetailView from './views/detail';
import zip from 'jszip';
import { RenderToHTML, HtmlSkeletonStatic } from '../ssg';
import { saveAs } from 'file-saver';
import { GqlContainer } from './GqlContainer';
export interface LiveDocProps {
  url: string;
}
const Detail = ({ url }: LiveDocProps) => {
  const [currentType, setCurrentType] = useState('Company');
  useEffect(() => {
    //@ts-ignore
    window.route = (typeName: string) => {
      setCurrentType(typeName);
    };
  }, []);
  return (
    <GqlContainer
      gql={DetailView.gql(currentType)}
      url={url}
      headers={{}}
      dryad={{ render: DetailView.dryad(currentType) }}
    >
      Loading...
    </GqlContainer>
  );
};
const returnTypeNames = async (url: string, headers = {}): Promise<string[]> => {
  const parsedGql = `
  {
    __schema{
      types{
        name
      }
    }
  }
  `;
  const response = await (
    await fetch(url, {
      body: JSON.stringify({ query: parsedGql }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })
  ).json();
  const qualifiedPageTypes = response.data.__schema.types
    .filter((t: any) => t.name.indexOf('__') === -1)
    .map((t: any) => t.name);
  return qualifiedPageTypes;
};
export const LiveDocHtml = async ({ url }: LiveDocProps) => {
  const allTypes = await returnTypeNames(url);
  const z = new zip();
  const types = z.folder('types');
  for (const at of allTypes) {
    const html = await RenderToHTML({
      dryad: { render: DetailView.dryad(at) },
      gql: DetailView.gql(at),
      url,
      headers: {},
    })!;
    const all = HtmlSkeletonStatic({
      body: html!,
      style: DetailView.css,
    });
    await types.file(`${at}.html`, all!);
  }
  console.log('Zipping');
  const zipFile = await z.generateAsync({ type: 'blob' });
  saveAs(zipFile, 'livedoc.zip');
};

export const LiveDoc = ({ url }: LiveDocProps) => {
  // Make introspection
  // Get all type names
  // Iterate to generate type pages
  // MENU
  // Render Menu with
  // Types - including all the types
  // in all pages with active
  // PLAY
  // Add the possibility to execute query on faker/live schema
  // if schema is live add place to add headers to query in settings Pane
  return (
    <div>
      <Detail url={url} />
      <style>{DetailView.css}</style>
    </div>
  );
};
