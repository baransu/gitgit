## IDEAS for 0.1:
1. Fetching data and processing it using chrome-extension (No GitHub API requests on backend*<sup>1</sup>)
2. Recognizing of members and non-members by giving them special banners
3. Calculating skill level based on repositories LOCALLY for each github user (see level rules below)
4. Figuring out two main "character classes" based on contributions (see level rules below)
5. Option to include a user banner under each issue/PR/comment that links REAL TIME to your current profile data

*<sup>1</sup> GithHub API Call limitation advises not to do any calls for non-users.
 API limitations are hard capped at 60/h for user without giving a token, and 5000 an hour with a token

## Level rules sketch

1. Each user can have infinitely many classes, only the 2 most proficient are displayed in his banner and profile. 
All of them should be accessible on a website
2. Each class coresponds directly to the language used f.i
   - Alchemist (Elixir)
   - Ninja (JavaScript)
   - Druid (Elm)
   - Barista (CoffeeScript)
   etc.
3. For version 0.1 a repository is considered of a language based on the `language` field in GitHub API response
   Future versions can fetch all the languages used in repositories
   
4. A level of a user for now is calculated as an amount of stars of all projects (public and organizations) in a language divided by 10
