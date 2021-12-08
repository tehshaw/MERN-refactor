import { gql } from "@apollo/client";

export const GET_ME = gql`
  query getMe {
    getMe {
      username
      email
      savedBooks {
        authors
        bookId
        description
        image
        link
        title
      }
      bookCount
    }
  }
`;
