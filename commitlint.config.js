const jiraTicketRegex = /^KAN-\d+/

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation changes
        'design', // Apply CSS style or Add images, icons
        'style', // Changes that do not affect the meaning of the code (white-space, formatting, etc.)
        'refactor', // Code changes that neither fix a bug nor add a feature
        'test', // Adding missing tests or correcting existing tests
        'build', // Changes that affect the build system or external dependencies (example scopes: npm)
        'chore', // Other changes that don't modify src or test files
        'ci', // Changes to CI configuration files and scripts
        'revert', // Reverts a previous commit
        'remove', // Delete file
        'rename', // Rename file name and changes path
        'env', // etc
      ],
    ],
    'jira-ticket-format': [2, 'always'],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^([A-Z]+-\d+)\s+(\w+):\s*(.*)$/,
      headerCorrespondence: ['ticket', 'type', 'subject'],
    },
  },
  plugins: [
    {
      rules: {
        'jira-ticket-format': (parsed) => {
          const ticket = parsed.ticket
          if (!jiraTicketRegex.test(ticket)) {
            return [false, `Wrong format. Ensure the ticket follows the 'KAN-123 Title' pattern.`]
          }
          return [true]
        },
      },
    },
  ],
}
