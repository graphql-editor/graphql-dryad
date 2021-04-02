/// <reference types="cypress" />

import { tree } from '@/cypressTree';

const jsInput = 'return "<div>Hello world</div>"';
const cssInput = `body{ background:red; }`;
const selector = (s: string) => `[data-cy="${s}"]`;
const codeElement = () =>
  cy.get(selector(tree.tree.main.code.element)).find('textarea');
context('Test GraphQL dryad', () => {
  beforeEach(() => {
    cy.visit('http://localhost:1456');
  });
  it('Inputs data to css and js and doesnt brake on tab switching', () => {
    cy.get(selector(tree.tree.main.code.tabs.js.element)).click();
    codeElement().type(jsInput, { force: true });
    cy.get(selector(tree.tree.main.code.tabs.css.element)).click();
    codeElement().type(cssInput, {
      force: true,
      parseSpecialCharSequences: false,
    });
    cy.get(selector(tree.tree.main.code.tabs.js.element)).click();
    codeElement()
      .invoke('val')
      .should('eq', jsInput);
    cy.get(selector(tree.tree.main.code.tabs.css.element)).click();
    codeElement()
      .invoke('val')
      .should('eq', cssInput);
  });
});
