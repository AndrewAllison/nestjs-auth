# TODO: Findout more - https://cucumber.io/docs/bdd/better-gherkin/
Feature: Server Info
  Displays info from the environment

  Scenario: Provides Info
    When Call to "/"
    Then the response status code should be 200
    And the response should contain the server version number
