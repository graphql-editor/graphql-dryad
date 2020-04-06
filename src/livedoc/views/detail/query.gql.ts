export const gql = (type: string) => `
{
    __schema{
        types{
            name
        }
    }
    __type(name:"${type}"){
        name
        description
        enumValues{
            name
            description
        }
        fields{
            type{
                name
                ofType{
                    name
                    enumValues{
                        name
                    }
                    description
                    ofType{
                        name
                    }
                }
                kind
                enumValues{
                    name
                }
            }
            args{
                type{
                    name
                }
                name
            }
            name
            description
            __typename
        }
    }
}
`;
