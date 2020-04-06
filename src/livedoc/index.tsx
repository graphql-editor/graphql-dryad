import React from 'react';
import DetailView from './views/detail';
import { DryadGQL } from '../dryad';
import { Utils, Parser } from 'graphql-zeus';
import zip from 'jszip';
import { RenderToHTML, HtmlSkeletonStatic } from '../ssg';
import { saveAs } from 'file-saver';
export interface LiveDocProps {
  url: string;
}
const Detail = ({ url }: LiveDocProps) => (
  <DryadGQL gql={DetailView.gql('Card')} url={url} headers={{}} dryad={{ render: DetailView.dryad }}>
    Loading...
  </DryadGQL>
);
const returnTypeNames = async (url: string) => {
  const schemaSting = await Utils.getFromUrl(url);
  const schemaTree = Parser.parse(schemaSting);
  return schemaTree.nodes.filter((t) => t.name).map((t) => t.name);
};
export const LiveDocHtml = async ({ url }: LiveDocProps) => {
  const allTypes = await returnTypeNames(url);
  const z = new zip();
  const types = z.folder('types');
  for (const at of allTypes) {
    const html = await RenderToHTML({
      dryad: { render: DetailView.dryad },
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
