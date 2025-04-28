const { Octokit } = require("@octokit/rest");
const github = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

// Test workflow module
const testWorkflow = {
  pullRequest: {}, // Default empty pull request object

  async testValidation() {
    console.log("Debug - Environment variables:", {
      GITHUB_TOKEN: process.env.GITHUB_TOKEN ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV
    });

    console.log("Debug - Pull Request Context:", {
      pullRequest: this.pullRequest,
      currentTime: new Date().toISOString()
    });

    console.log("Testing PR validation...");
    const isValid = this.validatePR(this.pullRequest);
    console.log(`Validation result: ${isValid}`);

    // Test label and assignee functionality
    console.log('Debug - Adding assignee with params:', {
      owner: "tdupoiron-org",
      repo: "required-workflows",
      issue_number: 1,
      assignees: ['tdupoiron']
    });

    try {
      await github.rest.issues.addAssignees({
        owner: "tdupoiron-org",
        repo: "required-workflows",
        issue_number: 1,
        assignees: ['tdupoiron']
      });
      console.log('Assignee added successfully');
    } catch (error) {
      console.error('Debug - Error details:', {
        message: error.message,
        status: error.status,
        response: error.response
      });
    }

    console.log('Current label:', "security");

    return isValid;
  },

  validatePR(pr) {
    if (!pr.title || !pr.branch) {
      return false;
    }
    if (!pr.labels || pr.labels.length === 0) {
      return false;
    }
    return true;
  }
};

// Run tests
console.log("Starting workflow tests...");
(async () => {
  await testWorkflow.testValidation();
  console.log("Tests completed.");
})();
