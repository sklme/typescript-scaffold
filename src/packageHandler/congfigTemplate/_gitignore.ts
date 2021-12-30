import { trim } from "../../util/templateLiteralsHelper.js";

export default trim`
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# Dependency directories
node_modules/
jspm_packages/

# output
dist
`;
