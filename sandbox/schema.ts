export const schema = `
"""Card used in card game<br>"""
type Card implements Nameable {
  """The attack power<br>"""
  Attack: Int!

  """<div>How many children the greek god had</div>"""
  Children: Int

  """The defense power<br>"""
  Defense: Int!

  """Attack other cards on the table , returns Cards after attack<br>"""
  attack(
    """Attacked card/card ids<br>"""
    cardID: [String!]!
  ): [Card!]

  """Put your description here"""
  cardImage: S3Object

  """Description of a card<br>"""
  description: String!
  id: ID!

  """The name of a card<br>"""
  name: String!
  skills: [SpecialSkills!]
}

"""Stack of cards"""
type CardStack implements Nameable {
  cards: [Card!]
  name: String!
}

union ChangeCard = SpecialCard | EffectCard

"""create card inputs<br>"""
input createCard {
  """Description of a card<br>"""
  description: String!

  """<div>How many children the greek god had</div>"""
  Children: Int

  """The attack power<br>"""
  Attack: Int!

  """The defense power<br>"""
  Defense: Int!

  """input skills"""
  skills: [SpecialSkills!]

  """The name of a card<br>"""
  name: String!
}

type EffectCard implements Nameable {
  effectSize: Float!
  name: String!
}

type Mutation {
  """add Card to Cards database<br>"""
  addCard(card: createCard!): Card!
}

interface Nameable {
  name: String!
}

type Query {
  cardById(cardId: String): Card

  """Draw a card<br>"""
  drawCard: Card!
  drawChangeCard: ChangeCard!

  """list All Cards availble<br>"""
  listCards: [Card!]!
  myStacks: [CardStack!]
  nameables: [Nameable!]!
}

"""Aws S3 File"""
type S3Object {
  bucket: String!
  key: String!
  region: String!
}

type SpecialCard implements Nameable {
  effect: String!
  name: String!
}

enum SpecialSkills {
  """50% chance to avoid any attack<br>"""
  FIRE

  """Lower enemy defense -5<br>"""
  THUNDER

  """Attack multiple Cards at once<br>"""
  RAIN
}

schema{
	query: Query,
	mutation: Mutation
}
`;
