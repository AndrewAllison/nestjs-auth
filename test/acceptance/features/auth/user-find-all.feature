Feature: /Users
  View a list of users

  Scenario: Unauthenticated User
    Given that I'am unauthenticated
    When I make a call to 'users'
    Then the status code should be 401

#  Scenario: Authenticated User
#    Given that I am authenticated
#    When I make a call to 'users'
#    Then the status code should be 200
