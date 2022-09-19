/// <reference types="cypress" />

import { tree } from 'graphql-dryad/lib/cypressTree';

const jsInput = 'export default () => "<div>Hello world</div>"';
const cssInput = `body{ background:red; }`;
const selector = (s: string) => `[data-cy="${s}"]`;
const codeElement = () =>
  cy.get(selector(tree.tree.main.code.element)).find('textarea');
context('Test GraphQL dryad', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1569');
  });
  it('Inputs data to css and js and doesnt break on tab switching', () => {
    cy.get(selector(tree.tree.main.code.tabs.js.element)).click();
    codeElement().type(jsInput, { force: true });
    cy.wait(100);
    cy.get(selector(tree.tree.main.code.tabs.css.element)).click();
    codeElement().type(cssInput, {
      force: true,
      parseSpecialCharSequences: false,
    });
    cy.wait(100);
    cy.get(selector(tree.tree.main.code.tabs.js.element)).click();
    codeElement().invoke('val').should('eq', jsInput);
    cy.wait(100);
    cy.get(selector(tree.tree.main.code.tabs.css.element)).click();
    codeElement().invoke('val').should('eq', cssInput);
    cy.get(selector(tree.tree.main.execute.play.element)).click();
  });
});
