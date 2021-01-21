module.exports = {
  bff: {
    getCards: {
      url: 'https://ckd-aggregate-api.testportal.general.dev.hci.aetna.com/cards',
    },
    getCardsById: {
      url: 'https://ckd-aggregate-api.testportal.general.dev.hci.aetna.com/cards',
      asyncLimit: 10,
    },
    idToken: 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJzaGdiRHVUemlPVEZNSHZQWWtMN1VSYjc1MkNrYjRNUno3SXg3alBQZGYwIn0.eyJleHAiOjE2MTEwNzkzMTcsImlhdCI6MTYxMTA3OTAxNywiYXV0aF90aW1lIjoxNjExMDc5MDE2LCJqdGkiOiJlNjUyNWE3Yi01YmEyLTRhMTktYTZmMC0wNGIwMmVmYzRiNGYiLCJpc3MiOiJodHRwczovL2FwaS1vcGVuLmdlbmVyYWwuZGV2LmhjaS5hZXRuYS5jb20vYXV0aC9yZWFsbXMvaGVhbHRoLWNsb3VkIiwiYXVkIjoiY2tkLWNsaWVudCIsInN1YiI6IjgzNzUyYWRjLWE2ZjYtNDFhMC1iYWU1LTg1OTc5MWZiZmJmZCIsInR5cCI6IklEIiwiYXpwIjoiY2tkLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiIyYzdhZGNiNy05ODEzLTQ0MzUtODcyZi1iNzJiOGQ0MGYxODIiLCJhdF9oYXNoIjoiNTQ1dGNSanJOdkx0SDg2a1pGS3J1QSIsImFjciI6IjEiLCJhcHBfbmFtZSI6IkNLRCIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sImFwcF91c2VyX2lkIjoiODI5YTc4OTEtNmE1Zi00YmIwLWFlODUtYTAyNjQ4NWRhOTMzIiwibmFtZSI6IkRBTElMQSBEQVJTSSIsInByZWZlcnJlZF91c2VybmFtZSI6IjE3b3lhenAyd3o4dG94Zmd5Z2RkQGFldG5hZS5jb20iLCJwcm94eV9pZCI6IjM0WU4xS0JCQlBYWSIsImdpdmVuX25hbWUiOiJEQUxJTEEiLCJmYW1pbHlfbmFtZSI6IkRBUlNJIiwiaGVhbHRoX2Nsb3VkX2lkIjoiYmE3NDFkNWUtNmE0NS00OTcyLWE1YTItMzE2MmI0N2ZiYjM3IiwidGVuYW50IjoiYWV0bmEifQ.ILs5Q7We2eN7dI6JOH6Ho0awSvTf7cEG-3bBpYkoTAvsUBOMlTb9DD5lN7NMrIc-pyhHoa8OJjg6IOHZO9M9cLeo4Ox4_NdXWO0pYPf12uoSsMdtyxSq6BIkQIYzpu7rWiN_hjTXrDSHHdg29FbDGk4ZjrJYYen75Uc6OcexWiiBUUPjtU3GZB-p_NxvqlBplzb10oZjP1eg6q9Q7VfsitnDkC3fU7bO_sNUHUjL784xNeNP4GhaToQyO3D-ZTrFw60L1PO1N5d6j97H8ON3I59KNyZe-QHBVLqRspPVFTeHjN4BHy-iyEnHgFnm5CiEHiRNKJT1dogIBNPtjYNd5A',
  },
  elasticsearch: {
    asyncLimit: 10,
    indexName: 'recipes',
    settings: {
      analysis: {
        analyzer: {
          recipe_text_analyzer: {
            type: 'standard',
            stopwords: '_english_',
          },
        },
      },
    },
    baseUrl: 'http://localhost:9200',
  },
  express: {
    port: 8080,
  },
};
