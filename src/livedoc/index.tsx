import React, { useState, useEffect } from 'react';
import DetailView from './views/detail';
import zip from 'jszip';
import { RenderToHTML } from '../ssg';
import { saveAs } from 'file-saver';
import { GqlContainer } from './GqlContainer';
import { CssReplace } from './CssReplace';
import { DocSkeletonStatic } from './DocSkeleton';
export interface LiveDocProps {
  url: string;
  initial: string;
}
export interface LiveDocExportProps {
  url: string;
  name?: string;
}
export const LiveDoc = ({ url, initial }: LiveDocProps) => {
  const [currentType, setCurrentType] = useState(initial);
  useEffect(() => {
    //@ts-ignore
    window.route = (typeName: string) => {
      setCurrentType(typeName);
    };
  }, []);
  return (
    <GqlContainer
      css={DetailView.css}
      gql={DetailView.gql(currentType)}
      url={url}
      headers={{}}
      dryad={DetailView.dryad(currentType)}
    >
      Loading...
    </GqlContainer>
  );
};
const returnTypeNames = async (url: string, headers = {}) => {
  const parsedGql = `
  {
    __schema{
      types{
        name
      }
      queryType{
          name
      }
      mutationType{
          name
      }
      subscriptionType{
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
  return {
    types: qualifiedPageTypes,
    query: response.data.__schema.queryType,
    mutation: response.data.__schema.mutationType,
    subscription: response.data.__schema.subscriptionType,
  };
};
export const LiveDocHtml = async ({
  url,
  name = 'graphql-editor',
}: LiveDocExportProps) => {
  const allTypes = await returnTypeNames(url);
  const z = new zip();
  const types = z.folder('docs');
  const mainType =
    allTypes.query?.name ||
    allTypes.mutation?.name ||
    allTypes.subscription?.name ||
    'Query';
  for (const at of allTypes.types) {
    const html = await RenderToHTML({
      dryad: { render: DetailView.dryad(at)(mainType) },
      gql: DetailView.gql(at),
      url,
      headers: {},
    })!;
    const all = DocSkeletonStatic({
      body: html!,
      style: CssReplace(DetailView.css, mainType),
    });
    await types.file(`${at}.html`, all!);
  }
  const zipFile = await z.generateAsync({ type: 'blob' });
  saveAs(zipFile, `${name}.zip`);
};
