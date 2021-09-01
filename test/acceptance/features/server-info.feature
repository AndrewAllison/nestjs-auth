Feature: Server Info
  Displays info from the environment

  Scenario: Provides INfo
    When Call to "/"
    Then the response status code should be 200
    And the response should contain the server version number
